import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Shield, ArrowLeft } from "lucide-react";
import { useRole, UserRole } from "@/contexts/RoleContext";
import hytLogo from "@/assets/hyt-logo.png";

const demoRoles = [
  {
    role: "student" as UserRole,
    icon: GraduationCap,
    title: "Intern",
    name: "Juan dela Cruz",
    description: "Experience the portal as an intern — view your dashboard, log attendance, submit reports, and track your progress through the program.",
    color: "--stat-green",
    path: "/portal",
  },
  {
    role: "mentor" as UserRole,
    icon: Users,
    title: "Mentor",
    name: "Maria Reyes",
    description: "See the mentor view — manage your assigned interns, review reports, and conduct evaluations.",
    color: "--stat-blue",
    path: "/mentor",
  },
  {
    role: "admin" as UserRole,
    icon: Shield,
    title: "Administrator",
    name: "Carlos Santos",
    description: "Explore the admin panel — oversee all users, departments, attendance logs, analytics, and system settings.",
    color: "--stat-orange",
    path: "/admin",
  },
];

export default function DemoSelect() {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const handleSelect = (item: typeof demoRoles[0]) => {
    setRole(item.role);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <img src={hytLogo} alt="HYT Foundation" width={100} height={100} className="mb-6" />
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Choose a Demo View</h1>
      <p className="text-muted-foreground mb-10 text-center max-w-lg">
        Select a role to explore the Dream Academy Portal. Each view shows different features and capabilities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {demoRoles.map((item) => (
          <button
            key={item.role}
            onClick={() => handleSelect(item)}
            className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `hsl(var(${item.color}) / 0.15)` }}>
              <item.icon className="w-7 h-7" style={{ color: `hsl(var(${item.color}))` }} />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm font-medium mb-3" style={{ color: `hsl(var(${item.color}))` }}>{item.name}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            <div className="mt-4 text-sm font-semibold group-hover:underline" style={{ color: `hsl(var(${item.color}))` }}>
              Enter as {item.title} →
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => navigate("/signin")} className="mt-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </button>
    </div>
  );
}
