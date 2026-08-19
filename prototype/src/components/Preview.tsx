"use client";

import { useRef } from "react";
import { DocumentPlaceholder } from "./DocumentPlaceholder";

type PreviewProps = {
  documentUrl: string;
  documentName: string;
  onReplace: (file: File) => void;
};

export function Preview({ documentUrl, documentName, onReplace }: PreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="flex min-h-[32rem] flex-col bg-slate-50 p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Document</h2>
          <p className="mt-0.5 truncate text-xs text-slate-500">{documentName}</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Replace
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onReplace(file);
            event.target.value = "";
          }}
        />
      </div>
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-200/60 p-3 ring-1 ring-slate-200">
        {documentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={documentUrl}
            alt="Uploaded receipt or invoice"
            className="max-h-[34rem] w-full object-contain"
          />
        ) : (
          <DocumentPlaceholder name={documentName} />
        )}
      </div>
    </section>
  );
}
