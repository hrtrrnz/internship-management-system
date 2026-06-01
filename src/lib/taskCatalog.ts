import {
  DEMO_STUDENT_INTERN_ID,
  DEMO_STUDENT_NAME,
  INTERN_ROSTER,
  type InternBatch,
  type InternRosterEntry,
  internInitials,
} from "@/lib/internRoster";
import type { TaskItem } from "@/lib/internTasks";

export type TaskStatus = TaskItem["status"];

/** Program-wide batch tasks (B16 baseline schedule). */
export const BATCH_TASK_TITLES = [
  "Know Our Partners",
  "Visitor Management System (VMS) Slides",
  "Visitor Management System (VMS)",
  "LMS (Initial Design)",
  "Logo Design Options for KGC",
  "LMS Presentation",
  "LMS (Revised)",
  "HYTFI System Proposal",
  "IMS Presentation",
  "HRMS E GOV",
  "Additional Burger Bite Logos",
  "Internship Management System: Final Revision",
  "Technical Skills Development Documentation",
  "AFFI Group Posts",
  "AFFI Individuals",
  "Project HYTech System Website/Prototype",
  "Quotations",
  "Wheel Supplier Quotations",
  "HYTFI IMS Flyer",
  "HYTFI IMS Brochure",
  "HYTFI IMS Socal Media Post",
  "HYTFI IMS Portfolio",
  "Printed Multiflex KSI ID",
  "Printed Kalin KSI ID",
  "Printed INOAC Cebu KSI ID",
  "Printed EBPI KSI ID",
  "Printed  Roberts KSI ID",
  "HYTFI Ad Flyer 1",
  "HYTFI Ad Flyer 2",
  "HYTFI Ad Flyer 3",
  "Business Calendar",
] as const;

/** Hart Lawrence Binay — sole active in-progress deliverable. */
export const HART_IN_PROGRESS_TASK_TITLE = "Internship Management System: Final Revision";

export const BATCH_START: Record<InternBatch, Date> = {
  B14: new Date(2025, 6, 7),
  B15: new Date(2025, 9, 7),
  B16: new Date(2026, 0, 6),
};

/** Demo “today” for task status and due comparisons. */
export const TASK_DEMO_TODAY = new Date(2026, 4, 31);

const BATCH_OFFSET_DAYS: Record<InternBatch, number> = {
  B16: 0,
  B15: Math.round((BATCH_START.B16.getTime() - BATCH_START.B15.getTime()) / 86400000),
  B14: Math.round((BATCH_START.B16.getTime() - BATCH_START.B14.getTime()) / 86400000),
};

export type TaskCatalogEntry = {
  id: number;
  title: string;
  category: string;
  description: string;
  daysFromBatchStart: number;
};

export type InternTaskAssignment = {
  internId: string;
  internName: string;
  batch: InternBatch;
  taskId: number;
  title: string;
  category: string;
  due: string;
  dueDate: Date;
  status: TaskStatus;
  progress: number;
  updatedAt: string;
  description: string;
};

export type MentorTaskView = {
  id: number;
  title: string;
  due: string;
  description: string;
  internStatuses: {
    intern: string;
    batch: string;
    status: TaskStatus;
    progress: number;
    updatedAt: string;
  }[];
};

export type AdminTaskView = {
  id: number;
  title: string;
  due: string;
  description: string;
  internStatuses: {
    intern: string;
    unit: string;
    batch: string;
    status: TaskStatus;
    updatedAt: string;
  }[];
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function categorizeTask(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("internship management system")) return "Development";
  if (t.includes("flyer") || t.includes("brochure") || t.includes("logo") || t.includes("portfolio") || t.includes("printed") || t.includes("calendar") || t.includes("social media")) {
    return "Design";
  }
  if (t.includes("presentation") || t.includes("slides") || t.includes("documentation") || t.includes("proposal") || t.includes("quotation")) {
    return "Reports";
  }
  if (t.includes("affi") || t.includes("partners") || t.includes("posts") || t.includes("individuals")) {
    return "Marketing";
  }
  return "Development";
}

function taskDescription(title: string): string {
  return `Deliver ${title} according to unit standards, mentor review, and Dream Academy internship guidelines.`;
}

function formatDueDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dueDateForBatch(batch: InternBatch, daysFromBatchStart: number): Date {
  const shiftedDays = daysFromBatchStart - BATCH_OFFSET_DAYS[batch];
  return addDays(BATCH_START[batch], Math.max(7, shiftedDays));
}

function assignmentStatus(internId: string, taskId: number, taskTitle: string, due: Date): TaskStatus {
  const ref = startOfDay(TASK_DEMO_TODAY).getTime();
  const dueTime = startOfDay(due).getTime();
  const h = hashString(`${internId}:${taskId}`);

  if (internId === DEMO_STUDENT_INTERN_ID) {
    if (taskTitle === HART_IN_PROGRESS_TASK_TITLE) return "In Progress";
    if (dueTime > ref) return "Pending";
    return "Completed";
  }

  if (dueTime > ref) return "Pending";

  const daysPast = Math.floor((ref - dueTime) / 86400000);
  if (daysPast > 28) return "Completed";
  if (daysPast > 14) return h % 6 === 0 ? "In Progress" : "Completed";
  if (daysPast > 0) return h % 3 === 0 ? "In Progress" : h % 3 === 1 ? "Completed" : "Pending";
  return h % 2 === 0 ? "In Progress" : "Pending";
}

function progressForStatus(status: TaskStatus, internId: string, taskId: number, taskTitle: string): number {
  if (internId === DEMO_STUDENT_INTERN_ID && taskTitle === HART_IN_PROGRESS_TASK_TITLE && status === "In Progress") {
    return 72;
  }
  const h = hashString(`${internId}:${taskId}:p`) % 100;
  if (status === "Completed") return 100;
  if (status === "In Progress") return 35 + (h % 55);
  return 5 + (h % 25);
}

const UPDATED_AT_SNIPPETS = [
  "Today, 10:20 AM",
  "Today, 9:15 AM",
  "Today, 1:08 PM",
  "Yesterday, 4:40 PM",
  "Today, 11:37 AM",
  "Yesterday, 3:50 PM",
];

function updatedAtFor(internId: string, taskId: number): string {
  return UPDATED_AT_SNIPPETS[hashString(`${internId}:${taskId}:u`) % UPDATED_AT_SNIPPETS.length];
}

export const TASK_CATALOG: TaskCatalogEntry[] = BATCH_TASK_TITLES.map((title, index) => ({
  id: index + 1,
  title,
  category: categorizeTask(title),
  description: taskDescription(title),
  daysFromBatchStart:
    title === HART_IN_PROGRESS_TASK_TITLE ? 10 + (BATCH_TASK_TITLES.length - 1) * 4 : 10 + index * 4,
}));

function applyHartAssignmentOverrides(rows: InternTaskAssignment[]): InternTaskAssignment[] {
  return rows.map((row) => {
    if (row.internId !== DEMO_STUDENT_INTERN_ID) return row;
    if (row.title === HART_IN_PROGRESS_TASK_TITLE) {
      return { ...row, status: "In Progress", progress: 72, updatedAt: "Today, 1:08 PM" };
    }
    if (row.status === "In Progress") {
      return { ...row, status: "Completed", progress: 100 };
    }
    return row;
  });
}

function buildAssignments(): InternTaskAssignment[] {
  const rows: InternTaskAssignment[] = [];
  for (const intern of INTERN_ROSTER) {
    for (const task of TASK_CATALOG) {
      const dueDate = dueDateForBatch(intern.batch, task.daysFromBatchStart);
      const status = assignmentStatus(intern.id, task.id, task.title, dueDate);
      rows.push({
        internId: intern.id,
        internName: intern.name,
        batch: intern.batch,
        taskId: task.id,
        title: task.title,
        category: task.category,
        due: formatDueDate(dueDate),
        dueDate,
        status,
        progress: progressForStatus(status, intern.id, task.id, task.title),
        updatedAt:
          intern.id === DEMO_STUDENT_INTERN_ID && task.title === HART_IN_PROGRESS_TASK_TITLE
            ? "Today, 1:08 PM"
            : updatedAtFor(intern.id, task.id),
        description: task.description,
      });
    }
  }
  return applyHartAssignmentOverrides(rows);
}

let allAssignmentsCache: InternTaskAssignment[] | null = null;

function getAllAssignments(): InternTaskAssignment[] {
  if (!allAssignmentsCache) {
    allAssignmentsCache = buildAssignments();
  }
  return allAssignmentsCache;
}

export function getInternAssignments(internId: string): InternTaskAssignment[] {
  return getAllAssignments().filter((a) => a.internId === internId);
}

function normalizeHartTaskBoard(tasks: TaskItem[]): TaskItem[] {
  return tasks.map((task) => {
    if (task.title === HART_IN_PROGRESS_TASK_TITLE) {
      return { ...task, status: "In Progress" };
    }
    if (task.status === "In Progress") {
      return { ...task, status: "Completed" };
    }
    return task;
  });
}

export function getInternTaskBoard(internId: string): TaskItem[] {
  const board = getInternAssignments(internId)
    .map((a) => ({
      id: a.taskId,
      title: a.title,
      category: a.category,
      due: a.due,
      status: a.status,
      description: a.description,
    }))
    .sort((a, b) => {
      const order = { Pending: 0, "In Progress": 1, Completed: 2 };
      const diff = order[a.status] - order[b.status];
      if (diff !== 0) return diff;
      return a.id - b.id;
    });

  return internId === DEMO_STUDENT_INTERN_ID ? normalizeHartTaskBoard(board) : board;
}

export function getInternTaskByIdForIntern(internId: string, taskId: number): TaskItem | undefined {
  return getInternTaskBoard(internId).find((t) => t.id === taskId);
}

export function getActiveInternTasksForIntern(internId: string): TaskItem[] {
  return getInternTaskBoard(internId).filter((t) => t.status !== "Completed");
}

export function getInternTaskSummaries(
  internId: string,
  limit = 5,
): { title: string; status: TaskStatus; due: string }[] {
  return getInternAssignments(internId)
    .filter((a) => a.status !== "Completed")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, limit)
    .map((a) => ({ title: a.title, status: a.status, due: a.due }));
}

export function getInternTaskSummariesByName(name: string, limit = 5) {
  const intern = INTERN_ROSTER.find((i) => i.name === name);
  if (!intern) return [];
  return getInternTaskSummaries(intern.id, limit);
}

export function getInternTaskSummariesRecord(
  limit = 5,
): Record<string, { title: string; status: TaskStatus; due: string }[]> {
  return Object.fromEntries(INTERN_ROSTER.map((intern) => [intern.name, getInternTaskSummaries(intern.id, limit)]));
}

export function activeTaskCountForIntern(internId: string): number {
  return getInternAssignments(internId).filter((a) => a.status !== "Completed").length;
}

export function getMentorTaskViews(): MentorTaskView[] {
  return TASK_CATALOG.map((task) => {
    const internStatuses = getAllAssignments()
      .filter((a) => a.taskId === task.id)
      .map((a) => ({
        intern: a.internName,
        batch: a.batch,
        status: a.status,
        progress: a.progress,
        updatedAt: a.updatedAt,
      }));
    const b16Due = dueDateForBatch("B16", task.daysFromBatchStart);
    return {
      id: task.id,
      title: task.title,
      due: formatDueDate(b16Due),
      description: task.description,
      internStatuses,
    };
  });
}

export function getAdminTaskViews(): AdminTaskView[] {
  return TASK_CATALOG.map((task) => {
    const internStatuses = getAllAssignments()
      .filter((a) => a.taskId === task.id)
      .map((a) => ({
        intern: a.internName,
        unit: "Tech & Innovation",
        batch: a.batch,
        status: a.status,
        updatedAt: a.updatedAt,
      }));
    const b16Due = dueDateForBatch("B16", task.daysFromBatchStart);
    return {
      id: task.id,
      title: task.title,
      due: formatDueDate(b16Due),
      description: task.description,
      internStatuses,
    };
  });
}

export function getDemoStudentTasks(): TaskItem[] {
  return getInternTaskBoard(DEMO_STUDENT_INTERN_ID);
}

export function getDemoStudentTaskById(taskId: number): TaskItem | undefined {
  return getInternTaskByIdForIntern(DEMO_STUDENT_INTERN_ID, taskId);
}

export function getDemoStudentActiveTasks(): TaskItem[] {
  return getActiveInternTasksForIntern(DEMO_STUDENT_INTERN_ID);
}

export { DEMO_STUDENT_INTERN_ID, DEMO_STUDENT_NAME, internInitials };
