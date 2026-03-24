import { Star, Users, Mail, MoreVertical } from "lucide-react";

const mentors = [
  { name: "Maria Reyes", department: "Tech & Innovation", interns: 5, rating: 4.8, sessions: 48, email: "maria.reyes@hytfoundation.org" },
  { name: "James Cruz", department: "Marketing", interns: 3, rating: 4.5, sessions: 32, email: "james.cruz@hytfoundation.org" },
  { name: "Elena Torres", department: "Operations", interns: 2, rating: 4.6, sessions: 28, email: "elena@hytfoundation.org" },
  { name: "Michael Tan", department: "Data Analytics", interns: 2, rating: 4.3, sessions: 22, email: "michael.tan@hytfoundation.org" },
  { name: "Patricia Cruz", department: "Human Resources", interns: 1, rating: 4.4, sessions: 18, email: "patricia@hytfoundation.org" },
  { name: "Roberto Lim", department: "Tech & Innovation", interns: 2, rating: 4.7, sessions: 35, email: "roberto@hytfoundation.org" },
  { name: "Sarah Villanueva", department: "Marketing", interns: 3, rating: 4.2, sessions: 25, email: "sarah@hytfoundation.org" },
  { name: "Antonio Reyes", department: "Finance", interns: 1, rating: 4.0, sessions: 12, email: "antonio@hytfoundation.org" },
];

export default function AdminMentors() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Mentors</h2>
        <p className="text-sm text-muted-foreground">Overview of all mentors in the program</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {mentors.map((m) => (
          <div key={m.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {m.name.split(" ").map(n => n[0]).join("")}
              </div>
              <button className="p-1 rounded hover:bg-muted transition-colors">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <h4 className="font-semibold text-foreground">{m.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{m.department}</p>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3.5 h-3.5 text-stat-orange fill-stat-orange" />
              <span className="text-sm font-medium text-foreground">{m.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">· {m.sessions} sessions</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <Users className="w-3.5 h-3.5" /> {m.interns} active interns
            </div>
            <button className="w-full py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
