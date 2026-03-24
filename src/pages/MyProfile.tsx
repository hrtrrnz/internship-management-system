import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar } from "lucide-react";

export default function MyProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
        <p className="text-sm text-muted-foreground">Your personal and internship information</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold font-display mb-4">
            JD
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Juan dela Cruz</h3>
          <p className="text-sm text-muted-foreground">Technology & Innovation Intern</p>
          <div className="mt-4 w-full space-y-3 text-left">
            <InfoRow icon={Mail} label="Email" value="juan.delacruz@email.com" />
            <InfoRow icon={Phone} label="Phone" value="+63 912 345 6789" />
            <InfoRow icon={MapPin} label="Location" value="Manila, Philippines" />
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Internship Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock icon={Building} label="Department" value="Technology & Innovation" />
              <InfoBlock icon={Briefcase} label="Position" value="Software Development Intern" />
              <InfoBlock icon={Calendar} label="Start Date" value="February 3, 2026" />
              <InfoBlock icon={Calendar} label="End Date" value="April 24, 2026" />
              <InfoBlock icon={User} label="Mentor" value="Maria Reyes" />
              <InfoBlock icon={MapPin} label="Office" value="HYT Foundation HQ" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground mb-4">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Git", "Figma", "REST APIs"].map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground font-medium">
                  {skill}
                </span>
              ))}
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
