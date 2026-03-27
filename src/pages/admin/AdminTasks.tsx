import { useMemo, useState } from "react";
import { CheckSquare, Clock } from "lucide-react";

type InternStatus = {
  intern: string;
  unit: string;
  batch: string;
  status: "Pending" | "In Progress" | "Completed";
  progress: number;
  updatedAt: string;
};

type AdminTask = {
  id: number;
  title: string;
  due: string;
  description: string;
  internStatuses: InternStatus[];
};

const tasks: AdminTask[] = [
  {
    id: 101,
    title: "Complete TypeScript Assessment",
    due: "Mar 25",
    description: "Program-wide technical assessment task for batch B16.",
    internStatuses: [
      { intern: "Alex Cruz", unit: "Tech Unit", batch: "B16", status: "In Progress", progress: 72, updatedAt: "Today, 10:12 AM" },
      { intern: "Bea Santos", unit: "Tech Unit", batch: "B16", status: "Completed", progress: 100, updatedAt: "Today, 9:41 AM" },
      { intern: "Lia Tan", unit: "Marketing", batch: "B15", status: "Pending", progress: 14, updatedAt: "Yesterday, 4:55 PM" },
    ],
  },
  {
    id: 102,
    title: "Submit Weekly Progress Report",
    due: "Mar 27",
    description: "Required weekly report for all interns across departments.",
    internStatuses: [
      { intern: "Marco Reyes", unit: "Operations", batch: "B15", status: "In Progress", progress: 65, updatedAt: "Today, 1:20 PM" },
      { intern: "Adrian Cole", unit: "Data Analytics", batch: "B14", status: "Pending", progress: 20, updatedAt: "Yesterday, 5:03 PM" },
      { intern: "Alex Cruz", unit: "Tech Unit", batch: "B16", status: "Completed", progress: 100, updatedAt: "Today, 11:08 AM" },
    ],
  },
];

const statusStyle: Record<InternStatus["status"], string> = {
  Pending: "bg-muted text-muted-foreground",
  "In Progress": "bg-stat-blue-bg text-stat-blue",
  Completed: "bg-stat-green-bg text-stat-green",
};

export default function AdminTasks() {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? 0);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];

  const summary = useMemo(() => {
    if (!selectedTask) return { total: 0, pending: 0, inProgress: 0, completed: 0 };
    return {
      total: selectedTask.internStatuses.length,
      pending: selectedTask.internStatuses.filter((s) => s.status === "Pending").length,
      inProgress: selectedTask.internStatuses.filter((s) => s.status === "In Progress").length,
      completed: selectedTask.internStatuses.filter((s) => s.status === "Completed").length,
    };
  }, [selectedTask]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Task Monitoring</h2>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
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
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">{selectedTask.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> Due {selectedTask.due}
                  </span>
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <Stat label="Total Interns" value={summary.total.toString()} />
                  <Stat label="Pending" value={summary.pending.toString()} />
                  <Stat label="In Progress" value={summary.inProgress.toString()} />
                  <Stat label="Completed" value={summary.completed.toString()} />
                </div>

                <div className="space-y-2">
                  {selectedTask.internStatuses.map((item) => (
                    <div key={item.intern} className="rounded-lg border border-border bg-background px-3 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.intern}</p>
                          <p className="text-[11px] text-muted-foreground">{item.unit} · Batch {item.batch}</p>
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
                  ))}
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
