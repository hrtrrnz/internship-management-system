import { Clock, CheckSquare, FileText, Users, LogIn, LogOut, ExternalLink, Building2, Smile } from "lucide-react";
import { useState, useEffect } from "react";

function StatCard({ icon: Icon, value, label, sub, colorClass }: {
  icon: React.ElementType; value: string; label: string; sub: string; colorClass: string;
}) {
  return (
    <div className="rounded-xl bg-card p-5 border border-border/80 relative overflow-hidden shadow-sm">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `hsl(var(${colorClass}) / 0.16)` }}>
        <Icon className="w-5 h-5" style={{ color: `hsl(var(${colorClass}))` }} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
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
    <div className="bg-clock-bg rounded-xl p-5 flex items-center justify-between border border-sidebar-border/60">
      <p className="text-3xl font-mono font-bold text-stat-green tracking-wider">{h}:{m}:{s}</p>
      <div className="text-right">
        <p className="text-card font-semibold text-sm">{dayName}</p>
        <p className="text-sidebar-muted text-xs">{dateStr}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: `hsl(var(${colorClass}))` }} />
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

const todayTasks = [
  { label: "Submit morning report", time: "9:00 AM", done: true },
  { label: "Team standup meeting", time: "10:00 AM", done: true },
  { label: "Review client proposal", time: "11:00 AM", done: true },
  { label: "Finish module 3 quiz", time: "Due today", done: false },
  { label: "Upload accomplishment report", time: "5:00 PM", done: false },
];

function formatDateTime(value: Date | null) {
  if (!value) return "—";
  return value.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"clock-in" | "clock-out">("clock-in");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);

  const handleClockIn = () => {
    if (isClockedIn) return;
    setClockInTime(new Date());
    setClockOutTime(null);
    setIsClockedIn(true);
    setActiveTab("clock-out");
  };

  const handleClockOut = () => {
    if (!isClockedIn) return;
    setClockOutTime(new Date());
    setIsClockedIn(false);
    setActiveTab("clock-in");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Clock} value="320 / 486" label="Training Hours" sub="Rendered Hours / Required Hours" colorClass="--stat-blue" />
        <StatCard icon={Users} value="34" label="Days Attended" sub="3 this week" colorClass="--stat-orange" />
        <StatCard icon={CheckSquare} value="18" label="Tasks Completed" sub="5 pending" colorClass="--stat-green" />
        <StatCard icon={FileText} value="78%" label="Overall Progress" sub="On track · 46 days left" colorClass="--stat-emerald" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Daily Log */}
        <div className="col-span-2">
          <div className="bg-card rounded-xl border border-border/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-display font-bold text-foreground">Dream Academy · Daily Log</h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isClockedIn ? "bg-stat-green-bg text-stat-green" : "bg-destructive/10 text-destructive"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isClockedIn ? "bg-stat-green" : "bg-destructive"}`} />
                {isClockedIn ? "Currently clocked in" : "Not yet clocked in"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Please complete your attendance details for today.</p>

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
              <button
                onClick={handleClockIn}
                disabled={isClockedIn}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all shadow-sm ${
                  activeTab === "clock-in"
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-foreground bg-background"
                } ${isClockedIn ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                <LogIn className="w-4 h-4" /> Clock In
              </button>
              <button
                onClick={handleClockOut}
                disabled={!isClockedIn}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "clock-out"
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-foreground bg-background"
                } ${isClockedIn ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"}`}
              >
                <LogOut className="w-4 h-4" /> Clock Out
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" /> Juan dela Cruz
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Assigned Unit</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" /> Technology & Innovation
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Assigned Company <span className="text-destructive">*</span></label>
                <select className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Select company...</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Office Location <span className="text-destructive">*</span></label>
                <select className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Select location...</option>
                  <option>HYT Business Center</option>
                  <option>Atlanta Office</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-foreground">Accomplishment Report <span className="text-destructive">*</span></label>
              <input
                type="text"
                placeholder="Paste Google Drive link here..."
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Share the link with talent.dreamacademy@gmail.com and hr.dreamacademy@gmail.com ·
                {" "}
                {activeTab === "clock-out" ? "you are currently in clock-out mode." : "you are currently in clock-in mode."}
              </p>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-foreground">How's your day today? <Smile className="w-3.5 h-3.5 inline text-stat-orange" /></label>
              <textarea
                placeholder="Share something about your day (optional)..."
                rows={3}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <button
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-stat-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
              onClick={activeTab === "clock-out" ? handleClockOut : handleClockIn}
            >
              {activeTab === "clock-out" ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {activeTab === "clock-out" ? "Submit Clock-Out" : "Submit Clock-In"}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-foreground">Today's Tasks</h3>
              <span className="text-xs text-muted-foreground">{todayTasks.filter(t => t.done).length} of {todayTasks.length} done</span>
            </div>
            <ul className="space-y-2.5">
              {todayTasks.map((t) => (
                <li key={t.label} className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg ${t.done ? 'bg-stat-green-bg' : 'bg-muted'}`}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${t.done ? 'bg-stat-green' : 'border border-border'}`}>
                    {t.done && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`flex-1 ${t.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{t.label}</span>
                  <span className={`text-xs shrink-0 ${t.done ? 'text-muted-foreground' : 'text-destructive font-medium'}`}>{t.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground">Internship Progress</h3>
              <span className="text-xs text-muted-foreground">Week 7 of 12</span>
            </div>
            <div className="space-y-3">
              <ProgressBar label="Attendance" value={92} colorClass="--stat-green" />
              <ProgressBar label="Tasks Completed" value={78} colorClass="--stat-blue" />
              <ProgressBar label="Reports Submitted" value={85} colorClass="--stat-emerald" />
              <ProgressBar label="Learning Modules" value={60} colorClass="--stat-orange" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-sm">
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
        </div>
      </div>
    </div>
  );
}
