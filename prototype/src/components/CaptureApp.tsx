"use client";

import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, MIN_PROCESSING_MS } from "@/lib/constants";
import { extractDocument } from "@/lib/extractClient";
import { getSample } from "@/lib/samples";
import type {
  ConfidenceMap,
  ExtractionSource,
  FormFields,
  Phase,
  SavedTransaction,
} from "@/lib/types";
import { emptyFields, lowConfidence, validateForm } from "@/lib/validation";
import { useEffect, useRef, useState } from "react";
import { Dropzone } from "./Dropzone";
import { ExtractedForm } from "./ExtractedForm";
import { Preview } from "./Preview";
import { Processing } from "./Processing";
import { SamplePicker } from "./SamplePicker";
import { Success } from "./Success";
import { TransactionView } from "./TransactionView";

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function validateUpload(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "That file type is not supported. Please upload a JPG, PNG, or WebP image.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "That image is too large. Please upload a file under 8 MB.";
  }
  return null;
}

export function CaptureApp() {
  const [phase, setPhase] = useState<Phase>("empty");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [confidence, setConfidence] = useState<ConfidenceMap>({});
  const [warning, setWarning] = useState<string | null>(null);
  const [source, setSource] = useState<ExtractionSource>("mock");
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [apiDone, setApiDone] = useState(false);
  const [saved, setSaved] = useState<SavedTransaction | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  function rememberBlob(url: string | null) {
    if (blobUrlRef.current && blobUrlRef.current !== url) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = url;
  }

  function resetToEmpty() {
    rememberBlob(null);
    setPhase("empty");
    setUploadError(null);
    setDocumentUrl("");
    setDocumentName("");
    setFields(emptyFields);
    setConfidence({});
    setWarning(null);
    setErrors({});
    setApiDone(false);
    setSaved(null);
  }

  async function runExtraction(input: {
    previewUrl: string;
    name: string;
    file?: File;
    sampleId?: string;
    blobUrl?: string | null;
  }) {
    rememberBlob(input.blobUrl ?? null);
    setUploadError(null);
    setErrors({});
    setDocumentUrl(input.previewUrl);
    setDocumentName(input.name);
    setStartedAt(Date.now());
    setApiDone(false);
    setPhase("processing");

    const wait = sleep(MIN_PROCESSING_MS);
    const result = await extractDocument({
      file: input.file,
      sampleId: input.sampleId,
    });
    await wait;
    setApiDone(true);
    await sleep(280);

    if (
      !result.ok &&
      (result.code === "unsupported_type" ||
        result.code === "file_too_large" ||
        result.code === "no_document")
    ) {
      rememberBlob(null);
      setPhase("empty");
      setUploadError(result.message);
      setDocumentUrl("");
      return;
    }

    if (!result.ok) {
      setFields(emptyFields);
      setConfidence(lowConfidence);
      setSource("mock");
      setWarning(
        "We couldn't confidently read this document. Please review or enter the information manually.",
      );
      setPhase("review");
      return;
    }

    setFields(result.fields);
    setConfidence(result.confidence);
    setSource(result.source);
    setWarning(result.warning);
    setPhase("review");
  }

  function onFile(file: File) {
    const message = validateUpload(file);
    if (message) {
      setUploadError(message);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    void runExtraction({
      previewUrl,
      name: file.name,
      file,
      blobUrl: previewUrl,
    });
  }

  function onSample(sampleId: string) {
    const sample = getSample(sampleId);
    if (!sample) return;
    void runExtraction({
      previewUrl: "",
      name: sample.title,
      sampleId: sample.id,
      blobUrl: null,
    });
  }

  function onFieldChange(name: keyof FormFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function onSave() {
    const result = validateForm(fields);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setSaved({
      id: crypto.randomUUID(),
      fields: result.data,
      documentUrl,
      documentName,
      savedAt: new Date().toISOString(),
    });
    setPhase("success");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {phase === "empty" ? (
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
              From document to transaction
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Capture a receipt in seconds
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Upload a document, review the extracted details, then save. The original receipt stays attached.
            </p>
          </div>
          <Dropzone error={uploadError} onFile={onFile} />
          <div className="mt-8">
            <SamplePicker onSelect={onSample} />
          </div>
        </div>
      ) : null}

      {phase === "processing" ? (
        <Processing documentUrl={documentUrl} startedAt={startedAt} apiDone={apiDone} />
      ) : null}

      {phase === "review" ? (
        <div>
          <div className="mb-5">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Review extracted information
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Check the details against the document, then save the transaction.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-2">
              <Preview documentUrl={documentUrl} documentName={documentName} onReplace={onFile} />
              <ExtractedForm
                fields={fields}
                confidence={confidence}
                errors={errors}
                warning={warning}
                source={source}
                onChange={onFieldChange}
              />
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={resetToEmpty}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
              >
                Save transaction
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {phase === "success" && saved ? (
        <Success
          transaction={saved}
          onView={() => setPhase("view")}
          onReset={resetToEmpty}
        />
      ) : null}

      {phase === "view" && saved ? (
        <TransactionView transaction={saved} onReset={resetToEmpty} />
      ) : null}
    </div>
  );
}
