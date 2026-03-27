import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";

const reports = [
  {
    id: 1,
    date: "Mar 21, 2026",
    status: "Submitted",
    feedback: "Great work! The API integration approach is solid.",
    hours: "8h 30m",
    highlights: "API integration, sprint review, demo",
    sections: {
      accomplishments: [
        {
          title: "User Module API Integration",
          description: "Completed REST API integration for the user module and validated main success/error flows.",
        },
        {
          title: "Resilient UI Handling",
          description: "Added loading states and error handling across key screens to improve reliability and clarity.",
        },
        {
          title: "Sprint Review Presentation",
          description: "Presented progress during sprint review and demo'd the dashboard to stakeholders.",
        },
      ],
      challenges: ["No major blockers today"],
      nextSteps: [
        "Add integration tests for the user module endpoints",
        "Polish edge-case UX for failed requests and retries",
      ],
    },
  },
  {
    id: 2,
    date: "Mar 20, 2026",
    status: "Submitted",
    feedback: "Needs more detail on testing approach.",
    hours: "9h 00m",
    highlights: "Dashboard UI, responsive polish",
    sections: {
      accomplishments: [
        {
          title: "Dashboard Core Layout",
          description: "Built the main dashboard with stat cards, attendance widget, and task overview sections.",
        },
        {
          title: "Responsive Refinements",
          description: "Improved layout behavior for tablet and mobile breakpoints for consistent usability.",
        },
      ],
      challenges: ["Time-boxed testing; need more coverage notes next time"],
      nextSteps: ["Document testing approach and add a basic regression checklist"],
    },
  },
  {
    id: 3,
    date: "Mar 19, 2026",
    status: "Submitted",
    feedback: "Approved. Schema looks well-normalized.",
    hours: "8h 45m",
    highlights: "DB schema, migrations, seed data",
    sections: {
      accomplishments: [
        {
          title: "Schema Design",
          description: "Designed normalized tables for attendance, reports, and evaluations with clear relationships.",
        },
        {
          title: "Migration and Seed Setup",
          description: "Created migration scripts and prepared seed data to support local and QA testing.",
        },
      ],
      challenges: ["Clarified naming conventions across tables to avoid ambiguity"],
      nextSteps: ["Review indexes and add constraints for data integrity"],
    },
  },
  {
    id: 4,
    date: "Mar 18, 2026",
    status: "Submitted",
    feedback: "Well documented component props.",
    hours: "9h 15m",
    highlights: "UI components, library setup",
    sections: {
      accomplishments: [
        {
          title: "Shared Component Library",
          description: "Set up common UI components (Button, Card, Input, and Table) for reuse across pages.",
        },
        {
          title: "Prop Standardization",
          description: "Standardized component props patterns to keep implementation and documentation consistent.",
        },
      ],
      challenges: ["Ensured consistent spacing/typography across components"],
      nextSteps: ["Add more components and align variants with design tokens"],
    },
  },
  {
    id: 5,
    date: "Mar 17, 2026",
    status: "Submitted",
    feedback: "Good start to the sprint.",
    hours: "8h 00m",
    highlights: "Kickoff, environment setup",
    sections: {
      accomplishments: [
        {
          title: "Environment Setup",
          description: "Prepared local development environment and installed required project dependencies.",
        },
        {
          title: "Quality Tooling",
          description: "Configured linting and formatting rules for consistent code quality.",
        },
        {
          title: "Kickoff Alignment",
          description: "Attended project kickoff and aligned with the team on sprint goals and expectations.",
        },
      ],
      challenges: ["Coordinated access and environment parity across devices"],
      nextSteps: ["Finalize local scripts and document onboarding steps"],
    },
  },
  {
    id: 6,
    date: "Mar 14, 2026",
    status: "Submitted",
    feedback: "—",
    hours: "8h 00m",
    highlights: "Late submission completed",
    sections: {
      accomplishments: [
        {
          title: "Research and Planning",
          description: "Completed project research and planning notes, then consolidated findings into the daily accomplishment report.",
        },
      ],
      challenges: ["Initial requirements were still being clarified"],
      nextSteps: ["Confirm scope details and continue with implementation tasks"],
    },
  },
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
        <p className="text-sm text-muted-foreground">One report per workday (summary of everything you did that day)</p>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-3">
        {[
          { label: "Total", value: reports.length, color: "--stat-emerald" },
          { label: "Submitted", value: reports.filter(r => r.status === "Submitted").length, color: "--stat-blue" },
          { label: "Reviewed", value: reports.filter(r => r.status === "Reviewed").length, color: "--stat-orange" },
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
                    <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{r.date}</p>
                    <div className="flex items-center gap-2 mt-1">
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
                <h3 className="font-display font-bold text-foreground text-lg">Daily Report</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selected.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStatus.bg} ${selectedStatus.color}`}>
                {selected.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            {selected.sections ? (
              <>
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

                <div className="mb-5 overflow-auto rounded-lg border border-border bg-muted/20 p-4">
                  <div className="mx-auto aspect-[1/1.4142] w-full max-w-[720px] bg-white text-black shadow-md">
                    <div className="p-[1in] font-['Arial'] text-[11pt] leading-[1.35]">
                      <p className="mb-0.5">{selected.date}</p>
                      <p className="mb-0.5">Accomplishment Report</p>
                      <p>To Whom It May Concern,</p>

                      <h4 className="mt-10 text-center text-[11pt] font-bold">Accomplishment Report</h4>

                      <ol className="mt-8 list-decimal pl-6 space-y-4">
                        {selected.sections.accomplishments.map((item) => (
                          <li key={item.title} className="leading-[1.35]">
                            <p className="font-bold">{item.title}</p>
                            <p>{item.description}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

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