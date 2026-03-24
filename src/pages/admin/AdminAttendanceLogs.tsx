import { Clock, CheckCircle, AlertCircle, Download } from "lucide-react";

const logs = [
  { name: "Juan dela Cruz", dept: "Tech & Innovation", date: "Mar 24", in: "—", out: "—", status: "Absent" },
  { name: "Ana Santos", dept: "Tech & Innovation", date: "Mar 24", in: "7:55 AM", out: "—", status: "Present" },
  { name: "Mark Rivera", dept: "Tech & Innovation", date: "Mar 24", in: "—", out: "—", status: "Absent" },
  { name: "Lisa Tan", dept: "Marketing", date: "Mar 24", in: "8:10 AM", out: "—", status: "Late" },
  { name: "Peter Lim", dept: "Operations", date: "Mar 24", in: "8:00 AM", out: "—", status: "Present" },
  { name: "Grace Yu", dept: "Tech & Innovation", date: "Mar 24", in: "7:50 AM", out: "—", status: "Present" },
  { name: "David Chen", dept: "Data Analytics", date: "Mar 24", in: "8:20 AM", out: "—", status: "Late" },
  { name: "Sofia Garcia", dept: "Marketing", date: "Mar 24", in: "7:58 AM", out: "—", status: "Present" },
];

const statusStyles: Record<string, string> = {
  Present: "text-stat-green bg-stat-green-bg",
  Late: "text-stat-orange bg-stat-orange-bg",
  Absent: "text-destructive bg-destructive/10",
};

export default function AdminAttendance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Attendance Logs</h2>
          <p className="text-sm text-muted-foreground">View all intern attendance records system-wide</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat icon={CheckCircle} label="Present Today" value="5" color="--stat-green" />
        <MiniStat icon={Clock} label="Late Today" value="2" color="--stat-orange" />
        <MiniStat icon={AlertCircle} label="Absent Today" value="2" color="--destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Department</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clock In</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clock Out</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{l.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{l.dept}</td>
                <td className="px-5 py-3 text-muted-foreground">{l.date}</td>
                <td className="px-5 py-3 text-foreground">{l.in}</td>
                <td className="px-5 py-3 text-foreground">{l.out}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[l.status]}`}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${color}) / 0.15)` }}>
        <Icon className="w-5 h-5" style={{ color: `hsl(var(${color}))` }} />
      </div>
      <div>
        <p className="text-2xl font-bold font-display text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
