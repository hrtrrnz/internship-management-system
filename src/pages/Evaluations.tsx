import { useCallback, useState } from "react";
import { CheckCircle2, Clock, FileText, ListTodo, Paperclip, User } from "lucide-react";
import {
  BeforeEvaluationList,
  CompletedWorkList,
  EvaluationPageHeader,
  EvaluationScheduleSection,
  EvaluationSectionHeader,
  EvaluationTwoColumnGrid,
  PreEvalProgressAside,
  ScheduleSectionLabel,
  ScheduleStat,
  ScheduleStatsGrid,
} from "@/components/evaluation/evaluationShared";
import {
  DEMO_STUDENT_INTERN_ID,
  demoInternJuanCompletedWorks,
  demoInternJuanPrerequisites,
  demoScheduleMariaReyes,
} from "@/lib/evaluationDemoData";
import {
  useEvaluationFormWorkflow,
  formatEvaluationFileSize,
  resolveEvaluationFormForIntern,
} from "@/contexts/EvaluationFormWorkflowContext";
import { cn } from "@/lib/utils";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import type { TaskItem } from "@/lib/internTasks";
import { getActiveInternTasks, getInternTaskById, internTaskCategoryStyles } from "@/lib/internTasks";
import { mockPreviewFile } from "@/lib/mockFilePreview";

export default function Evaluations() {
  const { submissions, internFormAssignments } = useEvaluationFormWorkflow();
  const [evaluationTask, setEvaluationTask] = useState<TaskItem | null>(null);
  const resolvedForm = resolveEvaluationFormForIntern(DEMO_STUDENT_INTERN_ID, submissions, internFormAssignments);
  const prerequisites = demoInternJuanPrerequisites;
  const activeInternTasks = getActiveInternTasks();

  const openLinkedOrEvaluationTask = useCallback((taskId: number) => {
    const t = getInternTaskById(taskId);
    if (t) setEvaluationTask(t);
  }, []);

  const doneCount = prerequisites.filter((p) => p.done).length;
  const totalReq = prerequisites.length;
  const allReady = doneCount === totalReq;
  const sch = demoScheduleMariaReyes;

  return (
    <div className="space-y-8">
      <EvaluationPageHeader
        title="Evaluation"
        description="Track work you’ve already finished and what’s left before your mentor conducts your evaluation. Your official evaluation form appears here only after an administrator approves your mentor’s upload and your mentor assigns that form to you."
      />

      <section
        className={cn(
          "rounded-2xl border p-5 shadow-sm ring-1 sm:p-6",
          resolvedForm
            ? "border-stat-green/25 bg-stat-green-bg/80 ring-stat-green/10"
            : "border-stat-orange/25 bg-stat-orange-bg/50 ring-stat-orange/10"
        )}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              resolvedForm ? "bg-stat-green-bg" : "bg-stat-orange-bg"
            )}
          >
            <FileText className={cn("h-5 w-5", resolvedForm ? "text-stat-green" : "text-stat-orange")} aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-display text-base font-bold text-foreground">
                {resolvedForm ? "Official evaluation form assigned" : "No evaluation form assigned yet"}
              </h2>
              {resolvedForm ? <MockFileDownloadMenu fileLabel={resolvedForm.fileName} /> : null}
            </div>
            {resolvedForm ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Your mentor assigned this approved document for your evaluation:{" "}
                  <button
                    type="button"
                    className="font-semibold text-foreground underline-offset-2 hover:text-primary hover:underline"
                    onClick={() => mockPreviewFile(resolvedForm.fileName)}
                  >
                    {resolvedForm.fileName}
                  </button>{" "}
                  ({formatEvaluationFileSize(resolvedForm.fileSizeBytes)}). Complete your checklist below before the planned session.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Admin approved {resolvedForm.approvedAt} · {resolvedForm.approvedByAdminName} · Uploaded by mentor{" "}
                  {resolvedForm.uploadedByMentorName}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Administrators only green-light evaluation files; your mentor must choose which approved form applies to you before it
                shows up here. You can still complete completed work and prerequisites while you wait.
              </p>
            )}
          </div>
        </div>
      </section>

      <EvaluationScheduleSection
        aside={
          <PreEvalProgressAside
            title="Pre-evaluation checklist"
            doneCount={doneCount}
            total={totalReq}
            allReady={allReady}
            messageReady="Everything required beforehand is done. Show up prepared for your session."
            messagePending="Finish the remaining items below so your evaluation can proceed without holds."
          />
        }
      >
        <ScheduleSectionLabel />
        <ScheduleStatsGrid>
          <ScheduleStat
            label="Mentor"
            value={sch.evaluator}
            icon={<User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
          />
          <ScheduleStat label="Eval window opens" value={sch.evaluationWindowOpens} />
          <ScheduleStat label="Planned session" value={sch.plannedSession} />
          <ScheduleStat label="Program end" value={sch.offboardingDate} />
        </ScheduleStatsGrid>
      </EvaluationScheduleSection>

      <EvaluationTwoColumnGrid
        left={
          <section className="space-y-4">
            <EvaluationSectionHeader
              icon={CheckCircle2}
              iconClassName="text-stat-green"
              title="Completed work"
              description="Verified deliverables and milestones counted toward your internship record."
            />
            <CompletedWorkList items={[...demoInternJuanCompletedWorks]} />
          </section>
        }
        right={
          <section className="space-y-8">
            <div className="space-y-4">
              <EvaluationSectionHeader
                icon={Clock}
                iconClassName="text-stat-blue"
                title="Active internship tasks"
                description="Open any task for the same details as the Tasks page. Finish uploads and submissions there so your mentor sees everything in one place."
              />
              <ul className="space-y-2">
                {activeInternTasks.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setEvaluationTask(t)}
                      className={cn(
                        "group flex w-full flex-col gap-2 rounded-xl border border-border/80 bg-card p-4 text-left shadow-sm ring-1 ring-black/[0.02] transition-colors",
                        "hover:border-primary/30 hover:bg-muted/20 dark:ring-white/[0.03]"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${internTaskCategoryStyles[t.category]}`}>
                          {t.category}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">{t.status}</span>
                      </div>
                      <p className="font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary">{t.title}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0 opacity-80" />
                          Due {t.due}
                        </span>
                        {t.mentorAttachments && t.mentorAttachments.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            {t.mentorAttachments.length} files
                          </span>
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <EvaluationSectionHeader
                icon={ListTodo}
                iconClassName="text-primary"
                title="Before evaluation"
                description="Complete these while waiting for your scheduled session. Your mentor may add organization-specific items in Messages or Tasks."
              />
              <BeforeEvaluationList items={prerequisites} onSelectLinkedTask={openLinkedOrEvaluationTask} />
            </div>
          </section>
        }
      />

      <TaskDetailModal task={evaluationTask} onClose={() => setEvaluationTask(null)} mode="evaluation" />
    </div>
  );
}
