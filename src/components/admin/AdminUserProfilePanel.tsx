import { Calendar, Mail, MapPin, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { internInitials } from "@/lib/internRoster";

export type AdminUserRecord = {
  name: string;
  email: string;
  role: "Admin" | "Mentor" | "Intern";
  department: string;
  status: string;
  joinDate: string;
  batch?: string;
};

const roleStyles: Record<AdminUserRecord["role"], string> = {
  Admin: "text-stat-orange bg-stat-orange-bg",
  Mentor: "text-stat-blue bg-stat-blue-bg",
  Intern: "text-stat-green bg-stat-green-bg",
};

type AdminUserProfilePanelProps = {
  user: AdminUserRecord;
  onClose: () => void;
};

export function AdminUserProfilePanel({ user, onClose }: AdminUserProfilePanelProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close profile"
        className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed z-50 bottom-6 right-6 w-[min(calc(100vw-2rem),22rem)]",
          "rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/5",
          "animate-in slide-in-from-bottom-4 fade-in duration-200",
        )}
        role="dialog"
        aria-labelledby="admin-user-profile-title"
      >
        <div className="flex items-start justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">User profile</p>
            <h3 id="admin-user-profile-title" className="mt-0.5 font-display text-lg font-bold text-foreground">
              {user.name}
            </h3>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 py-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {internInitials(user.name)}
            </div>
            <span className={cn("mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium", roleStyles[user.role])}>
              {user.role}
            </span>
            {user.status === "Flagged" ? (
              <span className="mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium text-stat-orange bg-stat-orange-bg">
                Flagged
              </span>
            ) : (
              <span className="mt-2 text-xs text-muted-foreground">{user.status}</span>
            )}
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <Detail icon={Mail} label="Email" value={user.email} />
            <Detail icon={MapPin} label="Department" value={user.department} />
            {user.batch ? <Detail icon={Shield} label="Batch" value={user.batch} /> : null}
            <Detail icon={Calendar} label="Member since" value={user.joinDate} />
          </dl>
        </div>

        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button type="button" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
            Edit user
          </Button>
        </div>
      </aside>
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium text-foreground break-words">{value}</dd>
      </div>
    </div>
  );
}
