import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const reports = [
  { id: 1, date: "Mar 21, 2026", title: "Sprint Review & API Integration Progress", status: "Submitted", feedback: "Great work!" },
  { id: 2, date: "Mar 20, 2026", title: "Dashboard UI Implementation", status: "Submitted", feedback: "Needs more detail" },
  { id: 3, date: "Mar 19, 2026", title: "Database Schema Design & Testing", status: "Reviewed", feedback: "Approved" },
  { id: 4, date: "Mar 18, 2026", title: "Frontend Component Library Setup", status: "Reviewed", feedback: "Well documented" },
  { id: 5, date: "Mar 17, 2026", title: "Project Kickoff & Environment Setup", status: "Reviewed", feedback: "Good start" },
  { id: 6, date: "Mar 14, 2026", title: "Research & Planning Phase", status: "Missing", feedback: "—" },
];

const statusStyle: Record<string, string> = {
  Submitted: "text-stat-blue bg-stat-blue-bg",
  Reviewed: "text-stat-green bg-stat-green-bg",
  Missing: "text-destructive bg-destructive/10",
};

export default function DailyReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Daily Reports</h2>
        <p className="text-sm text-muted-foreground">View and manage your daily report submissions</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat icon={FileText} label="Total Reports" value="12" color="--stat-blue" />
        <MiniStat icon={CheckCircle} label="Reviewed" value="10" color="--stat-green" />
        <MiniStat icon={AlertTriangle} label="Missing" value="1" color="--destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Report Title</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 text-foreground font-medium">{r.date}</td>
                <td className="px-5 py-3 text-foreground">{r.title}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{r.feedback}</td>
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
