import { useState } from "react";
import { Star, CheckSquare, Clock, Award } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { useMessagesThread } from "@/contexts/MessagesThreadContext";

type MentorTask = {
  id: number;
  title: string;
  due: string;
  status: string;
  credits: number;
};

type Mentor = {
  id: string;
  initials: string;
  name: string;
  title: string;
  department: string;
  creditHoursAwarded: number;
  tasks: MentorTask[];
};

const mentors: Mentor[] = [
  {
    id: "maria",
    initials: "MR",
    name: "Maria Reyes",
    title: "Senior Software Engineer",
    department: "Technology & Innovation Department",
    creditHoursAwarded: 24.5,
    tasks: [
      { id: 1, title: "Weekly progress report — Week 8", due: "Mar 28, 2026", status: "In review", credits: 1.5 },
      { id: 2, title: "API integration sprint deliverable", due: "Mar 25, 2026", status: "Submitted", credits: 4.0 },
      { id: 3, title: "Refactor authentication module", due: "Mar 22, 2026", status: "Returned with feedback", credits: 3.0 },
      { id: 4, title: "Document REST endpoints for mobile team", due: "Mar 18, 2026", status: "Approved", credits: 2.0 },
      { id: 5, title: "Shadow senior engineer — pairing sessions (log)", due: "Mar 15, 2026", status: "Approved", credits: 6.0 },
    ],
  },
  {
    id: "james",
    initials: "JC",
    name: "James Chen",
    title: "Product Design Lead",
    department: "Creative Unit",
    creditHoursAwarded: 12.0,
    tasks: [
      { id: 1, title: "Dashboard wireframe revision v2", due: "Mar 29, 2026", status: "In review", credits: 2.0 },
      { id: 2, title: "Design system tokens — spacing audit", due: "Mar 24, 2026", status: "Submitted", credits: 3.5 },
      { id: 3, title: "Stakeholder review deck — onboarding flow", due: "Mar 20, 2026", status: "Approved", credits: 4.0 },
      { id: 4, title: "Icon set export for mobile handoff", due: "Mar 12, 2026", status: "Approved", credits: 2.5 },
    ],
  },
];

const statusStyles: Record<string, string> = {
  Approved: "bg-stat-green-bg text-stat-green",
  Submitted: "bg-stat-blue-bg text-stat-blue",
  "In review": "bg-stat-orange-bg text-stat-orange",
  "Returned with feedback": "bg-muted text-muted-foreground",
};

export default function MyMentor() {
  const { role, user } = useRole();
  const { ensurePrivateThread, requestOpenFloatingChat } = useMessagesThread();
  const [selectedId, setSelectedId] = useState(mentors[0].id);
  const mentor = mentors.find((m) => m.id === selectedId) ?? mentors[0];
  const firstName = mentor.name.split(" ")[0];

  const handleSendMessageToMentor = () => {
    const chatId = ensurePrivateThread(user.name, mentor.name, role);
    requestOpenFloatingChat(chatId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Mentors</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a mentor to see their tasks and your credit hours with them.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="shrink-0 lg:w-72">
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Your mentors</p>
          <nav className="flex flex-col gap-1 rounded-xl border border-border bg-card p-1.5" aria-label="Mentors">
            {mentors.map((m) => {
              const selected = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedId(m.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    selected
                      ? "bg-accent/15 text-foreground ring-1 ring-accent/40"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                  aria-current={selected ? "true" : undefined}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                    {m.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.title}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="mb-4 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground sm:mb-0 sm:mr-6">
              {mentor.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-foreground">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{mentor.department}</p>
              <div className="mt-3 flex items-center justify-center gap-1 sm:justify-start">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-stat-orange text-stat-orange" />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
                <Award className="h-8 w-8 shrink-0 text-stat-orange" aria-hidden />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Credit hours awarded</p>
                  <p className="font-display text-2xl font-bold tabular-nums text-foreground">{mentor.creditHoursAwarded}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSendMessageToMentor}
                className="mt-4 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
              >
                Send Message
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-display font-bold text-foreground">Tasks assigned by {firstName}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Work items they assigned and the credit hours linked when approved.
              </p>
            </div>
            <div className="divide-y divide-border">
              {mentor.tasks.map((task) => (
                <div
                  key={`${mentor.id}-${task.id}`}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CheckSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <p className="font-medium text-foreground">{task.title}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {task.due}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[task.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right sm:pl-4">
                    <p className="text-xs text-muted-foreground">Credit hours</p>
                    <p className="font-display text-lg font-semibold tabular-nums text-foreground">{task.credits}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
