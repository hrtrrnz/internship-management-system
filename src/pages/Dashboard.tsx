import {
  Clock,
  CheckSquare,
  FileText,
  Users,
  LogIn,
  LogOut,
  ExternalLink,
  Building2,
  Smile,
  Upload,
  X,
  ChevronDown,
  Circle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getInternTasks, type TaskItem } from "@/lib/internTasks";
import { ASSIGNED_COMPANY_OPTIONS, loadAssignedCompany, saveAssignedCompany } from "@/lib/assignedCompanies";
import { DEMO_STUDENT_NAME } from "@/lib/internRoster";

const OFFICE_LOCATION_OPTIONS = ["HYT Business Center", "Atlanta Office"] as const;

const MAX_ACCOMPLISHMENT_REPORT_BYTES = 10 * 1024 * 1024;

type UploadedAccomplishmentReport = {
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
};

function formatReportFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const dailyLogSelectTriggerClass =
  "mt-1 h-auto min-h-[2.75rem] w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-normal text-muted-foreground shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-0 data-[placeholder]:text-muted-foreground";

const dailyLogSelectMenuClass =
  "z-[200] max-h-60 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md w-[var(--radix-popover-trigger-width)]";

type DailyLogSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: readonly string[];
};

function DailyLogSelect({ value, onValueChange, placeholder, options }: DailyLogSelectProps) {
  const [open, setOpen] = useState(false);
  const displayLabel = value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            dailyLogSelectTriggerClass,
            "flex items-center justify-between gap-2 text-left",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        className={dailyLogSelectMenuClass}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ul className="max-h-52 overflow-y-auto" role="listbox">
          {options.map((option) => {
            const selected = value === option;
            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    selected && "bg-accent/50 font-medium",
                  )}
                  onClick={() => {
                    onValueChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function StatCard({ icon: Icon, value, label, sub, colorClass }: {
  icon: React.ElementType; value: string; label: string; sub: string; colorClass: string;
}) {
  return (
    <div className="rounded-xl bg-card p-5 border border-border/80 relative overflow-hidden shadow-sm">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `hsl(var(${colorClass}) / 0.16)` }}>
        <Icon className="w-5 h-5" style={{ color: `hsl(var(${colorClass}))` }} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs mt-1" style={{ color: `hsl(var(${colorClass}))` }}>{sub}</p>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-clock-bg rounded-xl p-5 flex items-center justify-between border border-sidebar-border/60">
      <p className="text-3xl font-mono font-bold text-stat-green tracking-wider">{h}:{m}:{s}</p>
      <div className="text-right">
        <p className="text-card font-semibold text-sm">{dayName}</p>
        <p className="text-sidebar-muted text-xs">{dateStr}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: `hsl(var(${colorClass}))` }} />
      </div>
    </div>
  );
}

const attendanceEntries = [
  { date: "Mar 21", time: "8:02 AM – 5:14 PM", status: "In" },
  { date: "Mar 20", time: "8:15 AM – 5:30 PM", status: "Out" },
  { date: "Mar 19", time: "7:58 AM – 5:00 PM", status: "In" },
  { date: "Mar 18", time: "8:30 AM – 5:45 PM", status: "Out" },
  { date: "Mar 17", time: "8:00 AM – 5:00 PM", status: "In" },
];

const internTasks = getInternTasks();
const pendingTasks = internTasks.filter((t) => t.status === "Pending");
const inProgressTasks = internTasks.filter((t) => t.status === "In Progress");

const INDIVIDUAL_LOGSHEET_URL = "https://docs.google.com/spreadsheets/d/1nz5LZ-USw7XH9qlRkzEa7WRXy7gzVort/edit?gid=1568030268#gid=1568030268";
const BATCH_DAILY_ATTENDANCE_URL = "https://docs.google.com/spreadsheets/d/1Dhf9qzRfnLJq04vK5GwRdfsdqNxNjYow8MQIBB9qLLc/edit?pli=1&gid=923080193#gid=923080193";

/** Scroll area fits exactly three summary rows (h-9 each). */
const TODO_PANEL_HEIGHT_CLASS = "h-[6.75rem]";
const TODO_ROW_CLASS = "flex h-9 shrink-0 items-center";

function TodoTaskItems({ tasks, emptyMessage }: { tasks: TaskItem[]; emptyMessage: string }) {
  if (tasks.length === 0) {
    return (
      <p className="flex h-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className={TODO_ROW_CLASS}>
          <Link
            to={`/tasks?task=${task.id}`}
            className="flex w-full items-center justify-between gap-3 rounded-md px-2 text-sm transition-colors hover:bg-muted/50"
          >
            <span className="min-w-0 flex-1 truncate font-medium text-foreground">{task.title}</span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">Due {task.due}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function formatDateTime(value: Date | null) {
  if (!value) return "—";
  return value.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [assignedCompany, setAssignedCompany] = useState(loadAssignedCompany);
  const [officeLocation, setOfficeLocation] = useState("");
  const [accomplishmentReport, setAccomplishmentReport] = useState<UploadedAccomplishmentReport | null>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const handleAccomplishmentReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_ACCOMPLISHMENT_REPORT_BYTES) {
      toast.error("PDF must be 10 MB or smaller.");
      return;
    }

    setAccomplishmentReport({
      fileName: file.name,
      fileSizeBytes: file.size,
      uploadedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    });
    toast.success("Accomplishment report attached");
  };

  const handleClockIn = () => {
    if (isClockedIn) return;
    setClockInTime(new Date());
    setClockOutTime(null);
    setAccomplishmentReport(null);
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    if (!isClockedIn) return;
    setClockOutTime(new Date());
    setAccomplishmentReport(null);
    setIsClockedIn(false);
  };

  const isClockOutMode = isClockedIn;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Clock} value="402 / 400" label="Training Hours" sub="Rendered Hours / Required Hours" colorClass="--stat-blue" />
        <StatCard icon={Users} value="34" label="Days Attended" sub="3 this week" colorClass="--stat-orange" />
        <StatCard icon={CheckSquare} value="18" label="Tasks Completed" sub="5 pending" colorClass="--stat-green" />
        <StatCard icon={FileText} value="78%" label="Overall Progress" sub="On track · 46 days left" colorClass="--stat-emerald" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Daily Log */}
        <div className="col-span-2">
          <div className="bg-card rounded-xl border border-border/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-display font-bold text-foreground">Dream Academy · Daily Log</h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isClockedIn ? "bg-stat-green-bg text-stat-green" : "bg-destructive/10 text-destructive"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isClockedIn ? "bg-stat-green" : "bg-destructive"}`} />
                {isClockedIn ? "Currently clocked in" : "Not yet clocked in"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Please complete your attendance details for today.</p>

            <LiveClock />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={() => window.open(INDIVIDUAL_LOGSHEET_URL, "_blank", "noopener,noreferrer")}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Individual Log Sheet</span>
                <ExternalLink className="w-4 h-4 text-accent" />
              </button>
              <button
                type="button"
                onClick={() => window.open(BATCH_DAILY_ATTENDANCE_URL, "_blank", "noopener,noreferrer")}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Batch Daily Attendance</span>
                <ExternalLink className="w-4 h-4 text-accent" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3" role="tablist" aria-label="Attendance mode">
              <div
                role="tab"
                aria-selected={!isClockedIn}
                aria-current={!isClockedIn ? "step" : undefined}
                className={`pointer-events-none flex select-none items-center justify-center gap-2 rounded-lg px-4 py-3 text-center text-sm font-medium shadow-sm transition-colors ${
                  !isClockedIn
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                <LogIn className="h-4 w-4 shrink-0" aria-hidden /> Clock In
              </div>
              <div
                role="tab"
                aria-selected={isClockedIn}
                aria-current={isClockedIn ? "step" : undefined}
                className={`pointer-events-none flex select-none items-center justify-center gap-2 rounded-lg px-4 py-3 text-center text-sm font-medium transition-colors ${
                  isClockedIn
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "border border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden /> Clock Out
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Mode updates when you submit clock-in or clock-out below.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" /> {DEMO_STUDENT_NAME}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Assigned Unit</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" /> Technology & Innovation
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Assigned Company <span className="text-destructive">*</span></label>
                <DailyLogSelect
                  value={assignedCompany}
                  onValueChange={(value) => {
                    setAssignedCompany(value);
                    saveAssignedCompany(value);
                  }}
                  placeholder="Select company..."
                  options={ASSIGNED_COMPANY_OPTIONS}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Office Location <span className="text-destructive">*</span></label>
                <DailyLogSelect
                  value={officeLocation}
                  onValueChange={setOfficeLocation}
                  placeholder="Select location..."
                  options={OFFICE_LOCATION_OPTIONS}
                />
              </div>
            </div>

            {isClockOutMode ? (
              <div className="mt-4">
                <label className="text-xs font-semibold text-foreground">
                  Accomplishment Report <span className="text-destructive">*</span>
                </label>
                <input
                  ref={reportInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  aria-label="Upload accomplishment report PDF"
                  onChange={handleAccomplishmentReportChange}
                />
                {accomplishmentReport ? (
                  <div className="mt-1 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-stat-blue" aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{accomplishmentReport.fileName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatReportFileSize(accomplishmentReport.fileSizeBytes)} · Attached{" "}
                          {accomplishmentReport.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => reportInputRef.current?.click()}
                      >
                        Replace
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        aria-label="Remove accomplishment report"
                        onClick={() => {
                          setAccomplishmentReport(null);
                          toast.success("Accomplishment report removed");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => reportInputRef.current?.click()}
                    className="mt-1 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" aria-hidden />
                    <span className="text-sm font-medium text-foreground">Upload PDF</span>
                    <span className="text-xs text-muted-foreground">
                      Today&apos;s accomplishment report · PDF only · max 10 MB
                    </span>
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Attach your daily accomplishment report before submitting clock-out.
                </p>
              </div>
            ) : null}

            <div className="mt-4">
              <label className="text-xs font-semibold text-foreground">How's your day today? <Smile className="w-3.5 h-3.5 inline text-stat-orange" /></label>
              <textarea
                placeholder="Share something about your day (optional)..."
                rows={3}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <button
              type="button"
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-stat-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
              onClick={isClockedIn ? handleClockOut : handleClockIn}
            >
              {isClockedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isClockedIn ? "Submit Clock-Out" : "Submit Clock-In"}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-display font-bold text-foreground">To-Do</h3>
              <Link to="/tasks" className="text-xs font-medium text-primary hover:underline">
                View tasks
              </Link>
            </div>
            {pendingTasks.length === 0 && inProgressTasks.length === 0 ? (
              <p
                className={cn(
                  "rounded-lg border border-dashed border-border bg-muted/10 px-3 text-center text-sm text-muted-foreground",
                  TODO_PANEL_HEIGHT_CLASS,
                  "flex items-center justify-center",
                )}
              >
                All clear — no pending or in-progress tasks.
              </p>
            ) : (
              <Tabs
                defaultValue={pendingTasks.length > 0 ? "pending" : "in-progress"}
                className="w-full"
              >
                <TabsList className="grid h-9 w-full grid-cols-2">
                  <TabsTrigger value="pending" className="gap-1.5 text-xs">
                    <Circle className="h-3.5 w-3.5" aria-hidden />
                    Pending
                    <span className="tabular-nums opacity-80">({pendingTasks.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="in-progress" className="gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    In progress
                    <span className="tabular-nums opacity-80">({inProgressTasks.length})</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="pending"
                  className={cn("mt-3 overflow-y-auto pr-0.5", TODO_PANEL_HEIGHT_CLASS)}
                >
                  <TodoTaskItems tasks={pendingTasks} emptyMessage="No pending tasks." />
                </TabsContent>
                <TabsContent
                  value="in-progress"
                  className={cn("mt-3 overflow-y-auto pr-0.5", TODO_PANEL_HEIGHT_CLASS)}
                >
                  <TodoTaskItems tasks={inProgressTasks} emptyMessage="No tasks in progress." />
                </TabsContent>
              </Tabs>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground">Internship Progress</h3>
              <span className="text-xs text-muted-foreground">Week 7 of 12</span>
            </div>
            <div className="space-y-3">
              <ProgressBar label="Attendance" value={92} colorClass="--stat-green" />
              <ProgressBar label="Tasks Completed" value={78} colorClass="--stat-blue" />
              <ProgressBar label="Reports Submitted" value={85} colorClass="--stat-emerald" />
              <ProgressBar label="Learning Modules" value={60} colorClass="--stat-orange" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-sm">
            <h3 className="font-display font-bold text-foreground">Recent Attendance</h3>
            <p className="text-xs text-muted-foreground mb-3">Last 5 entries</p>
            <ul className="space-y-3">
              {attendanceEntries.map((e) => (
                <li key={e.date} className="flex items-center gap-3 text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${e.status === "In" ? "bg-stat-green" : "bg-destructive"}`} />
                  <span className="font-medium text-foreground w-14">{e.date}</span>
                  <span className="flex-1 text-muted-foreground">{e.time}</span>
                  <span className={`text-xs font-semibold ${e.status === "In" ? "text-stat-green" : "text-destructive"}`}>{e.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
