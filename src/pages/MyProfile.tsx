import { useMemo, useState } from "react";
import { Calendar, CalendarDays, Clock, FileText, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CvPreviewDialog } from "@/components/profile/CvPreviewDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildMonthDays,
  getMonthsInRange,
  INTERNSHIP_START,
  MONTH_LABELS,
  WEEKDAY_HEADERS,
  type DayStatus,
  type WeekPreviewStatus,
} from "@/lib/internAttendance";
import { cn } from "@/lib/utils";
import { useInternAttendance } from "@/hooks/useInternAttendance";
import { ProfilePhotoEditor } from "@/components/ProfilePhotoEditor";
import { ProfileAccountSection } from "@/components/profile/ProfileAccountSection";
import { LSPU_SAN_PABLO_CAMPUS } from "@/lib/internRoster";
import { useRole } from "@/contexts/RoleContext";

type ProfileDayStatus = Exclude<DayStatus, "none" | "excused">;

const DAY_STATUS_CELL: Record<ProfileDayStatus, string> = {
  present: "bg-stat-green text-white ring-stat-green/30",
  late: "bg-stat-orange text-white ring-stat-orange/30",
  absent: "bg-destructive/90 text-destructive-foreground ring-destructive/30",
};

const weekPreviewStyles: Record<WeekPreviewStatus, string> = {
  present: "bg-stat-green/20",
  late: "bg-stat-orange/20",
  absent: "bg-muted",
  excused: "bg-blue-500/20",
  upcoming: "bg-muted/40",
  none: "bg-muted/20",
};

const weekBarStyles: Record<WeekPreviewStatus, string> = {
  present: "bg-stat-green",
  late: "bg-stat-orange",
  absent: "bg-destructive",
  excused: "bg-blue-500",
  upcoming: "bg-muted",
  none: "bg-muted",
};

const HOURS_RENDERED = 402;
const HOURS_REQUIRED = 400;

export default function MyProfile() {
  const { user } = useRole();
  const [cvOpen, setCvOpen] = useState(false);
  const { today, policySlice, overrides, stats, resolveOptions } = useInternAttendance(undefined, {
    profileAttendance: true,
  });
  const hoursPercent = Math.min(100, Math.round((HOURS_RENDERED / HOURS_REQUIRED) * 100));

  return (
    <div className="space-y-6">
      <CvPreviewDialog open={cvOpen} onOpenChange={setCvOpen} internName={user.name} />
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your internship identity, program details, and progress.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 h-full">
          <div className="flex flex-col items-center text-center pt-1">
            <ProfilePhotoEditor />
            <h3 className="mt-2 text-xl font-display font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.roleLabel}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5 w-full gap-2"
            onClick={() => setCvOpen(true)}
          >
            <FileText className="h-4 w-4" />
            View CV
          </Button>

          <ProfileAccountSection className="mt-6 w-full text-left pb-1" />
        </div>

        <div className="col-span-2">
          <div className="bg-card rounded-xl border border-border p-5 h-full">
            <h3 className="font-display font-bold text-foreground mb-4">Internship Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock icon={GraduationCap} label="Program" value="Bachelor of Science in Information Technology" />
              <InfoBlock icon={GraduationCap} label="School" value={LSPU_SAN_PABLO_CAMPUS} />
              <InfoBlock icon={MapPin} label="Unit" value="Technology & Innovation" />
              <InfoBlock icon={GraduationCap} label="Batch" value={user.batch} />
              <InfoBlock icon={MapPin} label="Office" value="HYT Business Center" />
              <InfoBlock icon={Calendar} label="Start Date" value="February 3, 2026" />
            </div>

            <div className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
              <HoursRenderedSection rendered={HOURS_RENDERED} required={HOURS_REQUIRED} percent={hoursPercent} />
              <AttendanceSection
                stats={stats}
                today={today}
                policySlice={policySlice}
                overrides={overrides}
                resolveOptions={resolveOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HoursRenderedSection({
  rendered,
  required,
  percent,
}: {
  rendered: number;
  required: number;
  percent: number;
}) {
  const remaining = required - rendered;
  const remainingLabel =
    remaining > 0
      ? `${remaining} hours remaining`
      : remaining < 0
        ? `${Math.abs(remaining)} hours over requirement`
        : "Requirement met";

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-stat-blue-bg">
        <Clock className="h-4 w-4 text-stat-blue" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hours rendered</p>
      <p className="mt-1 font-display text-2xl font-bold text-foreground">
        {rendered}
        <span className="text-base font-semibold text-muted-foreground"> / {required}</span>
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{remainingLabel}</p>
      <div className="mt-4">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-stat-blue transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>0h</span>
          <span className="font-medium text-foreground">{rendered}h rendered</span>
          <span>{required}h required</span>
        </div>
      </div>
    </div>
  );
}

function AttendanceSection({
  stats,
  today,
  policySlice,
  overrides,
  resolveOptions,
}: {
  stats: ReturnType<typeof useInternAttendance>["stats"];
  today: Date;
  policySlice: ReturnType<typeof useInternAttendance>["policySlice"];
  overrides: ReturnType<typeof useInternAttendance>["overrides"];
  resolveOptions: ReturnType<typeof useInternAttendance>["resolveOptions"];
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const months = useMemo(() => getMonthsInRange(INTERNSHIP_START, today), [today]);

  return (
    <>
      <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-stat-orange-bg">
          <Calendar className="h-4 w-4 text-stat-orange" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attendance</p>
        <p className="mt-1 font-display text-2xl font-bold text-foreground">
          {stats.daysAttended}
          <span className="text-base font-semibold text-muted-foreground"> / {stats.daysRequired}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">program days attended</p>

        <p className="mt-4 text-xs font-medium text-muted-foreground">This week</p>
        <div className="mt-2 flex gap-2">
          {stats.currentWeek.map((entry) => (
            <div key={entry.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-full items-end justify-center rounded-md px-1",
                  weekPreviewStyles[entry.status],
                )}
              >
                <div
                  className={cn(
                    "h-5 w-full max-w-[24px] rounded-sm",
                    weekBarStyles[entry.status],
                    (entry.status === "absent" || entry.status === "none" || entry.status === "upcoming") &&
                      "h-2 self-center",
                  )}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{entry.day}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            View full history
          </button>
        </div>
      </div>

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden flex flex-col gap-0 p-0">
          <DialogHeader className="border-b border-border px-6 py-4 text-left shrink-0">
            <DialogTitle className="font-display">Attendance history</DialogTitle>
            <DialogDescription>
              {MONTH_LABELS[INTERNSHIP_START.getMonth()]} {INTERNSHIP_START.getFullYear()} through{" "}
              {MONTH_LABELS[today.getMonth()]} {today.getFullYear()} · Weekdays only
            </DialogDescription>
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <span className="text-muted-foreground">
                <span className="font-semibold text-stat-green">{stats.present}</span> present
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-stat-orange">{stats.late}</span> late
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-destructive">{stats.absent}</span> absent
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-blue-500">{stats.excused}</span> excused
              </span>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-5">
            <div className="grid gap-6 sm:grid-cols-2">
              {months.map(({ year, month }) => (
                <MonthAttendanceGrid
                  key={`${year}-${month}`}
                  year={year}
                  month={month}
                  today={today}
                  policySlice={policySlice}
                  overrides={overrides}
                  resolveOptions={resolveOptions}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MonthAttendanceGrid({
  year,
  month,
  today,
  policySlice,
  overrides,
  resolveOptions,
}: {
  year: number;
  month: number;
  today: Date;
  policySlice: ReturnType<typeof useInternAttendance>["policySlice"];
  overrides: ReturnType<typeof useInternAttendance>["overrides"];
  resolveOptions: ReturnType<typeof useInternAttendance>["resolveOptions"];
}) {
  const cells = useMemo(
    () => buildMonthDays(year, month, today, policySlice, overrides, resolveOptions),
    [year, month, today, policySlice, overrides, resolveOptions],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h4 className="mb-3 font-display text-sm font-bold text-foreground">
        {MONTH_LABELS[month]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_HEADERS.map((label) => (
          <div
            key={label}
            className="pb-1 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            {label}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (cell == null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          const { day, status } = cell;
          const isTracked = status !== "none" && status !== "excused";

          return (
            <div
              key={`${year}-${month}-${day}`}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-[11px] font-medium ring-1 ring-inset",
                isTracked
                  ? DAY_STATUS_CELL[status as ProfileDayStatus]
                  : status === "excused"
                    ? "bg-blue-500/80 text-white ring-blue-500/30"
                    : "bg-muted/40 text-muted-foreground ring-border/50",
              )}
              title={
                isTracked || status === "excused"
                  ? `${MONTH_LABELS[month]} ${day}, ${year}: ${status}`
                  : `${MONTH_LABELS[month]} ${day}, ${year}: no record`
              }
            >
              {day}
            </div>
          );
        })}
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
