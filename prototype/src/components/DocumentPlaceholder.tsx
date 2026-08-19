type DocumentPlaceholderProps = {
  name: string;
  compact?: boolean;
};

export function DocumentPlaceholder({ name, compact = false }: DocumentPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl bg-slate-100 text-center ring-1 ring-slate-200 ${
        compact ? "h-16 w-12 p-2" : "min-h-48 w-full px-4 py-10"
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-lg bg-white text-teal-700 ring-1 ring-slate-200 ${
          compact ? "h-7 w-7" : "h-10 w-10"
        }`}
      >
        <svg viewBox="0 0 16 16" className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true">
          <rect x="3" y="2" width="10" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      {compact ? null : (
        <>
          <p className="mt-3 text-sm font-medium text-slate-800">{name}</p>
          <p className="mt-1 text-xs text-slate-500">Sample document attached</p>
        </>
      )}
    </div>
  );
}
