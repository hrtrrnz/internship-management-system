import { Bell, Calendar, Lock, Save, Users } from "lucide-react";

export default function MentorSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Settings</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-5 h-5 text-stat-blue" />
            <h3 className="font-display font-bold text-foreground">Mentorship Preferences</h3>
          </div>
          <div className="space-y-4">
            <SettingRow label="Default intern view" value="My Interns" />
            <SettingRow label="Task assignment mode" value="Balanced Load" />
            <SettingRow label="Report review sort" value="Newest First" />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-stat-green" />
            <h3 className="font-display font-bold text-foreground">Notifications</h3>
          </div>
          <div className="space-y-4">
            <ToggleRow label="Pending review alerts" enabled={true} />
            <ToggleRow label="Task overdue alerts" enabled={true} />
            <ToggleRow label="Daily digest email" enabled={false} />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Calendar className="w-5 h-5 text-stat-orange" />
            <h3 className="font-display font-bold text-foreground">Work Schedule</h3>
          </div>
          <div className="space-y-4">
            <SettingRow label="Working Hours" value="8:00 AM - 5:00 PM" />
            <SettingRow label="Review Window" value="Weekdays, 2:00 PM - 4:00 PM" />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Lock className="w-5 h-5 text-stat-emerald" />
            <h3 className="font-display font-bold text-foreground">Security</h3>
          </div>
          <div className="space-y-4">
            <SettingRow label="Password Last Updated" value="March 8, 2026" />
            <ToggleRow label="Two-factor authentication" enabled={true} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ToggleRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${enabled ? "bg-accent" : "bg-muted"}`}>
        <div
          className={`w-4 h-4 rounded-full bg-card shadow-sm transition-transform mt-0.5 ${enabled ? "ml-4.5 translate-x-0" : "ml-0.5"}`}
          style={{ marginLeft: enabled ? "18px" : "2px" }}
        />
      </div>
    </div>
  );
}
