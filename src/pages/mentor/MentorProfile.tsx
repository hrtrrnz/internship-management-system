import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar, Star } from "lucide-react";

export default function MentorProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
        <p className="text-sm text-muted-foreground">Your mentor profile and information</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold font-display mb-4">
            MR
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Maria Reyes</h3>
          <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-stat-orange fill-stat-orange" />)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">4.8 avg. mentor rating</p>

          <div className="mt-4 w-full space-y-3 text-left">
            <InfoRow icon={Mail} label="Email" value="maria.reyes@hytfoundation.org" />
            <InfoRow icon={Phone} label="Phone" value="+63 917 555 1234" />
            <InfoRow icon={MapPin} label="Location" value="Manila, Philippines" />
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Role Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock icon={Building} label="Department" value="Technology & Innovation" />
              <InfoBlock icon={Briefcase} label="Position" value="Senior Software Engineer" />
              <InfoBlock icon={Calendar} label="Mentoring Since" value="January 2025" />
              <InfoBlock icon={User} label="Total Interns Mentored" value="15" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Node.js", "System Design", "API Architecture", "PostgreSQL", "Team Leadership", "Agile/Scrum"].map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground font-medium">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-3">Mentorship Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-stat-green-bg">
                <p className="text-2xl font-bold font-display text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Active Interns</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-stat-blue-bg">
                <p className="text-2xl font-bold font-display text-foreground">48</p>
                <p className="text-xs text-muted-foreground">Sessions Held</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-stat-orange-bg">
                <p className="text-2xl font-bold font-display text-foreground">92%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
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
