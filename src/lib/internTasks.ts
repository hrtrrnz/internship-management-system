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

/** Demo intern task board — shared by Tasks and Evaluation pages. */
export const INTERN_TASKS: TaskItem[] = [
  {
    id: 1,
    title: "Complete React module assessment",
    category: "Learning",
    due: "Mar 25",
    status: "In Progress",
    description: "Finish all required exercises and pass the Module 3 assessment.",
  },
  {
    id: 2,
    title: "Submit weekly progress report",
    category: "Reports",
    due: "Mar 24",
    status: "Pending",
    description: "Prepare and submit Week 7 accomplishments, blockers, and next steps using the mentor format.",
    mentorDescription: "Use the attached template and keep content concise but complete for the full workday.",
    mentorAttachments: ["Weekly-Report-Template.docx", "Week-7-Checklist.pdf"],
  },
  {
    id: 3,
    title: "Review API documentation",
    category: "Learning",
    due: "Mar 26",
    status: "Pending",
    description: "Read and annotate the REST API patterns guide, then list questions for mentoring sync.",
  },
  {
    id: 4,
    title: "Update project README",
    category: "Development",
    due: "Mar 28",
    status: "Pending",
    description: "Improve setup instructions, add environment variables section, and include updated screenshots.",
    mentorDescription: "Prioritize onboarding clarity and make sure setup succeeds on a clean machine.",
    mentorAttachments: ["README-Standards.md", "Screenshot-Guidelines.pdf"],
  },
  {
    id: 5,
    title: "Attend team standup",
    category: "Meetings",
    due: "Mar 24",
    status: "Completed",
    description: "Join daily standup and share progress, current blockers, and day plan.",
    submittedFiles: ["Standup-Attendance-Mar24.pdf", "Daily-Blockers-Notes.md"],
    submittedNotes: "Present; shared blocker on API staging access. Follow-up scheduled with mentor.",
  },
  {
    id: 6,
    title: "Design dashboard wireframes",
    category: "Design",
    due: "Mar 22",
    status: "Completed",
    description: "Produce low-fidelity dashboard wireframes based on the agreed layout and spacing system.",
    mentorDescription: "Follow the approved layout shell and keep spacing aligned to the design grid.",
    mentorAttachments: ["Dashboard-Requirements.pdf", "Wireframe-Reference.png"],
    submittedFiles: ["Dashboard-Wireframes-v3.fig", "Wireframes-Export-Sprint7.pdf", "Spacing-Annotations.md"],
    submittedLink: "https://figma.com/file/example-dashboard-wireframes",
    submittedNotes: "All screens use the 8px grid; annotations call out responsive breakpoints.",
  },
  {
    id: 7,
    title: "Fix navigation bug",
    category: "Development",
    due: "Mar 21",
    status: "Completed",
    description: "Resolve mobile sidebar issue where route changes do not automatically close navigation.",
    submittedFiles: ["NavigationFix-PR-184.diff", "Mobile-Regression-QA.zip", "CHANGELOG-entry.md"],
    submittedLink: "https://github.com/example/repo/pull/184",
    submittedNotes: "Sidebar now closes on route change; QA steps documented in the zip readme.",
  },
  {
    id: 8,
    title: "Prepare presentation slides",
    category: "Reports",
    due: "Mar 27",
    status: "In Progress",
    description: "Create sprint demo slides with key progress metrics, visuals, and blockers summary.",
    mentorDescription: "Use the branded deck template and include one slide for risks and mitigation.",
    mentorAttachments: ["Sprint-Demo-Deck-Template.pptx", "Brand-Guidelines.pdf"],
  },
];

export const internTaskCategoryStyles: Record<string, string> = {
  Learning: "bg-stat-blue-bg text-stat-blue",
  Reports: "bg-stat-orange-bg text-stat-orange",
  Development: "bg-stat-green-bg text-stat-green",
  Design: "bg-stat-emerald-bg text-stat-emerald",
  Meetings: "bg-muted text-muted-foreground",
};

export function getInternTaskById(id: number): TaskItem | undefined {
  return INTERN_TASKS.find((t) => t.id === id);
}

export function getActiveInternTasks(): TaskItem[] {
  return INTERN_TASKS.filter((t) => t.status !== "Completed");
}
