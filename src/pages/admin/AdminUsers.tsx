import { useState } from "react";
import { Users, Plus, MoreVertical, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const users = [
  { name: "Carlos Santos", email: "carlos@hytfoundation.org", role: "Admin", department: "Administration", status: "Active", joinDate: "Jan 2025" },
  { name: "Maria Reyes", email: "maria.reyes@hytfoundation.org", role: "Mentor", department: "Tech & Innovation", status: "Active", joinDate: "Jan 2025" },
  { name: "James Cruz", email: "james.cruz@hytfoundation.org", role: "Mentor", department: "Marketing", status: "Active", joinDate: "Mar 2025" },
  { name: "Elena Torres", email: "elena@hytfoundation.org", role: "Mentor", department: "Operations", status: "Active", joinDate: "Feb 2025" },
  { name: "Juan dela Cruz", email: "juan.delacruz@email.com", role: "Intern", department: "Tech & Innovation", status: "Active", joinDate: "Feb 2026" },
  { name: "Ana Santos", email: "ana.santos@email.com", role: "Intern", department: "Tech & Innovation", status: "Active", joinDate: "Feb 2026" },
  { name: "Mark Rivera", email: "mark.rivera@email.com", role: "Intern", department: "Tech & Innovation", status: "Flagged", joinDate: "Feb 2026" },
  { name: "Lisa Tan", email: "lisa.tan@email.com", role: "Intern", department: "Marketing", status: "Active", joinDate: "Feb 2026" },
  { name: "Peter Lim", email: "peter.lim@email.com", role: "Intern", department: "Operations", status: "Active", joinDate: "Feb 2026" },
  { name: "Grace Yu", email: "grace.yu@email.com", role: "Intern", department: "Tech & Innovation", status: "Active", joinDate: "Mar 2026" },
];

const roleStyles: Record<string, string> = {
  Admin: "text-stat-orange bg-stat-orange-bg",
  Mentor: "text-stat-blue bg-stat-blue-bg",
  Intern: "text-stat-green bg-stat-green-bg",
};

export default function AdminUsers() {
  const [filterRole, setFilterRole] = useState<string>("All");
  const [openAddUser, setOpenAddUser] = useState(false);
  const filtered = filterRole === "All" ? users : users.filter(u => u.role === filterRole);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">User Management</h2>
        </div>
        <button
          onClick={() => setOpenAddUser(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Role</p>
            <div className="space-y-1">
              {["All", "Admin", "Mentor", "Intern"].map((role) => {
                const count = role === "All" ? users.length : users.filter(u => u.role === role).length;
                return (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterRole === role ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{role}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</p>
            <div className="space-y-1">
              {[
                { label: "Active", count: users.filter(u => u.status === "Active").length, dot: "bg-stat-green" },
                { label: "Flagged", count: users.filter(u => u.status === "Flagged").length, dot: "bg-stat-orange" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between px-3 py-2 text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User cards grid */}
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() =>
                  toast({
                    title: "User preview",
                    description: `Opened ${u.name} profile card.`,
                  })
                }
                className="w-full text-left bg-card rounded-xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {u.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "Quick actions",
                        description: `Actions for ${u.name} are coming soon.`,
                      });
                    }}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{u.name}</h4>
                <p className="text-xs text-muted-foreground truncate mb-2">{u.email}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleStyles[u.role]}`}>{u.role}</span>
                  {u.status === "Flagged" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-stat-orange bg-stat-orange-bg">Flagged</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{u.department}</span>
                  <span>Since {u.joinDate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={openAddUser} onOpenChange={setOpenAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new admin, mentor, or intern profile.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOpenAddUser(false);
              toast({
                title: "User created",
                description: "The new user has been added successfully.",
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="add-user-name">Full name</Label>
              <Input id="add-user-name" placeholder="Juan dela Cruz" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-user-email">Email</Label>
              <Input id="add-user-email" type="email" placeholder="juan@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-user-role">Role</Label>
              <select
                id="add-user-role"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="Intern"
              >
                <option>Admin</option>
                <option>Mentor</option>
                <option>Intern</option>
              </select>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setOpenAddUser(false)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">
                Save user
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
