import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Clock, CheckSquare, FileText, Trophy,
  BookOpen, Users, ClipboardCheck, User, FolderOpen, MoreVertical, Bell, Search,
  ChevronDown, UserCog, BarChart3, Settings, Building, Shield, Star, Calendar,
  GraduationCap
} from "lucide-react";
import { useRole, UserRole } from "@/contexts/RoleContext";
import { useState } from "react";

type NavSection = {
  label: string;
  items: { to: string; icon: React.ElementType; label: string; badge?: number }[];
};

const studentNav: NavSection[] = [
  {
    label: "MAIN",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/attendance", icon: Clock, label: "Attendance", badge: 2 },
      { to: "/tasks", icon: CheckSquare, label: "Tasks", badge: 5 },
      { to: "/daily-reports", icon: FileText, label: "Daily Reports" },
      { to: "/accomplishments", icon: Trophy, label: "Accomplishments" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { to: "/learning-modules", icon: BookOpen, label: "Learning Modules", badge: 3 },
      { to: "/my-mentor", icon: Users, label: "My Mentor" },
      { to: "/evaluations", icon: ClipboardCheck, label: "Evaluations" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { to: "/my-profile", icon: User, label: "My Profile" },
      { to: "/documents", icon: FolderOpen, label: "Documents" },
    ],
  },
];

const mentorNav: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      { to: "/mentor", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/mentor/interns", icon: GraduationCap, label: "My Interns", badge: 8 },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { to: "/mentor/attendance-review", icon: Clock, label: "Attendance Review" },
      { to: "/mentor/report-review", icon: FileText, label: "Report Review", badge: 3 },
      { to: "/mentor/task-assignments", icon: CheckSquare, label: "Task Assignments" },
      { to: "/mentor/evaluations", icon: ClipboardCheck, label: "Evaluations", badge: 2 },
    ],
  },
  {
    label: "SESSIONS",
    items: [
      { to: "/mentor/sessions", icon: Calendar, label: "Mentorship Sessions" },
      { to: "/mentor/learning-paths", icon: BookOpen, label: "Learning Paths" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { to: "/mentor/profile", icon: User, label: "My Profile" },
    ],
  },
];

const adminNav: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { to: "/admin/users", icon: Users, label: "User Management", badge: 42 },
      { to: "/admin/departments", icon: Building, label: "Departments" },
      { to: "/admin/mentors", icon: Star, label: "Mentors" },
      { to: "/admin/interns", icon: GraduationCap, label: "Interns", badge: 24 },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { to: "/admin/attendance", icon: Clock, label: "Attendance Logs" },
      { to: "/admin/reports", icon: FileText, label: "All Reports" },
      { to: "/admin/evaluations", icon: ClipboardCheck, label: "Evaluations" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { to: "/admin/settings", icon: Settings, label: "Settings" },
      { to: "/admin/roles", icon: Shield, label: "Roles & Permissions" },
    ],
  },
];

const navByRole: Record<UserRole, NavSection[]> = {
  student: studentNav,
  mentor: mentorNav,
  admin: adminNav,
};

const roleColors: Record<UserRole, string> = {
  student: "bg-stat-green",
  mentor: "bg-stat-blue",
  admin: "bg-stat-orange",
};

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user, setRole } = useRole();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const sections = navByRole[role];

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    if (newRole === "student") navigate("/");
    else if (newRole === "mentor") navigate("/mentor");
    else navigate("/admin");
  };

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col justify-between fixed left-0 top-0 z-40">
      <div>
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-display text-lg font-bold text-sidebar-primary">
            HYT <span className="text-sidebar-accent-foreground">FOUNDATION</span>
          </h1>
          <p className="text-xs text-sidebar-muted tracking-wider mt-0.5">DREAM ACADEMY PORTAL</p>
        </div>

        {/* Role switcher */}
        <div className="px-3 mb-3">
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium hover:bg-sidebar-accent/80 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${roleColors[role]}`} />
              <span className="flex-1 text-left capitalize">{role} View</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {roleMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-sidebar-accent rounded-lg border border-sidebar-border overflow-hidden z-50 shadow-lg">
                {(["student", "mentor", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors ${
                      role === r
                        ? "text-sidebar-primary-foreground bg-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-border"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${roleColors[r]}`} />
                    <span className="capitalize">{r} View</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="px-3 space-y-5 mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {sections.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-semibold tracking-widest text-sidebar-muted px-3 mb-1.5">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold ${
                            isActive ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground" : "bg-stat-orange text-card"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-muted truncate">{user.department} · {user.roleLabel}</p>
          </div>
          <MoreVertical className="w-4 h-4 text-sidebar-muted" />
        </div>
      </div>
    </aside>
  );
}

export function TopBar() {
  const { user } = useRole();
  const firstName = user.name.split(" ")[0];

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Good morning, <span className="text-primary italic">{firstName}</span> 👋
      </h2>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <Search className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
