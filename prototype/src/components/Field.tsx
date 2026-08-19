import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
  needsReview?: boolean;
  error?: string;
  children: ReactNode;
};

export function fieldControlClass(opts: { error?: boolean; review?: boolean }) {
  if (opts.error) {
    return "w-full rounded-lg border border-red-400 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/15";
  }
  if (opts.review) {
    return "w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";
  }
  return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";
}

export function Field({ label, htmlFor, needsReview, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {needsReview ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Review
          </span>
        ) : null}
      </div>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
