import { ClipboardCheck, Star, Download } from "lucide-react";

const evaluations = [
  { intern: "Juan dela Cruz", mentor: "Maria Reyes", period: "Week 6", score: 4.5, date: "Mar 17", status: "Completed" },
  { intern: "Ana Santos", mentor: "Maria Reyes", period: "Week 6", score: 4.7, date: "Mar 17", status: "Completed" },
  { intern: "Mark Rivera", mentor: "Maria Reyes", period: "Week 6", score: 3.2, date: "Mar 17", status: "Completed" },
  { intern: "Lisa Tan", mentor: "James Cruz", period: "Week 4", score: 4.3, date: "Mar 3", status: "Completed" },
  { intern: "Peter Lim", mentor: "Elena Torres", period: "Week 4", score: 4.1, date: "Mar 3", status: "Completed" },
  { intern: "Juan dela Cruz", mentor: "Maria Reyes", period: "Week 7", score: 0, date: "Mar 28", status: "Pending" },
  { intern: "Ana Santos", mentor: "Maria Reyes", period: "Week 7", score: 0, date: "Mar 28", status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Completed: "text-stat-green bg-stat-green-bg",
  Pending: "text-stat-orange bg-stat-orange-bg",
};

export default function AdminEvaluations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Evaluations</h2>
          <p className="text-sm text-muted-foreground">All intern evaluations across the program</p>
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
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Period</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Score</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Due Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((e, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{e.intern}</td>
                <td className="px-5 py-3 text-muted-foreground">{e.mentor}</td>
                <td className="px-5 py-3 text-muted-foreground">{e.period}</td>
                <td className="px-5 py-3">
                  {e.score > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-stat-orange fill-stat-orange" />
                      <span className="font-medium text-foreground">{e.score}/5.0</span>
                    </div>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{e.date}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[e.status]}`}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
