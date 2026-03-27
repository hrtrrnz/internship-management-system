import { TrendingUp, Star, BarChart3, PieChart } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const weeklyTrend = [
  { week: "W1", attendance: 95, reports: 82, tasks: 60 },
  { week: "W2", attendance: 92, reports: 85, tasks: 65 },
  { week: "W3", attendance: 88, reports: 80, tasks: 68 },
  { week: "W4", attendance: 93, reports: 88, tasks: 72 },
  { week: "W5", attendance: 90, reports: 86, tasks: 70 },
  { week: "W6", attendance: 94, reports: 90, tasks: 76 },
  { week: "W7", attendance: 92, reports: 88, tasks: 78 },
];

const deptPerformance = [
  { dept: "Tech", attendance: 94, tasks: 82, evals: 4.5 },
  { dept: "Marketing", attendance: 90, tasks: 75, evals: 4.3 },
  { dept: "Operations", attendance: 88, tasks: 70, evals: 4.1 },
  { dept: "Data", attendance: 92, tasks: 68, evals: 3.9 },
  { dept: "HR", attendance: 95, tasks: 65, evals: 4.4 },
  { dept: "Finance", attendance: 85, tasks: 60, evals: 4.0 },
];

const radarData = [
  { metric: "Attendance", value: 92 },
  { metric: "Reports", value: 88 },
  { metric: "Tasks", value: 76 },
  { metric: "Evaluations", value: 84 },
  { metric: "Modules", value: 65 },
];

const topPerformers = [
  { name: "Ana Santos", dept: "Tech & Innovation", score: 4.7, progress: 85 },
  { name: "Juan dela Cruz", dept: "Tech & Innovation", score: 4.5, progress: 78 },
  { name: "Lisa Tan", dept: "Marketing", score: 4.3, progress: 72 },
  { name: "Peter Lim", dept: "Operations", score: 4.1, progress: 68 },
  { name: "Grace Yu", dept: "Tech & Innovation", score: 3.9, progress: 55 },
];

const metrics = [
  { label: "Attendance Rate", value: "92%", change: "+2.1%", color: "--stat-green" },
  { label: "Report Submission", value: "88%", change: "+5.4%", color: "--stat-blue" },
  { label: "Task Completion", value: "76%", change: "+3.2%", color: "--stat-orange" },
  { label: "Avg. Evaluation", value: "4.2", change: "+0.3", color: "--stat-emerald" },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Analytics</h2>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <span className="text-xs font-medium" style={{ color: `hsl(var(${m.color}))` }}>{m.change}</span>
            </div>
            <p className="text-3xl font-bold font-display text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground">Weekly Trends</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded bg-stat-green" /> Attendance</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded bg-stat-blue" /> Reports</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded bg-stat-orange" /> Tasks</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
              <Area type="monotone" dataKey="attendance" stroke="hsl(var(--stat-green))" fill="hsl(var(--stat-green) / 0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="reports" stroke="hsl(var(--stat-blue))" fill="hsl(var(--stat-blue) / 0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="tasks" stroke="hsl(var(--stat-orange))" fill="hsl(var(--stat-orange) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Program Health</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Bar chart: department performance */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptPerformance} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
              <Bar dataKey="attendance" fill="hsl(var(--stat-green))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tasks" fill="hsl(var(--stat-blue))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top performers */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-stat-orange-bg text-stat-orange' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.dept}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-stat-orange fill-stat-orange" />
                    <span className="text-sm font-bold text-foreground">{p.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
