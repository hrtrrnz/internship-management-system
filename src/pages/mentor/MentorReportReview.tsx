import { useState } from "react";
import { FileText, CheckCircle, Clock, Eye, ChevronRight, MessageSquare, Send, AlertTriangle } from "lucide-react";

const reports = [
  { id: 1, intern: "Juan dela Cruz", avatar: "JD", date: "Mar 21", title: "Sprint Review & API Integration", status: "Pending Review", content: "Completed REST API integration for user module. Set up error handling and loading states. Demo'd dashboard to stakeholders during sprint review." },
  { id: 2, intern: "Ana Santos", avatar: "AS", date: "Mar 21", title: "UI Component Testing Results", status: "Pending Review", content: "Ran comprehensive tests on all shared UI components. Found and fixed 3 accessibility issues. Updated Storybook with new test results." },
  { id: 3, intern: "Mark Rivera", avatar: "MR", date: "Mar 21", title: "Database Migration Plan", status: "Pending Review", content: "Drafted migration plan for attendance and evaluation tables. Identified potential data integrity issues with the current schema." },
  { id: 4, intern: "Juan dela Cruz", avatar: "JD", date: "Mar 20", title: "Dashboard UI Implementation", status: "Reviewed", content: "Built main dashboard layout with stat cards, attendance widget, and task overview. Implemented responsive breakpoints." },
  { id: 5, intern: "Ana Santos", avatar: "AS", date: "Mar 20", title: "Auth Flow Documentation", status: "Reviewed", content: "Documented the complete authentication flow including OAuth, email verification, and password reset processes." },
  { id: 6, intern: "Lisa Tan", avatar: "LT", date: "Mar 20", title: "Marketing Campaign Analysis", status: "Reviewed", content: "Analyzed Q1 marketing campaign performance. CTR improved by 12% compared to Q4. Recommended optimizations for Q2." },
  { id: 7, intern: "Peter Lim", avatar: "PL", date: "Mar 20", title: "Operations Process Map", status: "Needs Revision", content: "Created process map for intern onboarding workflow. Missing detail on IT provisioning step." },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
  "Pending Review": { color: "text-stat-orange", bg: "bg-stat-orange-bg" },
  "Reviewed": { color: "text-stat-green", bg: "bg-stat-green-bg" },
  "Needs Revision": { color: "text-destructive", bg: "bg-destructive/10" },
};

export default function MentorReportReview() {
  const [selectedId, setSelectedId] = useState(1);
  const selected = reports.find(r => r.id === selectedId)!;
  const sc = statusConfig[selected.status];
  const pendingCount = reports.filter(r => r.status === "Pending Review").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Report Review</h2>
          <p className="text-sm text-muted-foreground">Review and provide feedback on intern daily reports</p>
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-stat-orange-bg text-stat-orange text-sm font-medium">
            <Clock className="w-4 h-4" /> {pendingCount} pending review
          </span>
        )}
      </div>

      {/* Inbox-style split view */}
      <div className="grid grid-cols-5 gap-0 bg-card rounded-xl border border-border overflow-hidden" style={{ minHeight: '540px' }}>
        {/* List panel */}
        <div className="col-span-2 border-r border-border">
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground">Inbox · {reports.length} reports</p>
          </div>
          <div className="divide-y divide-border overflow-y-auto" style={{ maxHeight: '480px' }}>
            {reports.map((r) => {
              const rsc = statusConfig[r.status];
              const isActive = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors ${isActive ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {r.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>{r.intern}</span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">{r.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{r.title}</p>
                    </div>
                  </div>
                  {r.status === "Pending Review" && (
                    <div className="w-2 h-2 rounded-full bg-stat-orange absolute right-3 top-4" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="col-span-3 flex flex-col">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {selected.avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selected.intern}</p>
                <p className="text-xs text-muted-foreground">{selected.date} · {selected.title}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{selected.status}</span>
          </div>

          <div className="flex-1 p-6">
            <div className="bg-muted/20 rounded-lg p-5">
              <p className="text-sm text-foreground leading-relaxed">{selected.content}</p>
            </div>
          </div>

          {/* Action bar */}
          <div className="px-6 py-4 border-t border-border bg-muted/10">
            {selected.status === "Pending Review" ? (
              <div className="space-y-3">
                <textarea
                  placeholder="Write your feedback..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-2 justify-end">
                  <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Request Revision
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve & Send Feedback
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-stat-green" />
                <span>This report has been {selected.status.toLowerCase()}.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}