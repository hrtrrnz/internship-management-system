import { useEffect, useMemo, useState } from "react";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ALL_PERMISSION_IDS,
  PERMISSION_CATALOG,
  type PermissionId,
  type RoleDefinition,
} from "@/lib/rolePermissions";

type PermissionEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleDefinition | null;
  onSave: (roleName: RoleDefinition["name"], permissionIds: PermissionId[]) => void;
};

export function PermissionEditorDialog({
  open,
  onOpenChange,
  role,
  onSave,
}: PermissionEditorDialogProps) {
  const [selected, setSelected] = useState<Set<PermissionId>>(new Set());

  useEffect(() => {
    if (role && open) {
      setSelected(new Set(role.permissionIds));
    }
  }, [role, open]);

  const selectedCount = selected.size;
  const totalCount = ALL_PERMISSION_IDS.length;

  const groups = useMemo(() => PERMISSION_CATALOG, []);

  const toggle = (id: PermissionId, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const setGroup = (ids: PermissionId[], checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    if (!role) return;
    onSave(role.name, [...selected]);
    onOpenChange(false);
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[min(90vh,40rem)] flex flex-col gap-0 p-0 overflow-hidden sm:max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-start gap-3 pr-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(var(${role.color}) / 0.15)` }}
            >
              <Shield className="w-5 h-5" style={{ color: `hsl(var(${role.color}))` }} />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="font-display">{role.name}</DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-1">
                <Users className="w-3 h-3 shrink-0" />
                {role.count} users · {selectedCount} of {totalCount} permissions enabled
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {groups.map((group) => {
            const ids = group.permissions.map((p) => p.id);
            const enabledInGroup = ids.filter((id) => selected.has(id)).length;
            const allOn = enabledInGroup === ids.length;
            const someOn = enabledInGroup > 0 && !allOn;

            return (
              <section key={group.category}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-foreground">{group.category}</h4>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setGroup(ids, !allOn)}
                  >
                    {allOn ? "Clear all" : someOn ? "Select all" : "Select all"}
                  </button>
                </div>
                <ul className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                  {group.permissions.map((perm) => {
                    const checked = selected.has(perm.id);
                    return (
                      <li key={perm.id}>
                        <label
                          className={cn(
                            "flex items-start gap-3 rounded-md px-2 py-1.5 cursor-pointer",
                            "hover:bg-muted/50 transition-colors",
                          )}
                        >
                          <Checkbox
                            id={`perm-${role.name}-${perm.id}`}
                            checked={checked}
                            onCheckedChange={(value) => toggle(perm.id, value === true)}
                            className="mt-0.5"
                          />
                          <span className="text-sm text-foreground leading-snug">{perm.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0 sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setSelected(new Set(role.permissionIds))}
          >
            Reset changes
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSave}
            >
              Save permissions
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
