import { GraduationCap, CheckSquare, FileText, Clock, TrendingUp, Users, Calendar } from "lucide-react";

const internSummary = [
  { name: "Juan dela Cruz", progress: 78, tasks: 18, reports: 12, status: "On Track" },
  { name: "Ana Santos", progress: 85, tasks: 22, reports: 15, status: "On Track" },
  { name: "Mark Rivera", progress: 45, tasks: 10, reports: 7, status: "Needs Attention" },
];

export default function MentorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} value="8" label="Assigned Interns" sub="2 new this month" color="--stat-blue" />
        <StatCard icon={FileText} value="6" label="Pending Reviews" sub="3 reports, 3 evals" color="--stat-orange" />
        <StatCard icon={Calendar} value="4" label="Sessions This Week" sub="2 completed" color="--stat-green" />
        <StatCard icon={TrendingUp} value="72%" label="Avg. Intern Progress" sub="↑5% from last week" color="--stat-emerald" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-display font-bold text-foreground mb-4">Intern Overview</h3>
            <div className="space-y-4">
              {internSummary.map((intern) => (
                <div key={intern.name} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {intern.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-foreground">{intern.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        intern.status === "On Track" ? "text-stat-green bg-stat-green-bg" : "text-stat-orange bg-stat-orange-bg"
                      }`}>{intern.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>{intern.tasks} tasks</span>
                      <span>{intern.reports} reports</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${intern.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{intern.progress}% progress</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Upcoming Sessions</h3>
            <div className="space-y-3">
              {[
                { intern: "Juan dela Cruz", time: "2:00 PM Today", topic: "API Design Review" },
                { intern: "Ana Santos", time: "10:00 AM Tomorrow", topic: "Code Review" },
                { intern: "Mark Rivera", time: "3:00 PM Mar 26", topic: "Progress Check-in" },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-medium text-foreground">{s.topic}</p>
                  <p className="text-xs text-muted-foreground">{s.intern} · {s.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Pending Actions</h3>
            <div className="space-y-2">
              {[
                { text: "Review Juan's daily report", type: "report" },
                { text: "Complete Ana's Week 6 evaluation", type: "eval" },
                { text: "Approve Mark's task submission", type: "task" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${
                    a.type === "report" ? "bg-stat-blue" : a.type === "eval" ? "bg-stat-orange" : "bg-stat-green"
                  }`} />
                  <p className="text-sm text-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, sub, color }: {
  icon: React.ElementType; value: string; label: string; sub: string; color: string;
}) {
  return (
    <div className="rounded-xl bg-card p-5 border border-border/80 relative overflow-hidden shadow-sm">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `hsl(var(${color}) / 0.16)` }}>
        <Icon className="w-5 h-5" style={{ color: `hsl(var(${color}))` }} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs mt-1" style={{ color: `hsl(var(${color}))` }}>{sub}</p>
    </div>
  );
}
