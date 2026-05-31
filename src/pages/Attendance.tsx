import { useCallback, useMemo, useState } from "react";
import { AlertCircle, CalendarCheck, CheckCircle, ChevronLeft, ChevronRight, Clock, XCircle } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useAttendancePolicy } from "@/contexts/AttendancePolicyContext";
import {
  addDays,
  buildPresentWeekOverrides,
  formatTotalHours,
  formatWeekRange,
  getMondayOfWeek,
  getWeekdayDates,
  INTERNSHIP_START,
  isSameWeek,
  parseHours,
  resolveInternAttendanceRecord,
  startOfDay,
  toDateStr,
  type AttendanceRecord,
} from "@/lib/internAttendance";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  Present: "bg-stat-green",
  Late: "bg-stat-orange",
  Absent: "bg-destructive",
  Excused: "bg-blue-500",
};

const statusBadge: Record<string, string> = {
  Present: "text-stat-green bg-stat-green-bg",
  Late: "text-stat-orange bg-stat-orange-bg",
  Absent: "text-destructive bg-destructive/10",
  Excused: "text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/30",
};

const statusBg: Record<string, string> = {
  Present: "bg-stat-green-bg border-stat-green/20",
  Late: "bg-stat-orange-bg border-stat-orange/20",
  Absent: "bg-destructive/10 border-destructive/20",
  Excused: "bg-blue-50 border-blue-200/70 dark:bg-blue-950/20 dark:border-blue-900/50",
};

export default function Attendance() {
  const { role, user } = useRole();
  const isAdmin = role === "admin";
  const { dayConfigByDate, setDayConfigByDate, eventsByDate, excusalByInternByDate } = useAttendancePolicy();

  const today = useMemo(() => startOfDay(new Date()), []);
  const earliestWeekStart = useMemo(() => getMondayOfWeek(INTERNSHIP_START), []);
  const latestWeekStart = useMemo(() => getMondayOfWeek(today), [today]);

  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(() => toDateStr(new Date()));
  const [presentOverrides, setPresentOverrides] = useState<Record<string, AttendanceRecord>>(() =>
    buildPresentWeekOverrides(startOfDay(new Date())),
  );

  const getDayConfig = useCallback(
    (dateStr: string) => {
      const override = dayConfigByDate[dateStr];
      if (override) return override;
      const [y, m, d] = dateStr.split("-").map(Number);
      const dow = new Date(y, m - 1, d).getDay();
      return {
        type: dow === 0 || dow === 6 ? "no_work" : "workday",
        startTime: "09:00",
        endTime: "18:00",
      } as const;
    },
    [dayConfigByDate],
  );

  const isWorkday = useCallback((dateStr: string) => getDayConfig(dateStr).type === "workday", [getDayConfig]);
  const myEventsForDate = useCallback(
    (dateStr: string) => (eventsByDate[dateStr] ?? []).filter((e) => e.internNames.includes(user.name)),
    [eventsByDate, user.name],
  );
  const isRequiredDayForIntern = useCallback(
    (dateStr: string) => isWorkday(dateStr) || myEventsForDate(dateStr).length > 0,
    [isWorkday, myEventsForDate],
  );

  const policySlice = useMemo(
    () => ({
      dayConfigByDate,
      eventsByDate,
      excusalByInternByDate,
      internName: user.name,
    }),
    [dayConfigByDate, eventsByDate, excusalByInternByDate, user.name],
  );

  const resolveRecord = useCallback(
    (dateStr: string): AttendanceRecord | null =>
      resolveInternAttendanceRecord(dateStr, today, policySlice, presentOverrides),
    [today, policySlice, presentOverrides],
  );

  const weekDays = useMemo(() => getWeekdayDates(weekStart), [weekStart]);

  const weekEntries = useMemo(
    () =>
      weekDays.map((date) => {
        const dateStr = toDateStr(date);
        const record = resolveRecord(dateStr);
        const required = isRequiredDayForIntern(dateStr);
        const isFuture = date > today;
        const beforeProgram = date < startOfDay(INTERNSHIP_START);
        return { date, dateStr, record, required, isFuture, beforeProgram };
      }),
    [weekDays, resolveRecord, isRequiredDayForIntern, today],
  );

  const weekSummary = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;
    let totalHours = 0;

    for (const entry of weekEntries) {
      if (!entry.required || entry.isFuture || entry.beforeProgram) continue;
      if (!entry.record) continue;
      if (entry.record.status === "Present") present++;
      else if (entry.record.status === "Late") late++;
      else if (entry.record.status === "Absent") absent++;
      else if (entry.record.status === "Excused") excused++;
      totalHours += parseHours(entry.record.hours);
    }

    return { present, late, absent, excused, totalHours };
  }, [weekEntries]);

  const canGoPrev = weekStart > earliestWeekStart;
  const canGoNext = weekStart < latestWeekStart;

  const goPrevWeek = () => {
    if (!canGoPrev) return;
    const next = addDays(weekStart, -7);
    setWeekStart(next < earliestWeekStart ? earliestWeekStart : next);
  };

  const goNextWeek = () => {
    if (!canGoNext) return;
    const next = addDays(weekStart, 7);
    setWeekStart(next > latestWeekStart ? latestWeekStart : next);
  };

  const goToCurrentWeek = () => {
    setWeekStart(latestWeekStart);
    setSelectedDate(toDateStr(today));
    setPresentOverrides(buildPresentWeekOverrides(today));
  };

  const viewingCurrentWeek = isSameWeek(weekStart, today);

  const selected = selectedDate ? resolveRecord(selectedDate) : null;
  const selectedExcusal = selectedDate ? excusalByInternByDate[user.name]?.[selectedDate] : undefined;
  const selectedDayConfig = selectedDate ? getDayConfig(selectedDate) : null;
  const selectedMyEvents = selectedDate ? myEventsForDate(selectedDate) : [];
  const selectedRequired = selectedDate ? isRequiredDayForIntern(selectedDate) : false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Attendance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review your clock-ins, hours, and status week by week.</p>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrevWeek}
            disabled={!canGoPrev}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Week of</p>
            <p className="font-display text-lg font-bold text-foreground">{formatWeekRange(weekStart)}</p>
          </div>
          <button
            type="button"
            onClick={goNextWeek}
            disabled={!canGoNext}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex justify-center border-t border-border pt-3">
          <button
            type="button"
            onClick={goToCurrentWeek}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              viewingCurrentWeek
                ? "bg-stat-green-bg text-stat-green"
                : "bg-accent text-accent-foreground hover:opacity-90",
            )}
          >
            <CalendarCheck className="h-4 w-4" />
            Go to current week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-foreground">Weekly log</h3>
              <span className="text-xs text-muted-foreground">Monday – Friday</span>
            </div>

            <div className="space-y-2">
              {weekEntries.map((entry) => {
                const isSelected = selectedDate === entry.dateStr;
                const dayLabel = entry.date.toLocaleDateString("en-US", { weekday: "long" });
                const dateLabel = entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

                if (entry.beforeProgram) {
                  return (
                    <div
                      key={entry.dateStr}
                      className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">{dayLabel}</span>
                      <span className="mx-2">·</span>
                      {dateLabel}
                      <span className="mx-2">·</span>
                      Before program start
                    </div>
                  );
                }

                if (!entry.required) {
                  const dayConfig = getDayConfig(entry.dateStr);
                  return (
                    <div
                      key={entry.dateStr}
                      className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">{dayLabel}</span>
                      <span className="mx-2">·</span>
                      {dateLabel}
                      <span className="mx-2">·</span>
                      {dayConfig.type === "holiday" ? "Holiday" : "No work scheduled"}
                    </div>
                  );
                }

                return (
                  <button
                    key={entry.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(entry.dateStr)}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                      isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted/40",
                      entry.record ? statusBg[entry.record.status] : "border-border/70 bg-background",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{dayLabel}</p>
                        <p className="text-xs text-muted-foreground">{dateLabel}</p>
                      </div>
                      {entry.isFuture ? (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          Upcoming
                        </span>
                      ) : entry.record ? (
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusBadge[entry.record.status])}>
                          {entry.record.status}
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          No log yet
                        </span>
                      )}
                    </div>

                    {!entry.isFuture && entry.record && (
                      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Clock in</p>
                          <p className="font-medium text-foreground">{entry.record.in}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Clock out</p>
                          <p className="font-medium text-foreground">{entry.record.out}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Hours</p>
                          <p className="font-medium text-foreground">{entry.record.hours}</p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-display font-bold text-foreground">Hours this week</h3>
            <div className="space-y-2">
              {weekEntries.map((entry) => {
                if (!entry.required || entry.isFuture || entry.beforeProgram) return null;
                const hours = entry.record ? parseHours(entry.record.hours) : 0;
                const maxH = 10;
                const dayShort = entry.date.toLocaleDateString("en-US", { weekday: "short" });
                return (
                  <div key={`hours-${entry.dateStr}`} className="flex items-center gap-3">
                    <span className="w-10 text-xs text-muted-foreground">{dayShort}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted">
                      <div
                        className="flex h-full items-center justify-end rounded-md bg-accent pr-2 transition-all"
                        style={{ width: hours > 0 ? `${Math.min((hours / maxH) * 100, 100)}%` : "0%" }}
                      >
                        {hours > 0 && (
                          <span className="text-[10px] font-medium text-accent-foreground">{hours.toFixed(2)}h</span>
                        )}
                      </div>
                    </div>
                    <span className="w-14 text-right text-xs text-muted-foreground">
                      {entry.record?.hours ?? "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Week total</span>
              <span className="text-sm font-bold font-display text-foreground">
                {formatTotalHours(weekSummary.totalHours)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-display font-bold text-foreground">Week summary</h3>
            <div className="space-y-2">
              <SummaryRow icon={CheckCircle} iconClass="text-stat-green" label="Present" value={weekSummary.present} />
              <SummaryRow icon={AlertCircle} iconClass="text-stat-orange" label="Late" value={weekSummary.late} />
              <SummaryRow icon={XCircle} iconClass="text-destructive" label="Absent" value={weekSummary.absent} />
              <SummaryRow icon={CheckCircle} iconClass="text-blue-500" label="Excused" value={weekSummary.excused} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Total hours
              </span>
              <span className="font-bold text-foreground">{formatTotalHours(weekSummary.totalHours)}</span>
            </div>
          </div>

          {selectedDate && (
            <div className={cn("rounded-xl border p-5", selected ? statusBg[selected.status] : "border-border bg-muted/30")}>
              <p className="mb-1 text-xs text-muted-foreground">Selected day</p>
              <p className="mb-3 font-display text-lg font-bold text-foreground">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {!selectedRequired ? (
                <p className="text-sm text-muted-foreground">
                  {selectedDayConfig?.type === "holiday" ? "Holiday — no attendance required." : "No work scheduled."}
                </p>
              ) : selectedMyEvents.length > 0 && !selected ? (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Event scheduled.</p>
                  <p>{selectedMyEvents.map((e) => `${e.title} (${e.startTime}–${e.endTime})`).join(" · ")}</p>
                </div>
              ) : !selected ? (
                <p className="text-sm text-muted-foreground">No attendance log recorded yet.</p>
              ) : (
                <div className="space-y-2.5">
                  <DetailRow label="Status">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusBadge[selected.status])}>
                      {selected.status}
                    </span>
                  </DetailRow>
                  <DetailRow label="Clock in" value={selected.in} />
                  <DetailRow label="Clock out" value={selected.out} />
                  <DetailRow label="Total hours" value={selected.hours} bold />
                  {selectedMyEvents.length > 0 && (
                    <div className="space-y-1 border-t border-border/60 pt-2">
                      <p className="text-xs text-muted-foreground">Event(s)</p>
                      <p className="text-sm text-foreground">
                        {selectedMyEvents.map((e) => `${e.title} (${e.startTime}–${e.endTime})`).join(" · ")}
                      </p>
                    </div>
                  )}
                  {selected.status === "Excused" && (
                    <div className="space-y-1 border-t border-border/60 pt-2">
                      <p className="text-xs text-muted-foreground">Excusal description</p>
                      <p className="whitespace-pre-wrap text-sm text-foreground">
                        {selectedExcusal?.description?.trim() || "—"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedDate && isAdmin && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 font-display font-bold text-foreground">Admin controls</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <select
                    value={selectedDayConfig?.type ?? "workday"}
                    onChange={(e) =>
                      setDayConfigByDate((prev) => ({
                        ...prev,
                        [selectedDate]: {
                          ...getDayConfig(selectedDate),
                          type: e.target.value as "no_work" | "workday" | "holiday",
                        },
                      }))
                    }
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground"
                  >
                    <option value="no_work">No Work</option>
                    <option value="workday">Work Day</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setDayConfigByDate((prev) => ({ ...prev, [selectedDate]: undefined }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Clear day override
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", statusColor.Present)} />
                Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", statusColor.Late)} />
                Late
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", statusColor.Absent)} />
                Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", statusColor.Excused)} />
                Excused
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ElementType;
  iconClass: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", iconClass)} />
        {label}
      </span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  bold,
  children,
}: {
  label: string;
  value?: string;
  bold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children ?? (
        <span className={cn("text-sm text-foreground", bold && "font-bold")}>{value}</span>
      )}
    </div>
  );
}
