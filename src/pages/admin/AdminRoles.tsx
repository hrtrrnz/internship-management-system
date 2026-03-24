import { Shield, Users, Edit } from "lucide-react";

const roles = [
  {
    name: "Administrator",
    count: 2,
    permissions: ["Full system access", "User management", "Settings configuration", "View all data", "Export reports", "Manage departments"],
    color: "--stat-orange",
  },
  {
    name: "Mentor",
    count: 8,
    permissions: ["View assigned interns", "Review reports", "Create evaluations", "Assign tasks", "Schedule sessions", "Manage learning paths"],
    color: "--stat-blue",
  },
  {
    name: "Intern",
    count: 24,
    permissions: ["View own dashboard", "Clock in/out", "Submit reports", "View tasks", "Access learning modules", "View evaluations"],
    color: "--stat-green",
  },
];

export default function AdminRoles() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground">Manage user roles and their access levels</p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.name} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${role.color}) / 0.15)` }}>
                  <Shield className="w-5 h-5" style={{ color: `hsl(var(${role.color}))` }} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{role.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {role.count} users
                  </p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((p) => (
                <span key={p} className="px-3 py-1.5 rounded-lg bg-muted text-xs text-foreground font-medium">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
