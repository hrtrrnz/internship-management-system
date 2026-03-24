import { Users, Plus, MoreVertical, Shield } from "lucide-react";

const users = [
  { name: "Carlos Santos", email: "carlos@hytfoundation.org", role: "Admin", department: "Administration", status: "Active" },
  { name: "Maria Reyes", email: "maria.reyes@hytfoundation.org", role: "Mentor", department: "Tech & Innovation", status: "Active" },
  { name: "James Cruz", email: "james.cruz@hytfoundation.org", role: "Mentor", department: "Marketing", status: "Active" },
  { name: "Elena Torres", email: "elena@hytfoundation.org", role: "Mentor", department: "Operations", status: "Active" },
  { name: "Juan dela Cruz", email: "juan.delacruz@email.com", role: "Intern", department: "Tech & Innovation", status: "Active" },
  { name: "Ana Santos", email: "ana.santos@email.com", role: "Intern", department: "Tech & Innovation", status: "Active" },
  { name: "Mark Rivera", email: "mark.rivera@email.com", role: "Intern", department: "Tech & Innovation", status: "Flagged" },
  { name: "Lisa Tan", email: "lisa.tan@email.com", role: "Intern", department: "Marketing", status: "Active" },
  { name: "Peter Lim", email: "peter.lim@email.com", role: "Intern", department: "Operations", status: "Active" },
  { name: "Grace Yu", email: "grace.yu@email.com", role: "Intern", department: "Tech & Innovation", status: "Active" },
];

const roleStyles: Record<string, string> = {
  Admin: "text-stat-orange bg-stat-orange-bg",
  Mentor: "text-stat-blue bg-stat-blue-bg",
  Intern: "text-stat-green bg-stat-green-bg",
};

const statusStyles: Record<string, string> = {
  Active: "text-stat-green bg-stat-green-bg",
  Flagged: "text-stat-orange bg-stat-orange-bg",
  Inactive: "text-muted-foreground bg-muted",
};

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage all users in the Dream Academy Portal</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Department</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {u.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {u.name}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleStyles[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{u.department}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[u.status]}`}>{u.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
