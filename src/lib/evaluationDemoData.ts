import type { PrerequisiteItem } from "@/components/evaluation/evaluationShared";

/** Stable roster id for the demo student — must match mentor Evaluation intern ids and form assignments. */
export const DEMO_STUDENT_INTERN_ID = "juan";

/** Juan dela Cruz — matches what the intern Evaluation page shows (single source for mentor/admin alignment). */
export const demoInternJuanCompletedWorks = [
  {
    id: "cw1",
    title: "Daily reports — March cycle",
    detail: "21 consecutive submissions · mentor acknowledged",
    completedAt: "Mar 28, 2026",
  },
  {
    id: "cw2",
    title: "Learning Module 3 · React patterns",
    detail: "Quiz passed · capstone mini-project submitted",
    completedAt: "Apr 2, 2026",
  },
  {
    id: "cw3",
    title: "Tech unit sprint deliverables",
    detail: "Feature branch merged · demo recording uploaded",
    completedAt: "Apr 8, 2026",
  },
  {
    id: "cw4",
    title: "Attendance & timesheet compliance",
    detail: "No unresolved exceptions this period",
    completedAt: "Apr 10, 2026",
  },
] as const;

export const demoInternJuanPrerequisites: PrerequisiteItem[] = [
  {
    id: "p1",
    title: "Submit mid-internship reflection (template)",
    detail: "One-page narrative + goals for remainder of program",
    dueHint: "Due before eval window opens",
    done: true,
  },
  {
    id: "p2",
    title: "Portfolio ZIP — representative outputs",
    detail: "Include 3 artifacts your mentor can review offline",
    dueHint: "Due Apr 12, 2026",
    done: true,
  },
  {
    id: "p3",
    title: "Schedule evaluation slot with mentor",
    detail: "Use Dream Academy calendar or confirm via Messages",
    dueHint: "Book by Apr 13, 2026",
    done: false,
    linkedTaskId: 8,
  },
  {
    id: "p4",
    title: "Sign acknowledgment · internship policies",
    detail: "Electronic sign-off in Documents",
    dueHint: "Required once only",
    done: false,
  },
];

export const demoScheduleMariaReyes = {
  evaluator: "Maria Reyes",
  evaluationWindowOpens: "Apr 14, 2026",
  plannedSession: "Apr 15, 2026 · 2:00 PM",
  offboardingDate: "Apr 18, 2026",
} as const;
