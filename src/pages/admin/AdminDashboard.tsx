import { Users, GraduationCap, Star, Building, TrendingUp, Clock, FileText, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} value="42" label="Total Users" sub="↑4 this month" color="--stat-blue" bg="bg-stat-blue-bg" />
        <StatCard icon={GraduationCap} value="24" label="Active Interns" sub="3 batches" color="--stat-green" bg="bg-stat-green-bg" />
        <StatCard icon={Star} value="8" label="Mentors" sub="All active" color="--stat-orange" bg="bg-stat-orange-bg" />
        <StatCard icon={Building} value="6" label="Departments" sub="2 with openings" color="--stat-emerald" bg="bg-stat-emerald-bg" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-display font-bold text-foreground mb-4">System Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Attendance Rate", value: "92%", trend: "+2%", icon: Clock, color: "text-stat-green" },
                { label: "Report Submission", value: "88%", trend: "+5%", icon: FileText, color: "text-stat-blue" },
                { label: "Avg. Evaluation", value: "4.2/5", trend: "+0.3", icon: TrendingUp, color: "text-stat-orange" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-lg bg-muted/30 text-center">
                  <m.icon className={`w-6 h-6 mx-auto mb-2 ${m.color}`} />
                  <p className="text-2xl font-bold font-display text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xs text-stat-green mt-1">{m.trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-display font-bold text-foreground mb-4">Department Distribution</h3>
            <div className="space-y-3">
              {[
                { name: "Technology & Innovation", interns: 8, mentors: 3 },
                { name: "Marketing", interns: 6, mentors: 2 },
                { name: "Operations", interns: 4, mentors: 1 },
                { name: "Data Analytics", interns: 3, mentors: 1 },
                { name: "Human Resources", interns: 2, mentors: 1 },
                { name: "Finance", interns: 1, mentors: 0 },
              ].map((d) => (
                <div key={d.name} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-48">{d.name}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(d.interns / 8) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-28 text-right">{d.interns} interns · {d.mentors} mentors</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { text: "New intern Sofia Garcia registered", time: "2h ago", type: "info" },
                { text: "Maria Reyes completed 3 evaluations", time: "4h ago", type: "success" },
                { text: "Mark Rivera flagged for low attendance", time: "1d ago", type: "warning" },
                { text: "Batch 2026-Q1 internship started", time: "3d ago", type: "info" },
                { text: "System maintenance completed", time: "5d ago", type: "info" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    a.type === "success" ? "bg-stat-green" : a.type === "warning" ? "bg-stat-orange" : "bg-stat-blue"
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Alerts</h3>
            <div className="space-y-2">
              {[
                "3 interns haven't clocked in today",
                "2 weekly evaluations overdue",
                "1 mentor has no scheduled sessions",
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-stat-orange-bg">
                  <AlertTriangle className="w-4 h-4 text-stat-orange flex-shrink-0" />
                  <p className="text-xs text-foreground">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, sub, color, bg }: {
  icon: React.ElementType; value: string; label: string; sub: string; color: string; bg: string;
}) {
  return (
    <div className={`rounded-xl p-5 border border-border ${bg} relative overflow-hidden`}>
      <div className="absolute top-4 right-0 w-24 h-24 rounded-full opacity-20" style={{ background: `hsl(var(${color}))`, filter: 'blur(30px)' }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `hsl(var(${color}) / 0.15)` }}>
        <Icon className="w-5 h-5" style={{ color: `hsl(var(${color}))` }} />
      </div>
      <p className="text-3xl font-bold text-foreground font-display">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs mt-1" style={{ color: `hsl(var(${color}))` }}>{sub}</p>
    </div>
  );
}
