import { FileText, Download } from "lucide-react";

const reports = [
  { intern: "Juan dela Cruz", mentor: "Maria Reyes", date: "Mar 21", title: "Sprint Review & API Integration", status: "Reviewed" },
  { intern: "Ana Santos", mentor: "Maria Reyes", date: "Mar 21", title: "UI Component Testing Results", status: "Pending" },
  { intern: "Mark Rivera", mentor: "Maria Reyes", date: "Mar 21", title: "Database Migration Plan", status: "Pending" },
  { intern: "Lisa Tan", mentor: "James Cruz", date: "Mar 21", title: "Campaign Performance Analysis", status: "Reviewed" },
  { intern: "Peter Lim", mentor: "Elena Torres", date: "Mar 21", title: "Process Optimization Report", status: "Needs Revision" },
  { intern: "Grace Yu", mentor: "Roberto Lim", date: "Mar 20", title: "Frontend Setup Notes", status: "Reviewed" },
  { intern: "David Chen", mentor: "Michael Tan", date: "Mar 20", title: "Data Pipeline Design", status: "Reviewed" },
  { intern: "Sofia Garcia", mentor: "Sarah Villanueva", date: "Mar 20", title: "Brand Research Summary", status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Reviewed: "text-stat-green bg-stat-green-bg",
  Pending: "text-stat-orange bg-stat-orange-bg",
  "Needs Revision": "text-destructive bg-destructive/10",
};

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">All Reports</h2>
          <p className="text-sm text-muted-foreground">View all daily reports across the program</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Mentor</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Report Title</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{r.intern}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.mentor}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-5 py-3 text-foreground">{r.title}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
