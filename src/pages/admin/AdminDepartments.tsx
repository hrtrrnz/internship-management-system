import { Building, Users, GraduationCap, Edit } from "lucide-react";

const departments = [
  { name: "Technology & Innovation", head: "Dr. Roberto Lim", mentors: 3, interns: 8, capacity: 10, color: "--stat-blue" },
  { name: "Marketing", head: "Sarah Villanueva", mentors: 2, interns: 6, capacity: 8, color: "--stat-orange" },
  { name: "Operations", head: "Elena Torres", mentors: 1, interns: 4, capacity: 6, color: "--stat-green" },
  { name: "Data Analytics", head: "Michael Tan", mentors: 1, interns: 3, capacity: 5, color: "--stat-emerald" },
  { name: "Human Resources", head: "Patricia Cruz", mentors: 1, interns: 2, capacity: 4, color: "--stat-blue" },
  { name: "Finance", head: "Antonio Reyes", mentors: 0, interns: 1, capacity: 3, color: "--stat-orange" },
];

export default function AdminDepartments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Departments</h2>
        <p className="text-sm text-muted-foreground">Manage organizational departments and capacity</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {departments.map((d) => (
          <div key={d.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${d.color}) / 0.15)` }}>
                  <Building className="w-5 h-5" style={{ color: `hsl(var(${d.color}))` }} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{d.name}</h4>
                  <p className="text-xs text-muted-foreground">Head: {d.head}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold font-display text-foreground">{d.mentors}</p>
                <p className="text-[10px] text-muted-foreground">Mentors</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold font-display text-foreground">{d.interns}</p>
                <p className="text-[10px] text-muted-foreground">Interns</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold font-display text-foreground">{d.capacity}</p>
                <p className="text-[10px] text-muted-foreground">Capacity</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Capacity Usage</span>
                <span>{Math.round((d.interns / d.capacity) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${(d.interns / d.capacity) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
