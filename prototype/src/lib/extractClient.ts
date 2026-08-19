import type { ExtractResponse } from "./types";

export async function extractDocument(input: {
  file?: File;
  sampleId?: string;
}): Promise<ExtractResponse> {
  const body = new FormData();
  if (input.file) body.append("file", input.file);
  if (input.sampleId) body.append("sampleId", input.sampleId);

  try {
    const response = await fetch("/api/extract", {
      method: "POST",
      body,
    });
    return (await response.json()) as ExtractResponse;
  } catch {
    return {
      ok: false,
      code: "ai_unavailable",
      message:
        "We couldn't reach the extraction service. Please review or enter the information manually.",
    };
  }
}
