import { ClipboardCheck, Star, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const evaluation = {
  status: "pending" as "pending" | "completed",
  scheduledDate: "Apr 15, 2026",
  offboardingDate: "Apr 18, 2026",
  evaluator: "Maria Reyes",
  completedData: null as null | {
    date: string;
    score: number;
    summary: string;
    criteria: { name: string; score: number }[];
    strengths: string[];
    improvements: string[];
    recommendation: string;
  },
};

// Simulating a completed evaluation for demo
const completedEval = {
  status: "completed" as const,
  scheduledDate: "Apr 15, 2026",
  offboardingDate: "Apr 18, 2026",
  evaluator: "Maria Reyes",
  date: "Apr 15, 2026",
  score: 4.38,
  summary: "Juan has shown exceptional growth throughout the internship program. His technical skills improved significantly, and he consistently demonstrated strong initiative and collaboration.",
  criteria: [
    { name: "Technical Skills", score: 4.3 },
    { name: "Communication", score: 4.5 },
    { name: "Punctuality", score: 4.0 },
    { name: "Initiative", score: 4.7 },
    { name: "Teamwork", score: 4.4 },
  ],
  strengths: [
    "Strong problem-solving ability in React & TypeScript",
    "Excellent collaboration with cross-functional teams",
    "Proactive in taking on additional responsibilities",
  ],
  improvements: [
    "Documentation could be more thorough",
    "Time estimation for complex tasks needs refinement",
  ],
  recommendation: "Highly recommended for a full-time junior developer position.",
};

export default function Evaluations() {
  const isCompleted = true; // Toggle for demo
  const eval_ = isCompleted ? completedEval : evaluation;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Final Evaluation</h2>
      </div>

      {/* Status banner */}
      <div className={`rounded-xl border p-4 flex items-center gap-4 ${
        isCompleted ? 'bg-stat-green/5 border-stat-green/20' : 'bg-stat-orange/5 border-stat-orange/20'
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-stat-green flex-shrink-0" />
        ) : (
          <Clock className="w-5 h-5 text-stat-orange flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {isCompleted ? "Evaluation Completed" : "Evaluation Scheduled"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isCompleted
              ? `Completed on ${completedEval.date} by ${completedEval.evaluator}`
              : `Scheduled for ${evaluation.scheduledDate} · Offboarding on ${evaluation.offboardingDate}`
            }
          </p>
        </div>
        {!isCompleted && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-stat-orange/10 text-stat-orange">
            {Math.ceil((new Date(evaluation.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
          </span>
        )}
      </div>

      {isCompleted ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Overall score + criteria */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="w-28 h-28 mx-auto relative mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--stat-orange))" strokeWidth="2.5"
                    strokeDasharray={`${(completedEval.score / 5) * 97.4} 97.4`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Star className="w-4 h-4 text-stat-orange fill-stat-orange mb-0.5" />
                  <span className="text-2xl font-bold font-display text-foreground">{completedEval.score}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">Overall Score</p>
              <p className="text-xs text-muted-foreground">out of 5.0</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-stat-green" />
                <h3 className="font-display font-bold text-sm text-foreground">Criteria Breakdown</h3>
              </div>
              <div className="space-y-3">
                {completedEval.criteria.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground text-xs">{c.name}</span>
                      <span className="font-medium text-foreground text-xs">{c.score}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${(c.score / 5) * 100}%`,
                        background: c.score >= 4.5 ? 'hsl(var(--stat-green))' : c.score >= 4.0 ? 'hsl(var(--stat-blue))' : 'hsl(var(--stat-orange))'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary, strengths, improvements */}
          <div className="col-span-2 space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground mb-2">Evaluation Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{completedEval.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-bold text-foreground mb-3 text-sm">Key Strengths</h3>
                <ul className="space-y-2">
                  {completedEval.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-stat-green mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-bold text-foreground mb-3 text-sm">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {completedEval.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-stat-orange mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
              <h3 className="font-display font-bold text-foreground mb-1 text-sm">Mentor's Recommendation</h3>
              <p className="text-sm text-muted-foreground italic">"{completedEval.recommendation}"</p>
              <p className="text-xs text-muted-foreground mt-2">— {completedEval.evaluator}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-10 text-center">
          <ClipboardCheck className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-display font-bold text-foreground mb-1">Evaluation Not Yet Available</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your final evaluation will be conducted by your mentor before your offboarding date. You'll be able to view your results here once it's completed.
          </p>
        </div>
      )}
    </div>
  );
}
