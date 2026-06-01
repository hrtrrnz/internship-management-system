import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Clock, Plus } from "lucide-react";
import { AssignTaskDialog } from "@/components/mentor/AssignTaskDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMentorTaskViews } from "@/lib/taskCatalog";
import { internInitials } from "@/lib/internRoster";

type BatchFilter = "All" | "B14" | "B15" | "B16";

const batchTabs: { id: BatchFilter; label: string }[] = [
  { id: "All", label: "All interns" },
  { id: "B16", label: "Batch 16" },
  { id: "B15", label: "Batch 15" },
  { id: "B14", label: "Batch 14" },
];

const statusStyle: Record<"Pending" | "In Progress" | "Completed", string> = {
  Pending: "bg-muted text-muted-foreground",
  "In Progress": "bg-stat-blue-bg text-stat-blue",
  Completed: "bg-stat-green-bg text-stat-green",
};

export default function MentorTaskAssignments() {
  const tasks = useMemo(() => getMentorTaskViews(), []);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? 0);
  const [batchFilter, setBatchFilter] = useState<BatchFilter>("All");
  const [assignOpen, setAssignOpen] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];

  useEffect(() => {
    setBatchFilter("All");
  }, [selectedTaskId]);

  const filteredInternStatuses = useMemo(() => {
    if (!selectedTask) return [];
    if (batchFilter === "All") return selectedTask.internStatuses;
    return selectedTask.internStatuses.filter((s) => s.batch === batchFilter);
  }, [selectedTask, batchFilter]);

  const summary = useMemo(() => {
    return {
      total: filteredInternStatuses.length,
      pending: filteredInternStatuses.filter((s) => s.status === "Pending").length,
      inProgress: filteredInternStatuses.filter((s) => s.status === "In Progress").length,
      completed: filteredInternStatuses.filter((s) => s.status === "Completed").length,
    };
  }, [filteredInternStatuses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground">Task Assignments</h2>
        <Button
          type="button"
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => setAssignOpen(true)}
        >
          <Plus className="w-4 h-4" /> Assign Task
        </Button>
      </div>

      <AssignTaskDialog open={assignOpen} onOpenChange={setAssignOpen} />

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 rounded-xl border border-border bg-card p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">All Assigned Tasks</p>
            <span className="text-xs text-muted-foreground">{tasks.length}</span>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => {
              const active = task.id === selectedTask?.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    active ? "border-primary/40 bg-primary/5" : "border-border bg-background hover:bg-muted/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{task.internStatuses.length} interns</span>
                    <span>Due {task.due}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-border bg-card">
          {selectedTask ? (
            <>
              <div className="border-b border-border px-5 py-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">{selectedTask.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> Due {selectedTask.due}
                  </span>
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Filter interns by batch"
                >
                  {batchTabs.map((tab) => {
                    const selected = batchFilter === tab.id;
                    const count =
                      tab.id === "All"
                        ? selectedTask.internStatuses.length
                        : selectedTask.internStatuses.filter((s) => s.batch === tab.id).length;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setBatchFilter(tab.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        )}
                      >
                        {tab.label}
                        <span className="ml-1.5 tabular-nums opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <Stat label="Total Interns" value={summary.total.toString()} />
                  <Stat label="Pending" value={summary.pending.toString()} />
                  <Stat label="In Progress" value={summary.inProgress.toString()} />
                  <Stat label="Completed" value={summary.completed.toString()} />
                </div>

                <div className="space-y-2">
                  {filteredInternStatuses.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No interns in this batch for this task.
                    </p>
                  ) : (
                    filteredInternStatuses.map((item) => (
                      <div key={item.intern} className="rounded-lg border border-border bg-background px-3 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                              {internInitials(item.intern)}
                            </div>
                            <p className="text-sm font-medium text-foreground">{item.intern}</p>
                            <p className="text-[11px] text-muted-foreground">Batch {item.batch}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[item.status]}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${item.progress}%` }} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{item.progress}% progress</span>
                          <span>{item.updatedAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-muted-foreground">
              <CheckSquare className="w-6 h-6 mb-2" />
              Select a task to view intern progress.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
