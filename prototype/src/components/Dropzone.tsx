"use client";

import { useRef, useState, type DragEvent } from "react";

type DropzoneProps = {
  error: string | null;
  onFile: (file: File) => void;
};

export function Dropzone({ error, onFile }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const browseRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function takeFile(list: FileList | null) {
    const file = list?.[0];
    if (file) onFile(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    takeFile(event.dataTransfer.files);
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        setIsDragging(false);
      }}
      onDrop={onDrop}
      className={`rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
        isDragging
          ? "border-teal-600 bg-teal-50"
          : "border-slate-200 bg-slate-50/80"
      }`}
    >
      <input
        ref={browseRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          takeFile(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          takeFile(event.target.files);
          event.target.value = "";
        }}
      />
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M12 16V4m0 0 4 4M12 4 8 8M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Upload a receipt or invoice</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        AI will extract the information you need and fill in the details for you.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => browseRef.current?.click()}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          Browse files
        </button>
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Take a photo
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-400">JPG, PNG, or WebP · up to 8 MB</p>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
