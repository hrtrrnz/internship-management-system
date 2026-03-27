import { useState } from "react";
import { AlertTriangle, CheckCircle, ChevronRight, Clock } from "lucide-react";

type ReportStatus = "Pending Review" | "Reviewed" | "Needs Revision";

type MentorReport = {
  id: number;
  intern: string;
  batch: string;
  date: string;
  status: ReportStatus;
  hours: string;
  sections: {
    accomplishments: { title: string; description: string }[];
  };
};

const reports: MentorReport[] = [
  {
    id: 1,
    intern: "Juan dela Cruz",
    batch: "B16",
    date: "Mar 21, 2026",
    status: "Pending Review",
    hours: "8h 30m",
    sections: {
      accomplishments: [
        { title: "User Module API Integration", description: "Completed API integration for user module with error handling and loading states." },
        { title: "Sprint Review Demo", description: "Presented dashboard progress to stakeholders and documented feedback points." },
      ],
    },
  },
  {
    id: 2,
    intern: "Ana Santos",
    batch: "B16",
    date: "Mar 21, 2026",
    status: "Pending Review",
    hours: "9h 00m",
    sections: {
      accomplishments: [
        { title: "UI Component Testing", description: "Ran component tests and resolved accessibility issues in shared elements." },
        { title: "Storybook Updates", description: "Updated stories and usage references for revised UI states." },
      ],
    },
  },
  {
    id: 3,
    intern: "Mark Rivera",
    batch: "B15",
    date: "Mar 20, 2026",
    status: "Reviewed",
    hours: "8h 45m",
    sections: {
      accomplishments: [
        { title: "Database Migration Plan", description: "Drafted migration plan and identified potential data integrity checks." },
      ],
    },
  },
  {
    id: 4,
    intern: "Lisa Tan",
    batch: "B15",
    date: "Mar 20, 2026",
    status: "Needs Revision",
    hours: "7h 50m",
    sections: {
      accomplishments: [
        { title: "Campaign Analysis Draft", description: "Submitted campaign analysis with strong findings but lacking source references." },
      ],
    },
  },
  {
    id: 5,
    intern: "Peter Lim",
    batch: "B15",
    date: "Mar 19, 2026",
    status: "Reviewed",
    hours: "8h 05m",
    sections: {
      accomplishments: [
        { title: "Operations Tracker Update", description: "Updated weekly tracker and validated task completion checklist with mentor comments." },
      ],
    },
  },
  {
    id: 6,
    intern: "Sofia Garcia",
    batch: "B14",
    date: "Mar 19, 2026",
    status: "Pending Review",
    hours: "8h 15m",
    sections: {
      accomplishments: [
        { title: "Brand Assets Audit", description: "Audited campaign assets and categorized outdated materials for revision." },
      ],
    },
  },
  {
    id: 7,
    intern: "David Chen",
    batch: "B14",
    date: "Mar 18, 2026",
    status: "Needs Revision",
    hours: "7h 40m",
    sections: {
      accomplishments: [
        { title: "Data Pipeline Notes", description: "Documented ETL flow and flagged validation gaps in transformation rules." },
      ],
    },
  },
  {
    id: 8,
    intern: "Grace Yu",
    batch: "B14",
    date: "Mar 18, 2026",
    status: "Reviewed",
    hours: "8h 00m",
    sections: {
      accomplishments: [
        { title: "Frontend Setup Progress", description: "Completed environment setup and aligned dependencies with team standards." },
      ],
    },
  },
];

const statusConfig: Record<ReportStatus, { color: string; bg: string; icon: React.ElementType }> = {
  "Pending Review": { color: "text-stat-orange", bg: "bg-stat-orange-bg", icon: Clock },
  Reviewed: { color: "text-stat-green", bg: "bg-stat-green-bg", icon: CheckCircle },
  "Needs Revision": { color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
};

export default function MentorReportReview() {
  const uniqueDates = Array.from(new Set(reports.map((r) => r.date)));
  const [selectedDate, setSelectedDate] = useState(uniqueDates[0] ?? "");
  const dateReports = reports.filter((r) => r.date === selectedDate);
  const [selectedId, setSelectedId] = useState(dateReports[0]?.id ?? reports[0]?.id ?? 0);
  const selected = reports.find((r) => r.id === selectedId) ?? dateReports[0] ?? reports[0];
  const selectedStatus = statusConfig[selected.status];

  const stats = [
    { label: "Total", value: reports.length, color: "--stat-emerald" },
    { label: "Pending Review", value: reports.filter((r) => r.status === "Pending Review").length, color: "--stat-orange" },
    { label: "Reviewed", value: reports.filter((r) => r.status === "Reviewed").length, color: "--stat-green" },
    { label: "Needs Revision", value: reports.filter((r) => r.status === "Needs Revision").length, color: "--destructive" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Report Review</h2>

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
              const pendingCount = dayItems.filter((r) => r.status === "Pending Review").length;
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
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stat-orange-bg text-stat-orange">
                      {pendingCount} pending
                    </span>
                  )}
                  {active && <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-foreground text-lg">Daily Report</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedDate} · Batch {selected.batch}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStatus.bg} ${selectedStatus.color}`}>
                {selected.status}
              </span>
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

            <div className="mb-5 overflow-auto rounded-lg border border-border bg-muted/20 p-4">
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

            {selected.status === "Pending Review" && (
              <div className="border-t border-border pt-4">
                <textarea
                  placeholder="Write your feedback..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-2 justify-end mt-3">
                  <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Request Revision
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve & Send Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
