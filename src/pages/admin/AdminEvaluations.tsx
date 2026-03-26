import { Star, Download, CheckCircle2, Clock, Users } from "lucide-react";

const evaluations = [
  { intern: "Ana Santos", mentor: "Maria Reyes", score: 4.7, date: "Apr 10, 2026", status: "Completed", dept: "Tech & Innovation", offboarding: "Apr 12, 2026" },
  { intern: "Juan dela Cruz", mentor: "Maria Reyes", score: 4.38, date: "Apr 15, 2026", status: "Completed", dept: "Tech & Innovation", offboarding: "Apr 18, 2026" },
  { intern: "Lisa Tan", mentor: "James Cruz", score: 4.3, date: "Apr 5, 2026", status: "Completed", dept: "Marketing", offboarding: "Apr 8, 2026" },
  { intern: "Peter Lim", mentor: "Elena Torres", score: 4.1, date: "Apr 7, 2026", status: "Completed", dept: "Operations", offboarding: "Apr 10, 2026" },
  { intern: "Mark Rivera", mentor: "Maria Reyes", score: 0, date: "", status: "Pending", dept: "Tech & Innovation", offboarding: "Apr 30, 2026" },
  { intern: "Sara Kim", mentor: "James Cruz", score: 0, date: "", status: "Pending", dept: "Marketing", offboarding: "May 5, 2026" },
];

const completed = evaluations.filter(e => e.status === "Completed");
const pending = evaluations.filter(e => e.status === "Pending");
const avgScore = (completed.reduce((a, e) => a + e.score, 0) / completed.length).toFixed(1);

const distribution = [
  { range: "4.5–5.0", count: completed.filter(e => e.score >= 4.5).length, color: "--stat-green" },
  { range: "4.0–4.4", count: completed.filter(e => e.score >= 4.0 && e.score < 4.5).length, color: "--stat-blue" },
  { range: "3.5–3.9", count: completed.filter(e => e.score >= 3.5 && e.score < 4.0).length, color: "--stat-orange" },
  { range: "Below 3.5", count: completed.filter(e => e.score < 3.5).length, color: "--destructive" },
];

export default function AdminEvaluations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Final Evaluations</h2>
          <p className="text-sm text-muted-foreground">Pre-offboarding evaluations across the program</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Stats */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-24 h-24 mx-auto relative mb-3">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-orange))" strokeWidth="3"
                  strokeDasharray={`${(parseFloat(avgScore) / 5) * 97.4} 97.4`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Star className="w-4 h-4 text-stat-orange fill-stat-orange mb-0.5" />
                <span className="text-xl font-bold font-display text-foreground">{avgScore}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">Program Average</p>
            <p className="text-xs text-muted-foreground">out of 5.0</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-3">Score Distribution</h3>
            <div className="space-y-2.5">
              {distribution.map((d) => {
                const maxCount = Math.max(...distribution.map(x => x.count));
                return (
                  <div key={d.range} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">{d.range}</span>
                    <div className="flex-1 h-5 bg-muted rounded-md overflow-hidden">
                      <div className="h-full rounded-md flex items-center pl-2" style={{
                        width: `${maxCount > 0 ? (d.count / maxCount) * 100 : 0}%`,
                        background: `hsl(var(${d.color}))`,
                        minWidth: d.count > 0 ? '20px' : '0px',
                      }}>
                        <span className="text-[10px] font-bold text-white">{d.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-stat-green mx-auto mb-1" />
              <p className="text-lg font-bold font-display text-foreground">{completed.length}</p>
              <p className="text-[10px] text-muted-foreground">Completed</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Clock className="w-5 h-5 text-stat-orange mx-auto mb-1" />
              <p className="text-lg font-bold font-display text-foreground">{pending.length}</p>
              <p className="text-[10px] text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        {/* Right: Evaluation list */}
        <div className="col-span-2 space-y-3">
          {completed.sort((a, b) => b.score - a.score).map((e, i) => (
            <div key={`${e.intern}`} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i === 0 ? 'bg-stat-orange/10 text-stat-orange' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                {e.intern.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{e.intern}</p>
                <p className="text-[10px] text-muted-foreground">{e.dept} · {e.mentor} · Offboarded {e.offboarding}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${(e.score / 5) * 100}%`,
                    background: e.score >= 4.5 ? 'hsl(var(--stat-green))' : e.score >= 4.0 ? 'hsl(var(--stat-blue))' : e.score >= 3.5 ? 'hsl(var(--stat-orange))' : 'hsl(var(--destructive))'
                  }} />
                </div>
                <div className="flex items-center gap-1 w-14">
                  <Star className="w-3.5 h-3.5 text-stat-orange fill-stat-orange" />
                  <span className="text-sm font-bold text-foreground">{e.score}</span>
                </div>
              </div>
            </div>
          ))}

          {pending.length > 0 && (
            <>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-semibold text-stat-orange">Pending Evaluations</span>
                <div className="flex-1 h-px bg-stat-orange/30" />
              </div>
              {pending.map((e) => (
                <div key={e.intern} className="bg-card rounded-xl border border-dashed border-stat-orange/30 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                    {e.intern.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{e.intern}</p>
                    <p className="text-[10px] text-muted-foreground">{e.dept} · {e.mentor} · Offboarding {e.offboarding}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-stat-orange bg-stat-orange/10">Pending</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
