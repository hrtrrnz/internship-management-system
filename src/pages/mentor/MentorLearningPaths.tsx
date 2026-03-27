import { BookOpen, Plus, Edit } from "lucide-react";

const paths = [
  {
    title: "Frontend Development Track",
    modules: 6,
    assigned: 5,
    description: "React, TypeScript, Tailwind CSS, testing, and deployment fundamentals.",
    interns: ["Juan dela Cruz", "Ana Santos", "Mark Rivera", "Grace Yu", "David Chen"],
  },
  {
    title: "Marketing & Analytics Track",
    modules: 4,
    assigned: 2,
    description: "Digital marketing, data analysis, campaign management, and reporting.",
    interns: ["Lisa Tan", "Sofia Garcia"],
  },
  {
    title: "Operations & Process Track",
    modules: 3,
    assigned: 1,
    description: "Process mapping, optimization, documentation, and project management.",
    interns: ["Peter Lim"],
  },
];

export default function MentorLearningPaths() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Learning Paths</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Create Path
        </button>
      </div>

      <div className="space-y-4">
        {paths.map((p) => (
          <div key={p.title} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stat-blue-bg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-stat-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{p.title}</h4>
                  <p className="text-xs text-muted-foreground">{p.modules} modules · {p.assigned} interns assigned</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Assigned to:</span>
              <div className="flex -space-x-2">
                {p.interns.map((intern) => (
                  <div key={intern} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold border-2 border-card" title={intern}>
                    {intern.split(" ").map(n => n[0]).join("")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
