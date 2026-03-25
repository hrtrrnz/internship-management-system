import { Clock, CheckCircle, AlertCircle, User } from "lucide-react";

const attendanceData = [
  { intern: "Juan dela Cruz", avatar: "JD", in: "—", out: "—", status: "Not clocked in", unit: "Tech & Innovation" },
  { intern: "Ana Santos", avatar: "AS", in: "7:55 AM", out: "—", status: "Clocked in", unit: "Tech & Innovation" },
  { intern: "Mark Rivera", avatar: "MR", in: "—", out: "—", status: "Not clocked in", unit: "Tech & Innovation" },
  { intern: "Lisa Tan", avatar: "LT", in: "8:10 AM", out: "—", status: "Clocked in", unit: "Marketing" },
  { intern: "Peter Lim", avatar: "PL", in: "8:00 AM", out: "—", status: "Clocked in", unit: "Operations" },
  { intern: "Grace Yu", avatar: "GY", in: "—", out: "—", status: "Not clocked in", unit: "Tech & Innovation" },
  { intern: "David Chen", avatar: "DC", in: "8:20 AM", out: "—", status: "Late", unit: "Data Analytics" },
  { intern: "Sofia Garcia", avatar: "SG", in: "7:50 AM", out: "—", status: "Clocked in", unit: "Marketing" },
];

const statusConfig: Record<string, { color: string; bg: string; ring: string; label: string }> = {
  "Clocked in": { color: "text-stat-green", bg: "bg-stat-green", ring: "ring-stat-green/30", label: "On Time" },
  "Not clocked in": { color: "text-muted-foreground", bg: "bg-muted-foreground", ring: "ring-muted-foreground/30", label: "Absent" },
  "Late": { color: "text-stat-orange", bg: "bg-stat-orange", ring: "ring-stat-orange/30", label: "Late" },
};

export default function MentorAttendanceReview() {
  const clockedIn = attendanceData.filter(a => a.status === "Clocked in").length;
  const late = attendanceData.filter(a => a.status === "Late").length;
  const absent = attendanceData.filter(a => a.status === "Not clocked in").length;
  const total = attendanceData.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Attendance Review</h2>
        <p className="text-sm text-muted-foreground">Monitor your interns' attendance for today — March 24, 2026</p>
      </div>

      {/* Live status board */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-foreground">Live Status</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stat-green animate-pulse" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>

        {/* Attendance ring + avatars */}
        <div className="flex items-center gap-8">
          {/* Donut chart */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-green))" strokeWidth="3.5"
                strokeDasharray={`${(clockedIn / total) * 97.4} 97.4`} strokeLinecap="round" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-orange))" strokeWidth="3.5"
                strokeDasharray={`${(late / total) * 97.4} 97.4`}
                strokeDashoffset={`-${(clockedIn / total) * 97.4}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-display text-foreground">{clockedIn + late}</span>
              <span className="text-[10px] text-muted-foreground">of {total} in</span>
            </div>
          </div>

          {/* Avatar grid */}
          <div className="flex-1 grid grid-cols-4 gap-4">
            {attendanceData.map((a) => {
              const config = statusConfig[a.status];
              return (
                <div key={a.intern} className="flex flex-col items-center text-center gap-1.5">
                  <div className={`relative w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold ring-[3px] ${config.ring}`}>
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

      {/* Grouped by status */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "On Time", status: "Clocked in", icon: CheckCircle, color: "--stat-green", items: attendanceData.filter(a => a.status === "Clocked in") },
          { label: "Late", status: "Late", icon: Clock, color: "--stat-orange", items: attendanceData.filter(a => a.status === "Late") },
          { label: "Not Clocked In", status: "Not clocked in", icon: AlertCircle, color: "--destructive", items: attendanceData.filter(a => a.status === "Not clocked in") },
        ].map((group) => (
          <div key={group.label} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ borderBottomColor: `hsl(var(${group.color}) / 0.3)` }}>
              <group.icon className="w-4 h-4" style={{ color: `hsl(var(${group.color}))` }} />
              <span className="text-sm font-semibold text-foreground">{group.label}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{group.items.length}</span>
            </div>
            <div className="divide-y divide-border">
              {group.items.map((a) => (
                <div key={a.intern} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.intern}</p>
                    <p className="text-[10px] text-muted-foreground">{a.unit}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.in !== "—" ? a.in : "—"}</span>
                </div>
              ))}
              {group.items.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">None</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}