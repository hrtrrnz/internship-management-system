import { FileText, CheckCircle, Clock, Eye } from "lucide-react";

const reports = [
  { intern: "Juan dela Cruz", date: "Mar 21", title: "Sprint Review & API Integration", status: "Pending Review" },
  { intern: "Ana Santos", date: "Mar 21", title: "UI Component Testing Results", status: "Pending Review" },
  { intern: "Mark Rivera", date: "Mar 21", title: "Database Migration Plan", status: "Pending Review" },
  { intern: "Juan dela Cruz", date: "Mar 20", title: "Dashboard UI Implementation", status: "Reviewed" },
  { intern: "Ana Santos", date: "Mar 20", title: "Auth Flow Documentation", status: "Reviewed" },
  { intern: "Lisa Tan", date: "Mar 20", title: "Marketing Campaign Analysis", status: "Reviewed" },
  { intern: "Peter Lim", date: "Mar 20", title: "Operations Process Map", status: "Needs Revision" },
  { intern: "Mark Rivera", date: "Mar 19", title: "Schema Design Notes", status: "Reviewed" },
];

const statusStyles: Record<string, string> = {
  "Pending Review": "text-stat-orange bg-stat-orange-bg",
  "Reviewed": "text-stat-green bg-stat-green-bg",
  "Needs Revision": "text-destructive bg-destructive/10",
};

export default function MentorReportReview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Report Review</h2>
        <p className="text-sm text-muted-foreground">Review and provide feedback on intern daily reports</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat icon={Clock} label="Pending Review" value="3" color="--stat-orange" />
        <MiniStat icon={CheckCircle} label="Reviewed" value="24" color="--stat-green" />
        <MiniStat icon={FileText} label="Total Reports" value="28" color="--stat-blue" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Report Title</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{r.intern}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-5 py-3 text-foreground">{r.title}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    {r.status === "Pending Review" && (
                      <button className="px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90">Review</button>
                    )}
                  </div>
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
