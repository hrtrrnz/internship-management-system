import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
  CheckSquare,
  Circle,
  Clock,
  Flag,
  X,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import type { TaskItem } from "@/lib/internTasks";
import { INTERN_TASKS, internTaskCategoryStyles, getInternTaskById } from "@/lib/internTasks";

const tasks = INTERN_TASKS;

const activeColumns = [
  {
    key: "Pending",
    label: "Pending",
    subtitle: "Not started — prioritize by due date",
    icon: Circle,
    accent: "hsl(var(--muted-foreground))",
    accentBg: "bg-muted/40",
    borderAccent: "border-l-stat-orange/80",
  },
  {
    key: "In Progress",
    label: "In progress",
    subtitle: "Active work in flight",
    icon: Clock,
    accent: "hsl(var(--stat-blue))",
    accentBg: "bg-stat-blue-bg/50",
    borderAccent: "border-l-stat-blue",
  },
] as const;

const categoryStyles = internTaskCategoryStyles;

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);

  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;

  const openTask = useCallback(
    (task: TaskItem) => {
      setSelectedTask(task);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("task", String(task.id));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const closeTaskModal = useCallback(() => {
    setSelectedTask(null);
    setSearchParams(
      (prev) => {
        if (!prev.get("task")) return prev;
        const next = new URLSearchParams(prev);
        next.delete("task");
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  useEffect(() => {
    const raw = searchParams.get("task");
    if (!raw) return;
    const id = Number(raw);
    if (!Number.isFinite(id)) return;
    const t = getInternTaskById(id);
    if (t) setSelectedTask(t);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedTask || selectedTask.status === "Completed") return;
    setSubmissionNotes("");
    setSubmissionLink("");
    setStagedFiles(["Draft-Outline.docx"]);
  }, [selectedTask?.id, selectedTask?.status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Tasks</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Work assigned by your mentor. Open a task for details and submissions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Flag className="h-3.5 w-3.5" />
            {pendingCount + inProgressCount} active
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stat-orange/25 bg-stat-orange-bg/60 px-3 py-1.5 text-xs font-medium text-stat-orange">
            <Circle className="h-3.5 w-3.5" />
            {pendingCount} pending
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stat-blue/25 bg-stat-blue-bg/70 px-3 py-1.5 text-xs font-medium text-stat-blue">
            <Clock className="h-3.5 w-3.5" />
            {inProgressCount} in progress
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 border-dashed shadow-sm"
            onClick={() => setShowCompletedModal(true)}
          >
            <CheckSquare className="h-4 w-4" />
            Completed
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
              {completedTasks.length}
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {activeColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <section
              key={col.key}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card/50 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]"
            >
              <div className={cn("border-b border-border/80 px-4 py-4 sm:px-5", col.accentBg)}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm")}
                    style={{ color: col.accent }}
                  >
                    <col.icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-foreground">{col.label}</h3>
                      <span className="rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground shadow-sm ring-1 ring-border/60">
                        {colTasks.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{col.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 p-3 sm:p-4">
                {colTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => openTask(task)}
                    className={cn(
                      "group w-full rounded-xl border border-border/80 bg-background p-4 text-left shadow-sm transition-all duration-200",
                      "hover:border-primary/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "border-l-[3px]",
                      col.borderAccent
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryStyles[task.category]}`}>
                        {task.category}
                      </span>
                      {task.mentorAttachments && task.mentorAttachments.length > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <Paperclip className="h-3 w-3" />
                          {task.mentorAttachments.length}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2.5 font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{task.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1 text-[11px] font-medium tabular-nums text-muted-foreground">
                        <Clock className="h-3 w-3 shrink-0 opacity-80" />
                        Due {task.due}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground/80 transition-colors group-hover:text-primary">
                        View →
                      </span>
                    </div>
                  </button>
                ))}

                {colTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-10 text-center">
                    <p className="text-sm font-medium text-foreground">All clear</p>
                    <p className="mt-1 text-xs text-muted-foreground">No tasks in this column.</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {showCompletedModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] dark:bg-black/55"
            role="presentation"
            onClick={() => setShowCompletedModal(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="completed-tasks-title"
              className="flex max-h-[min(85vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-muted/25 px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-2">
                  <CheckSquare className="h-4 w-4 shrink-0 text-stat-green" aria-hidden />
                  <h3 id="completed-tasks-title" className="font-display text-sm font-semibold text-foreground">
                    Completed tasks
                  </h3>
                  <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground ring-1 ring-border/60">
                    {completedTasks.length}
                  </span>
                </div>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-lg" aria-label="Close" onClick={() => setShowCompletedModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                {completedTasks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No completed tasks yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {completedTasks.map((task) => (
                      <li key={task.id}>
                        <button
                          type="button"
                          onClick={() => {
                            openTask(task);
                            setShowCompletedModal(false);
                          }}
                          className="flex w-full items-start gap-3 rounded-xl border border-border/80 bg-background p-3 text-left shadow-sm transition-colors hover:border-primary/25 hover:bg-muted/20"
                        >
                          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-stat-green" aria-hidden />
                          <div className="min-w-0 flex-1">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${categoryStyles[task.category]}`}>{task.category}</span>
                            <p className="mt-1.5 font-display text-sm font-semibold text-foreground">{task.title}</p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                            <p className="mt-2 text-[11px] text-muted-foreground">Completed · due {task.due}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="shrink-0 border-t border-border/80 bg-muted/15 px-4 py-3 sm:px-5">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setShowCompletedModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <TaskDetailModal
        task={selectedTask}
        onClose={closeTaskModal}
        mode="interactive"
        interactive={{
          stagedFiles,
          setStagedFiles,
          submissionNotes,
          setSubmissionNotes,
          submissionLink,
          setSubmissionLink,
        }}
      />
    </div>
  );
}
