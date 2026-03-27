import { Clock, CheckCircle, AlertCircle, Download, Calendar } from "lucide-react";

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

export default function AdminAttendance() {
  const present = todayLogs.filter(l => l.status === "Present").length;
  const late = todayLogs.filter(l => l.status === "Late").length;
  const absent = todayLogs.filter(l => l.status === "Absent").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Attendance Logs</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Today's overview */}
        <div className="col-span-2 space-y-4">
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
                <div key={l.name} className="px-5 py-3 flex items-center gap-4 hover:bg-muted/20 transition-colors">
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
        </div>

        {/* Weekly heatmap */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-bold text-foreground">Week 7 Heatmap</h3>
          </div>

          <div className="space-y-1.5">
            {/* Header */}
            <div className="grid grid-cols-6 gap-1.5 text-center">
              <span className="text-[10px] text-muted-foreground" />
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map(d => (
                <span key={d} className="text-[10px] text-muted-foreground font-medium">{d}</span>
              ))}
            </div>
            {/* Rows */}
            {weeklyHeatmap.map((row) => (
              <div key={row.name} className="grid grid-cols-6 gap-1.5">
                <span className="text-[10px] text-muted-foreground flex items-center">{row.name}</span>
                {["mon", "tue", "wed", "thu", "fri"].map((day) => {
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
      </div>
    </div>
  );
}
