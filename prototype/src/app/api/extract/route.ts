import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { genericMock, mockExtract } from "@/lib/mockExtract";
import type { ExtractFailure, ExtractResponse } from "@/lib/types";
import { emptyFields, lowConfidence, normalizeExtraction } from "@/lib/validation";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You extract data from receipts and invoices for a bookkeeping product.
Return ONLY JSON with this shape:
{
  "vendor": string,
  "date": "YYYY-MM-DD" or "",
  "total": number or null,
  "tax": number or null,
  "invoiceNumber": string,
  "category": string,
  "paymentMethod": string,
  "currency": "USD" | "CAD" | "EUR" | "GBP" | "MXN",
  "confidence": {
    "vendor": number,
    "date": number,
    "total": number,
    "tax": number,
    "invoiceNumber": number,
    "category": number,
    "paymentMethod": number,
    "currency": number
  }
}
Rules:
- Never invent a vendor. Use "" if unreadable.
- Dates must be ISO YYYY-MM-DD.
- Amounts are numbers without currency symbols. Tax is tax only, not tip.
- category should be the best fit from: Office Supplies, Meals & Entertainment, Travel, Utilities, Software & Subscriptions, Professional Services, Other.
- paymentMethod examples: Credit Card, Debit Card, Cash, ACH, Check, Other. Use "" if unknown.
- confidence is 0 to 1. Use values below 0.75 when the user should review the field.
- If a field is absent (for example no invoice number on a store receipt), return "" and a high confidence that it is blank.`;

function failure(
  code: ExtractFailure["code"],
  message: string,
  status: number,
): NextResponse<ExtractResponse> {
  return NextResponse.json({ ok: false, code, message }, { status });
}

function unreadableWarning(source: "ai" | "mock", warning: string) {
  return NextResponse.json({
    ok: true,
    source,
    fields: { ...emptyFields },
    confidence: { ...lowConfidence },
    warning,
  } satisfies ExtractResponse);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return failure("no_document", "Upload a receipt or invoice image to continue.", 400);
  }

  const sampleId = formData.get("sampleId");
  if (typeof sampleId === "string" && sampleId.trim()) {
    const sample = mockExtract(sampleId.trim());
    if (!sample) {
      return failure("no_document", "That sample receipt could not be found.", 400);
    }
    return NextResponse.json(sample);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return failure("no_document", "Upload a receipt or invoice image to continue.", 400);
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return failure(
      "unsupported_type",
      "That file type is not supported. Please upload a JPG, PNG, or WebP image.",
      400,
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return failure(
      "file_too_large",
      "That image is too large. Please upload a file under 8 MB.",
      400,
    );
  }

  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(genericMock());
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
    const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the receipt or invoice fields as JSON.",
            },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      return unreadableWarning(
        "ai",
        "We couldn't confidently read this document. Please review or enter the information manually.",
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return unreadableWarning(
        "ai",
        "We couldn't confidently read this document. Please review or enter the information manually.",
      );
    }

    return NextResponse.json(normalizeExtraction(parsed, "ai"));
  } catch {
    return unreadableWarning(
      "ai",
      "The AI service is unavailable right now. Please review or enter the information manually.",
    );
  }
}
