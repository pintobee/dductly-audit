import { CURRENCIES, FIELD_NAMES, REVIEW_THRESHOLD } from "./constants";
import type {
  ConfidenceMap,
  Currency,
  ExtractSuccess,
  FieldName,
  FormFields,
  SavedFields,
} from "./types";
import { z } from "zod";

export const emptyFields: FormFields = {
  vendor: "",
  date: "",
  total: "",
  tax: "",
  invoiceNumber: "",
  category: "",
  paymentMethod: "",
  currency: "USD",
};

export const lowConfidence: ConfidenceMap = Object.fromEntries(
  FIELD_NAMES.map((name) => [name, 0.3]),
) as ConfidenceMap;

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function normalizeDate(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) return "";
  const value = input.trim();
  if (isValidIsoDate(value)) return value;

  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const iso = `${us[3]}-${us[1].padStart(2, "0")}-${us[2].padStart(2, "0")}`;
    if (isValidIsoDate(iso)) return iso;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const iso = parsed.toISOString().slice(0, 10);
    if (isValidIsoDate(iso)) return iso;
  }

  return "";
}

function moneyToString(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return "";
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }
  return "";
}

const aiPayloadSchema = z.object({
  vendor: z.unknown().optional(),
  date: z.unknown().optional(),
  total: z.unknown().optional(),
  tax: z.unknown().optional(),
  invoiceNumber: z.unknown().optional(),
  category: z.unknown().optional(),
  paymentMethod: z.unknown().optional(),
  currency: z.unknown().optional(),
  confidence: z.record(z.string(), z.unknown()).optional(),
});

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asConfidence(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(1, Math.max(0, n));
}

export function normalizeExtraction(
  raw: unknown,
  source: ExtractSuccess["source"],
  warning: string | null = null,
): ExtractSuccess {
  const parsed = aiPayloadSchema.safeParse(raw);
  const data = parsed.success ? parsed.data : {};
  const currencyRaw = asString(data.currency).toUpperCase();
  const currency = (CURRENCIES as readonly string[]).includes(currencyRaw)
    ? currencyRaw
    : "USD";

  const fields: FormFields = {
    vendor: asString(data.vendor),
    date: normalizeDate(data.date),
    total: moneyToString(data.total),
    tax: moneyToString(data.tax),
    invoiceNumber: asString(data.invoiceNumber),
    category: asString(data.category),
    paymentMethod: asString(data.paymentMethod),
    currency,
  };

  const confidence: ConfidenceMap = {};
  for (const name of FIELD_NAMES) {
    const score = asConfidence(data.confidence?.[name]);
    if (score !== undefined) confidence[name] = score;
  }

  const incomplete =
    !fields.vendor || !fields.date || !fields.total
      ? "Some fields could not be read confidently. Please review or complete them before saving."
      : null;

  return {
    ok: true,
    source,
    fields,
    confidence,
    warning: warning ?? incomplete,
  };
}

export const formSchema = z
  .object({
    vendor: z.string().trim().min(1, "Vendor is required"),
    date: z
      .string()
      .trim()
      .min(1, "Date is required")
      .refine(isValidIsoDate, "Enter a valid date"),
    total: z
      .string()
      .trim()
      .min(1, "Total is required")
      .refine((value) => /^-?\d+(\.\d+)?$/.test(value), "Total must be a number")
      .transform(Number)
      .refine((value) => value >= 0, "Total must be 0 or greater")
      .refine((value) => value < 1_000_000, "Total is unreasonably large"),
    tax: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^-?\d+(\.\d+)?$/.test(value),
        "Tax must be a number",
      )
      .transform((value) => (value === "" ? null : Number(value)))
      .refine((value) => value === null || value >= 0, "Tax must be 0 or greater"),
    invoiceNumber: z.string(),
    category: z.string(),
    paymentMethod: z.string(),
    currency: z
      .string()
      .refine(
        (value): value is Currency =>
          (CURRENCIES as readonly string[]).includes(value),
        "Select a valid currency",
      ),
  })
  .superRefine((data, ctx) => {
    if (data.tax !== null && data.tax > data.total) {
      ctx.addIssue({
        code: "custom",
        path: ["tax"],
        message: "Tax cannot exceed total",
      });
    }
  });

export function validateForm(
  fields: FormFields,
):
  | { ok: true; data: SavedFields }
  | { ok: false; errors: Partial<Record<keyof FormFields, string>> } {
  const parsed = formSchema.safeParse(fields);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }

  const errors: Partial<Record<keyof FormFields, string>> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof FormFields] = issue.message;
    }
  }
  return { ok: false, errors };
}

export function needsReview(
  confidence: ConfidenceMap,
  field: FieldName,
  value: string,
): boolean {
  const score = confidence[field];
  if (score !== undefined) return score < REVIEW_THRESHOLD;
  if (field === "vendor" || field === "date" || field === "total") {
    return value.trim() === "";
  }
  return false;
}
