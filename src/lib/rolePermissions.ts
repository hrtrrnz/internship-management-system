export type RoleName = "Administrator" | "Mentor" | "Intern";

export type PermissionId =
  | "full_access"
  | "user_management"
  | "settings_config"
  | "view_all_data"
  | "manage_departments"
  | "export_reports"
  | "view_assigned_interns"
  | "review_reports"
  | "create_evaluations"
  | "assign_tasks"
  | "send_reminders"
  | "manage_learning_paths"
  | "view_own_dashboard"
  | "clock_in_out"
  | "submit_reports"
  | "view_tasks"
  | "access_learning_modules"
  | "view_evaluations"
  | "view_attendance_logs";

export type PermissionGroup = {
  category: string;
  permissions: { id: PermissionId; label: string }[];
};

export const PERMISSION_CATALOG: PermissionGroup[] = [
  {
    category: "System",
    permissions: [
      { id: "full_access", label: "Full system access" },
      { id: "user_management", label: "User management" },
      { id: "settings_config", label: "Settings configuration" },
      { id: "view_all_data", label: "View all data" },
      { id: "manage_departments", label: "Manage departments" },
    ],
  },
  {
    category: "Reports & data",
    permissions: [
      { id: "export_reports", label: "Export reports" },
      { id: "review_reports", label: "Review reports" },
      { id: "submit_reports", label: "Submit reports" },
    ],
  },
  {
    category: "Interns & mentorship",
    permissions: [
      { id: "view_assigned_interns", label: "View assigned interns" },
      { id: "view_attendance_logs", label: "View attendance logs" },
    ],
  },
  {
    category: "Tasks & evaluations",
    permissions: [
      { id: "assign_tasks", label: "Assign tasks" },
      { id: "view_tasks", label: "View tasks" },
      { id: "create_evaluations", label: "Create evaluations" },
      { id: "view_evaluations", label: "View evaluations" },
    ],
  },
  {
    category: "Learning & communication",
    permissions: [
      { id: "manage_learning_paths", label: "Manage learning paths" },
      { id: "access_learning_modules", label: "Access learning modules" },
      { id: "send_reminders", label: "Send reminders" },
    ],
  },
  {
    category: "Intern portal",
    permissions: [
      { id: "view_own_dashboard", label: "View own dashboard" },
      { id: "clock_in_out", label: "Clock in/out" },
    ],
  },
];

const permissionLabelById = new Map(
  PERMISSION_CATALOG.flatMap((g) => g.permissions).map((p) => [p.id, p.label]),
);

export function permissionLabel(id: PermissionId): string {
  return permissionLabelById.get(id) ?? id;
}

export type RoleDefinition = {
  name: RoleName;
  count: number;
  color: "--stat-orange" | "--stat-blue" | "--stat-green";
  permissionIds: PermissionId[];
};

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    name: "Administrator",
    count: 2,
    color: "--stat-orange",
    permissionIds: [
      "full_access",
      "user_management",
      "settings_config",
      "view_all_data",
      "export_reports",
      "manage_departments",
    ],
  },
  {
    name: "Mentor",
    count: 8,
    color: "--stat-blue",
    permissionIds: [
      "view_assigned_interns",
      "review_reports",
      "create_evaluations",
      "assign_tasks",
      "send_reminders",
      "manage_learning_paths",
      "view_attendance_logs",
    ],
  },
  {
    name: "Intern",
    count: 24,
    color: "--stat-green",
    permissionIds: [
      "view_own_dashboard",
      "clock_in_out",
      "submit_reports",
      "view_tasks",
      "access_learning_modules",
      "view_evaluations",
    ],
  },
];

export const ALL_PERMISSION_IDS = PERMISSION_CATALOG.flatMap((g) =>
  g.permissions.map((p) => p.id),
);
