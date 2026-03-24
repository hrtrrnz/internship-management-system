import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const attendanceData = [
  { intern: "Juan dela Cruz", date: "Mar 24", in: "—", out: "—", status: "Not clocked in" },
  { intern: "Ana Santos", date: "Mar 24", in: "7:55 AM", out: "—", status: "Clocked in" },
  { intern: "Mark Rivera", date: "Mar 24", in: "—", out: "—", status: "Not clocked in" },
  { intern: "Lisa Tan", date: "Mar 24", in: "8:10 AM", out: "—", status: "Clocked in" },
  { intern: "Peter Lim", date: "Mar 24", in: "8:00 AM", out: "—", status: "Clocked in" },
  { intern: "Grace Yu", date: "Mar 24", in: "—", out: "—", status: "Not clocked in" },
  { intern: "David Chen", date: "Mar 24", in: "8:20 AM", out: "—", status: "Late" },
  { intern: "Sofia Garcia", date: "Mar 24", in: "7:50 AM", out: "—", status: "Clocked in" },
];

const statusStyles: Record<string, string> = {
  "Clocked in": "text-stat-green bg-stat-green-bg",
  "Not clocked in": "text-muted-foreground bg-muted",
  "Late": "text-stat-orange bg-stat-orange-bg",
};

export default function MentorAttendanceReview() {
  const clockedIn = attendanceData.filter(a => a.status === "Clocked in").length;
  const late = attendanceData.filter(a => a.status === "Late").length;
  const absent = attendanceData.filter(a => a.status === "Not clocked in").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Attendance Review</h2>
        <p className="text-sm text-muted-foreground">Monitor your interns' attendance for today</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat icon={CheckCircle} label="Clocked In" value={clockedIn.toString()} color="--stat-green" />
        <MiniStat icon={Clock} label="Late" value={late.toString()} color="--stat-orange" />
        <MiniStat icon={AlertCircle} label="Not Clocked In" value={absent.toString()} color="--destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clock In</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Clock Out</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((a) => (
              <tr key={a.intern} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{a.intern}</td>
                <td className="px-5 py-3 text-muted-foreground">{a.date}</td>
                <td className="px-5 py-3 text-foreground">{a.in}</td>
                <td className="px-5 py-3 text-foreground">{a.out}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[a.status]}`}>{a.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-xs text-accent hover:underline font-medium">View History</button>
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
