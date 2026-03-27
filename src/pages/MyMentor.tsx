import { Users, MessageSquare, Calendar, Star } from "lucide-react";

export default function MyMentor() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Mentor</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold font-display mb-4">
            MR
          </div>
          <h3 className="text-lg font-semibold text-foreground">Maria Reyes</h3>
          <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
          <p className="text-xs text-muted-foreground mt-1">Technology & Innovation Department</p>
          <div className="flex items-center gap-1 mt-3">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-stat-orange fill-stat-orange" />)}
          </div>
          <button className="mt-4 w-full py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Send Message
          </button>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Upcoming Check-ins</h3>
            <div className="space-y-3">
              {[
                { date: "Mar 25, 2026", time: "2:00 PM", topic: "API Design Review" },
                { date: "Mar 28, 2026", time: "3:00 PM", topic: "Career Development Discussion" },
              ].map(s => (
                <div key={s.date} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-stat-blue" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.topic}</p>
                    <p className="text-xs text-muted-foreground">{s.date} at {s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Past Check-ins</h3>
            <div className="space-y-3">
              {[
                { date: "Mar 18, 2026", topic: "React Best Practices", notes: "Discussed component patterns and state management" },
                { date: "Mar 11, 2026", topic: "Code Review Check-in", notes: "Reviewed dashboard implementation, suggested improvements" },
                { date: "Mar 4, 2026", topic: "Onboarding & Expectations", notes: "Set internship goals and weekly milestones" },
              ].map(s => (
                <div key={s.date} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <MessageSquare className="w-5 h-5 text-stat-green mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.topic}</p>
                    <p className="text-xs text-muted-foreground">{s.notes}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
