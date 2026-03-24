import { ClipboardCheck, Star, Plus } from "lucide-react";

const evaluations = [
  { intern: "Juan dela Cruz", period: "Week 7", due: "Mar 28", status: "Pending", lastScore: 4.5 },
  { intern: "Ana Santos", period: "Week 7", due: "Mar 28", status: "Pending", lastScore: 4.7 },
  { intern: "Mark Rivera", period: "Week 7", due: "Mar 28", status: "Not Started", lastScore: 3.2 },
  { intern: "Juan dela Cruz", period: "Week 6", due: "Mar 21", status: "Completed", lastScore: 4.5 },
  { intern: "Ana Santos", period: "Week 6", due: "Mar 21", status: "Completed", lastScore: 4.7 },
  { intern: "Mark Rivera", period: "Week 6", due: "Mar 21", status: "Completed", lastScore: 3.2 },
];

const statusStyles: Record<string, string> = {
  Completed: "text-stat-green bg-stat-green-bg",
  Pending: "text-stat-orange bg-stat-orange-bg",
  "Not Started": "text-muted-foreground bg-muted",
};

export default function MentorEvaluations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Evaluations</h2>
          <p className="text-sm text-muted-foreground">Evaluate your interns' performance each week</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Evaluation
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Period</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Due Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Last Score</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((e, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{e.intern}</td>
                <td className="px-5 py-3 text-muted-foreground">{e.period}</td>
                <td className="px-5 py-3 text-muted-foreground">{e.due}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-stat-orange fill-stat-orange" />
                    <span className="text-foreground font-medium">{e.lastScore}/5.0</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[e.status]}`}>{e.status}</span>
                </td>
                <td className="px-5 py-3">
                  {e.status !== "Completed" ? (
                    <button className="px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90">Evaluate</button>
                  ) : (
                    <button className="text-xs text-accent hover:underline font-medium">View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
