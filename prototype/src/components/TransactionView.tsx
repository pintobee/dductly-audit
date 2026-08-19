import { displaySavedValue, formatDate } from "@/lib/format";
import type { SavedFields, SavedTransaction } from "@/lib/types";
import { DocumentPlaceholder } from "./DocumentPlaceholder";

const rows: { key: keyof SavedFields; label: string }[] = [
  { key: "vendor", label: "Vendor" },
  { key: "date", label: "Date" },
  { key: "total", label: "Total" },
  { key: "tax", label: "Tax" },
  { key: "invoiceNumber", label: "Invoice number" },
  { key: "category", label: "Category" },
  { key: "paymentMethod", label: "Payment method" },
  { key: "currency", label: "Currency" },
];

type TransactionViewProps = {
  transaction: SavedTransaction;
  onReset: () => void;
};

export function TransactionView({ transaction, onReset }: TransactionViewProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Saved transaction</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {transaction.fields.vendor}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Saved {formatDate(transaction.savedAt.slice(0, 10))} · Original document attached
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Capture another
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-2">
          <div className="bg-slate-50 p-5 sm:p-6">
            <p className="mb-3 text-sm font-semibold text-slate-900">Attached receipt</p>
            <div className="rounded-xl bg-slate-200/60 p-3 ring-1 ring-slate-200">
              {transaction.documentUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={transaction.documentUrl}
                  alt="Receipt attached to this transaction"
                  className="mx-auto max-h-[32rem] w-full object-contain"
                />
              ) : (
                <DocumentPlaceholder name={transaction.documentName} />
              )}
            </div>
          </div>
          <dl className="divide-y divide-slate-100 p-5 sm:p-6">
            {rows.map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-6 py-3">
                <dt className="text-sm text-slate-500">{row.label}</dt>
                <dd className="text-right text-sm font-medium text-slate-900">
                  {displaySavedValue(row.key, transaction.fields)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
