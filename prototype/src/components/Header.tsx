export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
              <rect x="3" y="2" width="10" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">dductly</span>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <span className="text-sm text-slate-500">AI Receipt Capture</span>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Prototype
        </span>
      </div>
    </header>
  );
}
