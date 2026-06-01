import { useState } from "react";
import { Lock, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileAccount } from "@/contexts/ProfileAccountContext";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { EditAddressDialog } from "@/components/profile/EditAddressDialog";
import { EditEmailDialog } from "@/components/profile/EditEmailDialog";
import { EditPhoneDialog } from "@/components/profile/EditPhoneDialog";

type ProfileAccountSectionProps = {
  className?: string;
  showSecurity?: boolean;
};

export function ProfileAccountSection({ className, showSecurity = true }: ProfileAccountSectionProps) {
  const { account } = useProfileAccount();
  const [emailOpen, setEmailOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <>
      <EditEmailDialog open={emailOpen} onOpenChange={setEmailOpen} />
      <EditPhoneDialog open={phoneOpen} onOpenChange={setPhoneOpen} />
      <EditAddressDialog open={addressOpen} onOpenChange={setAddressOpen} />
      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />

      <div className={className}>
        <div className="space-y-1">
          <EditableRow
            icon={Mail}
            label="Email"
            value={account.email}
            onEdit={() => setEmailOpen(true)}
            editLabel="Edit email"
          />
          <EditableRow
            icon={Phone}
            label="Phone"
            value={account.phone}
            onEdit={() => setPhoneOpen(true)}
            editLabel="Edit phone"
          />
          <EditableRow
            icon={MapPin}
            label="Address"
            value={account.address}
            onEdit={() => setAddressOpen(true)}
            editLabel="Edit address"
          />
        </div>

        {showSecurity ? (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setPasswordOpen(true)}
            >
              <Lock className="h-4 w-4" />
              Change password
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Last updated {account.passwordLastUpdated}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}

function EditableRow({
  icon: Icon,
  label,
  value,
  onEdit,
  editLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <Icon className="mt-0.5 w-4 h-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground break-words">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={editLabel}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ProfilePasswordLastUpdated() {
  const { account } = useProfileAccount();
  return <>{account.passwordLastUpdated}</>;
}
