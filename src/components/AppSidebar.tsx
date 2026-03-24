import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Clock, CheckSquare, FileText, Trophy,
  BookOpen, Users, ClipboardCheck, User, FolderOpen, MoreVertical, Bell, Search
} from "lucide-react";

const navSections = [
  {
    label: "MAIN",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/attendance", icon: Clock, label: "Attendance", badge: 2 },
      { to: "/tasks", icon: CheckSquare, label: "Tasks", badge: 5 },
      { to: "/daily-reports", icon: FileText, label: "Daily Reports", badge: undefined as number | undefined },
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

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col justify-between fixed left-0 top-0 z-40">
      <div>
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-display text-lg font-bold text-sidebar-primary">
            HYT <span className="text-sidebar-accent-foreground">FOUNDATION</span>
          </h1>
          <p className="text-xs text-sidebar-muted tracking-wider mt-0.5">DREAM ACADEMY PORTAL</p>
        </div>

        <nav className="px-3 space-y-5 mt-2">
          {navSections.map((section) => (
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
                        {item.badge && (
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
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">Juan dela Cruz</p>
            <p className="text-xs text-sidebar-muted truncate">Tech & Innovation · Intern</p>
          </div>
          <MoreVertical className="w-4 h-4 text-sidebar-muted" />
        </div>
      </div>
    </aside>
  );
}

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <h2 className="text-2xl font-display font-bold text-foreground">
        Good morning, <span className="text-primary italic">Juan</span> 👋
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
