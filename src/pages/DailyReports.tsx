import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import { INTERN_ACCOMPLISHMENT_REPORTS } from "@/lib/accomplishmentReports";

const reports = INTERN_ACCOMPLISHMENT_REPORTS;

const statusConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  Submitted: { color: "text-stat-blue", icon: Clock, bg: "bg-stat-blue-bg" },
  Reviewed: { color: "text-stat-green", icon: CheckCircle, bg: "bg-stat-green-bg" },
  Missing: { color: "text-destructive", icon: AlertTriangle, bg: "bg-destructive/10" },
};

export default function DailyReports() {
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? 0);
  const selected = reports.find((r) => r.id === selectedId) ?? reports[0];

  if (!selected) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-foreground">Daily Reports</h2>
        <p className="text-sm text-muted-foreground">No accomplishment reports found.</p>
      </div>
    );
  }

  const selectedStatus = statusConfig[selected.status];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Daily Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitted accomplishment reports from your internship.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {[
          { label: "Total", value: reports.length, color: "--stat-emerald" },
          { label: "Submitted", value: reports.filter((r) => r.status === "Submitted").length, color: "--stat-blue" },
          { label: "Reviewed", value: 0, color: "--stat-orange" },
          { label: "Missing", value: 0, color: "--destructive" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <span className="w-2 h-2 rounded-full" style={{ background: `hsl(var(${s.color}))` }} />
            <span className="text-sm font-medium text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground">All Reports</p>
          </div>
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto divide-y divide-border">
            {reports.map((r) => {
              const sc = statusConfig[r.status];
              const isActive = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors flex items-start gap-3 ${
                    isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30 border-l-2 border-l-transparent"
                  }`}
                >
                  <sc.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${sc.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                      {r.date}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.color}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  {isActive ? <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-foreground text-lg">Accomplishment Report</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selected.date}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <MockFileDownloadMenu
                  fileLabel={selected.fileName}
                  fileUrl={selected.pdfUrl}
                />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStatus.bg} ${selectedStatus.color}`}>
                  {selected.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Document</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{selected.fileName}</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-lg font-bold font-display text-foreground">{selected.date}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
              <iframe
                key={selected.pdfUrl}
                src={selected.pdfUrl}
                title={selected.fileName}
                className="h-[min(70vh,42rem)] w-full bg-background"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
