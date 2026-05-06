import type { UserRole } from "@/contexts/RoleContext";

export type Group = {
  id: number;
  name: string;
  members: string[];
  createdBy: UserRole;
  /** True for 1:1 threads. */
  isPrivate?: boolean;
  lastSender: string;
  lastMessage: string;
  lastAt: string;
  unread?: number;
  pinned?: boolean;
  muted?: boolean;
  archived?: boolean;
};

export type ChatMessage = {
  id: number;
  groupId: number;
  sender: string;
  text: string;
  at: string;
  attachments?: string[];
  replyToId?: number;
  edited?: boolean;
  status?: "sent" | "delivered" | "read";
  reactions?: Record<string, number>;
  /** Current signed-in user reaction; used to enforce one reaction per user per message. */
  myReaction?: string;
};

export const MESSAGES_SEED_GROUPS: Group[] = [
  {
    id: 1,
    name: "DA B16 - Attendance Monitoring",
    members: ["Nora", "Alex Cruz", "Bea Santos", "Marco Reyes"],
    createdBy: "mentor",
    lastSender: "Juan dela Cruz",
    lastMessage: "Thanks — I’ve uploaded my attendance log for this morning.",
    lastAt: "12:52",
    unread: 4,
    pinned: true,
  },
  {
    id: 2,
    name: "B16 : TECH UNIT",
    members: ["Tristan Lee", "Alex Cruz", "Bea Santos", "Marco Reyes"],
    createdBy: "mentor",
    lastSender: "Tristan Lee",
    lastMessage: "Please submit your outputs after your shift.",
    lastAt: "12:57",
    muted: true,
  },
  {
    id: 3,
    name: "Official Batch 16 - Dream Academy",
    members: ["Nora", "Adrian Cole", "Alex Cruz", "Bea Santos", "Marco Reyes", "Lia Tan"],
    createdBy: "admin",
    lastSender: "Nora",
    lastMessage: "Acknowledged.",
    lastAt: "Feb 24",
  },
  {
    id: 4,
    name: "Applicant Pooling",
    members: ["HR Desk", "Maria Reyes", "James Cruz", "Elena Torres"],
    createdBy: "admin",
    lastSender: "James Cruz",
    lastMessage: "Shared three profiles for pooling — initials only in Drive.",
    lastAt: "9:14",
    unread: 2,
  },
  {
    id: 5,
    name: "Dream Academy Applicants",
    members: ["Admissions Desk", "Nora", "Lia Tan", "Adrian Cole"],
    createdBy: "admin",
    lastSender: "Admissions Desk",
    lastMessage: "Next briefing for short-listed applicants is Thursday 10:30 AM.",
    lastAt: "Mon",
    unread: 1,
  },
];

export const MESSAGES_SEED_MESSAGES: ChatMessage[] = [
  { id: 1, groupId: 1, sender: "Nora", text: "March 27, 2026 | Friday | 11:00 AM attendance check", at: "12:47", status: "read" },
  { id: 2, groupId: 1, sender: "Alex Cruz", text: "Noted, submitting shortly.", at: "12:49", attachments: ["daily-log-march27.pdf"], status: "read", reactions: { "👍": 2 } },
  {
    id: 5,
    groupId: 1,
    sender: "Juan dela Cruz",
    text: "Thanks — I’ve uploaded my attendance log for this morning.",
    at: "12:52",
    status: "read",
  },
  { id: 3, groupId: 2, sender: "Tristan Lee", text: "Please submit your outputs after your shift.", at: "12:57", status: "delivered" },
  { id: 4, groupId: 3, sender: "Nora", text: "Acknowledged.", at: "Feb 24", status: "read" },
  {
    id: 6,
    groupId: 4,
    sender: "HR Desk",
    text: "Pooling status for cohort Q2 — please review flagged CVs (sanitized IDs only).",
    at: "Yesterday",
    status: "read",
  },
  { id: 7, groupId: 4, sender: "Maria Reyes", text: "Uploaded two nominees for pooling review.", at: "8:50", status: "read" },
  {
    id: 8,
    groupId: 4,
    sender: "James Cruz",
    text: "Shared three profiles for pooling — initials only in Drive.",
    at: "9:14",
    status: "delivered",
  },
  {
    id: 9,
    groupId: 5,
    sender: "Admissions Desk",
    text: "Welcome — use this channel for applicant questions and RSVP tracking.",
    at: "Mar 2",
    status: "read",
  },
  { id: 10, groupId: 5, sender: "Nora", text: "Confirmed two mentor shadows for finalist day.", at: "Mar 3", status: "read" },
  {
    id: 11,
    groupId: 5,
    sender: "Admissions Desk",
    text: "Next briefing for short-listed applicants is Thursday 10:30 AM.",
    at: "Mon",
    status: "read",
  },
];

export type FloatingThreadLine = { sender: string; text: string; mine?: boolean };

/** Maps shared thread messages into launcher bubbles (same source as Messages page). */
export function getFloatingLinesForGroup(messages: ChatMessage[], groupId: number, currentUserName: string): FloatingThreadLine[] {
  return [...messages]
    .filter((m) => m.groupId === groupId)
    .sort((a, b) => a.id - b.id)
    .map((m) => ({
      sender: m.sender === currentUserName ? "You" : m.sender,
      text: formatFloatingLineText(m),
      mine: m.sender === currentUserName,
    }));
}

function formatFloatingLineText(m: ChatMessage): string {
  let t = m.text;
  if (m.attachments?.length) {
    t += `\n📎 ${m.attachments.join(", ")}`;
  }
  if (m.reactions && Object.keys(m.reactions).length > 0) {
    const react = Object.entries(m.reactions)
      .map(([e, n]) => `${e}×${n}`)
      .join(" ");
    t += `\n${react}`;
  }
  return t;
}
