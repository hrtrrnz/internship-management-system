import { useState } from "react";
import { Building2, CheckCircle2, FileText, ListTodo, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEvaluationFormWorkflow, formatEvaluationFileSize } from "@/contexts/EvaluationFormWorkflowContext";
import { useRole } from "@/contexts/RoleContext";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import {
  EvaluationPageHeader,
  EvaluationScheduleSection,
  EvaluationSectionHeader,
  EvaluationTwoColumnGrid,
  PreEvalProgressAside,
  ScheduleSectionLabel,
  ScheduleStat,
  ScheduleStatsGrid,
} from "@/components/evaluation/evaluationShared";

/** Aggregated view — prerequisite counts align with the four standard items on the intern Evaluation page. */
const cohortInterns = [
  {
    name: "Juan dela Cruz",
    mentor: "Maria Reyes",
    dept: "Tech & Innovation",
    prereqDone: 2,
    prereqTotal: 4,
    completedWorkItems: 4,
    offboarding: "Apr 18, 2026",
  },
  {
    name: "Ana Santos",
    mentor: "Maria Reyes",
    dept: "Tech & Innovation",
    prereqDone: 1,
    prereqTotal: 4,
    completedWorkItems: 2,
    offboarding: "Apr 25, 2026",
  },
  {
    name: "Mark Rivera",
    mentor: "Maria Reyes",
    dept: "Tech & Innovation",
    prereqDone: 0,
    prereqTotal: 4,
    completedWorkItems: 1,
    offboarding: "Apr 30, 2026",
  },
  {
    name: "Lisa Tan",
    mentor: "James Cruz",
    dept: "Marketing",
    prereqDone: 4,
    prereqTotal: 4,
    completedWorkItems: 5,
    offboarding: "Apr 8, 2026",
  },
  {
    name: "Peter Lim",
    mentor: "Elena Torres",
    dept: "Operations",
    prereqDone: 3,
    prereqTotal: 4,
    completedWorkItems: 3,
    offboarding: "Apr 10, 2026",
  },
  {
    name: "Sara Kim",
    mentor: "James Cruz",
    dept: "Marketing",
    prereqDone: 2,
    prereqTotal: 4,
    completedWorkItems: 2,
    offboarding: "May 5, 2026",
  },
];

const cohortSnapshot = [
  { title: "Daily reporting streaks acknowledged", detail: "Five interns at full March cycle compliance · two with gaps" },
  { title: "Learning modules completed", detail: "Mixed completion across Module 2–3; Marketing cohort ahead of Tech on quiz pass rate" },
  { title: "Unit deliverables filed", detail: "Tech & Innovation: demos + merge artifacts · Marketing: campaign packs uploaded" },
  { title: "Attendance / timesheet clean", detail: "Three open exceptions escalated to HR — visible on mentor checklists" },
];

export default function AdminEvaluations() {
  const { user } = useRole();
  const { submissions, approveSubmission, rejectSubmission } = useEvaluationFormWorkflow();
  const pendingForms = submissions.filter((s) => s.status === "pending_approval");
  const approvedForms = submissions.filter((s) => s.status === "approved");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fullyReady = cohortInterns.filter((i) => i.prereqDone >= i.prereqTotal).length;
  const total = cohortInterns.length;
  const needsAttention = cohortInterns.filter((i) => i.prereqDone < i.prereqTotal);

  const openReject = (id: string) => {
    setRejectTargetId(id);
    setRejectReason("");
    setRejectOpen(true);
  };

  const confirmReject = () => {
    if (!rejectTargetId) return;
    rejectSubmission(rejectTargetId, user.name, rejectReason);
    toast({
      title: "Evaluation form rejected",
      description: "The mentor can upload a revised file.",
    });
    setRejectOpen(false);
    setRejectTargetId(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-8">
      <EvaluationPageHeader
        title="Evaluation"
        description="Approve mentor-uploaded evaluation forms so they can be assigned to interns. Approval alone does not give interns a form — mentors choose which approved file applies to each intern."
        actions={<MockFileDownloadMenu variant="button" fileLabel="Evaluation readiness summary" />}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stat-green-bg">
              <FileText className="h-5 w-5 text-stat-green" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="font-display text-base font-bold text-foreground">Approved forms (library)</h2>
              <p className="text-xs text-muted-foreground">
                These files are cleared for use but are not active for any intern until their mentor assigns one on the Evaluation page.
              </p>
            </div>
          </div>
          {approvedForms.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
              No approved forms yet. Approve a mentor upload on the right — mentors then assign per intern.
            </p>
          ) : (
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
              {approvedForms.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-stat-green/20 bg-stat-green-bg/50 px-3 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{s.fileName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatEvaluationFileSize(s.fileSizeBytes)} · {s.uploadedByMentorName} · Approved {s.reviewedAt ?? ""} ·{" "}
                      {s.reviewedByAdminName}
                    </p>
                  </div>
                  <MockFileDownloadMenu fileLabel={s.fileName} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04] sm:p-6">
          <h2 className="font-display text-base font-bold text-foreground">Pending mentor uploads</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Approving adds the file to the mentor’s approved library; they assign it to specific interns when ready.
          </p>
          {pendingForms.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing waiting for approval.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingForms.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/15 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{s.fileName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatEvaluationFileSize(s.fileSizeBytes)} · {s.uploadedByMentorName} · {s.uploadedAt}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <MockFileDownloadMenu fileLabel={s.fileName} />
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        approveSubmission(s.id, user.name);
                        toast({
                          title: "Evaluation form approved",
                          description: `${s.fileName} — mentors can assign it to interns; interns won’t see it until assigned.`,
                        });
                      }}
                    >
                      Approve
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => openReject(s.id)}>
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) {
            setRejectTargetId(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject evaluation form?</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Optional note to mentor (e.g. wrong template version)…"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmReject}>
              Reject form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EvaluationScheduleSection
        aside={
          <PreEvalProgressAside
            title="Interns fully prerequisite-complete"
            doneCount={fullyReady}
            total={total}
            allReady={fullyReady === total}
            messageReady="Every tracked intern has cleared the standard four prerequisites — sessions can run without checklist holds."
            messagePending="Some interns still owe prerequisite steps that match what they see on their Evaluation page."
          />
        }
      >
        <ScheduleSectionLabel />
        <ScheduleStatsGrid>
          <ScheduleStat label="Evaluation window opens" value="Apr 14, 2026" />
          <ScheduleStat label="Cohort deadline" value="Apr 30, 2026" />
          <ScheduleStat label="Interns in pipeline" value={`${total} active`} icon={<User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />} />
          <ScheduleStat label="Departments" value="Tech & Innovation, Marketing, Operations" icon={<Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />} />
        </ScheduleStatsGrid>
      </EvaluationScheduleSection>

      <EvaluationTwoColumnGrid
        left={
          <section className="space-y-4">
            <EvaluationSectionHeader
              icon={CheckCircle2}
              iconClassName="text-stat-green"
              title="Completed work — cohort snapshot"
              description="High-level picture of what interns have already verified — same categories mentors and interns reference, rolled up for oversight."
            />
            <ul className="space-y-3">
              {cohortSnapshot.map((row, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]"
                >
                  <p className="font-display text-sm font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        }
        right={
          <section className="space-y-4">
            <EvaluationSectionHeader
              icon={ListTodo}
              iconClassName="text-primary"
              title="Before evaluation — interns to watch"
              description="Prerequisite progress uses the same four-item standard as the intern portal (reflection, portfolio ZIP, session booking, policy acknowledgment)."
            />
            <ul className="space-y-3">
              {needsAttention.map((i) => {
                const pct = i.prereqTotal > 0 ? (i.prereqDone / i.prereqTotal) * 100 : 0;
                return (
                  <li
                    key={i.name}
                    className="rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-foreground">{i.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {i.dept} · Mentor {i.mentor}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/90">
                          Completed work items on file · {i.completedWorkItems} · Offboarding {i.offboarding}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          i.prereqDone >= i.prereqTotal ? "bg-stat-green-bg text-stat-green" : "bg-stat-orange-bg text-stat-orange"
                        )}
                      >
                        Prerequisites {i.prereqDone}/{i.prereqTotal}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-stat-orange transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        }
      />
    </div>
  );
}
