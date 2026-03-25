import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle, ChevronRight, MessageSquare } from "lucide-react";

const reports = [
  { id: 1, date: "Mar 21, 2026", title: "Sprint Review & API Integration Progress", status: "Submitted", feedback: "Great work! The API integration approach is solid.", content: "Completed the REST API integration for the user module. Set up error handling and loading states. Participated in sprint review and demo'd the dashboard to stakeholders.", hours: "8h 30m" },
  { id: 2, date: "Mar 20, 2026", title: "Dashboard UI Implementation", status: "Submitted", feedback: "Needs more detail on testing approach.", content: "Built the main dashboard layout with stat cards, attendance widget, and task overview. Implemented responsive breakpoints for tablet and mobile.", hours: "9h 00m" },
  { id: 3, date: "Mar 19, 2026", title: "Database Schema Design & Testing", status: "Reviewed", feedback: "Approved. Schema looks well-normalized.", content: "Designed the database schema for attendance, reports, and evaluation tables. Wrote migration scripts and seed data for testing.", hours: "8h 45m" },
  { id: 4, date: "Mar 18, 2026", title: "Frontend Component Library Setup", status: "Reviewed", feedback: "Well documented component props.", content: "Set up the shared component library with Button, Card, Input, and Table components. Created Storybook stories for each component.", hours: "9h 15m" },
  { id: 5, date: "Mar 17, 2026", title: "Project Kickoff & Environment Setup", status: "Reviewed", feedback: "Good start to the sprint.", content: "Set up development environment, installed dependencies, and configured ESLint and Prettier. Attended project kickoff meeting.", hours: "8h 00m" },
  { id: 6, date: "Mar 14, 2026", title: "Research & Planning Phase", status: "Missing", feedback: "—", content: "", hours: "—" },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  Submitted: { color: "text-stat-blue", icon: Clock, bg: "bg-stat-blue-bg" },
  Reviewed: { color: "text-stat-green", icon: CheckCircle, bg: "bg-stat-green-bg" },
  Missing: { color: "text-destructive", icon: AlertTriangle, bg: "bg-destructive/10" },
};

export default function DailyReports() {
  const [selectedId, setSelectedId] = useState(1);
  const selected = reports.find(r => r.id === selectedId)!;
  const selectedStatus = statusConfig[selected.status];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Daily Reports</h2>
        <p className="text-sm text-muted-foreground">View and manage your daily report submissions</p>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-3">
        {[
          { label: "Total", value: reports.length, color: "--stat-blue" },
          { label: "Reviewed", value: reports.filter(r => r.status === "Reviewed").length, color: "--stat-green" },
          { label: "Submitted", value: reports.filter(r => r.status === "Submitted").length, color: "--stat-orange" },
          { label: "Missing", value: reports.filter(r => r.status === "Missing").length, color: "--destructive" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <span className="w-2 h-2 rounded-full" style={{ background: `hsl(var(${s.color}))` }} />
            <span className="text-sm font-medium text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Split view: list + detail */}
      <div className="grid grid-cols-5 gap-4">
        {/* Report list */}
        <div className="col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground">All Reports</p>
          </div>
          <div className="divide-y divide-border">
            {reports.map((r) => {
              const sc = statusConfig[r.status];
              const isActive = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors flex items-start gap-3 ${isActive ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30 border-l-2 border-l-transparent'}`}
                >
                  <sc.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${sc.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>{r.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.color}`}>{r.status}</span>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Report detail */}
        <div className="col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-foreground text-lg">{selected.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selected.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStatus.bg} ${selectedStatus.color}`}>
                {selected.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            {selected.content ? (
              <>
                <div className="mb-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Report Content</p>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">{selected.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Hours Logged</p>
                    <p className="text-lg font-bold font-display text-foreground">{selected.hours}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-lg font-bold font-display text-foreground">{selected.date}</p>
                  </div>
                </div>

                {selected.feedback && selected.feedback !== "—" && (
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-stat-blue" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mentor Feedback</p>
                    </div>
                    <div className="bg-stat-blue-bg rounded-lg p-4">
                      <p className="text-sm text-foreground italic">"{selected.feedback}"</p>
                      <p className="text-xs text-muted-foreground mt-2">— Maria Reyes</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="w-10 h-10 text-destructive mb-3" />
                <h4 className="font-display font-bold text-foreground">Report Missing</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">This daily report was not submitted. Please make sure to submit your reports daily.</p>
                <button className="mt-4 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Submit Late Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}