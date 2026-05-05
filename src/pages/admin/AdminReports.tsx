import { useState } from "react";
import { AlertTriangle, CheckCircle, ChevronRight, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";

type ReportStatus = "Submitted" | "Reviewed" | "Needs Revision";

type AdminReport = {
  id: number;
  intern: string;
  mentor: string;
  unit: string;
  batch: string;
  date: string;
  status: ReportStatus;
  hours: string;
  sections: {
    accomplishments: { title: string; description: string }[];
  };
};

const reports: AdminReport[] = [
  {
    id: 1,
    intern: "Alex Cruz",
    mentor: "Nora",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 27, 2026",
    status: "Submitted",
    hours: "8h 20m",
    sections: {
      accomplishments: [
        { title: "Daily Attendance Monitoring", description: "Verified attendance records and submitted updated daily log entries." },
        { title: "Frontend Task Updates", description: "Completed pending UI refinements and synchronized dashboard card layouts." },
      ],
    },
  },
  {
    id: 2,
    intern: "Bea Santos",
    mentor: "Nora",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 27, 2026",
    status: "Reviewed",
    hours: "8h 00m",
    sections: {
      accomplishments: [
        { title: "API Error Handling", description: "Implemented robust API error states for task and report modules." },
        { title: "Form Validation Cleanup", description: "Standardized validation messaging and reduced duplicate field errors." },
      ],
    },
  },
  {
    id: 3,
    intern: "Marco Reyes",
    mentor: "Tristan Lee",
    unit: "Operations",
    batch: "B15",
    date: "Mar 26, 2026",
    status: "Needs Revision",
    hours: "7h 45m",
    sections: {
      accomplishments: [
        { title: "Operations Checklist Draft", description: "Prepared onboarding checklist draft for batch interns." },
      ],
    },
  },
  {
    id: 4,
    intern: "Lia Tan",
    mentor: "Adrian Cole",
    unit: "Marketing",
    batch: "B15",
    date: "Mar 26, 2026",
    status: "Submitted",
    hours: "8h 10m",
    sections: {
      accomplishments: [
        { title: "Brand Asset Cleanup", description: "Organized design assets and revised naming conventions for campaign files." },
        { title: "Report Packaging", description: "Prepared monthly campaign summary with supporting visuals for review." },
      ],
    },
  },
  {
    id: 5,
    intern: "Marco Reyes",
    mentor: "Tristan Lee",
    unit: "Operations",
    batch: "B15",
    date: "Mar 25, 2026",
    status: "Reviewed",
    hours: "8h 00m",
    sections: {
      accomplishments: [
        { title: "Checklist Compliance", description: "Validated operations checklist updates and reconciled missing entries." },
      ],
    },
  },
  {
    id: 6,
    intern: "Alex Cruz",
    mentor: "Nora",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 25, 2026",
    status: "Submitted",
    hours: "8h 25m",
    sections: {
      accomplishments: [
        { title: "Task Board Refinements", description: "Improved task list hierarchy and polished detail pane responsiveness." },
      ],
    },
  },
  {
    id: 7,
    intern: "Adrian Cole",
    mentor: "Carlos Santos",
    unit: "Data Analytics",
    batch: "B14",
    date: "Mar 24, 2026",
    status: "Needs Revision",
    hours: "7h 35m",
    sections: {
      accomplishments: [
        { title: "Pipeline Integrity Review", description: "Reviewed data validation checkpoints and identified discrepancies in edge cases." },
      ],
    },
  },
  {
    id: 8,
    intern: "Bea Santos",
    mentor: "Nora",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 24, 2026",
    status: "Reviewed",
    hours: "8h 05m",
    sections: {
      accomplishments: [
        { title: "Error-State UX Updates", description: "Updated report and task modules with clearer user-facing error messages." },
      ],
    },
  },
];

const statusConfig: Record<ReportStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Submitted: { color: "text-stat-blue", bg: "bg-stat-blue-bg", icon: Clock },
  Reviewed: { color: "text-stat-green", bg: "bg-stat-green-bg", icon: CheckCircle },
  "Needs Revision": { color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
};

export default function AdminReports() {
  const uniqueDates = Array.from(new Set(reports.map((r) => r.date)));
  const [selectedDate, setSelectedDate] = useState(uniqueDates[0] ?? "");
  const dateReports = reports.filter((r) => r.date === selectedDate);
  const [selectedId, setSelectedId] = useState(dateReports[0]?.id ?? reports[0]?.id ?? 0);
  const selected = reports.find((r) => r.id === selectedId) ?? dateReports[0] ?? reports[0];

  const stats = [
    { label: "Total", value: reports.length, color: "--stat-emerald" },
    { label: "Submitted", value: reports.filter((r) => r.status === "Submitted").length, color: "--stat-blue" },
    { label: "Reviewed", value: reports.filter((r) => r.status === "Reviewed").length, color: "--stat-green" },
    { label: "Needs Revision", value: reports.filter((r) => r.status === "Needs Revision").length, color: "--destructive" },
  ];

  const selectedStatus = statusConfig[selected.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground">All Reports</h2>
        <MockFileDownloadMenu variant="button" fileLabel="All internship reports export" />
      </div>

      <div className="flex items-center gap-3">
        {stats.map((s) => (
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
            <p className="text-xs font-medium text-muted-foreground">Report Days</p>
          </div>
          <div className="divide-y divide-border">
            {uniqueDates.map((date) => {
              const dayItems = reports.filter((r) => r.date === date);
              const active = date === selectedDate;
              const submitted = dayItems.filter((r) => r.status === "Submitted").length;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedId(dayItems[0]?.id ?? 0);
                  }}
                  className={`w-full text-left px-4 py-3.5 transition-colors flex items-start gap-3 ${
                    active ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30 border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>{date}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{dayItems.length} reports</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stat-blue-bg text-stat-blue">
                    {submitted} submitted
                  </span>
                  {active && <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-foreground text-lg">Daily Report</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedDate} · {selected.intern} · Batch {selected.batch} · {selected.unit} · Mentor: {selected.mentor}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <MockFileDownloadMenu fileLabel={`Daily report — ${selected.intern} — ${selectedDate}`} />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStatus.bg} ${selectedStatus.color}`}>
                  {selected.status}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {dateReports.map((r) => {
                const active = r.id === selected.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {r.intern} · {r.batch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Hours Logged</p>
                <p className="text-lg font-bold font-display text-foreground">{selected.hours}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-lg font-bold font-display text-foreground">{selected.date}</p>
              </div>
            </div>

            <div
              className="mb-5 overflow-auto rounded-lg border border-border bg-muted/20 p-4 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() =>
                toast({
                  title: "Document preview",
                  description: `Previewing ${selected.intern}'s report.`,
                })
              }
            >
              <div className="mx-auto aspect-[1/1.4142] w-full max-w-[720px] bg-white text-black shadow-md">
                <div className="p-[1in] font-['Arial'] text-[11pt] leading-[1.35]">
                  <p className="mb-0.5">{selected.date}</p>
                  <p className="mb-0.5">Accomplishment Report</p>
                  <p>To Whom It May Concern,</p>

                  <h4 className="mt-10 text-center text-[11pt] font-bold">Accomplishment Report</h4>

                  <ol className="mt-8 list-decimal pl-6 space-y-4">
                    {selected.sections.accomplishments.map((item) => (
                      <li key={item.title} className="leading-[1.35]">
                        <p className="font-bold">{item.title}</p>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
