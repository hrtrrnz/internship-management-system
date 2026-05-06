import { useMemo, useState } from "react";
import { Clock, CheckCircle, AlertCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import { useAttendancePolicy } from "@/contexts/AttendancePolicyContext";

const todayLogs = [
  { name: "Ana Santos", dept: "Tech & Innovation", in: "7:55 AM", status: "Present" },
  { name: "Peter Lim", dept: "Operations", in: "8:00 AM", status: "Present" },
  { name: "Grace Yu", dept: "Tech & Innovation", in: "7:50 AM", status: "Present" },
  { name: "Sofia Garcia", dept: "Marketing", in: "7:58 AM", status: "Present" },
  { name: "Lisa Tan", dept: "Marketing", in: "8:10 AM", status: "Late" },
  { name: "David Chen", dept: "Data Analytics", in: "8:20 AM", status: "Late" },
  { name: "Juan dela Cruz", dept: "Tech & Innovation", in: "—", status: "Absent" },
  { name: "Mark Rivera", dept: "Tech & Innovation", in: "—", status: "Absent" },
];

const weeklyHeatmap = [
  { name: "Juan", mon: "P", tue: "P", wed: "P", thu: "L", fri: "P" },
  { name: "Ana", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P" },
  { name: "Mark", mon: "P", tue: "A", wed: "P", thu: "P", fri: "L" },
  { name: "Lisa", mon: "P", tue: "P", wed: "L", thu: "P", fri: "P" },
  { name: "Peter", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P" },
  { name: "Grace", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P" },
  { name: "David", mon: "L", tue: "P", wed: "P", thu: "P", fri: "L" },
  { name: "Sofia", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P" },
];

const cellColor: Record<string, string> = {
  P: "bg-stat-green/20 text-stat-green",
  L: "bg-stat-orange/20 text-stat-orange",
  A: "bg-destructive/15 text-destructive",
};

const statusStyles: Record<string, string> = {
  Present: "text-stat-green bg-stat-green-bg",
  Late: "text-stat-orange bg-stat-orange-bg",
  Absent: "text-destructive bg-destructive/10",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AdminAttendance() {
  const { workdayOverrideByDate, setWorkdayOverrideByDate, excusalByInternByDate, setExcusalByInternByDate } = useAttendancePolicy();
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-24");
  const [currentMonth, setCurrentMonth] = useState(2); // March = 2
  const [currentYear] = useState(2026);
  const [excusalInternNames, setExcusalInternNames] = useState<string[]>([todayLogs[0]?.name ?? "Juan dela Cruz"]);
  const [excusalDate, setExcusalDate] = useState<string>("2026-03-24");
  const [excusalDescription, setExcusalDescription] = useState("");
  const [excusalLetters, setExcusalLetters] = useState<string[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [displayMode, setDisplayMode] = useState<"day" | "week">("day");
  const [rightPanelMode, setRightPanelMode] = useState<"workdays" | "excusals">("workdays");

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const isWorkday = (dateStr: string) => {
    const override = workdayOverrideByDate[dateStr];
    if (override !== undefined) return override;
    const [y, m, d] = dateStr.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    return dow !== 0 && dow !== 6;
  };

  const selectedWorkday = isWorkday(selectedDate);
  const anyExcusalOnDate = useMemo(() => {
    for (const internMap of Object.values(excusalByInternByDate)) {
      if (internMap?.[selectedDate]?.excused) return true;
    }
    return false;
  }, [excusalByInternByDate, selectedDate]);

  const workdayCountThisMonth = useMemo(() => {
    let n = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      if (isWorkday(dateStr)) n += 1;
    }
    return n;
  }, [currentMonth, currentYear, daysInMonth, workdayOverrideByDate]);

  const present = todayLogs.filter(l => l.status === "Present").length;
  const late = todayLogs.filter(l => l.status === "Late").length;
  const absent = todayLogs.filter(l => l.status === "Absent").length;

  const refToday = useMemo(() => new Date(2026, 2, 24), []);
  const weekStart = useMemo(() => {
    // Monday of the reference week, then apply offset (negative = previous weeks)
    const base = new Date(refToday);
    const dow = base.getDay(); // Sun=0
    const mondayDelta = (dow + 6) % 7;
    base.setDate(base.getDate() - mondayDelta + weekOffset * 7);
    base.setHours(0, 0, 0, 0);
    return base;
  }, [refToday, weekOffset]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const canNextWeek = useMemo(() => {
    // don't allow navigating beyond the reference week
    return weekOffset < 0;
  }, [weekOffset]);

  const weekRangeLabel = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    const fmt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${weekStart.toLocaleDateString("en-US", fmt)} – ${end.toLocaleDateString("en-US", fmt)}, ${weekStart.getFullYear()}`;
  }, [weekStart]);

  const weekKey = useMemo(() => weekStart.toISOString().slice(0, 10), [weekStart]);
  const weeklyHeatmapForWeek = useMemo(() => {
    // Simple deterministic variation per week so browsing "previous weeks" shows different data.
    const shift = Math.abs(Array.from(weekKey).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % 3;
    const rotate = (v: string) => {
      const order = ["P", "L", "A"];
      const idx = order.indexOf(v);
      if (idx === -1) return v;
      return order[(idx + shift) % order.length];
    };
    return weeklyHeatmap.map((row) => ({
      ...row,
      mon: rotate(row.mon),
      tue: rotate(row.tue),
      wed: rotate(row.wed),
      thu: rotate(row.thu),
      fri: rotate(row.fri),
      sat: rotate(row.mon),
      sun: rotate(row.fri),
    }));
  }, [weekKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Attendance Logs</h2>
        </div>
        <MockFileDownloadMenu variant="button" fileLabel="Attendance logs export" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Today's overview */}
        <div className="col-span-2 space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => setDisplayMode("day")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  displayMode === "day" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode("week")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  displayMode === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {displayMode === "day" ? (
            <>
              {/* Visual summary bar */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-foreground">Today — March 24, 2026</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-stat-green" /> {present} Present</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-stat-orange" /> {late} Late</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-destructive" /> {absent} Absent</span>
                  </div>
                </div>
                {/* Stacked bar */}
                <div className="w-full h-6 rounded-full overflow-hidden flex">
                  <div className="bg-stat-green h-full transition-all" style={{ width: `${(present / todayLogs.length) * 100}%` }} />
                  <div className="bg-stat-orange h-full transition-all" style={{ width: `${(late / todayLogs.length) * 100}%` }} />
                  <div className="bg-destructive h-full transition-all" style={{ width: `${(absent / todayLogs.length) * 100}%` }} />
                </div>
              </div>

              {/* Today's list grouped by status */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="divide-y divide-border">
                  {todayLogs.sort((a, b) => {
                    const order = { Present: 0, Late: 1, Absent: 2 };
                    return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3);
                  }).map((l) => (
                    <div
                      key={l.name}
                      className="px-5 py-3 flex items-center gap-4 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() =>
                        toast({
                          title: "Attendance detail",
                          description: `${l.name} is marked ${l.status}.`,
                        })
                      }
                    >
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {l.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{l.name}</p>
                        <p className="text-[10px] text-muted-foreground">{l.dept}</p>
                      </div>
                      <span className="text-xs text-muted-foreground w-16">{l.in}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[l.status]}`}>{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-display font-bold text-foreground">Weekly attendance</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{weekRangeLabel}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((o) => o - 1)}
                    className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:bg-muted"
                    aria-label="Previous week"
                    title="Previous week"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
                    disabled={!canNextWeek}
                    className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40"
                    aria-label="Next week"
                    title="Next week"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="grid grid-cols-8 gap-1.5 text-center">
                  <span className="text-[10px] text-muted-foreground" />
                  {weekDays.map((d) => (
                    <span key={d.toISOString()} className="text-[10px] text-muted-foreground font-medium">
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                      <span className="block text-[9px] opacity-80">
                        {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </span>
                  ))}
                </div>
                {weeklyHeatmapForWeek.map((row) => (
                  <div key={row.name} className="grid grid-cols-8 gap-1.5">
                    <span className="text-[10px] text-muted-foreground flex items-center">{row.name}</span>
                    {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => {
                      const val = row[day as keyof typeof row] as string;
                      return (
                        <div key={day} className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${cellColor[val]}`}>
                          {val}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-stat-green/20" /> Present</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-stat-orange/20" /> Late</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-destructive/15" /> Absent</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => setRightPanelMode("workdays")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  rightPanelMode === "workdays" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Workdays
              </button>
              <button
                type="button"
                onClick={() => setRightPanelMode("excusals")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  rightPanelMode === "excusals" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Excusals
              </button>
            </div>
          </div>

          {rightPanelMode === "workdays" && (
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-display font-bold text-foreground">Workdays & Excusals</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mark days as workdays/off-days and record excusal reflection.
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentMonth((m) => Math.max(0, m - 1))}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMonth((m) => Math.min(11, m + 1))}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-foreground text-sm">
                {monthNames[currentMonth]} {currentYear}
              </p>
              <p className="text-[11px] text-muted-foreground tabular-nums">{workdayCountThisMonth} workdays</p>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isSelected = selectedDate === dateStr;
                const dow = new Date(currentYear, currentMonth, day).getDay();
                const isWeekend = dow === 0 || dow === 6;
                const isFuture = new Date(currentYear, currentMonth, day) > new Date(2026, 2, 24);
                const workday = isWorkday(dateStr);
                const excused = Object.values(excusalByInternByDate).some((m) => m?.[dateStr]?.excused);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-sm transition-all relative
                      ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}
                      hover:bg-muted/50
                      ${(!workday || isWeekend) ? "text-muted-foreground/60" : "text-foreground"}
                    `}
                    aria-label={`Select ${dateStr}`}
                  >
                    <span className="font-medium text-xs">{day}</span>
                    {excused ? (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    ) : workday ? (
                      <span className="w-2 h-2 rounded-full bg-primary/70" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border space-y-3">
              <div className="text-xs text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">
                  {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Work day</span>
                <button
                  type="button"
                  onClick={() =>
                    setWorkdayOverrideByDate((prev) => ({
                      ...prev,
                      [selectedDate]: !selectedWorkday,
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedWorkday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  {selectedWorkday ? "Workday" : "Off"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWorkdayOverrideByDate((prev) => ({ ...prev, [selectedDate]: undefined }));
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Clear workday override for this date
              </button>
            </div>
          </div>
          )}

          {/* Excusal assignment (per intern) */}
          {rightPanelMode === "excusals" && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground">Excusal</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Assign an excusal to one or more interns for a specific date. This will mark the day as <span className="font-semibold">Excused</span> on each selected intern’s Attendance page.
            </p>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <input
                  type="date"
                  value={excusalDate}
                  onChange={(e) => setExcusalDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Interns</label>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border bg-background p-2">
                  {Array.from(new Set(todayLogs.map((l) => l.name))).map((name) => {
                    const checked = excusalInternNames.includes(name);
                    return (
                      <label key={name} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-muted/50">
                        <span className="text-foreground">{name}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setExcusalInternNames((prev) =>
                              checked ? prev.filter((x) => x !== name) : [...prev, name]
                            )
                          }
                        />
                      </label>
                    );
                  })}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Selected: {excusalInternNames.length ? excusalInternNames.join(", ") : "None"}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Excuse letter</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).map((f) => f.name);
                    setExcusalLetters(files);
                    e.currentTarget.value = "";
                  }}
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
                />
                {excusalLetters.length > 0 && (
                  <div className="text-[11px] text-muted-foreground">Selected: {excusalLetters.join(", ")}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  value={excusalDescription}
                  onChange={(e) => setExcusalDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Short note about the excusal (e.g. medical appointment, approved leave)."
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (excusalInternNames.length === 0) return;
                  if (!excusalDate) return;
                  if (excusalLetters.length === 0) return;
                  setExcusalByInternByDate((prev) => {
                    const next = { ...prev };
                    for (const internName of excusalInternNames) {
                      const internMap = { ...(next[internName] ?? {}) };
                      internMap[excusalDate] = {
                        excused: true,
                        excuseLetters: excusalLetters,
                        description: excusalDescription.trim(),
                      };
                      next[internName] = internMap;
                    }
                    return next;
                  });
                  setExcusalDescription("");
                  setExcusalLetters([]);
                  toast({
                    title: "Excusal submitted",
                    description: `${excusalInternNames.length} intern(s) marked excused on ${excusalDate}.`,
                  });
                }}
                className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                disabled={excusalInternNames.length === 0 || !excusalDate || excusalLetters.length === 0}
              >
                Submit excusal
              </button>
            </div>

            {anyExcusalOnDate && (
              <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-[11px] text-muted-foreground">
                Tip: this date already has at least one intern excused.
              </div>
            )}
          </div>
          )}
      </div>
      </div>
    </div>
  );
}
