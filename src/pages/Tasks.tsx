import { CheckSquare, Circle, Clock, AlertTriangle, Flag } from "lucide-react";

const tasks = [
  { id: 1, title: "Complete React module assessment", category: "Learning", priority: "High", due: "Mar 25", status: "In Progress", description: "Finish all exercises in Module 3" },
  { id: 2, title: "Submit weekly progress report", category: "Reports", priority: "High", due: "Mar 24", status: "Pending", description: "Week 7 summary with accomplishments" },
  { id: 3, title: "Review API documentation", category: "Learning", priority: "Medium", due: "Mar 26", status: "Pending", description: "Read through REST API design patterns" },
  { id: 4, title: "Update project README", category: "Development", priority: "Low", due: "Mar 28", status: "Pending", description: "Add setup instructions and screenshots" },
  { id: 5, title: "Attend team standup", category: "Meetings", priority: "Medium", due: "Mar 24", status: "Completed", description: "Daily sync with the dev team" },
  { id: 6, title: "Design dashboard wireframes", category: "Design", priority: "High", due: "Mar 22", status: "Completed", description: "Low-fi wireframes for the intern portal" },
  { id: 7, title: "Fix navigation bug", category: "Development", priority: "High", due: "Mar 21", status: "Completed", description: "Mobile sidebar not closing on route change" },
  { id: 8, title: "Prepare presentation slides", category: "Reports", priority: "Medium", due: "Mar 27", status: "In Progress", description: "Sprint demo for stakeholders" },
];

const columns = [
  { key: "Pending", label: "To Do", icon: Circle, color: "--muted-foreground", borderColor: "border-muted-foreground/30" },
  { key: "In Progress", label: "In Progress", icon: Clock, color: "--stat-blue", borderColor: "border-stat-blue/30" },
  { key: "Completed", label: "Done", icon: CheckSquare, color: "--stat-green", borderColor: "border-stat-green/30" },
];

const priorityConfig: Record<string, { icon: string; style: string }> = {
  High: { icon: "🔴", style: "text-destructive" },
  Medium: { icon: "🟡", style: "text-stat-orange" },
  Low: { icon: "🟢", style: "text-stat-green" },
};

const categoryStyles: Record<string, string> = {
  Learning: "bg-stat-blue-bg text-stat-blue",
  Reports: "bg-stat-orange-bg text-stat-orange",
  Development: "bg-stat-green-bg text-stat-green",
  Design: "bg-stat-emerald-bg text-stat-emerald",
  Meetings: "bg-muted text-muted-foreground",
};

export default function Tasks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Tasks</h2>
          <p className="text-sm text-muted-foreground">Manage and track your assigned tasks</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-medium">
            <Flag className="w-3 h-3" /> {tasks.length} total
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-l-[3px] bg-card border border-border`} style={{ borderLeftColor: `hsl(var(${col.color}))` }}>
                <col.icon className="w-4 h-4" style={{ color: `hsl(var(${col.color}))` }} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{colTasks.length}</span>
              </div>

              {/* Task cards */}
              {colTasks.map((task) => (
                <div key={task.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoryStyles[task.category]}`}>{task.category}</span>
                    <span className="text-xs" title={task.priority}>{priorityConfig[task.priority].icon}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.due}
                    </span>
                    {col.key === "Completed" && (
                      <CheckSquare className="w-4 h-4 text-stat-green" />
                    )}
                  </div>
                </div>
              ))}

              {colTasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}