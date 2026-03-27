import { GraduationCap, MoreVertical } from "lucide-react";

const interns = [
  { name: "Juan dela Cruz", department: "Tech & Innovation", mentor: "Maria Reyes", week: 7, progress: 78, status: "On Track" },
  { name: "Ana Santos", department: "Tech & Innovation", mentor: "Maria Reyes", week: 7, progress: 85, status: "On Track" },
  { name: "Mark Rivera", department: "Tech & Innovation", mentor: "Maria Reyes", week: 7, progress: 45, status: "At Risk" },
  { name: "Lisa Tan", department: "Marketing", mentor: "James Cruz", week: 5, progress: 62, status: "On Track" },
  { name: "Peter Lim", department: "Operations", mentor: "Elena Torres", week: 5, progress: 55, status: "On Track" },
  { name: "Grace Yu", department: "Tech & Innovation", mentor: "Roberto Lim", week: 3, progress: 30, status: "New" },
  { name: "David Chen", department: "Data Analytics", mentor: "Michael Tan", week: 3, progress: 28, status: "New" },
  { name: "Sofia Garcia", department: "Marketing", mentor: "Sarah Villanueva", week: 1, progress: 8, status: "New" },
];

const statusStyles: Record<string, string> = {
  "On Track": "text-stat-green bg-stat-green-bg",
  "At Risk": "text-destructive bg-destructive/10",
  "New": "text-stat-blue bg-stat-blue-bg",
};

export default function AdminInterns() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Interns</h2>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Department</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Mentor</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Week</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Progress</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern) => (
              <tr key={intern.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {intern.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {intern.name}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{intern.department}</td>
                <td className="px-5 py-3 text-foreground">{intern.mentor}</td>
                <td className="px-5 py-3 text-muted-foreground">{intern.week}/12</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${intern.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{intern.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[intern.status]}`}>{intern.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
