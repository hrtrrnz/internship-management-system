import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import {
  ReportBatchFilter,
  type ReportBatchFilter as BatchFilter,
} from "@/components/reports/ReportBatchFilter";
import { cn } from "@/lib/utils";

type MentorReport = {
  id: number;
  intern: string;
  batch: string;
  date: string;
  hours: string;
  attendanceNote?: string;
  sections: {
    accomplishments: { title: string; description: string }[];
  };
};

const reports: MentorReport[] = [
  {
    id: 1,
    intern: "Hart Lawrence Binay",
    batch: "B16",
    date: "Mar 21, 2026",
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
    intern: "Ian Belarmino",
    batch: "B16",
    date: "Mar 21, 2026",
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
    intern: "Josephine Mission",
    batch: "B15",
    date: "Mar 20, 2026",
    hours: "8h 45m",
    sections: {
      accomplishments: [
        { title: "Database Migration Plan", description: "Drafted migration plan and identified potential data integrity checks." },
      ],
    },
  },
  {
    id: 4,
    intern: "Justice Tanudra",
    batch: "B15",
    date: "Mar 20, 2026",
    hours: "7h 50m",
    attendanceNote: "Reported hours do not match attendance on Mar 19 — review before following up.",
    sections: {
      accomplishments: [
        { title: "Campaign Analysis Draft", description: "Submitted campaign analysis with supporting data tables." },
      ],
    },
  },
  {
    id: 5,
    intern: "John Andrei Bonito",
    batch: "B15",
    date: "Mar 19, 2026",
    hours: "8h 05m",
    sections: {
      accomplishments: [
        { title: "Operations Tracker Update", description: "Updated weekly tracker and validated task completion checklist." },
      ],
    },
  },
  {
    id: 6,
    intern: "Kim Gamot",
    batch: "B14",
    date: "Mar 19, 2026",
    hours: "8h 15m",
    attendanceNote: "Late clock-in on Mar 18 — compare with hours claimed in this report.",
    sections: {
      accomplishments: [
        { title: "Brand Assets Audit", description: "Audited campaign assets and categorized outdated materials for revision." },
      ],
    },
  },
  {
    id: 7,
    intern: "Gabriel Tabiñas",
    batch: "B15",
    date: "Mar 18, 2026",
    hours: "7h 40m",
    attendanceNote: "Excused absence on Mar 17 — confirm work items against attendance excusal.",
    sections: {
      accomplishments: [
        { title: "Data Pipeline Notes", description: "Documented ETL flow and flagged validation gaps in transformation rules." },
      ],
    },
  },
  {
    id: 8,
    intern: "Kasandra Bumagat",
    batch: "B16",
    date: "Mar 18, 2026",
    hours: "8h 00m",
    sections: {
      accomplishments: [
        { title: "Frontend Setup Progress", description: "Completed environment setup and aligned dependencies with team standards." },
      ],
    },
  },
];

export default function MentorReportReview() {
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
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Intern Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Open submitted accomplishment reports when you need context alongside a student&apos;s attendance record.
        </p>
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
              <div>
                <h3 className="font-display font-bold text-foreground text-lg">Daily report</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedDate} · {selected.intern} · Batch {selected.batch}
                </p>
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

              <div className="overflow-auto rounded-lg border border-border bg-muted/20 p-4">
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
