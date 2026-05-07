import { useMemo, useState } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useAttendancePolicy } from "@/contexts/AttendancePolicyContext";

const records: Record<string, { in: string; out: string; hours: string; status: string }> = {
  "2026-03-21": { in: "8:02 AM", out: "5:14 PM", hours: "9h 12m", status: "Present" },
  "2026-03-20": { in: "8:15 AM", out: "5:30 PM", hours: "9h 15m", status: "Late" },
  "2026-03-19": { in: "7:58 AM", out: "5:00 PM", hours: "9h 02m", status: "Present" },
  "2026-03-18": { in: "8:30 AM", out: "5:45 PM", hours: "9h 15m", status: "Late" },
  "2026-03-17": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-03-14": { in: "—", out: "—", hours: "—", status: "Absent" },
  "2026-03-13": { in: "7:55 AM", out: "5:10 PM", hours: "9h 15m", status: "Present" },
  "2026-03-12": { in: "8:05 AM", out: "5:00 PM", hours: "8h 55m", status: "Present" },
  "2026-03-11": { in: "8:00 AM", out: "5:05 PM", hours: "9h 05m", status: "Present" },
  "2026-03-10": { in: "7:50 AM", out: "5:00 PM", hours: "9h 10m", status: "Present" },
  "2026-03-07": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-03-06": { in: "8:10 AM", out: "5:15 PM", hours: "9h 05m", status: "Present" },
  "2026-03-05": { in: "8:20 AM", out: "5:30 PM", hours: "9h 10m", status: "Late" },
  "2026-03-04": { in: "7:55 AM", out: "5:00 PM", hours: "9h 05m", status: "Present" },
  "2026-03-03": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-28": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-27": { in: "8:05 AM", out: "5:10 PM", hours: "9h 05m", status: "Present" },
  "2026-02-26": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-25": { in: "7:55 AM", out: "5:00 PM", hours: "9h 05m", status: "Present" },
  "2026-02-24": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
};

const statusColor: Record<string, string> = {
  Present: "bg-stat-green",
  Late: "bg-stat-orange",
  Absent: "bg-destructive",
  Excused: "bg-blue-500",
};

const statusBg: Record<string, string> = {
  Present: "bg-stat-green-bg border-stat-green/20",
  Late: "bg-stat-orange-bg border-stat-orange/20",
  Absent: "bg-destructive/10 border-destructive/20",
  Excused: "bg-blue-50 border-blue-200/70 dark:bg-blue-950/20 dark:border-blue-900/50",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Attendance() {
  const { role, user } = useRole();
  const isAdmin = role === "admin";
  const { dayConfigByDate, setDayConfigByDate, eventsByDate, excusalByInternByDate } = useAttendancePolicy();
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-03-21");
  const [currentMonth, setCurrentMonth] = useState(2); // March = 2
  const [currentYear] = useState(2026);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const getDayConfig = (dateStr: string) => {
    const override = dayConfigByDate[dateStr];
    if (override) return override;
    const [y, m, d] = dateStr.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    return {
      type: dow === 0 || dow === 6 ? "no_work" : "workday",
      startTime: "09:00",
      endTime: "18:00",
    } as const;
  };
  const isWorkday = (dateStr: string) => getDayConfig(dateStr).type === "workday";
  const myEventsForDate = (dateStr: string) => (eventsByDate[dateStr] ?? []).filter((e) => e.internNames.includes(user.name));
  const isRequiredDayForIntern = (dateStr: string) => isWorkday(dateStr) || myEventsForDate(dateStr).length > 0;

  const effectiveRecordByDate = useMemo(() => {
    const map: Record<string, { in: string; out: string; hours: string; status: string }> = {};
    // Populate month view (non-future) so summary + selection work even when no explicit record exists.
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isFuture = new Date(currentYear, currentMonth, i) > new Date(2026, 2, 24);
      if (isFuture) continue;

      const base = records[dateStr];
      const required = isRequiredDayForIntern(dateStr);
      if (!required) continue;

      if (base && base.in !== "—") {
        map[dateStr] = base;
        continue;
      }

      const myExcusal = excusalByInternByDate[user.name]?.[dateStr];
      if (myExcusal?.excused) {
        map[dateStr] = { in: "—", out: "—", hours: "—", status: "Excused" };
      } else {
        map[dateStr] = { in: "—", out: "—", hours: "—", status: "Absent" };
      }
    }
    return map;
  }, [currentMonth, currentYear, daysInMonth, dayConfigByDate, eventsByDate, excusalByInternByDate, user.name]);

  const allEffectiveRecords = Object.entries(effectiveRecordByDate);
  const presentCount = allEffectiveRecords.filter(([, r]) => r.status === "Present").length;
  const lateCount = allEffectiveRecords.filter(([, r]) => r.status === "Late").length;
  const absentCount = allEffectiveRecords.filter(([, r]) => r.status === "Absent").length;
  const excusedCount = allEffectiveRecords.filter(([, r]) => r.status === "Excused").length;

  const selected = selectedDate ? effectiveRecordByDate[selectedDate] ?? null : null;
  const selectedExcusal = selectedDate ? excusalByInternByDate[user.name]?.[selectedDate] : undefined;
  const selectedWorkday = selectedDate ? isWorkday(selectedDate) : false;
  const selectedDayConfig = selectedDate ? getDayConfig(selectedDate) : null;
  const selectedMyEvents = selectedDate ? myEventsForDate(selectedDate) : [];
  const selectedRequired = selectedDate ? isRequiredDayForIntern(selectedDate) : false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Attendance</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-foreground text-lg">{monthNames[currentMonth]} {currentYear}</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentMonth(m => Math.max(0, m - 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => setCurrentMonth(m => Math.min(11, m + 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = effectiveRecordByDate[dateStr];
              const workday = isWorkday(dateStr);
              const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 || new Date(currentYear, currentMonth, day).getDay() === 6;
              const isSelected = selectedDate === dateStr;
              const isFuture = new Date(currentYear, currentMonth, day) > new Date(2026, 2, 24);
              const base = records[dateStr];
              const hasClockIn = Boolean(base && base.in && base.in !== "—");
              const canSelect = true;

              return (
                <button
                  key={day}
                  onClick={() => canSelect && setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-sm transition-all relative
                    ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
                    ${(!workday || isWeekend) ? 'text-muted-foreground/50' : 'text-foreground'}
                    ${isFuture ? 'text-muted-foreground/40' : ''}
                    ${canSelect ? 'cursor-pointer hover:bg-muted/50' : ''}
                    ${!record && workday && !isFuture ? 'text-muted-foreground/80' : ''}
                  `}
                >
                  <span className="font-medium">{day}</span>
                  {record && (
                    <span className={`w-2 h-2 rounded-full ${statusColor[record.status]}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-5 pt-4 border-t border-border">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-stat-green" /> Present</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-stat-orange" /> Late</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-destructive" /> Absent</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Excused</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Summary ring */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Summary</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-green))" strokeWidth="3"
                    strokeDasharray={`${(presentCount / (presentCount + lateCount + absentCount + excusedCount || 1)) * 97.4} 97.4`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-orange))" strokeWidth="3"
                    strokeDasharray={`${(lateCount / (presentCount + lateCount + absentCount + excusedCount || 1)) * 97.4} 97.4`}
                    strokeDashoffset={`-${(presentCount / (presentCount + lateCount + absentCount + excusedCount || 1)) * 97.4}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-display text-foreground">{presentCount + lateCount + absentCount + excusedCount}</span>
                  <span className="text-[10px] text-muted-foreground">Total Days</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-stat-green" /> Present</span>
                <span className="font-bold text-foreground">{presentCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-stat-orange" /> Late</span>
                <span className="font-bold text-foreground">{lateCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive" /> Absent</span>
                <span className="font-bold text-foreground">{absentCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Excused</span>
                <span className="font-bold text-foreground">{excusedCount}</span>
              </div>
            </div>
          </div>

          {/* Selected day detail */}
          {selectedDate && (
            <div className={`rounded-xl border p-5 ${selected ? statusBg[selected.status] : "bg-muted/30 border-border/70"}`}>
              <p className="text-xs text-muted-foreground mb-1">Selected Date</p>
              <p className="text-lg font-display font-bold text-foreground mb-3">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              {!selectedRequired ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {selectedDayConfig?.type === "holiday" ? "Holiday" : "No work"}
                    </span>
                  </div>
                </div>
              ) : selectedMyEvents.length > 0 && !selected ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Event scheduled</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedMyEvents.map((e) => `${e.title} (${e.startTime}–${e.endTime})`).join(" · ")}
                  </div>
                </div>
              ) : !selected ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">No log yet</span>
                  </div>
                </div>
              ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selected.status === "Present" ? "text-stat-green bg-stat-green-bg" :
                    selected.status === "Late" ? "text-stat-orange bg-stat-orange-bg" :
                    selected.status === "Excused" ? "text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/30" :
                    "text-destructive bg-destructive/10"
                  }`}>{selected.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Clock In</span>
                  <span className="text-sm font-medium text-foreground">{selected.in}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Clock Out</span>
                  <span className="text-sm font-medium text-foreground">{selected.out}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Hours</span>
                  <span className="text-sm font-bold text-foreground">{selected.hours}</span>
                </div>
                {selectedMyEvents.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-border/60 space-y-1.5">
                    <div className="text-xs text-muted-foreground">Event(s)</div>
                    <div className="text-sm text-foreground">
                      {selectedMyEvents.map((e) => `${e.title} (${e.startTime}–${e.endTime})`).join(" · ")}
                    </div>
                    {selectedMyEvents.some((e) => e.description) ? (
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {selectedMyEvents.map((e) => e.description).filter(Boolean).join("\n")}
                      </div>
                    ) : null}
                  </div>
                )}
                {selected.status === "Excused" && (
                  <div className="pt-2 mt-2 border-t border-border/60 space-y-1.5">
                    <div className="text-xs text-muted-foreground">Excusal description</div>
                    <div className="text-sm text-foreground whitespace-pre-wrap">{selectedExcusal?.description?.trim() || "—"}</div>
                    <div className="text-xs text-muted-foreground mt-2">Excuse letter</div>
                    <div className="text-sm text-foreground">
                      {selectedExcusal?.excuseLetters?.length ? selectedExcusal.excuseLetters.join(", ") : "—"}
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          )}
          {selectedDate && isAdmin && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground mb-3">Admin controls</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <select
                    value={selectedDayConfig?.type ?? "workday"}
                    onChange={(e) =>
                      setDayConfigByDate((prev) => ({
                        ...prev,
                        [selectedDate]: {
                          ...(getDayConfig(selectedDate)),
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

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Start time</label>
                    <input
                      type="time"
                      value={selectedDayConfig?.startTime ?? "09:00"}
                      onChange={(e) =>
                        setDayConfigByDate((prev) => ({
                          ...prev,
                          [selectedDate]: {
                            ...(getDayConfig(selectedDate)),
                            startTime: e.target.value || "09:00",
                          },
                        }))
                      }
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">End time</label>
                    <input
                      type="time"
                      value={selectedDayConfig?.endTime ?? "18:00"}
                      onChange={(e) =>
                        setDayConfigByDate((prev) => ({
                          ...prev,
                          [selectedDate]: {
                            ...(getDayConfig(selectedDate)),
                            endTime: e.target.value || "18:00",
                          },
                        }))
                      }
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDayConfigByDate((prev) => ({ ...prev, [selectedDate]: undefined }));
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Clear day override for this date
                </button>
              </div>
            </div>
          )}

          {/* Weekly hours */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">This Week</h3>
            <div className="space-y-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                const hours = [9, 9.25, 9.03, 9.25, 9.2];
                const maxH = 10;
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{day}</span>
                    <div className="flex-1 h-5 bg-muted rounded-md overflow-hidden">
                      <div className="h-full bg-accent rounded-md flex items-center justify-end pr-2" style={{ width: `${(hours[i] / maxH) * 100}%` }}>
                        <span className="text-[10px] font-medium text-accent-foreground">{hours[i]}h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-sm font-bold font-display text-foreground">45h 43m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
