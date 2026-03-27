import { Trophy, Star, Award, Zap } from "lucide-react";

const accomplishments = [
  { id: 1, title: "Completed React Fundamentals Module", date: "Mar 20, 2026", type: "Learning", description: "Finished all 12 lessons and passed the final assessment with 95% score.", badge: "🎓" },
  { id: 2, title: "Built Dashboard MVP", date: "Mar 18, 2026", type: "Development", description: "Designed and implemented the intern portal dashboard with responsive layout.", badge: "🚀" },
  { id: 3, title: "Perfect Attendance – Week 6", date: "Mar 17, 2026", type: "Attendance", description: "Maintained 100% on-time attendance for the entire week.", badge: "⭐" },
  { id: 4, title: "Led Team Standup Presentation", date: "Mar 14, 2026", type: "Leadership", description: "Presented sprint progress and demo to the development team.", badge: "🎤" },
  { id: 5, title: "Resolved Critical Navigation Bug", date: "Mar 12, 2026", type: "Development", description: "Identified and fixed a routing issue affecting mobile users.", badge: "🐛" },
  { id: 6, title: "Mentorship Session Completion", date: "Mar 10, 2026", type: "Learning", description: "Completed 1-on-1 mentorship session on API design best practices.", badge: "💡" },
];

const typeColors: Record<string, string> = {
  Learning: "--stat-blue",
  Development: "--stat-green",
  Attendance: "--stat-orange",
  Leadership: "--stat-emerald",
};

export default function Accomplishments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Accomplishments</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="col-span-2">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-0">
              {accomplishments.map((a, i) => {
                const colorVar = typeColors[a.type];
                return (
                  <div key={a.id} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Timeline node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-[3px] border-card"
                        style={{ background: `hsl(var(${colorVar}) / 0.15)` }}
                      >
                        {a.badge}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow relative">
                      {/* Arrow */}
                      <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-border" />
                      <div className="absolute left-[-7px] top-4 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-card" />

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{a.title}</h4>
                          <span className="text-xs text-muted-foreground">{a.date}</span>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                          style={{
                            color: `hsl(var(${colorVar}))`,
                            background: `hsl(var(${colorVar}) / 0.1)`,
                          }}
                        >
                          {a.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Achievement Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-stat-orange-bg">
                <Trophy className="w-5 h-5 text-stat-orange mx-auto mb-1" />
                <p className="text-xl font-bold font-display text-foreground">6</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-stat-green-bg">
                <Star className="w-5 h-5 text-stat-green mx-auto mb-1" />
                <p className="text-xl font-bold font-display text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground">This Month</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-stat-blue-bg">
                <Award className="w-5 h-5 text-stat-blue mx-auto mb-1" />
                <p className="text-xl font-bold font-display text-foreground">2</p>
                <p className="text-[10px] text-muted-foreground">Badges</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-stat-emerald-bg">
                <Zap className="w-5 h-5 text-stat-emerald mx-auto mb-1" />
                <p className="text-xl font-bold font-display text-foreground">4</p>
                <p className="text-[10px] text-muted-foreground">Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">By Category</h3>
            <div className="space-y-3">
              {Object.entries(typeColors).map(([type, color]) => {
                const count = accomplishments.filter(a => a.type === type).length;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{type}</span>
                      <span className="font-medium text-foreground">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(count / accomplishments.length) * 100}%`, background: `hsl(var(${color}))` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-primary rounded-xl p-5 text-primary-foreground">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-display font-bold text-lg">Keep it up!</h3>
            <p className="text-sm opacity-80 mt-1">You're on a 4-week achievement streak. Complete 2 more tasks to earn the "Consistent Performer" badge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
