import { useState } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
};

const statusBg: Record<string, string> = {
  Present: "bg-stat-green-bg border-stat-green/20",
  Late: "bg-stat-orange-bg border-stat-orange/20",
  Absent: "bg-destructive/10 border-destructive/20",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-03-21");
  const [currentMonth, setCurrentMonth] = useState(2); // March = 2
  const [currentYear] = useState(2026);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const allRecords = Object.entries(records);
  const presentCount = allRecords.filter(([, r]) => r.status === "Present").length;
  const lateCount = allRecords.filter(([, r]) => r.status === "Late").length;
  const absentCount = allRecords.filter(([, r]) => r.status === "Absent").length;

  const selected = selectedDate ? records[selectedDate] : null;

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
              const record = records[dateStr];
              const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 || new Date(currentYear, currentMonth, day).getDay() === 6;
              const isSelected = selectedDate === dateStr;
              const isFuture = new Date(currentYear, currentMonth, day) > new Date(2026, 2, 24);

              return (
                <button
                  key={day}
                  onClick={() => record && setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-sm transition-all relative
                    ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
                    ${isWeekend ? 'text-muted-foreground/50' : 'text-foreground'}
                    ${isFuture ? 'text-muted-foreground/30' : ''}
                    ${!isWeekend && !isFuture && record ? 'cursor-pointer hover:bg-muted/50' : ''}
                    ${!record && !isWeekend && !isFuture ? 'text-muted-foreground/60' : ''}
                  `}
                >
                  <span className="font-medium">{day}</span>
                  {record && !isWeekend && (
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
                    strokeDasharray={`${(presentCount / (presentCount + lateCount + absentCount)) * 97.4} 97.4`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-orange))" strokeWidth="3"
                    strokeDasharray={`${(lateCount / (presentCount + lateCount + absentCount)) * 97.4} 97.4`}
                    strokeDashoffset={`-${(presentCount / (presentCount + lateCount + absentCount)) * 97.4}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-display text-foreground">{presentCount + lateCount + absentCount}</span>
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
            </div>
          </div>

          {/* Selected day detail */}
          {selected && selectedDate && (
            <div className={`rounded-xl border p-5 ${statusBg[selected.status]}`}>
              <p className="text-xs text-muted-foreground mb-1">Selected Date</p>
              <p className="text-lg font-display font-bold text-foreground mb-3">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selected.status === "Present" ? "text-stat-green bg-stat-green-bg" :
                    selected.status === "Late" ? "text-stat-orange bg-stat-orange-bg" :
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
