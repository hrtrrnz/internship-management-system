import { useMemo, useState } from "react";
import { Building, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Department = {
  name: string;
  head: string;
  mentors: number;
  interns: number;
  color: string;
  mentorMembers: string[];
  internMembers: string[];
};

const initialDepartments: Department[] = [
  {
    name: "Technology & Innovation",
    head: "Dr. Roberto Lim",
    mentors: 3,
    interns: 8,
    color: "--stat-blue",
    mentorMembers: ["Dr. Roberto Lim", "Maria Reyes", "Noah Villanueva"],
    internMembers: ["Juan dela Cruz", "Ana Santos", "Mark Rivera", "Grace Yu", "Alex Cruz", "Bea Santos", "Renz Castillo", "Ivy Mendoza"],
  },
  {
    name: "Marketing",
    head: "Sarah Villanueva",
    mentors: 2,
    interns: 6,
    color: "--stat-orange",
    mentorMembers: ["Sarah Villanueva", "James Cruz"],
    internMembers: ["Lisa Tan", "Sofia Garcia", "Mika Sarmiento", "Lia Tan", "Noah Villanueva", "Sara Kim"],
  },
  {
    name: "Operations",
    head: "Elena Torres",
    mentors: 1,
    interns: 4,
    color: "--stat-green",
    mentorMembers: ["Elena Torres"],
    internMembers: ["Peter Lim", "Marco Reyes", "Adrian Cole", "Zed Alonzo"],
  },
  {
    name: "Data Analytics",
    head: "Michael Tan",
    mentors: 1,
    interns: 3,
    color: "--stat-emerald",
    mentorMembers: ["Michael Tan"],
    internMembers: ["David Chen", "Adrian Cole", "Renz Castillo"],
  },
  {
    name: "Human Resources",
    head: "Patricia Cruz",
    mentors: 1,
    interns: 2,
    color: "--stat-blue",
    mentorMembers: ["Patricia Cruz"],
    internMembers: ["Sofia Garcia", "Ivy Mendoza"],
  },
  {
    name: "Finance",
    head: "Antonio Reyes",
    mentors: 0,
    interns: 1,
    color: "--stat-orange",
    mentorMembers: [],
    internMembers: ["Zed Alonzo"],
  },
];

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState(initialDepartments[0]?.name ?? "");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", head: "" });

  const selectedDepartment = useMemo(
    () => departments.find((d) => d.name === selectedDepartmentName) ?? departments[0],
    [departments, selectedDepartmentName],
  );

  const openDetails = (dept: Department) => {
    setSelectedDepartmentName(dept.name);
    setDetailsOpen(true);
  };

  const openEdit = (dept: Department) => {
    setSelectedDepartmentName(dept.name);
    setDraft({
      name: dept.name,
      head: dept.head,
    });
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Departments</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {departments.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => openDetails(d)}
            className="w-full text-left bg-card rounded-xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(d);
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Edit className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold font-display text-foreground">{d.mentors}</p>
                <p className="text-[10px] text-muted-foreground">Mentors</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold font-display text-foreground">{d.interns}</p>
                <p className="text-[10px] text-muted-foreground">Interns</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedDepartment && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDepartment.name}</DialogTitle>
              <DialogDescription>
                Department overview and current operational snapshot.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{selectedDepartment.mentors}</p>
                  <p className="text-xs text-muted-foreground">Mentors</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{selectedDepartment.interns}</p>
                  <p className="text-xs text-muted-foreground">Interns</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Department Head</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedDepartment.head}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">Mentors</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {selectedDepartment.mentorMembers.length > 0 ? (
                      selectedDepartment.mentorMembers.map((member) => <li key={member}>- {member}</li>)
                    ) : (
                      <li>No mentors assigned yet.</li>
                    )}
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">Interns</p>
                  <ul className="mt-2 max-h-48 space-y-1.5 overflow-auto text-sm text-muted-foreground">
                    {selectedDepartment.internMembers.length > 0 ? (
                      selectedDepartment.internMembers.map((member) => <li key={member}>- {member}</li>)
                    ) : (
                      <li>No interns assigned yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => openEdit(selectedDepartment)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                Edit Department
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department details (demo interaction only).</DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDepartments((prev) =>
                prev.map((d) =>
                  d.name === selectedDepartmentName
                    ? { ...d, name: draft.name, head: draft.head }
                    : d,
                ),
              );
              setSelectedDepartmentName(draft.name);
              setEditOpen(false);
              toast({
                title: "Department updated",
                description: `${draft.name} details have been updated.`,
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department name</Label>
              <Input
                id="dept-name"
                value={draft.name}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-head">Department head</Label>
              <Input
                id="dept-head"
                value={draft.head}
                onChange={(e) => setDraft((prev) => ({ ...prev, head: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">
                Save Changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
