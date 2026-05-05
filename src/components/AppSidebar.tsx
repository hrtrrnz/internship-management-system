import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Clock, CheckSquare, FileText,
  BookOpen, Users, ClipboardCheck, User, FolderOpen, MoreVertical, Bell, Search,
  UserCog, BarChart3, Settings, Building, Shield, Star, Calendar,
  GraduationCap, LogOut, PanelLeft, PanelRight, MessageSquare, AlertCircle
} from "lucide-react";
import { useRole, UserRole } from "@/contexts/RoleContext";
import { useState, useRef, useEffect } from "react";
import hytLogo from "@/assets/hyt-logo.png";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavSection = {
  label: string;
  items: { to: string; icon: React.ElementType; label: string; badge?: number }[];
};

const studentNav: NavSection[] = [
  {
    label: "MAIN",
    items: [
      { to: "/portal", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/attendance", icon: Clock, label: "Attendance" },
      { to: "/tasks", icon: CheckSquare, label: "Tasks" },
      { to: "/daily-reports", icon: FileText, label: "Daily Reports" },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { to: "/my-mentor", icon: Users, label: "My Mentor" },
      { to: "/evaluations", icon: ClipboardCheck, label: "Evaluation" },
      { to: "/messages", icon: MessageSquare, label: "Messages" },
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
      { to: "/mentor/messages", icon: MessageSquare, label: "Messages" },
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
      { to: "/admin/tasks", icon: CheckSquare, label: "Tasks" },
      { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { to: "/admin/roles", icon: Shield, label: "Roles & Permissions" },
      { to: "/admin/profile", icon: User, label: "My Profile" },
    ],
  },
];

const navByRole: Record<UserRole, NavSection[]> = {
  student: studentNav,
  mentor: mentorNav,
  admin: adminNav,
};

const settingsRouteByRole: Record<UserRole, string> = {
  student: "/settings",
  mentor: "/mentor/settings",
  admin: "/admin/settings",
};

type SystemNotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
};

const systemNotificationsByRole: Record<UserRole, SystemNotificationItem[]> = {
  student: [
    {
      id: "s1",
      title: "New task assigned",
      description: "Complete the onboarding module checklist from your mentor.",
      time: "2 hours ago",
      icon: CheckSquare,
    },
    {
      id: "s2",
      title: "Daily report due soon",
      description: "Submit today’s daily report before 5:00 PM.",
      time: "Today",
      icon: FileText,
    },
    {
      id: "s3",
      title: "Upcoming deadline",
      description: "Research summary draft is due this Friday.",
      time: "3 days left",
      icon: Calendar,
    },
    {
      id: "s4",
      title: "Evaluation window",
      description: "Mid-internship self-evaluation opens next Monday.",
      time: "Next week",
      icon: ClipboardCheck,
    },
  ],
  mentor: [
    {
      id: "m1",
      title: "Reports awaiting review",
      description: "3 daily reports from your interns need feedback.",
      time: "1 hour ago",
      icon: FileText,
    },
    {
      id: "m2",
      title: "Task review deadline",
      description: "Approve or return submitted tasks before end of day.",
      time: "Today",
      icon: CheckSquare,
    },
    {
      id: "m3",
      title: "Evaluation period",
      description: "Intern mid-term evaluations must be submitted by Friday.",
      time: "4 days left",
      icon: ClipboardCheck,
    },
    {
      id: "m4",
      title: "Attendance follow-up",
      description: "2 interns missed check-in yesterday — review if needed.",
      time: "Yesterday",
      icon: Clock,
    },
  ],
  admin: [
    {
      id: "a1",
      title: "Pending account approvals",
      description: "2 new intern registrations are waiting for activation.",
      time: "30 minutes ago",
      icon: Users,
    },
    {
      id: "a2",
      title: "Report submission spike",
      description: "Unusually high volume of daily reports in the last 24 hours.",
      time: "Today",
      icon: FileText,
    },
    {
      id: "a3",
      title: "Task assignment backlog",
      description: "5 tasks are overdue across departments.",
      time: "This week",
      icon: CheckSquare,
    },
    {
      id: "a4",
      title: "System maintenance",
      description: "Scheduled maintenance this Sunday 2:00–4:00 AM (local).",
      time: "Reminder",
      icon: AlertCircle,
    },
  ],
};

const sidebarRoleLabel: Record<UserRole, string> = {
  student: "Intern",
  mentor: "Mentor",
  admin: "Admin",
};

type AppSidebarProps = {
  collapsed?: boolean;
};

export default function AppSidebar({ collapsed = false }: AppSidebarProps) {
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
    <aside
      className={cn(
        "portal-app fixed left-0 top-0 z-40 flex min-h-screen flex-col justify-between bg-sidebar transition-[width] duration-300",
        collapsed ? "w-20" : "w-60"
      )}
    >
      <div>
        <div className={cn("flex items-center pt-5 pb-4", collapsed ? "justify-center px-2" : "gap-3 px-5")}>
          <img src={hytLogo} alt="HYT Foundation" width={48} height={48} />
          <div className={cn(collapsed && "hidden")}>
            <p className="text-xs font-bold tracking-wider text-sidebar-accent-foreground leading-tight">HELPING YOUTH<br/>TRANSCEND</p>
            <p className="text-[9px] text-sidebar-muted tracking-wider">DREAM ACADEMY PORTAL</p>
          </div>
        </div>

        <nav
          className={cn("sidebar-scroll mt-2 overflow-y-auto space-y-5", collapsed ? "px-2" : "px-3")}
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          {sections.map((section) => (
            <div key={section.label}>
              <p className={cn("mb-1.5 text-[10px] font-semibold tracking-widest text-sidebar-muted", collapsed ? "hidden" : "px-3")}>
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        } ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className={cn("flex-1", collapsed && "hidden")}>{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={cn("relative pb-4", collapsed ? "px-2" : "px-3")} ref={menuRef}>
        {profileMenuOpen && (
          <div
            className={cn(
              "absolute bottom-16 z-50 overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent shadow-xl",
              collapsed ? "left-full ml-2 w-48" : "left-3 right-3"
            )}
          >
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
          className={cn(
            "cursor-pointer rounded-lg px-3 py-3 transition-colors hover:bg-sidebar-accent",
            collapsed ? "flex justify-center" : "flex items-center gap-3"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
            {user.initials}
          </div>
          <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-muted truncate">{sidebarRoleLabel[role]}</p>
          </div>
          <MoreVertical className={cn("h-4 w-4 text-sidebar-muted", collapsed && "hidden")} />
        </div>
      </div>
    </aside>
  );
}

type TopBarProps = {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
};

export function TopBar({ collapsed = false, onToggleSidebar }: TopBarProps) {
  const { role } = useRole();
  const notifications = systemNotificationsByRole[role];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="h-9 w-9 rounded-md border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelRight className="mx-auto h-4 w-4" /> : <PanelLeft className="mx-auto h-4 w-4" />}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Notifications"
              aria-haspopup="dialog"
            >
              <Bell className="w-5 h-5 text-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[min(100vw-2rem,22rem)] p-0"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Tasks, deadlines, and system updates</p>
            </div>
            <ScrollArea className="h-[min(20rem,50vh)]">
              <ul className="divide-y divide-border p-2">
                {notifications.map((item) => (
                  <li key={item.id}>
                    <div className="flex gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/80">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground/90">{item.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <button
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
