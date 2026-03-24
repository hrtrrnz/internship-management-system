import { Trophy, Star, Award } from "lucide-react";

const accomplishments = [
  { id: 1, title: "Completed React Fundamentals Module", date: "Mar 20, 2026", type: "Learning", description: "Finished all 12 lessons and passed the final assessment with 95% score." },
  { id: 2, title: "Built Dashboard MVP", date: "Mar 18, 2026", type: "Development", description: "Designed and implemented the intern portal dashboard with responsive layout." },
  { id: 3, title: "Perfect Attendance – Week 6", date: "Mar 17, 2026", type: "Attendance", description: "Maintained 100% on-time attendance for the entire week." },
  { id: 4, title: "Led Team Standup Presentation", date: "Mar 14, 2026", type: "Leadership", description: "Presented sprint progress and demo to the development team." },
  { id: 5, title: "Resolved Critical Navigation Bug", date: "Mar 12, 2026", type: "Development", description: "Identified and fixed a routing issue affecting mobile users." },
  { id: 6, title: "Mentorship Session Completion", date: "Mar 10, 2026", type: "Learning", description: "Completed 1-on-1 mentorship session on API design best practices." },
];

const typeStyles: Record<string, string> = {
  Learning: "text-stat-blue bg-stat-blue-bg",
  Development: "text-stat-green bg-stat-green-bg",
  Attendance: "text-stat-orange bg-stat-orange-bg",
  Leadership: "text-stat-emerald bg-stat-emerald-bg",
};

export default function Accomplishments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Accomplishments</h2>
        <p className="text-sm text-muted-foreground">Your achievements and milestones throughout the internship</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stat-orange-bg">
            <Trophy className="w-5 h-5 text-stat-orange" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-foreground">6</p>
            <p className="text-xs text-muted-foreground">Total Accomplishments</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stat-green-bg">
            <Star className="w-5 h-5 text-stat-green" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-foreground">3</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stat-blue-bg">
            <Award className="w-5 h-5 text-stat-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-foreground">2</p>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {accomplishments.map((a) => (
          <div key={a.id} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-stat-orange-bg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trophy className="w-5 h-5 text-stat-orange" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{a.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeStyles[a.type]}`}>{a.type}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{a.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
