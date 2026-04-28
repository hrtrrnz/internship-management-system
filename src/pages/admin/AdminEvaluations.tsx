import { Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const evaluations = [
  { intern: "Ana Santos", mentor: "Maria Reyes", result: "Passed", date: "Apr 10, 2026", status: "Completed", dept: "Tech & Innovation", offboarding: "Apr 12, 2026" },
  { intern: "Juan dela Cruz", mentor: "Maria Reyes", result: "Passed", date: "Apr 15, 2026", status: "Completed", dept: "Tech & Innovation", offboarding: "Apr 18, 2026" },
  { intern: "Lisa Tan", mentor: "James Cruz", result: "Passed", date: "Apr 5, 2026", status: "Completed", dept: "Marketing", offboarding: "Apr 8, 2026" },
  { intern: "Peter Lim", mentor: "Elena Torres", result: "Failed", date: "Apr 7, 2026", status: "Completed", dept: "Operations", offboarding: "Apr 10, 2026" },
  { intern: "Mark Rivera", mentor: "Maria Reyes", result: "Pending", date: "", status: "Pending", dept: "Tech & Innovation", offboarding: "Apr 30, 2026" },
  { intern: "Sara Kim", mentor: "James Cruz", result: "Pending", date: "", status: "Pending", dept: "Marketing", offboarding: "May 5, 2026" },
];

const completed = evaluations.filter(e => e.status === "Completed");
const pending = evaluations.filter(e => e.status === "Pending");
const passedCount = completed.filter((e) => e.result === "Passed").length;
const failedCount = completed.filter((e) => e.result === "Failed").length;
const passRate = completed.length > 0 ? Math.round((passedCount / completed.length) * 100) : 0;

const distribution = [
  { label: "Passed", count: passedCount, color: "--stat-green" },
  { label: "Failed", count: failedCount, color: "--destructive" },
];

export default function AdminEvaluations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Final Evaluations</h2>
        </div>
        <button
          type="button"
          onClick={() =>
            toast({
              title: "Export started",
              description: "Evaluation summary download is being prepared.",
            })
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
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
                  strokeDasharray={`${(passRate / 100) * 97.4} 97.4`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-stat-orange mb-0.5" />
                <span className="text-xl font-bold font-display text-foreground">{passRate}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">Pass Rate</p>
            <p className="text-xs text-muted-foreground">{passedCount} of {completed.length} completed</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-3">Outcome Distribution</h3>
            <div className="space-y-2.5">
              {distribution.map((d) => {
                const maxCount = Math.max(...distribution.map(x => x.count));
                return (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">{d.label}</span>
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
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <XCircle className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-lg font-bold font-display text-foreground">{failedCount}</p>
              <p className="text-[10px] text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>

        {/* Right: Evaluation list */}
        <div className="col-span-2 space-y-3">
          {completed.sort((a, b) => (a.result === "Passed" ? -1 : 1)).map((e, i) => (
            <button
              key={`${e.intern}`}
              type="button"
              onClick={() =>
                toast({
                  title: "Evaluation details",
                  description: `${e.intern} is marked ${e.result}.`,
                })
              }
              className="w-full text-left bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  e.result === "Passed" ? "text-stat-green bg-stat-green-bg" : "text-destructive bg-destructive/10"
                }`}>
                  {e.result}
                </span>
              </div>
            </button>
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
