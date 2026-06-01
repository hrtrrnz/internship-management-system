import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckSquare, Users } from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { INTERN_ROSTER, type InternBatch, internInitials } from "@/lib/internRoster";

const CATEGORIES = ["Development", "Design", "Reports", "Marketing"] as const;

const BATCHES: InternBatch[] = ["B16", "B15", "B14"];

const defaultDueDate = () => {
  const d = new Date(2026, 5, 14);
  return d.toISOString().slice(0, 10);
};

type AssignTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssignTaskDialog({ open, onOpenChange }: AssignTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Development");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [selectedBatches, setSelectedBatches] = useState<Set<InternBatch>>(new Set(BATCHES));
  const [selectedInternIds, setSelectedInternIds] = useState<Set<string>>(
    () => new Set(INTERN_ROSTER.map((i) => i.id)),
  );

  const visibleInterns = useMemo(
    () => INTERN_ROSTER.filter((i) => selectedBatches.has(i.batch)),
    [selectedBatches],
  );

  const toggleBatch = (batch: InternBatch, checked: boolean) => {
    setSelectedBatches((prev) => {
      const next = new Set(prev);
      if (checked) next.add(batch);
      else next.delete(batch);
      return next;
    });
  };

  useEffect(() => {
    setSelectedInternIds((prev) => {
      const visibleIds = new Set(visibleInterns.map((i) => i.id));
      const next = new Set<string>();
      for (const id of prev) {
        if (visibleIds.has(id)) next.add(id);
      }
      if (next.size === 0) {
        visibleInterns.forEach((i) => next.add(i.id));
      }
      return next;
    });
  }, [visibleInterns]);

  const toggleIntern = (id: string, checked: boolean) => {
    setSelectedInternIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectAllInterns = (checked: boolean) => {
    if (checked) {
      setSelectedInternIds(new Set(visibleInterns.map((i) => i.id)));
    } else {
      setSelectedInternIds(new Set());
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Development");
    setDueDate(defaultDueDate());
    setSelectedBatches(new Set(BATCHES));
    setSelectedInternIds(new Set(INTERN_ROSTER.map((i) => i.id)));
  };

  const handleClose = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Task title is required.");
      return;
    }
    if (selectedBatches.size === 0) {
      toast.error("Select at least one batch.");
      return;
    }
    if (selectedInternIds.size === 0) {
      toast.error("Select at least one intern.");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required.");
      return;
    }

    const internNames = INTERN_ROSTER.filter((i) => selectedInternIds.has(i.id)).map((i) => i.name);
    const dueLabel = new Date(dueDate + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    toast.success("Task assigned", {
      description: `"${trimmedTitle}" assigned to ${internNames.length} intern${internNames.length === 1 ? "" : "s"} · due ${dueLabel}.`,
    });
    handleClose(false);
  };

  const allVisibleSelected =
    visibleInterns.length > 0 && visibleInterns.every((i) => selectedInternIds.has(i.id));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">Assign task</DialogTitle>
          <DialogDescription>
            Create a new assignment and choose which interns receive it. This demo saves locally and shows a confirmation only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="task-title">
              Task title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="task-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Due date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              Assign to batches
            </div>
            <div className="flex flex-wrap gap-4">
              {BATCHES.map((batch) => (
                <label key={batch} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={selectedBatches.has(batch)}
                    onCheckedChange={(checked) => toggleBatch(batch, checked === true)}
                  />
                  Batch {batch.replace("B", "")}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                Interns ({selectedInternIds.size} selected)
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) => selectAllInterns(checked === true)}
                />
                Select all
              </label>
            </div>
            {visibleInterns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Select at least one batch to see interns.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {visibleInterns.map((intern) => (
                  <label
                    key={intern.id}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-muted/50",
                      selectedInternIds.has(intern.id) && "bg-primary/5",
                    )}
                  >
                    <Checkbox
                      checked={selectedInternIds.has(intern.id)}
                      onCheckedChange={(checked) => toggleIntern(intern.id, checked === true)}
                    />
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {internInitials(intern.name)}
                    </span>
                    <span className="min-w-0 flex-1 font-medium text-foreground truncate">{intern.name}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">{intern.batch}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <CheckSquare className="h-4 w-4" />
              Assign task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
