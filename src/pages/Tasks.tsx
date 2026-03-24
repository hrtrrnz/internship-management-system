import { CheckSquare, Circle, Clock, AlertTriangle } from "lucide-react";

const tasks = [
  { id: 1, title: "Complete React module assessment", category: "Learning", priority: "High", due: "Mar 25", status: "In Progress" },
  { id: 2, title: "Submit weekly progress report", category: "Reports", priority: "High", due: "Mar 24", status: "Pending" },
  { id: 3, title: "Review API documentation", category: "Learning", priority: "Medium", due: "Mar 26", status: "Pending" },
  { id: 4, title: "Update project repository README", category: "Development", priority: "Low", due: "Mar 28", status: "Pending" },
  { id: 5, title: "Attend team standup meeting", category: "Meetings", priority: "Medium", due: "Mar 24", status: "Completed" },
  { id: 6, title: "Design dashboard wireframes", category: "Design", priority: "High", due: "Mar 22", status: "Completed" },
  { id: 7, title: "Fix navigation bug", category: "Development", priority: "High", due: "Mar 21", status: "Completed" },
  { id: 8, title: "Prepare presentation slides", category: "Reports", priority: "Medium", due: "Mar 27", status: "In Progress" },
];

const priorityStyles: Record<string, string> = {
  High: "text-destructive bg-destructive/10",
  Medium: "text-stat-orange bg-stat-orange-bg",
  Low: "text-stat-green bg-stat-green-bg",
};

const statusStyles: Record<string, string> = {
  Completed: "text-stat-green bg-stat-green-bg",
  "In Progress": "text-stat-blue bg-stat-blue-bg",
  Pending: "text-muted-foreground bg-muted",
};

export default function Tasks() {
  const completed = tasks.filter(t => t.status === "Completed").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const pending = tasks.filter(t => t.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Tasks</h2>
        <p className="text-sm text-muted-foreground">Manage and track your assigned tasks</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatMini icon={CheckSquare} label="Total Tasks" value={tasks.length.toString()} color="--stat-blue" />
        <StatMini icon={CheckSquare} label="Completed" value={completed.toString()} color="--stat-green" />
        <StatMini icon={Clock} label="In Progress" value={inProgress.toString()} color="--stat-orange" />
        <StatMini icon={AlertTriangle} label="Pending" value={pending.toString()} color="--destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Task</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Priority</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Due Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                  <Circle className={`w-4 h-4 ${t.status === "Completed" ? "text-stat-green" : "text-muted-foreground"}`} />
                  {t.title}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{t.category}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[t.priority]}`}>{t.priority}</span>
                </td>
                <td className="px-5 py-3 text-foreground">{t.due}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[t.status]}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatMini({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
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
