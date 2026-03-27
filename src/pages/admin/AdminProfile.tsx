import { Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

export default function AdminProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold font-display mb-4">
            CS
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Carlos Santos</h3>
          <p className="text-sm text-muted-foreground">Admin</p>
          <div className="mt-4 w-full space-y-3 text-left">
            <InfoRow icon={Mail} label="Email" value="carlos@hytfoundation.org" />
            <InfoRow icon={Phone} label="Phone" value="+63 918 200 1100" />
            <InfoRow icon={MapPin} label="Address" value="Manila, Philippines" />
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Admin Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock icon={Shield} label="Role" value="Admin" />
              <InfoBlock icon={Shield} label="Access Level" value="Full System Access" />
              <InfoBlock icon={Calendar} label="Member Since" value="January 2025" />
              <InfoBlock icon={Calendar} label="Last Password Update" value="March 5, 2026" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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
