"use client";

import { useEffect, useState } from "react";

type ProcessingProps = {
  documentUrl: string;
  startedAt: number;
  apiDone: boolean;
};

const steps = [
  { id: "uploaded", label: "Document uploaded", at: 280 },
  { id: "extracting", label: "Extracting information", at: 900 },
  { id: "reviewing", label: "Reviewing results", at: 1400 },
];

export function Processing({ documentUrl, startedAt, apiDone }: ProcessingProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 120);
    return () => window.clearInterval(id);
  }, []);

  const elapsed = now - startedAt;

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {documentUrl ? (
          <div className="bg-slate-50 px-6 py-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={documentUrl}
              alt="Uploaded document"
              className="mx-auto max-h-48 rounded-lg object-contain shadow-sm ring-1 ring-slate-200"
            />
          </div>
        ) : null}
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold text-slate-900">Reading your receipt...</h2>
          <p className="mt-1 text-sm text-slate-500">
            This usually takes a moment. You will review everything before it is saved.
          </p>
          <ol className="mt-6 space-y-3">
            {steps.map((step, index) => {
              const reached =
                step.id === "reviewing" ? apiDone && elapsed >= step.at : elapsed >= step.at;
              const current =
                !reached &&
                (index === 0 || elapsed >= steps[index - 1].at) &&
                (step.id !== "reviewing" || elapsed >= 900);
              return (
                <li key={step.id} className="flex items-center gap-3 text-sm">
                  <StatusIcon done={reached} current={current} />
                  <span className={reached || current ? "text-slate-800" : "text-slate-400"}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-white">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
          <path d="m3.5 8.5 3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  if (current) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-teal-700 text-teal-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal-700" />
      </span>
    );
  }

  return <span className="h-5 w-5 rounded-full border border-slate-200 bg-white" />;
}
