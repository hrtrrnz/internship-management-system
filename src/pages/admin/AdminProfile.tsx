import { Calendar, Shield } from "lucide-react";
import { ProfilePhotoEditor } from "@/components/ProfilePhotoEditor";
import { ProfileAccountSection, ProfilePasswordLastUpdated } from "@/components/profile/ProfileAccountSection";
import { useRole } from "@/contexts/RoleContext";

export default function AdminProfile() {
  const { user } = useRole();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <ProfilePhotoEditor />
          <h3 className="mt-2 text-xl font-display font-bold text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.roleLabel}</p>
          <ProfileAccountSection className="mt-4 w-full text-left" />
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Admin Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock icon={Shield} label="Role" value="Admin" />
              <InfoBlock icon={Shield} label="Access Level" value="Full System Access" />
              <InfoBlock icon={Calendar} label="Member Since" value="January 2025" />
              <InfoBlock
                icon={Calendar}
                label="Last Password Update"
                value={<ProfilePasswordLastUpdated />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
