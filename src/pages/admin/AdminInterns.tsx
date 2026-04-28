import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Filter, GraduationCap, MoreVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const interns = [
  { name: "Juan dela Cruz", department: "Tech & Innovation", batch: "B16", mentor: "Maria Reyes", week: 7, progress: 78, status: "On Track" },
  { name: "Ana Santos", department: "Tech & Innovation", batch: "B16", mentor: "Maria Reyes", week: 7, progress: 85, status: "On Track" },
  { name: "Mark Rivera", department: "Tech & Innovation", batch: "B15", mentor: "Maria Reyes", week: 7, progress: 45, status: "At Risk" },
  { name: "Lisa Tan", department: "Marketing", batch: "B15", mentor: "James Cruz", week: 5, progress: 62, status: "On Track" },
  { name: "Peter Lim", department: "Operations", batch: "B15", mentor: "Elena Torres", week: 5, progress: 55, status: "On Track" },
  { name: "Grace Yu", department: "Tech & Innovation", batch: "B14", mentor: "Roberto Lim", week: 3, progress: 30, status: "New" },
  { name: "David Chen", department: "Data Analytics", batch: "B14", mentor: "Michael Tan", week: 3, progress: 28, status: "New" },
  { name: "Sofia Garcia", department: "Marketing", batch: "B14", mentor: "Sarah Villanueva", week: 1, progress: 8, status: "New" },
];

const statusStyles: Record<string, string> = {
  "On Track": "text-stat-green bg-stat-green-bg",
  "At Risk": "text-destructive bg-destructive/10",
  "New": "text-stat-blue bg-stat-blue-bg",
};

export default function AdminInterns() {
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(interns[0]?.name ?? "");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(interns.map((i) => i.department)))],
    [],
  );
  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(interns.map((i) => i.status)))],
    [],
  );

  const filteredInterns = useMemo(
    () =>
      interns.filter((intern) => {
        const matchesDepartment = departmentFilter === "All" || intern.department === departmentFilter;
        const matchesStatus = statusFilter === "All" || intern.status === statusFilter;
        return matchesDepartment && matchesStatus;
      }),
    [departmentFilter, statusFilter],
  );

  const selected = useMemo(
    () => interns.find((i) => i.name === selectedName) ?? interns[0],
    [selectedName],
  );

  const recentActivityByIntern: Record<string, { text: string; when: string; type: "report" | "attendance" | "task" }[]> = {
    "Juan dela Cruz": [
      { text: "Submitted daily report", when: "Today, 11:05 AM", type: "report" },
      { text: "Clocked in", when: "Today, 7:55 AM", type: "attendance" },
      { text: "Updated assigned task status", when: "Yesterday, 4:40 PM", type: "task" },
    ],
    "Ana Santos": [
      { text: "Completed assigned task", when: "Today, 9:40 AM", type: "task" },
      { text: "Submitted daily report", when: "Yesterday, 5:10 PM", type: "report" },
    ],
  };

  const tasksByIntern: Record<string, { title: string; status: "Pending" | "In Progress" | "Completed"; due: string }[]> = {
    "Juan dela Cruz": [
      { title: "Complete TypeScript Assessment", status: "In Progress", due: "Mar 25" },
      { title: "Submit Weekly Progress Report", status: "Pending", due: "Mar 27" },
    ],
    "Ana Santos": [
      { title: "Complete TypeScript Assessment", status: "Completed", due: "Mar 25" },
      { title: "Submit Weekly Progress Report", status: "In Progress", due: "Mar 27" },
    ],
  };

  const openDetails = (name: string) => {
    setSelectedName(name);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground">Interns</h2>
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing {filteredInterns.length} of {interns.length} interns.
          </p>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Intern</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Department</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Batch</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Mentor</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Week</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Progress</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {filteredInterns.map((intern) => (
              <tr
                key={intern.name}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => openDetails(intern.name)}
              >
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {intern.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {intern.name}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{intern.department}</td>
                <td className="px-5 py-3 text-muted-foreground">{intern.batch}</td>
                <td className="px-5 py-3 text-foreground">{intern.mentor}</td>
                <td className="px-5 py-3 text-muted-foreground">{intern.week}/12</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${intern.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{intern.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[intern.status]}`}>{intern.status}</span>
                </td>
                <td className="px-5 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Intern actions"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          openDetails(intern.name);
                          toast({ title: "Intern details", description: `${intern.name} opened.` });
                        }}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast({
                            title: "Message composer",
                            description: `Composing a message to ${intern.name}.`,
                          })
                        }
                      >
                        Message intern
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          toast({
                            title: "Reassign mentor",
                            description: `Mentor reassignment for ${intern.name} opened.`,
                          })
                        }
                      >
                        Reassign mentor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast({
                            title: "Flag updated",
                            description: `${intern.name} has been flagged for review.`,
                          })
                        }
                      >
                        Flag for review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {filteredInterns.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No interns match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>
                {selected.department} · Batch {selected.batch} · Mentor: {selected.mentor}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Week
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selected.week}/12</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Status
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className={statusStyles[selected.status]}>
                    {selected.status}
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Progress
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selected.progress}%</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Program progress</p>
                <span className="text-sm font-medium text-muted-foreground">{selected.progress}%</span>
              </div>
              <Progress value={selected.progress} className="h-3" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Assigned tasks</p>
                <div className="mt-3 space-y-2">
                  {(tasksByIntern[selected.name] ?? []).map((t) => (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() =>
                        toast({
                          title: "Task opened",
                          description: t.title,
                        })
                      }
                      className="w-full text-left rounded-md border border-border/60 bg-background px-3 py-2 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.title}</p>
                          <p className="text-[11px] text-muted-foreground">Due {t.due}</p>
                        </div>
                        <Badge variant="outline">{t.status}</Badge>
                      </div>
                    </button>
                  ))}
                  {(tasksByIntern[selected.name] ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No tasks assigned yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Recent activity</p>
                <div className="mt-3 space-y-2">
                  {(recentActivityByIntern[selected.name] ?? []).map((a, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        toast({
                          title: "Activity opened",
                          description: a.text,
                        })
                      }
                      className="w-full text-left rounded-md border border-border/60 bg-background px-3 py-2 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-foreground">{a.text}</p>
                        <span className="text-[11px] text-muted-foreground">{a.when}</span>
                      </div>
                    </button>
                  ))}
                  {(recentActivityByIntern[selected.name] ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity logged yet.</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  toast({
                    title: "Message sent",
                    description: `Opened message composer for ${selected.name}.`,
                  });
                  setDetailsOpen(false);
                }}
                className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90"
              >
                Message intern
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
