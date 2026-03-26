import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Clock, CheckSquare, FileText, Trophy,
  BookOpen, Users, ClipboardCheck, User, FolderOpen, MoreVertical, Bell, Search,
  UserCog, BarChart3, Settings, Building, Shield, Star, Calendar,
  GraduationCap, LogOut
} from "lucide-react";
import { useRole, UserRole } from "@/contexts/RoleContext";
import { useState, useRef, useEffect } from "react";
import hytLogo from "@/assets/hyt-logo.png";

type NavSection = {
  label: string;
  items: { to: string; icon: React.ElementType; label: string; badge?: number }[];
};

const studentNav: NavSection[] = [
  {
    label: "MAIN",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/attendance", icon: Clock, label: "Attendance" },
      { to: "/tasks", icon: CheckSquare, label: "Tasks" },
      { to: "/daily-reports", icon: FileText, label: "Daily Reports" },
      { to: "/accomplishments", icon: Trophy, label: "Accomplishments" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { to: "/my-mentor", icon: Users, label: "My Mentor" },
      { to: "/evaluations", icon: ClipboardCheck, label: "Evaluation" },
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
      { to: "/mentor/interns", icon: GraduationCap, label: "My Interns" },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { to: "/mentor/attendance-review", icon: Clock, label: "Attendance Review" },
      { to: "/mentor/report-review", icon: FileText, label: "Report Review" },
      { to: "/mentor/task-assignments", icon: CheckSquare, label: "Task Assignments" },
      { to: "/mentor/evaluations", icon: ClipboardCheck, label: "Evaluations" },
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
      { to: "/admin/users", icon: Users, label: "User Management" },
      { to: "/admin/departments", icon: Building, label: "Departments" },
      { to: "/admin/mentors", icon: Star, label: "Mentors" },
      { to: "/admin/interns", icon: GraduationCap, label: "Interns" },
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
      { to: "/admin/roles", icon: Shield, label: "Roles & Permissions" },
    ],
  },
];

const navByRole: Record<UserRole, NavSection[]> = {
  student: studentNav,
  mentor: mentorNav,
  admin: adminNav,
};

const settingsRouteByRole: Record<UserRole, string> = {
  student: "/my-profile",
  mentor: "/mentor/profile",
  admin: "/admin/settings",
};

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user } = useRole();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sections = navByRole[role];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    navigate("/signin");
  };

  const handleSettings = () => {
    setProfileMenuOpen(false);
    navigate(settingsRouteByRole[role]);
  };

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col justify-between fixed left-0 top-0 z-40">
      <div>
        <div className="px-5 pt-5 pb-4 flex items-center gap-3">
          <img src={hytLogo} alt="HYT Foundation" width={48} height={48} />
          <div>
            <p className="text-xs font-bold tracking-wider text-sidebar-accent-foreground leading-tight">HELPING YOUTH<br/>TRANSCEND</p>
            <p className="text-[9px] text-sidebar-muted tracking-wider">DREAM ACADEMY PORTAL</p>
          </div>
        </div>

        <nav className="px-3 space-y-5 mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
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
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-4 relative" ref={menuRef}>
        {profileMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-sidebar-accent rounded-lg border border-sidebar-border overflow-hidden z-50 shadow-xl">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-sidebar-foreground hover:bg-sidebar-border transition-colors text-left"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-sidebar-border transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
        <div
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
        >
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
