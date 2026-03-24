import { GraduationCap, Mail, MoreVertical } from "lucide-react";

const interns = [
  { name: "Juan dela Cruz", unit: "Technology & Innovation", week: 7, progress: 78, tasks: 18, status: "On Track", avatar: "JD" },
  { name: "Ana Santos", unit: "Technology & Innovation", week: 7, progress: 85, tasks: 22, status: "On Track", avatar: "AS" },
  { name: "Mark Rivera", unit: "Technology & Innovation", week: 7, progress: 45, tasks: 10, status: "Needs Attention", avatar: "MR" },
  { name: "Lisa Tan", unit: "Marketing", week: 5, progress: 62, tasks: 14, status: "On Track", avatar: "LT" },
  { name: "Peter Lim", unit: "Operations", week: 5, progress: 55, tasks: 12, status: "On Track", avatar: "PL" },
  { name: "Grace Yu", unit: "Technology & Innovation", week: 3, progress: 30, tasks: 6, status: "New", avatar: "GY" },
  { name: "David Chen", unit: "Data Analytics", week: 3, progress: 28, tasks: 5, status: "New", avatar: "DC" },
  { name: "Sofia Garcia", unit: "Marketing", week: 1, progress: 8, tasks: 2, status: "New", avatar: "SG" },
];

const statusStyles: Record<string, string> = {
  "On Track": "text-stat-green bg-stat-green-bg",
  "Needs Attention": "text-stat-orange bg-stat-orange-bg",
  "New": "text-stat-blue bg-stat-blue-bg",
};

export default function MentorInterns() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Interns</h2>
        <p className="text-sm text-muted-foreground">Manage and track your assigned interns</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {interns.map((intern) => (
          <div key={intern.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {intern.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{intern.name}</p>
                  <p className="text-xs text-muted-foreground">{intern.unit}</p>
                </div>
              </div>
              <button className="p-1 rounded hover:bg-muted transition-colors">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Week {intern.week} of 12</span>
              <span className={`px-2 py-0.5 rounded-full font-medium ${statusStyles[intern.status]}`}>{intern.status}</span>
            </div>

            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-accent rounded-full" style={{ width: `${intern.progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{intern.progress}% progress</span>
              <span>{intern.tasks} tasks</span>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                View Profile
              </button>
              <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
