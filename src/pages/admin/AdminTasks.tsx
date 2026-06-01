import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  ReportBatchFilter,
  type ReportBatchFilter as BatchFilter,
} from "@/components/reports/ReportBatchFilter";
import { internInitials } from "@/lib/internRoster";
import { getAdminTaskViews } from "@/lib/taskCatalog";

const statusStyle: Record<"Pending" | "In Progress" | "Completed", string> = {
  Pending: "bg-muted text-muted-foreground",
  "In Progress": "bg-stat-blue-bg text-stat-blue",
  Completed: "bg-stat-green-bg text-stat-green",
};

export default function AdminTasks() {
  const tasks = useMemo(() => getAdminTaskViews(), []);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? 0);
  const [batchFilter, setBatchFilter] = useState<BatchFilter>("All");

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
      <h2 className="text-2xl font-display font-bold text-foreground">Task Status</h2>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 rounded-xl border border-border bg-card p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">All Tasks</p>
            <span className="text-xs text-muted-foreground">{tasks.length}</span>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => {
              const active = task.id === selectedTask?.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    toast({
                      title: "Task selected",
                      description: `${task.title} opened.`,
                    });
                  }}
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

                <ReportBatchFilter
                  value={batchFilter}
                  onChange={setBatchFilter}
                  reports={selectedTask.internStatuses}
                />
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
                      <button
                        key={item.intern}
                        type="button"
                        onClick={() =>
                          toast({
                            title: "Task status",
                            description: `${item.intern} is marked ${item.status}.`,
                          })
                        }
                        className="w-full text-left rounded-lg border border-border bg-background px-3 py-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                              {internInitials(item.intern)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.intern}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {item.unit} · Batch {item.batch}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[item.status]}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Last updated</span>
                          <span>{item.updatedAt}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-muted-foreground">
              <CheckSquare className="w-6 h-6 mb-2" />
              Select a task to view intern status.
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
