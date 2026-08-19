import { samples } from "@/lib/samples";

type SamplePickerProps = {
  onSelect: (sampleId: string) => void;
};

export function SamplePicker({ onSelect }: SamplePickerProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Or try a sample receipt
        </p>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelect(sample.id)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-teal-600/40 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-slate-900">{sample.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">{sample.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
