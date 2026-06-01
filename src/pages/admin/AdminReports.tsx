import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import {
  ReportBatchFilter,
  type ReportBatchFilter as BatchFilter,
} from "@/components/reports/ReportBatchFilter";
import { cn } from "@/lib/utils";

type AdminReport = {
  id: number;
  intern: string;
  mentor: string;
  unit: string;
  batch: string;
  date: string;
  hours: string;
  /** Set when mentors/admins should open this report alongside attendance issues. */
  attendanceNote?: string;
  sections: {
    accomplishments: { title: string; description: string }[];
  };
};

const reports: AdminReport[] = [
  {
    id: 1,
    intern: "Hart Lawrence Binay",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 27, 2026",
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
    intern: "Ian Belarmino",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 27, 2026",
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
    intern: "Justice Tanudra",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B15",
    date: "Mar 26, 2026",
    hours: "7h 45m",
    attendanceNote: "Unexcused absence on Mar 25 — review hours logged vs. attendance record.",
    sections: {
      accomplishments: [
        { title: "Operations Checklist Draft", description: "Prepared onboarding checklist draft for batch interns." },
      ],
    },
  },
  {
    id: 4,
    intern: "Karylle Lubiano",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B15",
    date: "Mar 26, 2026",
    hours: "8h 10m",
    sections: {
      accomplishments: [
        { title: "Brand Asset Cleanup", description: "Organized design assets and revised naming conventions for campaign files." },
        { title: "Report Packaging", description: "Prepared monthly campaign summary with supporting visuals." },
      ],
    },
  },
  {
    id: 5,
    intern: "Justice Tanudra",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B15",
    date: "Mar 25, 2026",
    hours: "8h 00m",
    sections: {
      accomplishments: [
        { title: "Checklist Compliance", description: "Validated operations checklist updates and reconciled missing entries." },
      ],
    },
  },
  {
    id: 6,
    intern: "Hart Lawrence Binay",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 25, 2026",
    hours: "8h 25m",
    attendanceNote: "Absent Mar 24 on attendance log — use this report to verify claimed work.",
    sections: {
      accomplishments: [
        { title: "Task Board Refinements", description: "Improved task list hierarchy and polished detail pane responsiveness." },
      ],
    },
  },
  {
    id: 7,
    intern: "Kim Gamot",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B14",
    date: "Mar 24, 2026",
    hours: "7h 35m",
    attendanceNote: "Late clock-in on Mar 23 and Mar 24 — cross-check reported hours.",
    sections: {
      accomplishments: [
        { title: "Pipeline Integrity Review", description: "Reviewed data validation checkpoints and identified discrepancies in edge cases." },
      ],
    },
  },
  {
    id: 8,
    intern: "Ian Belarmino",
    mentor: "James Aeron Borja",
    unit: "Tech Unit",
    batch: "B16",
    date: "Mar 24, 2026",
    hours: "8h 05m",
    sections: {
      accomplishments: [
        { title: "Error-State UX Updates", description: "Updated report and task modules with clearer user-facing error messages." },
      ],
    },
  },
];

export default function AdminReports() {
  const [batchFilter, setBatchFilter] = useState<BatchFilter>("All");

  const filteredReports = useMemo(() => {
    if (batchFilter === "All") return reports;
    return reports.filter((r) => r.batch === batchFilter);
  }, [batchFilter]);

  const uniqueDates = useMemo(
    () => Array.from(new Set(filteredReports.map((r) => r.date))),
    [filteredReports],
  );

  const [selectedDate, setSelectedDate] = useState(uniqueDates[0] ?? "");
  const [selectedId, setSelectedId] = useState(0);

  const dateReports = useMemo(
    () => filteredReports.filter((r) => r.date === selectedDate),
    [filteredReports, selectedDate],
  );

  const selected = useMemo(() => {
    const match = filteredReports.find((r) => r.id === selectedId);
    return match ?? dateReports[0] ?? filteredReports[0];
  }, [filteredReports, selectedId, dateReports]);

  useEffect(() => {
    const dates = Array.from(new Set(filteredReports.map((r) => r.date)));
    const nextDate = dates.includes(selectedDate) ? selectedDate : (dates[0] ?? "");
    setSelectedDate(nextDate);
    const dayItems = filteredReports.filter((r) => r.date === nextDate);
    const stillVisible = dayItems.some((r) => r.id === selectedId);
    if (!stillVisible) {
      setSelectedId(dayItems[0]?.id ?? filteredReports[0]?.id ?? 0);
    }
  }, [batchFilter, filteredReports, selectedDate, selectedId]);

  const attendanceFollowUpCount = filteredReports.filter((r) => r.attendanceNote).length;

  const stats = [
    { label: "Total reports", value: filteredReports.length, color: "--stat-emerald" },
    { label: "Attendance follow-up", value: attendanceFollowUpCount, color: "--stat-orange" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">All Reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted accomplishment reports for reference — especially when attendance needs investigation.
          </p>
        </div>
        <MockFileDownloadMenu variant="button" fileLabel="All internship reports export" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(var(${s.color}))` }} />
              <span className="text-sm font-medium text-foreground">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <ReportBatchFilter value={batchFilter} onChange={setBatchFilter} reports={reports} />
      </div>

      {filteredReports.length === 0 ? (
        <p className="rounded-xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          No reports for this batch.
        </p>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground">Report days</p>
            </div>
            <div className="divide-y divide-border">
              {uniqueDates.map((date) => {
                const dayItems = filteredReports.filter((r) => r.date === date);
                const active = date === selectedDate;
                const attendanceFlags = dayItems.filter((r) => r.attendanceNote).length;
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
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {dayItems.length} report{dayItems.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    {attendanceFlags > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stat-orange-bg text-stat-orange">
                        {attendanceFlags} attendance
                      </span>
                    ) : null}
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
                  <h3 className="font-display font-bold text-foreground text-lg">Daily report</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedDate} · {selected.intern} · Batch {selected.batch} · {selected.unit} · Mentor:{" "}
                    {selected.mentor}
                  </p>
                </div>
                <MockFileDownloadMenu fileLabel={`Daily report — ${selected.intern} — ${selectedDate}`} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {dateReports.map((r) => {
                  const active = r.id === selected.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                        active
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background text-muted-foreground border-border hover:bg-muted",
                        r.attendanceNote && !active && "border-stat-orange/40",
                      )}
                    >
                      {r.attendanceNote ? (
                        <AlertTriangle className="h-3 w-3 shrink-0 text-stat-orange" aria-hidden />
                      ) : null}
                      {r.intern} · {r.batch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {selected.attendanceNote ? (
                <div className="mb-5 flex gap-3 rounded-lg border border-stat-orange/30 bg-stat-orange-bg/50 px-4 py-3 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-stat-orange mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Attendance follow-up</p>
                    <p className="mt-0.5 text-muted-foreground">{selected.attendanceNote}</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Hours logged</p>
                  <p className="text-lg font-bold font-display text-foreground">{selected.hours}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Report date</p>
                  <p className="text-lg font-bold font-display text-foreground">{selected.date}</p>
                </div>
              </div>

              <div
                className="overflow-auto rounded-lg border border-border bg-muted/20 p-4 cursor-pointer hover:border-primary/40 transition-colors"
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
      )}
    </div>
  );
}
