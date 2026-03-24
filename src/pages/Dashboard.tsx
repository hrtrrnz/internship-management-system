import { Clock, CheckSquare, FileText, Users, LogIn, LogOut, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

function StatCard({ icon: Icon, value, label, sub, colorClass, bgClass }: {
  icon: React.ElementType; value: string; label: string; sub: string; colorClass: string; bgClass: string;
}) {
  return (
    <div className={`rounded-xl p-5 border border-border ${bgClass} relative overflow-hidden`}>
      <div className="absolute top-4 right-0 w-24 h-24 rounded-full opacity-20" style={{ background: `hsl(var(${colorClass}))`, filter: 'blur(30px)' }} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3`} style={{ background: `hsl(var(${colorClass}) / 0.15)` }}>
        <Icon className="w-5 h-5" style={{ color: `hsl(var(${colorClass}))` }} />
      </div>
      <p className="text-3xl font-bold text-foreground font-display">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs mt-1" style={{ color: `hsl(var(${colorClass}))` }}>{sub}</p>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-clock-bg rounded-xl p-5 flex items-center justify-between">
      <p className="text-4xl font-mono font-bold text-stat-green tracking-wider">{h}:{m}:{s}</p>
      <div className="text-right">
        <p className="text-card font-semibold">{dayName}</p>
        <p className="text-sidebar-muted text-sm">{dateStr}</p>
      </div>
    </div>
  );
}

const attendanceEntries = [
  { date: "Mar 21", time: "8:02 AM – 5:14 PM", status: "In" },
  { date: "Mar 20", time: "8:15 AM – 5:30 PM", status: "Out" },
  { date: "Mar 19", time: "7:58 AM – 5:00 PM", status: "In" },
  { date: "Mar 18", time: "8:30 AM – 5:45 PM", status: "Out" },
  { date: "Mar 17", time: "8:00 AM – 5:00 PM", status: "In" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Clock} value="34" label="Days Attended" sub="↑3 this week" colorClass="--stat-orange" bgClass="bg-stat-orange-bg" />
        <StatCard icon={CheckSquare} value="18" label="Tasks Completed" sub="↑5 pending" colorClass="--stat-green" bgClass="bg-stat-green-bg" />
        <StatCard icon={FileText} value="12" label="Reports Submitted" sub="1 overdue" colorClass="--stat-blue" bgClass="bg-stat-blue-bg" />
        <StatCard icon={Users} value="78%" label="Overall Progress" sub="On track · 46 days left" colorClass="--stat-emerald" bgClass="bg-stat-emerald-bg" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Daily Log */}
        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-display font-bold text-foreground">Dream Academy · Daily Log</h3>
              <span className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                <span className="w-2 h-2 rounded-full bg-destructive" /> Not yet clocked in
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Awesome day! Log your attendance below.</p>

            <LiveClock />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex items-center justify-between px-4 py-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Individual Log Sheet</span>
                <ExternalLink className="w-4 h-4 text-accent" />
              </button>
              <button className="flex items-center justify-between px-4 py-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Batch Daily Attendance</span>
                <ExternalLink className="w-4 h-4 text-accent" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                <LogIn className="w-4 h-4" /> Clock In
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors">
                <LogOut className="w-4 h-4" /> Clock Out
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" /> Juan dela Cruz
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Assigned Unit</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" /> Technology & Innovation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground">Recent Attendance</h3>
            <p className="text-xs text-muted-foreground mb-3">Last 5 entries</p>
            <ul className="space-y-3">
              {attendanceEntries.map((e) => (
                <li key={e.date} className="flex items-center gap-3 text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${e.status === "In" ? "bg-stat-green" : "bg-destructive"}`} />
                  <span className="font-medium text-foreground w-14">{e.date}</span>
                  <span className="flex-1 text-muted-foreground">{e.time}</span>
                  <span className={`text-xs font-semibold ${e.status === "In" ? "text-stat-green" : "text-destructive"}`}>{e.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-foreground">Internship Progress</h3>
              <span className="text-xs text-muted-foreground">Week 7 of 12</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: '58%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">58% complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
