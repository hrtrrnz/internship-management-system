import { Calendar, Plus, Video, Clock } from "lucide-react";

const upcoming = [
  { intern: "Juan dela Cruz", date: "Mar 25, 2026", time: "2:00 PM", topic: "API Design Review", type: "1-on-1" },
  { intern: "Ana Santos", date: "Mar 26, 2026", time: "10:00 AM", topic: "Code Review Session", type: "1-on-1" },
  { intern: "Mark Rivera", date: "Mar 26, 2026", time: "3:00 PM", topic: "Progress Check-in", type: "1-on-1" },
  { intern: "All Interns", date: "Mar 27, 2026", time: "9:00 AM", topic: "Weekly Team Standup", type: "Group" },
];

const past = [
  { intern: "Juan dela Cruz", date: "Mar 18, 2026", topic: "React Best Practices", duration: "45 min", notes: "Covered hooks, context, and performance optimization" },
  { intern: "Ana Santos", date: "Mar 18, 2026", topic: "Testing Strategies", duration: "30 min", notes: "Discussed unit and integration testing patterns" },
  { intern: "All Interns", date: "Mar 17, 2026", topic: "Sprint Planning", duration: "60 min", notes: "Assigned tasks for Week 7, reviewed blockers" },
  { intern: "Mark Rivera", date: "Mar 14, 2026", topic: "Performance Discussion", duration: "40 min", notes: "Discussed areas for improvement, set new goals" },
];

export default function MentorSessions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Mentorship Sessions</h2>
          <p className="text-sm text-muted-foreground">Schedule and track mentoring sessions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {upcoming.map((s, i) => (
              <div key={i} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{s.topic}</p>
                    <p className="text-xs text-muted-foreground">{s.intern}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    s.type === "Group" ? "text-stat-blue bg-stat-blue-bg" : "text-stat-green bg-stat-green-bg"
                  }`}>{s.type}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {s.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.time}</span>
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-xs text-accent font-medium hover:underline">
                  <Video className="w-3.5 h-3.5" /> Join Session
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Past Sessions</h3>
          <div className="space-y-3">
            {past.map((s, i) => (
              <div key={i} className="p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-foreground">{s.topic}</p>
                  <span className="text-xs text-muted-foreground">{s.duration}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{s.intern} · {s.date}</p>
                <p className="text-sm text-muted-foreground">{s.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
