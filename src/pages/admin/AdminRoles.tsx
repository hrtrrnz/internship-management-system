import { useState } from "react";
import { Shield, Users, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PermissionEditorDialog } from "@/components/admin/PermissionEditorDialog";
import {
  INITIAL_ROLES,
  permissionLabel,
  type PermissionId,
  type RoleDefinition,
  type RoleName,
} from "@/lib/rolePermissions";

export default function AdminRoles() {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const openEditor = (role: RoleDefinition) => {
    setEditingRole(role);
    setEditorOpen(true);
  };

  const handleSave = (roleName: RoleName, permissionIds: PermissionId[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.name === roleName ? { ...r, permissionIds } : r)),
    );
    toast({
      title: "Permissions updated",
      description: `${permissionIds.length} permissions saved for ${roleName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground mt-1">Click a role to edit its permissions.</p>
      </div>

      <PermissionEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        role={editingRole}
        onSave={handleSave}
      />

      <div className="space-y-4">
        {roles.map((role) => (
          <button
            key={role.name}
            type="button"
            onClick={() => openEditor(role)}
            className="w-full text-left bg-card rounded-xl border border-border p-6 hover:shadow-sm hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(var(${role.color}) / 0.15)` }}
                >
                  <Shield className="w-5 h-5" style={{ color: `hsl(var(${role.color}))` }} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{role.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {role.count} users
                  </p>
                </div>
              </div>
              <span
                className="p-2 rounded-lg text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-colors"
                aria-hidden
              >
                <Edit className="w-4 h-4" />
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissionIds.map((id) => (
                <span
                  key={id}
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs text-foreground font-medium"
                >
                  {permissionLabel(id)}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
