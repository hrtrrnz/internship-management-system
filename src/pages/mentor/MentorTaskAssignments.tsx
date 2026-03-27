import { CheckSquare, Clock, Circle, Plus, User } from "lucide-react";

const assignments = [
  { id: 1, title: "Complete TypeScript assessment", assignedTo: "Juan dela Cruz", avatar: "JD", due: "Mar 25", priority: "High", status: "In Progress", description: "Finish all exercises in the TS module" },
  { id: 2, title: "Build user auth module", assignedTo: "Ana Santos", avatar: "AS", due: "Mar 26", priority: "High", status: "In Progress", description: "Implement login, signup, and password reset" },
  { id: 3, title: "Write API documentation", assignedTo: "Mark Rivera", avatar: "MR", due: "Mar 27", priority: "Medium", status: "Pending", description: "Document all REST endpoints" },
  { id: 4, title: "Create unit tests for dashboard", assignedTo: "Juan dela Cruz", avatar: "JD", due: "Mar 28", priority: "Medium", status: "Pending", description: "Write tests for stat cards and chart widgets" },
  { id: 5, title: "Design mobile wireframes", assignedTo: "Lisa Tan", avatar: "LT", due: "Mar 25", priority: "High", status: "Completed", description: "Low-fi wireframes for the mobile app" },
  { id: 6, title: "Optimize database queries", assignedTo: "David Chen", avatar: "DC", due: "Mar 29", priority: "Low", status: "Pending", description: "Profile and optimize slow queries" },
  { id: 7, title: "Brand style guide review", assignedTo: "Sofia Garcia", avatar: "SG", due: "Mar 26", priority: "Medium", status: "Completed", description: "Review and provide feedback on style guide" },
];

const columns = [
  { key: "Pending", label: "To Do", icon: Circle, color: "--muted-foreground" },
  { key: "In Progress", label: "In Progress", icon: Clock, color: "--stat-blue" },
  { key: "Completed", label: "Done", icon: CheckSquare, color: "--stat-green" },
];

const priorityDot: Record<string, string> = {
  High: "bg-destructive",
  Medium: "bg-stat-orange",
  Low: "bg-stat-green",
};

export default function MentorTaskAssignments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Task Assignments</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Assign Task
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = assignments.filter(t => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card border border-border" style={{ borderLeftWidth: '3px', borderLeftColor: `hsl(var(${col.color}))` }}>
                <col.icon className="w-4 h-4" style={{ color: `hsl(var(${col.color}))` }} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{colTasks.length}</span>
              </div>

              {colTasks.map((task) => (
                <div key={task.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
                    <span className="text-[10px] text-muted-foreground font-medium">{task.priority}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[9px] font-bold">
                        {task.avatar}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{task.assignedTo.split(" ")[0]}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
