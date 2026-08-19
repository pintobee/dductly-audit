import type { SavedTransaction } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { DocumentPlaceholder } from "./DocumentPlaceholder";

type SuccessProps = {
  transaction: SavedTransaction;
  onView: () => void;
  onReset: () => void;
};

export function Success({ transaction, onView, onReset }: SuccessProps) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            <path
              d="m5 12 5 5 9-10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-semibold text-slate-900">Transaction saved successfully</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your receipt has been attached to this transaction.
        </p>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
          {transaction.documentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={transaction.documentUrl}
              alt=""
              className="h-16 w-12 rounded-md object-cover ring-1 ring-slate-200"
            />
          ) : (
            <DocumentPlaceholder name={transaction.documentName} compact />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{transaction.fields.vendor}</p>
            <p className="text-sm text-slate-500">
              {formatMoney(transaction.fields.total, transaction.fields.currency)} · Receipt attached
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onView}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            View transaction
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Capture another
          </button>
        </div>
      </div>
    </div>
  );
}
