import { useState } from "react";
import { Plus, MoreVertical, Search } from "lucide-react";
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
import {
  AdminUserProfilePanel,
  type AdminUserRecord,
} from "@/components/admin/AdminUserProfilePanel";
import { cn } from "@/lib/utils";
import {
  ADMIN_EMAIL,
  ADMIN_NAME,
  DEMO_STUDENT_NAME,
  getAdminInternRows,
  internEmail,
  internInitials,
  MENTOR_NAME,
} from "@/lib/internRoster";

const joinDateByBatch: Record<string, string> = {
  B14: "Jul 2025",
  B15: "Oct 2025",
  B16: "Feb 2026",
};

const internUsers: AdminUserRecord[] = getAdminInternRows().map((row) => ({
  name: row.name,
  email: internEmail(row.name),
  role: "Intern" as const,
  department: row.department,
  status: "Active",
  joinDate: joinDateByBatch[row.batch] ?? "Feb 2026",
  batch: row.batch,
}));

const users: AdminUserRecord[] = [
  {
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    role: "Admin",
    department: "Administration",
    status: "Active",
    joinDate: "Jan 2025",
  },
  {
    name: MENTOR_NAME,
    email: "james.aeron.borja@hytfoundation.org",
    role: "Mentor",
    department: "Tech & Innovation",
    status: "Active",
    joinDate: "Jan 2025",
  },
  ...internUsers,
];

const roleStyles: Record<string, string> = {
  Admin: "text-stat-orange bg-stat-orange-bg",
  Mentor: "text-stat-blue bg-stat-blue-bg",
  Intern: "text-stat-green bg-stat-green-bg",
};

export default function AdminUsers() {
  const [filterRole, setFilterRole] = useState<string>("All");
  const [openAddUser, setOpenAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const filtered = filterRole === "All" ? users : users.filter((u) => u.role === filterRole);

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
                const count = role === "All" ? users.length : users.filter((u) => u.role === role).length;
                return (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterRole === role ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
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
                { label: "Active", count: users.filter((u) => u.status === "Active").length, dot: "bg-stat-green" },
                { label: "Flagged", count: users.filter((u) => u.status === "Flagged").length, dot: "bg-stat-orange" },
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

        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((u) => {
              const isSelected = selectedUser?.email === u.email;
              return (
                <div
                  key={u.email}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedUser(u)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedUser(u);
                    }
                  }}
                  className={cn(
                    "w-full text-left bg-card rounded-xl border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",
                    isSelected ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-border",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {internInitials(u.name)}
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
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-stat-orange bg-stat-orange-bg">
                        Flagged
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{u.department}</span>
                    <span>Since {u.joinDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedUser ? (
        <AdminUserProfilePanel user={selectedUser} onClose={() => setSelectedUser(null)} />
      ) : null}

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
              <Input id="add-user-name" placeholder={DEMO_STUDENT_NAME} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-user-email">Email</Label>
              <Input id="add-user-email" type="email" placeholder="fullname.dreamacademy@gmail.com" required />
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
