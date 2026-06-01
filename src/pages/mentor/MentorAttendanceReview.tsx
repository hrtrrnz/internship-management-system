import { useMemo } from "react";
import { Clock, CheckCircle, AlertCircle, User } from "lucide-react";
import { getMentorLiveAttendance } from "@/lib/internAttendancePortal";

const statusConfig: Record<string, { color: string; bg: string; ring: string; label: string }> = {
  "Clocked in": { color: "text-stat-green", bg: "bg-stat-green", ring: "ring-stat-green/30", label: "On Time" },
  "Not clocked in": { color: "text-muted-foreground", bg: "bg-muted-foreground", ring: "ring-muted-foreground/30", label: "Absent" },
  Late: { color: "text-stat-orange", bg: "bg-stat-orange", ring: "ring-stat-orange/30", label: "Late" },
};

export default function MentorAttendanceReview() {
  const attendanceData = useMemo(() => getMentorLiveAttendance(), []);
  const clockedIn = attendanceData.filter((a) => a.status === "Clocked in").length;
  const late = attendanceData.filter((a) => a.status === "Late").length;
  const absent = attendanceData.filter((a) => a.status === "Not clocked in").length;
  const total = attendanceData.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Attendance Review</h2>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-foreground">Live Status</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stat-green animate-pulse" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="hsl(var(--stat-green))"
                strokeWidth="3.5"
                strokeDasharray={`${(clockedIn / total) * 97.4} 97.4`}
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="hsl(var(--stat-orange))"
                strokeWidth="3.5"
                strokeDasharray={`${(late / total) * 97.4} 97.4`}
                strokeDashoffset={`-${(clockedIn / total) * 97.4}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-display text-foreground">{clockedIn + late}</span>
              <span className="text-[10px] text-muted-foreground">of {total} in</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-4 max-h-64 overflow-y-auto">
            {attendanceData.map((a) => {
              const config = statusConfig[a.status];
              return (
                <div key={a.internId} className="flex flex-col items-center text-center gap-1.5">
                  <div
                    className={`relative w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold ring-[3px] ${config.ring}`}
                  >
                    {a.avatar}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${config.bg}`} />
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{a.intern.split(" ")[0]}</p>
                  <p className="text-[10px] text-muted-foreground">{a.in !== "—" ? a.in : "—"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatusGroup
          title="Clocked In"
          icon={CheckCircle}
          color="text-stat-green"
          items={attendanceData.filter((a) => a.status === "Clocked in")}
        />
        <StatusGroup
          title="Late"
          icon={Clock}
          color="text-stat-orange"
          items={attendanceData.filter((a) => a.status === "Late")}
        />
        <StatusGroup
          title="Not Clocked In"
          icon={AlertCircle}
          color="text-muted-foreground"
          items={attendanceData.filter((a) => a.status === "Not clocked in")}
        />
      </div>
    </div>
  );
}

function StatusGroup({
  title,
  icon: Icon,
  color,
  items,
}: {
  title: string;
  icon: typeof User;
  color: string;
  items: { intern: string; in: string; unit: string }[];
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.intern} className="flex items-center gap-2 text-sm">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{a.intern}</span>
            <span className="text-xs text-muted-foreground ml-auto">{a.in !== "—" ? a.in : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
