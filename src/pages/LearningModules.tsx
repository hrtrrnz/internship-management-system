import { BookOpen, CheckCircle, Clock, Play } from "lucide-react";

const modules = [
  { id: 1, title: "React Fundamentals", lessons: 12, completed: 12, status: "Completed", progress: 100 },
  { id: 2, title: "TypeScript for React", lessons: 8, completed: 6, status: "In Progress", progress: 75 },
  { id: 3, title: "API Design & Integration", lessons: 10, completed: 3, status: "In Progress", progress: 30 },
  { id: 4, title: "Database Management", lessons: 6, completed: 0, status: "Not Started", progress: 0 },
  { id: 5, title: "UI/UX Design Principles", lessons: 8, completed: 0, status: "Not Started", progress: 0 },
  { id: 6, title: "Testing & QA", lessons: 7, completed: 0, status: "Not Started", progress: 0 },
];

const statusIcons: Record<string, React.ElementType> = {
  Completed: CheckCircle,
  "In Progress": Play,
  "Not Started": Clock,
};

const statusColors: Record<string, string> = {
  Completed: "text-stat-green",
  "In Progress": "text-stat-orange",
  "Not Started": "text-muted-foreground",
};

export default function LearningModules() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Learning Modules</h2>
        <p className="text-sm text-muted-foreground">Your assigned courses and learning materials</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {modules.map((m) => {
          const StatusIcon = statusIcons[m.status];
          return (
            <div key={m.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-stat-blue-bg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-stat-blue" />
                </div>
                <StatusIcon className={`w-5 h-5 ${statusColors[m.status]}`} />
              </div>
              <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{m.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{m.completed}/{m.lessons} lessons completed</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${m.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{m.progress}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
