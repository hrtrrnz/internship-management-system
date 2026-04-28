import { useMemo, useState } from "react";
import { Star, Users, Mail, MoreVertical, Calendar, CheckCircle2, Clock } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mentors = [
  { name: "Maria Reyes", department: "Tech & Innovation", interns: 5, rating: 4.8, activities: 48, email: "maria.reyes@hytfoundation.org" },
  { name: "James Cruz", department: "Marketing", interns: 3, rating: 4.5, activities: 32, email: "james.cruz@hytfoundation.org" },
  { name: "Elena Torres", department: "Operations", interns: 2, rating: 4.6, activities: 28, email: "elena@hytfoundation.org" },
  { name: "Michael Tan", department: "Data Analytics", interns: 2, rating: 4.3, activities: 22, email: "michael.tan@hytfoundation.org" },
  { name: "Patricia Cruz", department: "Human Resources", interns: 1, rating: 4.4, activities: 18, email: "patricia@hytfoundation.org" },
  { name: "Roberto Lim", department: "Tech & Innovation", interns: 2, rating: 4.7, activities: 35, email: "roberto@hytfoundation.org" },
  { name: "Sarah Villanueva", department: "Marketing", interns: 3, rating: 4.2, activities: 25, email: "sarah@hytfoundation.org" },
  { name: "Antonio Reyes", department: "Finance", interns: 1, rating: 4.0, activities: 12, email: "antonio@hytfoundation.org" },
];

export default function AdminMentors() {
  const [selectedName, setSelectedName] = useState(mentors[0]?.name ?? "");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInternName, setSelectedInternName] = useState("");
  const [internDetailsOpen, setInternDetailsOpen] = useState(false);

  const selected = useMemo(
    () => mentors.find((m) => m.name === selectedName) ?? mentors[0],
    [selectedName],
  );

  const internAssignmentsByMentor: Record<string, string[]> = {
    "Maria Reyes": ["Juan dela Cruz", "Ana Santos", "Mark Rivera", "Alex Cruz", "Bea Santos"],
    "James Cruz": ["Lisa Tan", "Sara Kim", "Noah Villanueva"],
    "Elena Torres": ["Peter Lim", "Marco Reyes"],
    "Michael Tan": ["David Chen", "Renz Castillo"],
    "Patricia Cruz": ["Ivy Mendoza"],
    "Roberto Lim": ["Grace Yu", "Adrian Cole"],
    "Sarah Villanueva": ["Sofia Garcia", "Mika Sarmiento", "Lia Tan"],
    "Antonio Reyes": ["Zed Alonzo"],
  };

  const recentActivityByMentor: Record<string, { text: string; when: string; type: "review" | "eval" }[]> = {
    "Maria Reyes": [
      { text: "Reviewed 2 daily reports", when: "Today, 11:20 AM", type: "review" },
      { text: "Completed 1 evaluation", when: "Yesterday, 4:10 PM", type: "eval" },
      { text: "Reviewed assigned task statuses", when: "Yesterday, 10:05 AM", type: "review" },
    ],
    "James Cruz": [
      { text: "Assigned a new task", when: "Today, 9:40 AM", type: "review" },
      { text: "Reviewed assigned task statuses", when: "Yesterday, 3:15 PM", type: "review" },
    ],
  };

  const internInfo: Record<
    string,
    {
      department: string;
      batch: string;
      mentor: string;
      week: number;
      status: "On Track" | "At Risk" | "New";
      progress: number;
      lastUpdate: string;
    }
  > = {
    "Juan dela Cruz": { department: "Tech & Innovation", batch: "B16", mentor: "Maria Reyes", week: 7, status: "On Track", progress: 78, lastUpdate: "Today, 11:05 AM" },
    "Ana Santos": { department: "Tech & Innovation", batch: "B16", mentor: "Maria Reyes", week: 7, status: "On Track", progress: 85, lastUpdate: "Today, 9:40 AM" },
    "Mark Rivera": { department: "Tech & Innovation", batch: "B15", mentor: "Maria Reyes", week: 7, status: "At Risk", progress: 45, lastUpdate: "Yesterday, 4:40 PM" },
    "Alex Cruz": { department: "Tech & Innovation", batch: "B16", mentor: "Maria Reyes", week: 7, status: "On Track", progress: 72, lastUpdate: "Today, 10:12 AM" },
    "Bea Santos": { department: "Tech & Innovation", batch: "B16", mentor: "Maria Reyes", week: 7, status: "On Track", progress: 100, lastUpdate: "Today, 9:41 AM" },
    "Lisa Tan": { department: "Marketing", batch: "B15", mentor: "James Cruz", week: 5, status: "On Track", progress: 62, lastUpdate: "Yesterday, 5:10 PM" },
    "Sara Kim": { department: "Marketing", batch: "B14", mentor: "James Cruz", week: 2, status: "New", progress: 22, lastUpdate: "Yesterday, 2:03 PM" },
    "Noah Villanueva": { department: "Marketing", batch: "B16", mentor: "James Cruz", week: 6, status: "On Track", progress: 69, lastUpdate: "Today, 8:55 AM" },
    "Peter Lim": { department: "Operations", batch: "B15", mentor: "Elena Torres", week: 5, status: "On Track", progress: 55, lastUpdate: "Today, 8:00 AM" },
    "Marco Reyes": { department: "Operations", batch: "B15", mentor: "Elena Torres", week: 5, status: "On Track", progress: 65, lastUpdate: "Today, 1:20 PM" },
    "David Chen": { department: "Data Analytics", batch: "B14", mentor: "Michael Tan", week: 3, status: "New", progress: 28, lastUpdate: "Today, 8:20 AM" },
    "Renz Castillo": { department: "Data Analytics", batch: "B14", mentor: "Michael Tan", week: 4, status: "On Track", progress: 58, lastUpdate: "Yesterday, 3:22 PM" },
    "Ivy Mendoza": { department: "Human Resources", batch: "B14", mentor: "Patricia Cruz", week: 6, status: "On Track", progress: 74, lastUpdate: "Yesterday, 1:40 PM" },
    "Grace Yu": { department: "Tech & Innovation", batch: "B14", mentor: "Roberto Lim", week: 3, status: "New", progress: 30, lastUpdate: "Today, 7:50 AM" },
    "Adrian Cole": { department: "Data Analytics", batch: "B14", mentor: "Roberto Lim", week: 4, status: "At Risk", progress: 41, lastUpdate: "Yesterday, 5:03 PM" },
    "Sofia Garcia": { department: "Marketing", batch: "B14", mentor: "Sarah Villanueva", week: 1, status: "New", progress: 8, lastUpdate: "Today, 7:58 AM" },
    "Mika Sarmiento": { department: "Marketing", batch: "B15", mentor: "Sarah Villanueva", week: 5, status: "On Track", progress: 61, lastUpdate: "Yesterday, 11:14 AM" },
    "Lia Tan": { department: "Marketing", batch: "B15", mentor: "Sarah Villanueva", week: 5, status: "On Track", progress: 70, lastUpdate: "Today, 10:44 AM" },
    "Zed Alonzo": { department: "Finance", batch: "B14", mentor: "Antonio Reyes", week: 6, status: "On Track", progress: 60, lastUpdate: "Yesterday, 9:27 AM" },
  };

  const selectedIntern = selectedInternName ? internInfo[selectedInternName] : undefined;
  const internStatusStyles: Record<"On Track" | "At Risk" | "New", string> = {
    "On Track": "text-stat-green bg-stat-green-bg",
    "At Risk": "text-destructive bg-destructive/10",
    "New": "text-stat-blue bg-stat-blue-bg",
  };

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
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Mentors</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {mentors.map((m) => (
          <button
            key={m.name}
            type="button"
            onClick={() => openDetails(m.name)}
            className="w-full text-left bg-card rounded-xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {m.name.split(" ").map(n => n[0]).join("")}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Mentor actions"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      openDetails(m.name);
                      toast({ title: "Mentor profile", description: `${m.name} opened.` });
                    }}
                  >
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast({
                        title: "Message composer",
                        description: `Composing a message to ${m.name}.`,
                      })
                    }
                  >
                    Message mentor
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      toast({
                        title: "Intern list",
                        description: `Viewing interns assigned to ${m.name}.`,
                      })
                    }
                  >
                    View assigned interns
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      toast({
                        title: "Reminder sent",
                        description: `Sent a progress reminder to ${m.name}.`,
                      })
                    }
                  >
                    Send reminder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h4 className="font-semibold text-foreground">{m.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{m.department}</p>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3.5 h-3.5 text-stat-orange fill-stat-orange" />
              <span className="text-sm font-medium text-foreground">{m.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">· {m.activities} activities</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <Users className="w-3.5 h-3.5" /> {m.interns} active interns
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Message sent",
                  description: `Opened contact composer for ${m.name}.`,
                });
              }}
              className="w-full py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Contact
            </button>
          </button>
        ))}
      </div>

      {selected && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>
                {selected.department} · {selected.email}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Assigned interns
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selected.interns}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-4 w-4" />
                  Mentor rating
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selected.rating}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Activities logged
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selected.activities}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Department members</p>
                  <Badge variant="secondary">Interns</Badge>
                </div>
                <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">
                  {(internAssignmentsByMentor[selected.name] ?? []).map((intern) => (
                    <li
                      key={intern}
                      className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2 hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-foreground">{intern}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInternName(intern);
                          setInternDetailsOpen(true);
                        }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View
                      </button>
                    </li>
                  ))}
                  {(internAssignmentsByMentor[selected.name] ?? []).length === 0 && (
                    <li className="text-sm text-muted-foreground">No interns assigned.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Recent activity</p>
                  <Badge variant="outline">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    This week
                  </Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {(recentActivityByMentor[selected.name] ?? []).map((a, idx) => (
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
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {a.when}
                        </span>
                      </div>
                    </button>
                  ))}
                  {(recentActivityByMentor[selected.name] ?? []).length === 0 && (
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
                    title: "Reminder sent",
                    description: `Sent a progress reminder to ${selected.name}.`,
                  });
                  setDetailsOpen(false);
                }}
                className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90"
              >
                Send reminder
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedIntern && (
        <Dialog open={internDetailsOpen} onOpenChange={setInternDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedInternName}</DialogTitle>
              <DialogDescription>
                {selectedIntern.department} · Batch {selectedIntern.batch}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{selectedIntern.department}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Batch</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{selectedIntern.batch}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Mentor</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{selectedIntern.mentor}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Week</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{selectedIntern.week}/12</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Program progress</p>
                <span className="text-sm font-medium text-muted-foreground">{selectedIntern.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent" style={{ width: `${selectedIntern.progress}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className={internStatusStyles[selectedIntern.status]}>
                  {selectedIntern.status}
                </Badge>
                <p className="text-xs text-muted-foreground">Last update: {selectedIntern.lastUpdate}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Assigned tasks</p>
                <div className="mt-3 space-y-2">
                  {(tasksByIntern[selectedInternName] ?? []).map((t) => (
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
                  {(tasksByIntern[selectedInternName] ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No tasks assigned yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Recent activity</p>
                <div className="mt-3 space-y-2">
                  {(recentActivityByIntern[selectedInternName] ?? []).map((a, idx) => (
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
                  {(recentActivityByIntern[selectedInternName] ?? []).length === 0 && (
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
                    title: "Message composer",
                    description: `Opened message composer for ${selectedInternName}.`,
                  });
                  setInternDetailsOpen(false);
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
