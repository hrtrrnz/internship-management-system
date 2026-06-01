export type TaskItem = {
  id: number;
  title: string;
  category: string;
  due: string;
  status: "Pending" | "In Progress" | "Completed";
  description: string;
  mentorDescription?: string;
  mentorAttachments?: string[];
  submittedFiles?: string[];
  submittedLink?: string;
  submittedNotes?: string;
};

import {
  getDemoStudentActiveTasks,
  getDemoStudentTaskById,
  getDemoStudentTasks,
} from "@/lib/taskCatalog";

/** Hart Lawrence Binay task board — synced with mentor/admin assignments. */
export function getInternTasks(): TaskItem[] {
  return getDemoStudentTasks();
}

export function getInternTaskById(id: number): TaskItem | undefined {
  return getDemoStudentTaskById(id);
}

export function getActiveInternTasks(): TaskItem[] {
  return getDemoStudentActiveTasks();
}


export const internTaskCategoryStyles: Record<string, string> = {
  Learning: "bg-stat-blue-bg text-stat-blue",
  Reports: "bg-stat-orange-bg text-stat-orange",
  Development: "bg-stat-green-bg text-stat-green",
  Design: "bg-stat-emerald-bg text-stat-emerald",
  Marketing: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  Meetings: "bg-muted text-muted-foreground",
};
