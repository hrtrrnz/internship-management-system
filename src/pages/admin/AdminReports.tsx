import { FileText, Download, CheckCircle, Clock, AlertTriangle, BarChart3 } from "lucide-react";

const reports = [
  { intern: "Juan dela Cruz", mentor: "Maria Reyes", date: "Mar 21", title: "Sprint Review & API Integration", status: "Reviewed", dept: "Tech & Innovation" },
  { intern: "Ana Santos", mentor: "Maria Reyes", date: "Mar 21", title: "UI Component Testing Results", status: "Pending", dept: "Tech & Innovation" },
  { intern: "Mark Rivera", mentor: "Maria Reyes", date: "Mar 21", title: "Database Migration Plan", status: "Pending", dept: "Tech & Innovation" },
  { intern: "Lisa Tan", mentor: "James Cruz", date: "Mar 21", title: "Campaign Performance Analysis", status: "Reviewed", dept: "Marketing" },
  { intern: "Peter Lim", mentor: "Elena Torres", date: "Mar 21", title: "Process Optimization Report", status: "Needs Revision", dept: "Operations" },
  { intern: "Grace Yu", mentor: "Roberto Lim", date: "Mar 20", title: "Frontend Setup Notes", status: "Reviewed", dept: "Tech & Innovation" },
  { intern: "David Chen", mentor: "Michael Tan", date: "Mar 20", title: "Data Pipeline Design", status: "Reviewed", dept: "Data Analytics" },
  { intern: "Sofia Garcia", mentor: "Sarah Villanueva", date: "Mar 20", title: "Brand Research Summary", status: "Pending", dept: "Marketing" },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Reviewed: { color: "text-stat-green", bg: "bg-stat-green-bg", icon: CheckCircle },
  Pending: { color: "text-stat-orange", bg: "bg-stat-orange-bg", icon: Clock },
  "Needs Revision": { color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
};

export default function AdminReports() {
  const reviewed = reports.filter(r => r.status === "Reviewed").length;
  const pending = reports.filter(r => r.status === "Pending").length;
  const revision = reports.filter(r => r.status === "Needs Revision").length;

  // Group by date
  const grouped = reports.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {} as Record<string, typeof reports>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">All Reports</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Overview strip */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stat-blue-bg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-stat-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{reports.length}</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </div>
          <div className="flex-1 h-4 rounded-full overflow-hidden flex bg-muted">
            <div className="bg-stat-green h-full" style={{ width: `${(reviewed / reports.length) * 100}%` }} />
            <div className="bg-stat-orange h-full" style={{ width: `${(pending / reports.length) * 100}%` }} />
            <div className="bg-destructive h-full" style={{ width: `${(revision / reports.length) * 100}%` }} />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stat-green" /> {reviewed} Reviewed</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stat-orange" /> {pending} Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" /> {revision} Revision</span>
          </div>
        </div>
      </div>

      {/* Grouped by date */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([date, dateReports]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-foreground">{date}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{dateReports.length} reports</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dateReports.map((r, i) => {
                const sc = statusConfig[r.status];
                return (
                  <div key={i} className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                          {r.intern.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.intern}</p>
                          <p className="text-[10px] text-muted-foreground">{r.dept} · {r.mentor}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.color}`}>{r.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
