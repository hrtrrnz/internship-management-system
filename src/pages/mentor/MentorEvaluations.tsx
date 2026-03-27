import { Star, Plus, CheckCircle2, Clock, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const interns = [
  {
    name: "Juan dela Cruz", avatar: "JD", offboardingDate: "Apr 18, 2026",
    status: "completed" as const,
    evaluation: {
      date: "Apr 15, 2026", score: 4.38,
      criteria: { Technical: 4.3, Communication: 4.5, Punctuality: 4.0, Initiative: 4.7, Teamwork: 4.4 },
      strengths: ["Strong React & TypeScript skills", "Excellent teamwork"],
      improvements: ["Documentation habits", "Time estimation"],
      recommendation: "Highly recommended for a junior developer role.",
    },
  },
  {
    name: "Ana Santos", avatar: "AS", offboardingDate: "Apr 25, 2026",
    status: "scheduled" as const,
    scheduledDate: "Apr 22, 2026",
    evaluation: null,
  },
  {
    name: "Mark Rivera", avatar: "MR", offboardingDate: "Apr 30, 2026",
    status: "not_started" as const,
    evaluation: null,
  },
];

export default function MentorEvaluations() {
  const [selected, setSelected] = useState(interns[0].name);
  const intern = interns.find(i => i.name === selected)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Final Evaluations</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Intern list */}
        <div className="space-y-3">
          {interns.map((i) => (
            <button
              key={i.name}
              onClick={() => setSelected(i.name)}
              className={`w-full text-left bg-card rounded-xl border p-4 flex items-center gap-3 transition-all ${
                selected === i.name ? 'border-accent shadow-sm' : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                {i.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{i.name}</p>
                <p className="text-[10px] text-muted-foreground">Offboarding: {i.offboardingDate}</p>
              </div>
              {i.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 text-stat-green flex-shrink-0" />
              ) : i.status === "scheduled" ? (
                <Clock className="w-4 h-4 text-stat-orange flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="col-span-2">
          {intern.status === "completed" && intern.evaluation ? (
            <div className="space-y-4">
              <div className="bg-stat-green/5 border border-stat-green/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-stat-green" />
                <div>
                  <p className="text-sm font-medium text-foreground">Evaluation Completed</p>
                  <p className="text-xs text-muted-foreground">Submitted on {intern.evaluation.date}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-stat-orange fill-stat-orange" />
                  <span className="text-lg font-bold font-display text-foreground">{intern.evaluation.score}/5.0</span>
                </div>
              </div>

              {/* Criteria */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-bold text-sm text-foreground mb-4">Criteria Scores</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(intern.evaluation.criteria).map(([name, score]) => (
                    <div key={name} className="text-center">
                      <div className="relative w-full aspect-square mb-1.5">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke={
                            score >= 4.5 ? 'hsl(var(--stat-green))' : score >= 4.0 ? 'hsl(var(--stat-blue))' : 'hsl(var(--stat-orange))'
                          } strokeWidth="3"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-display font-bold text-sm text-foreground mb-3">Strengths</h3>
                  <ul className="space-y-2">
                    {intern.evaluation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-stat-green mt-1.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-display font-bold text-sm text-foreground mb-3">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {intern.evaluation.improvements.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-stat-orange mt-1.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
                <h3 className="font-display font-bold text-sm text-foreground mb-1">Recommendation</h3>
                <p className="text-sm text-muted-foreground italic">"{intern.evaluation.recommendation}"</p>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-10 text-center">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-display font-bold text-foreground mb-1">
                {intern.status === "scheduled" ? "Evaluation Scheduled" : "Not Yet Scheduled"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {intern.status === "scheduled"
                  ? `Scheduled for ${(intern as any).scheduledDate}. ${intern.name}'s offboarding is on ${intern.offboardingDate}.`
                  : `Schedule and complete ${intern.name}'s final evaluation before their offboarding on ${intern.offboardingDate}.`
                }
              </p>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                {intern.status === "scheduled" ? "Start Evaluation" : "Schedule Evaluation"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
