import type { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckSquare,
  Circle,
  Link2,
  Paperclip,
  Upload,
  FileText,
  ListChecks,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import type { TaskItem } from "@/lib/internTasks";
import { internTaskCategoryStyles as categoryStyles } from "@/lib/internTasks";
import { mockPreviewFile } from "@/lib/mockFilePreview";

export type TaskDetailInteractiveState = {
  stagedFiles: string[];
  setStagedFiles: Dispatch<SetStateAction<string[]>>;
  submissionNotes: string;
  setSubmissionNotes: (v: string) => void;
  submissionLink: string;
  setSubmissionLink: (v: string) => void;
};

type TaskDetailModalProps = {
  task: TaskItem | null;
  onClose: () => void;
  mode: "interactive" | "evaluation";
  interactive?: TaskDetailInteractiveState;
};

export function TaskDetailModal({ task, onClose, mode, interactive }: TaskDetailModalProps) {
  if (!task) return null;

  const allowSubmission = mode === "interactive" && interactive && task.status !== "Completed";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h3 id="task-detail-title" className="font-display text-lg font-bold text-foreground">
              Task details
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {task.status === "Completed"
                ? "Completed task — submitted files and notes on file"
                : mode === "evaluation"
                  ? "Same details as the Tasks page — submit materials from Tasks when you’re ready"
                  : "Review task details and prepare your submission"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md border border-border transition-colors hover:bg-muted"
            aria-label="Close"
          >
            <X className="mx-auto h-4 w-4 text-foreground" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${categoryStyles[task.category]}`}>{task.category}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{task.status}</span>
            </div>

            <div>
              <h4 className="text-base font-semibold text-foreground">{task.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{task.description}</p>
            </div>

            {task.mentorDescription && (
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mentor Notes</p>
                <p className="text-sm leading-relaxed text-foreground">{task.mentorDescription}</p>
              </div>
            )}

            {task.mentorAttachments && task.mentorAttachments.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mentor Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {task.mentorAttachments.map((file) => (
                    <span
                      key={file}
                      className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
                    >
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-1 text-left transition-colors hover:text-primary"
                        onClick={() => mockPreviewFile(file)}
                      >
                        <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 truncate">{file}</span>
                      </button>
                      <MockFileDownloadMenu fileLabel={file} className="h-7 w-7 shrink-0" />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-[11px] text-muted-foreground">Due Date</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{task.due}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-[11px] text-muted-foreground">Status</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{task.status}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {task.status === "Completed" ? (
            <div className="space-y-5 pb-2">
              <div>
                <h4 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                  <CheckSquare className="h-4 w-4 text-stat-green" />
                  Submitted files
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Files on record when this task was completed. These match what your mentor required for sign-off.
                </p>
              </div>

              {(task.submittedFiles?.length ?? 0) > 0 ? (
                <ul className="space-y-2">
                  {task.submittedFiles!.map((name) => (
                    <li
                      key={name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/15 px-3 py-2.5"
                    >
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left text-sm text-foreground transition-colors hover:text-primary"
                        onClick={() => mockPreviewFile(name)}
                      >
                        <FileText className="h-4 w-4 shrink-0 text-stat-blue" />
                        <span className="truncate font-medium">{name}</span>
                      </button>
                      <MockFileDownloadMenu fileLabel={name} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
                  No submitted files listed for this task.
                </p>
              )}

              {task.submittedLink ? (
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    Submitted link
                  </p>
                  <a
                    href={task.submittedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {task.submittedLink}
                  </a>
                </div>
              ) : null}

              {task.submittedNotes ? (
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submission notes</p>
                  <p className="text-sm leading-relaxed text-foreground">{task.submittedNotes}</p>
                </div>
              ) : null}
            </div>
          ) : allowSubmission && interactive ? (
            <div className="space-y-5 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                    <Upload className="h-4 w-4 text-primary" />
                    Submit materials
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">Attach files, add an optional link, and leave notes for your mentor.</p>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Drop files here</p>
                <p className="mt-1 text-xs text-muted-foreground">or use the button below to attach a file</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => interactive.setStagedFiles((prev) => [...prev, `Sample-File-${prev.length + 1}.pdf`])}
                >
                  Add sample file
                </Button>
              </div>

              {interactive.stagedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Staged files</Label>
                  <ul className="space-y-2">
                    {interactive.stagedFiles.map((name) => (
                      <li
                        key={name}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        <button
                          type="button"
                          className="flex min-w-0 flex-1 items-center gap-2 text-left text-foreground transition-colors hover:text-primary"
                          onClick={() => mockPreviewFile(name)}
                        >
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{name}</span>
                        </button>
                        <MockFileDownloadMenu fileLabel={name} className="shrink-0" />
                        <button
                          type="button"
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Remove ${name}`}
                          onClick={() => interactive.setStagedFiles((prev) => prev.filter((f) => f !== name))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted/15 p-4">
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ListChecks className="h-3.5 w-3.5" />
                  Expected deliverables
                </p>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-stat-green" />
                    <span>Primary artifact (document, deck, or export) attached above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-stat-green" />
                    <span>Brief summary of what changed and how to review it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">Optional: link to repo, Figma, or shared drive</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submission-link" className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Link (optional)
                </Label>
                <Input
                  id="submission-link"
                  value={interactive.submissionLink}
                  onChange={(e) => interactive.setSubmissionLink(e.target.value)}
                  placeholder="https://…"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submission-notes">Notes for mentor</Label>
                <Textarea
                  id="submission-notes"
                  value={interactive.submissionNotes}
                  onChange={(e) => interactive.setSubmissionNotes(e.target.value)}
                  placeholder="What you completed, where to look in your files, and any questions…"
                  rows={4}
                  className="resize-y bg-background"
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.message("Draft saved", { description: "You can keep editing and submit when ready." })}
                >
                  Save draft
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    toast.success("Submitted for review", {
                      description: "Your mentor will be able to see your materials and notes.",
                    })
                  }
                >
                  Submit for review
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              <p className="text-sm text-muted-foreground">
                Submissions and drafts are managed on the Tasks page so your mentor sees everything in one place.
              </p>
              <Button type="button" className="w-full sm:w-auto" asChild>
                <Link to={`/tasks?task=${task.id}`} onClick={onClose}>
                  Open on Tasks to complete
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
