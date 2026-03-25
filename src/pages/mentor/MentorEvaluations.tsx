import { ClipboardCheck, Star, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";

const internEvals = [
  {
    intern: "Juan dela Cruz", avatar: "JD",
    current: { period: "Week 7", due: "Mar 28", status: "Pending" },
    history: [
      { period: "Week 6", score: 4.5 },
      { period: "Week 4", score: 4.2 },
      { period: "Week 2", score: 3.8 },
    ],
    criteria: { Technical: 4.5, Communication: 4.3, Punctuality: 4.0, Initiative: 4.7, Teamwork: 4.4 },
  },
  {
    intern: "Ana Santos", avatar: "AS",
    current: { period: "Week 7", due: "Mar 28", status: "Pending" },
    history: [
      { period: "Week 6", score: 4.7 },
      { period: "Week 4", score: 4.5 },
      { period: "Week 2", score: 4.2 },
    ],
    criteria: { Technical: 4.8, Communication: 4.6, Punctuality: 4.5, Initiative: 4.9, Teamwork: 4.7 },
  },
  {
    intern: "Mark Rivera", avatar: "MR",
    current: { period: "Week 7", due: "Mar 28", status: "Not Started" },
    history: [
      { period: "Week 6", score: 3.2 },
      { period: "Week 4", score: 3.5 },
      { period: "Week 2", score: 3.0 },
    ],
    criteria: { Technical: 3.0, Communication: 3.5, Punctuality: 2.8, Initiative: 3.2, Teamwork: 3.5 },
  },
];

function getTrend(history: { score: number }[]) {
  if (history.length < 2) return "stable";
  return history[0].score > history[1].score ? "up" : history[0].score < history[1].score ? "down" : "stable";
}

export default function MentorEvaluations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Evaluations</h2>
          <p className="text-sm text-muted-foreground">Evaluate your interns' performance each week</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Evaluation
        </button>
      </div>

      {/* Evaluation cards per intern */}
      <div className="space-y-5">
        {internEvals.map((intern) => {
          const trend = getTrend(intern.history);
          const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
          const trendColor = trend === "up" ? "text-stat-green" : trend === "down" ? "text-destructive" : "text-muted-foreground";
          const avgScore = (Object.values(intern.criteria).reduce((a, b) => a + b, 0) / Object.values(intern.criteria).length).toFixed(1);

          return (
            <div key={intern.intern} className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {intern.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{intern.intern}</h4>
                    <p className="text-xs text-muted-foreground">{intern.current.period} evaluation · Due {intern.current.due}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">{trend === "up" ? "Improving" : trend === "down" ? "Declining" : "Stable"}</span>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-opacity ${
                    intern.current.status === "Not Started" ? 'bg-accent text-accent-foreground hover:opacity-90' : 'border border-border text-foreground hover:bg-muted'
                  }`}>
                    {intern.current.status === "Not Started" ? "Start Evaluation" : "Continue"}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 grid grid-cols-3 gap-6">
                {/* Score history chart */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Score History</p>
                  <div className="flex items-end gap-3 h-24">
                    {[...intern.history].reverse().map((h) => (
                      <div key={h.period} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-foreground">{h.score}</span>
                        <div className="w-full bg-muted rounded-t-md relative" style={{ height: '100%' }}>
                          <div
                            className="absolute bottom-0 w-full rounded-t-md bg-accent"
                            style={{ height: `${(h.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{h.period.replace("Week ", "W")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Criteria breakdown */}
                <div className="col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Latest Breakdown</p>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(intern.criteria).map(([name, score]) => (
                      <div key={name} className="text-center">
                        <div className="relative w-full aspect-square mb-1.5">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                              strokeDasharray={`${(score / 5) * 97.4} 97.4`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-foreground">{score}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: average */}
              <div className="px-6 py-3 bg-muted/20 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Overall Average</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-stat-orange fill-stat-orange" />
                  <span className="text-sm font-bold font-display text-foreground">{avgScore}/5.0</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}