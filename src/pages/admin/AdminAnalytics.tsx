import { TrendingUp, Users, Clock, FileText, Star, GraduationCap } from "lucide-react";

const metrics = [
  { label: "Avg. Attendance Rate", value: "92%", change: "+2.1%", data: [85, 88, 90, 91, 93, 92] },
  { label: "Report Submission Rate", value: "88%", change: "+5.4%", data: [78, 80, 83, 85, 87, 88] },
  { label: "Task Completion Rate", value: "76%", change: "+3.2%", data: [65, 68, 70, 72, 74, 76] },
  { label: "Avg. Evaluation Score", value: "4.2", change: "+0.3", data: [3.5, 3.7, 3.9, 4.0, 4.1, 4.2] },
];

const topPerformers = [
  { name: "Ana Santos", department: "Tech & Innovation", score: 4.7, progress: 85 },
  { name: "Juan dela Cruz", department: "Tech & Innovation", score: 4.5, progress: 78 },
  { name: "Lisa Tan", department: "Marketing", score: 4.3, progress: 72 },
  { name: "Peter Lim", department: "Operations", score: 4.1, progress: 68 },
  { name: "Grace Yu", department: "Tech & Innovation", score: 3.9, progress: 55 },
];

const weeklyData = [
  { week: "Week 1", attendance: 95, reports: 82, tasks: 60 },
  { week: "Week 2", attendance: 92, reports: 85, tasks: 65 },
  { week: "Week 3", attendance: 88, reports: 80, tasks: 68 },
  { week: "Week 4", attendance: 93, reports: 88, tasks: 72 },
  { week: "Week 5", attendance: 90, reports: 86, tasks: 70 },
  { week: "Week 6", attendance: 94, reports: 90, tasks: 76 },
  { week: "Week 7", attendance: 92, reports: 88, tasks: 78 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">Program-wide performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold font-display text-foreground">{m.value}</p>
              <span className="text-xs text-stat-green font-medium">{m.change}</span>
            </div>
            <div className="flex items-end gap-1 mt-3 h-8">
              {m.data.map((v, i) => (
                <div key={i} className="flex-1 bg-accent/30 rounded-sm relative overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-accent rounded-sm" style={{ height: `${(v / Math.max(...m.data)) * 100}%` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Weekly Trends</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-stat-green" /> Attendance</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-stat-blue" /> Reports</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-stat-orange" /> Tasks</span>
            </div>
            {weeklyData.map((w) => (
              <div key={w.week} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-16">{w.week}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-stat-green rounded-full" style={{ width: `${w.attendance}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8">{w.attendance}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-stat-blue rounded-full" style={{ width: `${w.reports}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8">{w.reports}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-stat-orange rounded-full" style={{ width: `${w.tasks}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8">{w.tasks}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.department}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-stat-orange fill-stat-orange" />
                    <span className="text-sm font-medium text-foreground">{p.score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
