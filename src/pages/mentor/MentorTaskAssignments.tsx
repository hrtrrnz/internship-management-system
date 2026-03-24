import { CheckSquare, Plus, User } from "lucide-react";

const assignments = [
  { id: 1, title: "Complete TypeScript assessment", assignedTo: "Juan dela Cruz", due: "Mar 25", priority: "High", status: "In Progress" },
  { id: 2, title: "Build user auth module", assignedTo: "Ana Santos", due: "Mar 26", priority: "High", status: "In Progress" },
  { id: 3, title: "Write API documentation", assignedTo: "Mark Rivera", due: "Mar 27", priority: "Medium", status: "Pending" },
  { id: 4, title: "Create unit tests for dashboard", assignedTo: "Juan dela Cruz", due: "Mar 28", priority: "Medium", status: "Pending" },
  { id: 5, title: "Design mobile wireframes", assignedTo: "Lisa Tan", due: "Mar 25", priority: "High", status: "Completed" },
  { id: 6, title: "Optimize database queries", assignedTo: "David Chen", due: "Mar 29", priority: "Low", status: "Pending" },
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

export default function MentorTaskAssignments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Task Assignments</h2>
          <p className="text-sm text-muted-foreground">Create and manage tasks for your interns</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Assign Task
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Task</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Assigned To</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Due Date</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Priority</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{t.title}</td>
                <td className="px-5 py-3 text-foreground flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> {t.assignedTo}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{t.due}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[t.priority]}`}>{t.priority}</span>
                </td>
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
