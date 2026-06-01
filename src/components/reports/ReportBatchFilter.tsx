import { cn } from "@/lib/utils";
import type { InternBatch } from "@/lib/internRoster";

export type ReportBatchFilter = "All" | InternBatch;

const batchTabs: { id: ReportBatchFilter; label: string }[] = [
  { id: "All", label: "All interns" },
  { id: "B16", label: "Batch 16" },
  { id: "B15", label: "Batch 15" },
  { id: "B14", label: "Batch 14" },
];

type ReportBatchFilterProps = {
  value: ReportBatchFilter;
  onChange: (value: ReportBatchFilter) => void;
  reports: { batch: string }[];
  className?: string;
};

export function ReportBatchFilter({ value, onChange, reports, className }: ReportBatchFilterProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="tablist"
      aria-label="Filter reports by batch"
    >
      {batchTabs.map((tab) => {
        const selected = value === tab.id;
        const count =
          tab.id === "All" ? reports.length : reports.filter((r) => r.batch === tab.id).length;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {tab.label}
            <span className="ml-1.5 tabular-nums opacity-80">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
