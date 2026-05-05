import { CheckCircle2, ClipboardCheck, Clock, FileText, ListTodo, Upload, User } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEvaluationFormWorkflow, formatEvaluationFileSize } from "@/contexts/EvaluationFormWorkflowContext";
import { useRole } from "@/contexts/RoleContext";
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
  type PrerequisiteItem,
} from "@/components/evaluation/evaluationShared";
import { demoInternJuanCompletedWorks, demoInternJuanPrerequisites, demoScheduleMariaReyes } from "@/lib/evaluationDemoData";

type InternEvalCard = {
  id: string;
  name: string;
  avatar: string;
  schedule: typeof demoScheduleMariaReyes;
  completedWorks: { id: string; title: string; detail: string; completedAt: string }[];
  internPrerequisites: PrerequisiteItem[];
  mentorPrep: PrerequisiteItem[];
  sessionStatus: "ready" | "scheduled" | "not_scheduled";
};

const mentorPrepTemplate: Omit<PrerequisiteItem, "done">[] = [
  {
    id: "m1",
    title: "Review intern portfolio ZIP offline",
    detail: "Confirm artifacts align with unit expectations before the session",
    dueHint: "Before planned session",
  },
  {
    id: "m2",
    title: "Confirm attendance / HR flags cleared",
    detail: "Resolve or escalate exceptions so evaluation isn’t blocked",
    dueHint: "Same checklist interns see in Documents",
  },
];

const interns: InternEvalCard[] = [
  {
    id: "juan",
    name: "Juan dela Cruz",
    avatar: "JD",
    schedule: demoScheduleMariaReyes,
    completedWorks: [...demoInternJuanCompletedWorks],
    internPrerequisites: demoInternJuanPrerequisites,
    mentorPrep: mentorPrepTemplate.map((t, i) => ({ ...t, done: i === 0 })),
    sessionStatus: "scheduled",
  },
  {
    id: "ana",
    name: "Ana Santos",
    avatar: "AS",
    schedule: {
      evaluator: "Maria Reyes",
      evaluationWindowOpens: "Apr 21, 2026",
      plannedSession: "Apr 22, 2026 · 10:30 AM",
      offboardingDate: "Apr 25, 2026",
    },
    completedWorks: [
      {
        id: "a1",
        title: "Daily reports — March cycle",
        detail: "18 submissions · 3 awaiting acknowledgment",
        completedAt: "Mar 30, 2026",
      },
      {
        id: "a2",
        title: "Learning Module 2 · Foundations",
        detail: "Quiz passed",
        completedAt: "Mar 22, 2026",
      },
    ],
    internPrerequisites: [
      { id: "p1", title: demoInternJuanPrerequisites[0].title, detail: demoInternJuanPrerequisites[0].detail, dueHint: demoInternJuanPrerequisites[0].dueHint, done: true },
      { id: "p2", title: demoInternJuanPrerequisites[1].title, detail: demoInternJuanPrerequisites[1].detail, dueHint: demoInternJuanPrerequisites[1].dueHint, done: false },
      { id: "p3", title: demoInternJuanPrerequisites[2].title, detail: demoInternJuanPrerequisites[2].detail, dueHint: demoInternJuanPrerequisites[2].dueHint, done: false },
      { id: "p4", title: demoInternJuanPrerequisites[3].title, detail: demoInternJuanPrerequisites[3].detail, dueHint: demoInternJuanPrerequisites[3].dueHint, done: false },
    ],
    mentorPrep: mentorPrepTemplate.map((t) => ({ ...t, done: false })),
    sessionStatus: "scheduled",
  },
  {
    id: "mark",
    name: "Mark Rivera",
    avatar: "MR",
    schedule: {
      evaluator: "Maria Reyes",
      evaluationWindowOpens: "Apr 28, 2026",
      plannedSession: "—",
      offboardingDate: "Apr 30, 2026",
    },
    completedWorks: [
      {
        id: "m1",
        title: "Daily reports — partial March cycle",
        detail: "14 submissions · streak broken twice",
        completedAt: "Mar 29, 2026",
      },
    ],
    internPrerequisites: demoInternJuanPrerequisites.map((p) => ({ ...p, done: false })),
    mentorPrep: mentorPrepTemplate.map((t) => ({ ...t, done: false })),
    sessionStatus: "not_scheduled",
  },
];

export default function MentorEvaluations() {
  const { user } = useRole();
  const { submissions, uploadSubmission, internFormAssignments, setInternEvaluationFormAssignment } =
    useEvaluationFormWorkflow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formsSheetOpen, setFormsSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(interns[0].id);
  const intern = interns.find((i) => i.id === selectedId)!;

  const myUploads = useMemo(
    () => submissions.filter((s) => s.uploadedByMentorName === user.name),
    [submissions, user.name]
  );

  const myApprovedForms = useMemo(
    () => myUploads.filter((s) => s.status === "approved"),
    [myUploads]
  );

  const assignmentForIntern = internFormAssignments[intern.id] ?? null;
  const selectValue = assignmentForIntern ?? "__unassigned";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    uploadSubmission(file, user.name);
    toast.success("Evaluation form sent for admin approval.", {
      description: "After approval, assign it to each intern here — they won’t see it until you do.",
    });
  };

  const combinedBeforeEval = useMemo(() => [...intern.internPrerequisites, ...intern.mentorPrep], [intern]);
  const doneCombined = combinedBeforeEval.filter((p) => p.done).length;
  const totalCombined = combinedBeforeEval.length;
  const allReady = doneCombined === totalCombined;

  return (
    <div className="space-y-8">
      <EvaluationPageHeader
        title="Evaluation"
        description="Use the same checklist lenses your interns see: completed work, prerequisites, and session timing. Open Evaluation forms to upload one or more templates; after admin approval, assign which file applies to each intern."
        actions={
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setFormsSheetOpen(true)}>
            <FileText className="h-4 w-4" aria-hidden />
            Evaluation forms
          </Button>
        }
      />

      <Sheet open={formsSheetOpen} onOpenChange={setFormsSheetOpen}>
        <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Evaluation forms</SheetTitle>
            <SheetDescription>
              Upload multiple PDF or Word forms. Each stays pending until an administrator approves it — approval does not apply it to anyone. In the main panel, assign an approved file to each intern when it should become their official form.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex flex-1 flex-col border-t border-border/60 pt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              aria-hidden
              tabIndex={-1}
              onChange={handleFileChange}
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()} className="gap-2 self-start">
              <Upload className="h-4 w-4" aria-hidden />
              Upload another form
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">PDF or Word · you can keep several versions while admins review them.</p>
            {myUploads.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No uploads yet.</p>
            ) : (
              <ul className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
                {myUploads.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{s.fileName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatEvaluationFileSize(s.fileSizeBytes)} · Uploaded {s.uploadedAt}
                      </p>
                      {s.status === "rejected" && s.rejectReason ? (
                        <p className="mt-1 text-[11px] text-destructive">Reason: {s.rejectReason}</p>
                      ) : null}
                    </div>
                    <MockFileDownloadMenu fileLabel={s.fileName} />
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        s.status === "pending_approval" && "bg-stat-orange-bg text-stat-orange",
                        s.status === "approved" && "bg-stat-green-bg text-stat-green",
                        s.status === "rejected" && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {s.status === "pending_approval"
                        ? "Pending approval"
                        : s.status === "approved"
                          ? "Approved"
                          : "Rejected"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr]">
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Intern</p>
          {interns.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setSelectedId(i.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-left shadow-sm ring-1 ring-black/[0.02] transition-all dark:ring-white/[0.03]",
                selectedId === i.id ? "border-primary bg-primary/5 ring-primary/20" : "border-border/80 bg-card hover:border-primary/30"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i.avatar}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{i.name}</p>
                <p className="text-[10px] text-muted-foreground">Ends {i.schedule.offboardingDate}</p>
              </div>
              {i.sessionStatus === "scheduled" ? (
                <Clock className="h-4 w-4 shrink-0 text-stat-orange" aria-hidden />
              ) : i.sessionStatus === "ready" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-stat-green" aria-hidden />
              ) : (
                <ClipboardCheck className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />
              )}
            </button>
          ))}
        </aside>

        <div className="min-w-0 space-y-8">
          <p className="text-sm text-muted-foreground">
            Viewing <span className="font-semibold text-foreground">{intern.name}</span> — aligned with their intern Evaluation page.
          </p>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]">
            <Label htmlFor={`eval-form-${intern.id}`} className="text-sm font-semibold text-foreground">
              Evaluation form for this intern
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Admin approval does not assign a form by itself — pick which of your <span className="font-medium text-foreground">approved</span>{" "}
              uploads is official for {intern.name}, or leave unassigned until ready.
            </p>
            {myApprovedForms.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No approved forms yet. Use <span className="font-medium text-foreground">Evaluation forms</span> in the header to upload — then ask an administrator to approve.
              </p>
            ) : (
              <Select
                value={selectValue}
                onValueChange={(v) => {
                  const next = v === "__unassigned" ? null : v;
                  setInternEvaluationFormAssignment(intern.id, next);
                  toast.success(next ? "Official form assigned" : "Assignment cleared", {
                    description: next
                      ? `${intern.name} · ${myApprovedForms.find((x) => x.id === next)?.fileName ?? "Form"}`
                      : `${intern.name} has no official evaluation form until you assign one.`,
                  });
                }}
              >
                <SelectTrigger id={`eval-form-${intern.id}`} className="mt-3 max-w-xl">
                  <SelectValue placeholder="Choose form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unassigned">Not assigned — intern sees no official form yet</SelectItem>
                  {myApprovedForms.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.fileName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <EvaluationScheduleSection
            aside={
              <PreEvalProgressAside
                title="Checklist (intern + your prep)"
                doneCount={doneCombined}
                total={totalCombined}
                allReady={allReady}
                messageReady="Intern prerequisites and your prep items are complete — proceed with the scheduled session."
                messagePending="Resolve open checklist items together so the evaluation isn’t blocked."
              />
            }
          >
            <ScheduleSectionLabel />
            <ScheduleStatsGrid>
              <ScheduleStat label="Intern" value={intern.name} icon={<User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />} />
              <ScheduleStat label="Mentor (you)" value={intern.schedule.evaluator} />
              <ScheduleStat label="Eval window opens" value={intern.schedule.evaluationWindowOpens} />
              <ScheduleStat label="Planned session" value={intern.schedule.plannedSession} />
              <ScheduleStat label="Program end" value={intern.schedule.offboardingDate} />
            </ScheduleStatsGrid>
          </EvaluationScheduleSection>

          <EvaluationTwoColumnGrid
            left={
              <section className="space-y-4">
                <EvaluationSectionHeader
                  icon={CheckCircle2}
                  iconClassName="text-stat-green"
                  title="Completed work"
                  description="What this intern has already submitted or verified — mirrors their intern portal list."
                />
                <CompletedWorkList items={intern.completedWorks} />
              </section>
            }
            right={
              <div className="space-y-8">
                <section className="space-y-4">
                  <EvaluationSectionHeader
                    icon={ListTodo}
                    iconClassName="text-primary"
                    title="Before evaluation — intern"
                    description="Same prerequisite titles interns track; use Messages or Tasks to unblock items."
                  />
                  <BeforeEvaluationList items={intern.internPrerequisites} />
                </section>
                <section className="space-y-4">
                  <EvaluationSectionHeader
                    icon={ClipboardCheck}
                    iconClassName="text-stat-orange"
                    title="Before evaluation — your prep"
                    description="Mentor-side steps so your session matches program expectations."
                  />
                  <BeforeEvaluationList items={intern.mentorPrep} />
                </section>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
