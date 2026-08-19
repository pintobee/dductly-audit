import { getSample } from "./samples";
import type { ExtractSuccess } from "./types";
import { emptyFields, lowConfidence } from "./validation";

export function mockExtract(sampleId: string): ExtractSuccess | null {
  const sample = getSample(sampleId);
  if (!sample) return null;

  return {
    ok: true,
    source: "mock",
    fields: sample.fields,
    confidence: sample.confidence,
    warning: null,
  };
}

export function genericMock(): ExtractSuccess {
  return {
    ok: true,
    source: "mock",
    fields: { ...emptyFields },
    confidence: { ...lowConfidence },
    warning:
      "Demo mode is on because no AI API key is configured. Please enter the information from your document, or add AI_API_KEY to enable extraction.",
  };
}
