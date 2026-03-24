import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const records = [
  { date: "Mar 21, 2026", day: "Friday", in: "8:02 AM", out: "5:14 PM", hours: "9h 12m", status: "Present" },
  { date: "Mar 20, 2026", day: "Thursday", in: "8:15 AM", out: "5:30 PM", hours: "9h 15m", status: "Late" },
  { date: "Mar 19, 2026", day: "Wednesday", in: "7:58 AM", out: "5:00 PM", hours: "9h 02m", status: "Present" },
  { date: "Mar 18, 2026", day: "Tuesday", in: "8:30 AM", out: "5:45 PM", hours: "9h 15m", status: "Late" },
  { date: "Mar 17, 2026", day: "Monday", in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  { date: "Mar 14, 2026", day: "Friday", in: "—", out: "—", hours: "—", status: "Absent" },
  { date: "Mar 13, 2026", day: "Thursday", in: "7:55 AM", out: "5:10 PM", hours: "9h 15m", status: "Present" },
  { date: "Mar 12, 2026", day: "Wednesday", in: "8:05 AM", out: "5:00 PM", hours: "8h 55m", status: "Present" },
];

const statusStyles: Record<string, string> = {
  Present: "text-stat-green bg-stat-green-bg",
  Late: "text-stat-orange bg-stat-orange-bg",
  Absent: "text-destructive bg-destructive/10",
};

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground">Track your daily attendance records</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <SummaryCard icon={Clock} label="Total Days" value="34" color="--stat-blue" />
        <SummaryCard icon={CheckCircle} label="Present" value="30" color="--stat-green" />
        <SummaryCard icon={AlertCircle} label="Late" value="3" color="--stat-orange" />
        <SummaryCard icon={XCircle} label="Absent" value="1" color="--destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Day</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clock In</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clock Out</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Hours</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.date} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{r.date}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.day}</td>
                <td className="px-5 py-3 text-foreground">{r.in}</td>
                <td className="px-5 py-3 text-foreground">{r.out}</td>
                <td className="px-5 py-3 text-foreground">{r.hours}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
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
