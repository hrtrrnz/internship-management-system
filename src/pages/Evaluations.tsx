import { ClipboardCheck, Star, TrendingUp } from "lucide-react";

const evaluations = [
  { id: 1, period: "Week 6", date: "Mar 17, 2026", score: 4.5, evaluator: "Maria Reyes", comments: "Excellent progress in React development. Shows strong initiative." },
  { id: 2, period: "Week 4", date: "Mar 3, 2026", score: 4.2, evaluator: "Maria Reyes", comments: "Good collaboration skills. Needs to improve documentation habits." },
  { id: 3, period: "Week 2", date: "Feb 17, 2026", score: 3.8, evaluator: "Maria Reyes", comments: "Adapting well to the team. Strong learning curve on TypeScript." },
];

const criteria = [
  { name: "Technical Skills", score: 4.3 },
  { name: "Communication", score: 4.5 },
  { name: "Punctuality", score: 4.0 },
  { name: "Initiative", score: 4.7 },
  { name: "Teamwork", score: 4.4 },
];

export default function Evaluations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Evaluations</h2>
        <p className="text-sm text-muted-foreground">Performance reviews and feedback from your mentor</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {evaluations.map((e) => (
            <div key={e.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-stat-blue" />
                  <h4 className="font-semibold text-foreground">{e.period} Evaluation</h4>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-stat-orange fill-stat-orange" />
                  <span className="text-sm font-bold text-foreground">{e.score}/5.0</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{e.comments}</p>
              <p className="text-xs text-muted-foreground">By {e.evaluator} · {e.date}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-stat-green" />
              <h3 className="font-display font-bold text-foreground">Performance</h3>
            </div>
            <div className="space-y-3">
              {criteria.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="font-medium text-foreground">{c.score}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(c.score / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Overall Average</span>
              <span className="text-lg font-bold font-display text-foreground">4.38</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
