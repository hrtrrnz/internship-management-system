import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckSquare, Circle, Clock, Flag, X, Paperclip } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Complete React module assessment",
    category: "Learning",
    due: "Mar 25",
    status: "In Progress",
    description: "Finish all required exercises and pass the Module 3 assessment.",
  },
  {
    id: 2,
    title: "Submit weekly progress report",
    category: "Reports",
    due: "Mar 24",
    status: "Pending",
    description: "Prepare and submit Week 7 accomplishments, blockers, and next steps using the mentor format.",
    mentorDescription: "Use the attached template and keep content concise but complete for the full workday.",
    mentorAttachments: ["Weekly-Report-Template.docx", "Week-7-Checklist.pdf"],
  },
  {
    id: 3,
    title: "Review API documentation",
    category: "Learning",
    due: "Mar 26",
    status: "Pending",
    description: "Read and annotate the REST API patterns guide, then list questions for mentoring sync.",
  },
  {
    id: 4,
    title: "Update project README",
    category: "Development",
    due: "Mar 28",
    status: "Pending",
    description: "Improve setup instructions, add environment variables section, and include updated screenshots.",
    mentorDescription: "Prioritize onboarding clarity and make sure setup succeeds on a clean machine.",
    mentorAttachments: ["README-Standards.md", "Screenshot-Guidelines.pdf"],
  },
  {
    id: 5,
    title: "Attend team standup",
    category: "Meetings",
    due: "Mar 24",
    status: "Completed",
    description: "Join daily standup and share progress, current blockers, and day plan.",
  },
  {
    id: 6,
    title: "Design dashboard wireframes",
    category: "Design",
    due: "Mar 22",
    status: "Completed",
    description: "Produce low-fidelity dashboard wireframes based on the agreed layout and spacing system.",
    mentorDescription: "Follow the approved layout shell and keep spacing aligned to the design grid.",
    mentorAttachments: ["Dashboard-Requirements.pdf", "Wireframe-Reference.png"],
  },
  {
    id: 7,
    title: "Fix navigation bug",
    category: "Development",
    due: "Mar 21",
    status: "Completed",
    description: "Resolve mobile sidebar issue where route changes do not automatically close navigation.",
  },
  {
    id: 8,
    title: "Prepare presentation slides",
    category: "Reports",
    due: "Mar 27",
    status: "In Progress",
    description: "Create sprint demo slides with key progress metrics, visuals, and blockers summary.",
    mentorDescription: "Use the branded deck template and include one slide for risks and mitigation.",
    mentorAttachments: ["Sprint-Demo-Deck-Template.pptx", "Brand-Guidelines.pdf"],
  },
];

const columns = [
  { key: "Pending", label: "To Do", icon: Circle, color: "--muted-foreground", borderColor: "border-muted-foreground/30" },
  { key: "In Progress", label: "In Progress", icon: Clock, color: "--stat-blue", borderColor: "border-stat-blue/30" },
  { key: "Completed", label: "Done", icon: CheckSquare, color: "--stat-green", borderColor: "border-stat-green/30" },
];

const categoryStyles: Record<string, string> = {
  Learning: "bg-stat-blue-bg text-stat-blue",
  Reports: "bg-stat-orange-bg text-stat-orange",
  Development: "bg-stat-green-bg text-stat-green",
  Design: "bg-stat-emerald-bg text-stat-emerald",
  Meetings: "bg-muted text-muted-foreground",
};

export default function Tasks() {
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[number] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Tasks</h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-medium">
            <Flag className="w-3 h-3" /> {tasks.length} total
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stat-blue-bg text-stat-blue font-medium">
            <Clock className="w-3 h-3" /> {tasks.filter((t) => t.status === "In Progress").length} in progress
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-l-[3px] bg-card border border-border`} style={{ borderLeftColor: `hsl(var(${col.color}))` }}>
                <col.icon className="w-4 h-4" style={{ color: `hsl(var(${col.color}))` }} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{colTasks.length}</span>
              </div>

              {/* Task cards */}
              {colTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="w-full text-left bg-card rounded-xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoryStyles[task.category]}`}>{task.category}</span>
                    {task.mentorAttachments && task.mentorAttachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <Paperclip className="h-3 w-3" />
                        {task.mentorAttachments.length}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.due}
                    </span>
                    {col.key === "Completed" && (
                      <CheckSquare className="w-4 h-4 text-stat-green" />
                    )}
                  </div>
                </button>
              ))}

              {colTasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedTask &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTask(null)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-border px-6 py-4">
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground">Task Preview</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Review task details before updating progress</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="h-8 w-8 rounded-md border border-border hover:bg-muted transition-colors"
                  aria-label="Close preview"
                >
                  <X className="h-4 w-4 mx-auto text-foreground" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoryStyles[selectedTask.category]}`}>{selectedTask.category}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                    {selectedTask.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-foreground">{selectedTask.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{selectedTask.description}</p>
                </div>

                {selectedTask.mentorDescription && (
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Mentor Notes</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedTask.mentorDescription}</p>
                  </div>
                )}

                {selectedTask.mentorAttachments && selectedTask.mentorAttachments.length > 0 && (
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Mentor Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.mentorAttachments.map((file) => (
                        <span
                          key={file}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
                        >
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Due Date</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{selectedTask.due}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Current Column</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{selectedTask.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
