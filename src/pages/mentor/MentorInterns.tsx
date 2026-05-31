import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  ListTodo,
  Mail,
  MessageSquare,
  MoreVertical,
  User,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useMessagesThread } from "@/contexts/MessagesThreadContext";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Intern = {
  name: string;
  unit: string;
  batch: string;
  week: number;
  progress: number;
  tasks: number;
  status: string;
  avatar: string;
  email: string;
  phone: string;
  school: string;
  startDate: string;
};

type ModalView = "profile" | "tasks" | "evaluate" | "flag";

const interns: Intern[] = [
  {
    name: "Juan dela Cruz",
    unit: "Technology & Innovation",
    batch: "B16",
    week: 7,
    progress: 78,
    tasks: 18,
    status: "On Track",
    avatar: "JD",
    email: "juan.delacruz@company.mail",
    phone: "+63 917 100 0001",
    school: "University of the Philippines",
    startDate: "Jan 6, 2026",
  },
  {
    name: "Ana Santos",
    unit: "Technology & Innovation",
    batch: "B16",
    week: 7,
    progress: 85,
    tasks: 22,
    status: "On Track",
    avatar: "AS",
    email: "ana.santos@company.mail",
    phone: "+63 917 100 0002",
    school: "Ateneo de Manila University",
    startDate: "Jan 6, 2026",
  },
  {
    name: "Mark Rivera",
    unit: "Technology & Innovation",
    batch: "B15",
    week: 7,
    progress: 45,
    tasks: 10,
    status: "Needs Attention",
    avatar: "MR",
    email: "mark.rivera@company.mail",
    phone: "+63 917 100 0003",
    school: "De La Salle University",
    startDate: "Oct 7, 2025",
  },
  {
    name: "Lisa Tan",
    unit: "Marketing",
    batch: "B15",
    week: 5,
    progress: 62,
    tasks: 14,
    status: "On Track",
    avatar: "LT",
    email: "lisa.tan@company.mail",
    phone: "+63 917 100 0004",
    school: "University of Santo Tomas",
    startDate: "Oct 7, 2025",
  },
  {
    name: "Peter Lim",
    unit: "Operations",
    batch: "B15",
    week: 5,
    progress: 55,
    tasks: 12,
    status: "On Track",
    avatar: "PL",
    email: "peter.lim@company.mail",
    phone: "+63 917 100 0005",
    school: "Mapúa University",
    startDate: "Oct 7, 2025",
  },
  {
    name: "Grace Yu",
    unit: "Technology & Innovation",
    batch: "B14",
    week: 3,
    progress: 30,
    tasks: 6,
    status: "New",
    avatar: "GY",
    email: "grace.yu@company.mail",
    phone: "+63 917 100 0006",
    school: "Adamson University",
    startDate: "Jul 7, 2025",
  },
  {
    name: "David Chen",
    unit: "Data Analytics",
    batch: "B14",
    week: 3,
    progress: 28,
    tasks: 5,
    status: "New",
    avatar: "DC",
    email: "david.chen@company.mail",
    phone: "+63 917 100 0007",
    school: "University of San Carlos",
    startDate: "Jul 7, 2025",
  },
  {
    name: "Sofia Garcia",
    unit: "Marketing",
    batch: "B14",
    week: 1,
    progress: 8,
    tasks: 2,
    status: "New",
    avatar: "SG",
    email: "sofia.garcia@company.mail",
    phone: "+63 917 100 0008",
    school: "Far Eastern University",
    startDate: "Jul 7, 2025",
  },
];

const statusStyles: Record<string, string> = {
  "On Track": "text-stat-green bg-stat-green-bg",
  "Needs Attention": "text-stat-orange bg-stat-orange-bg",
  New: "text-stat-blue bg-stat-blue-bg",
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
  "Mark Rivera": [
    { title: "API Integration Exercise", status: "In Progress", due: "Mar 24" },
    { title: "Catch-up: Daily Reports (3 missing)", status: "Pending", due: "Mar 26" },
  ],
};

const recentActivityByIntern: Record<string, { text: string; when: string }[]> = {
  "Juan dela Cruz": [
    { text: "Submitted daily report", when: "Today, 11:05 AM" },
    { text: "Clocked in", when: "Today, 7:55 AM" },
  ],
  "Ana Santos": [
    { text: "Completed assigned task", when: "Today, 9:40 AM" },
    { text: "Submitted daily report", when: "Yesterday, 5:10 PM" },
  ],
  "Mark Rivera": [
    { text: "Missed daily report deadline", when: "Yesterday, 6:00 PM" },
    { text: "Requested mentor check-in", when: "Yesterday, 2:15 PM" },
  ],
};

const batches = Array.from(new Set(interns.map((i) => i.batch))).sort((a, b) => b.localeCompare(a));

export default function MentorInterns() {
  const { role, user } = useRole();
  const { ensurePrivateThread, requestOpenFloatingChat } = useMessagesThread();
  const [activeBatch, setActiveBatch] = useState(batches[0] ?? "B16");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("profile");
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);

  const messageIntern = (internName: string) => {
    const chatId = ensurePrivateThread(user.name, internName, role);
    requestOpenFloatingChat(chatId);
    setModalOpen(false);
  };

  const filteredInterns = useMemo(
    () => interns.filter((intern) => intern.batch === activeBatch),
    [activeBatch],
  );

  const internCountByBatch = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const intern of interns) {
      counts[intern.batch] = (counts[intern.batch] ?? 0) + 1;
    }
    return counts;
  }, []);

  const openModal = (intern: Intern, view: ModalView) => {
    setSelectedIntern(intern);
    setModalView(view);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Interns</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and support interns grouped by program batch.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {batches.map((batch) => (
          <button
            key={batch}
            type="button"
            onClick={() => setActiveBatch(batch)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeBatch === batch
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Batch {batch}
            <span className="ml-1.5 text-xs opacity-80">({internCountByBatch[batch] ?? 0})</span>
          </button>
        ))}
      </div>

      {filteredInterns.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No interns in Batch {activeBatch}.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredInterns.map((intern) => (
            <div
              key={intern.name}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {intern.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{intern.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {intern.unit} · Batch {intern.batch}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-muted transition-colors"
                      aria-label={`Actions for ${intern.name}`}
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{intern.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openModal(intern, "profile")}>
                      <User className="mr-2 h-4 w-4" />
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => messageIntern(intern.name)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message intern
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal(intern, "tasks")}>
                      <ListTodo className="mr-2 h-4 w-4" />
                      View tasks
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openModal(intern, "evaluate")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule evaluation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal(intern, "flag")}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Flag for review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Week {intern.week} of 12</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${statusStyles[intern.status]}`}>
                  {intern.status}
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                <div className="h-full bg-accent rounded-full" style={{ width: `${intern.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{intern.progress}% progress</span>
                <span>{intern.tasks} tasks</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => openModal(intern, "profile")}
                  className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => messageIntern(intern.name)}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  aria-label={`Message ${intern.name}`}
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIntern && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className={cn(modalView === "profile" || modalView === "tasks" ? "max-w-3xl" : "max-w-lg")}>
            {modalView === "profile" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {selectedIntern.avatar}
                    </div>
                    {selectedIntern.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedIntern.unit} · Batch {selectedIntern.batch} · Started {selectedIntern.startDate}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Week
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {selectedIntern.week}/12
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      Status
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className={statusStyles[selectedIntern.status]}>
                        {selectedIntern.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      Progress
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">{selectedIntern.progress}%</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Contact & background</p>
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-medium text-foreground">{selectedIntern.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd className="font-medium text-foreground">{selectedIntern.phone}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">School</dt>
                      <dd className="font-medium text-foreground">{selectedIntern.school}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Program progress</p>
                    <span className="text-sm font-medium text-muted-foreground">
                      {selectedIntern.progress}%
                    </span>
                  </div>
                  <Progress value={selectedIntern.progress} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selectedIntern.tasks} tasks assigned across the internship program
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">Recent activity</p>
                  <div className="mt-3 space-y-2">
                    {(recentActivityByIntern[selectedIntern.name] ?? []).map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2"
                      >
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <span className="text-[11px] text-muted-foreground">{activity.when}</span>
                      </div>
                    ))}
                    {(recentActivityByIntern[selectedIntern.name] ?? []).length === 0 && (
                      <p className="text-sm text-muted-foreground">No activity logged yet.</p>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <button
                    type="button"
                    onClick={() => openModal(selectedIntern, "tasks")}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    View tasks
                  </button>
                  <button
                    type="button"
                    onClick={() => messageIntern(selectedIntern.name)}
                    className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90"
                  >
                    Message intern
                  </button>
                </DialogFooter>
              </>
            )}

            {modalView === "tasks" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-muted-foreground" />
                    Tasks — {selectedIntern.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedIntern.tasks} total tasks · Batch {selectedIntern.batch} · Week{" "}
                    {selectedIntern.week} of 12
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {(tasksByIntern[selectedIntern.name] ?? []).map((task) => (
                    <div
                      key={task.title}
                      className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-background px-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-[11px] text-muted-foreground">Due {task.due}</p>
                      </div>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  ))}
                  {(tasksByIntern[selectedIntern.name] ?? []).length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No detailed task breakdown yet. {selectedIntern.name} has {selectedIntern.tasks}{" "}
                      tasks tracked in the program.
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                </DialogFooter>
              </>
            )}

            {modalView === "evaluate" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Schedule evaluation
                  </DialogTitle>
                  <DialogDescription>
                    Plan a formal check-in for {selectedIntern.name}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Intern</span>
                      <span className="font-medium text-foreground">{selectedIntern.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Evaluation period</span>
                      <span className="font-medium text-foreground">Week {selectedIntern.week}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suggested date</span>
                      <span className="font-medium text-foreground">Friday, 3:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium text-foreground">1-on-1 · 30 minutes</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current status: <span className="font-medium text-foreground">{selectedIntern.status}</span>
                    {" · "}
                    {selectedIntern.progress}% program progress
                  </p>
                </div>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90"
                  >
                    Confirm schedule
                  </button>
                </DialogFooter>
              </>
            )}

            {modalView === "flag" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Flag for review
                  </DialogTitle>
                  <DialogDescription>
                    Escalate {selectedIntern.name} to program coordinators for follow-up
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <p className="font-medium text-foreground">Reason for flag</p>
                    <p className="mt-1 text-muted-foreground">
                      {selectedIntern.status === "Needs Attention"
                        ? "Progress below expectations and missed deliverables noted in recent activity."
                        : selectedIntern.status === "New"
                          ? "Early onboarding — flag for coordinator awareness and mentor pairing check."
                          : "Routine mentor request for coordinator visibility on intern progress."}
                    </p>
                  </div>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Batch</dt>
                      <dd className="font-medium">{selectedIntern.batch}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Progress</dt>
                      <dd className="font-medium">{selectedIntern.progress}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Week</dt>
                      <dd className="font-medium">{selectedIntern.week} of 12</dd>
                    </div>
                  </dl>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90"
                  >
                    Submit flag
                  </button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
