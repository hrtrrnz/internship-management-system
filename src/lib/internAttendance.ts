import type { AttendanceDayConfig, AttendanceEvent, InternExcusalEntry } from "@/contexts/AttendancePolicyContext";

export const INTERNSHIP_START = new Date(2026, 1, 3);
export const INTERNSHIP_END = new Date(2026, 3, 24);

export type AttendanceRecord = { in: string; out: string; hours: string; status: string };
export type DayStatus = "present" | "late" | "absent" | "excused" | "none";

export const ATTENDANCE_RECORDS: Record<string, AttendanceRecord> = {
  "2026-05-29": { in: "8:02 AM", out: "—", hours: "—", status: "Present" },
  "2026-05-28": { in: "8:15 AM", out: "5:30 PM", hours: "9h 15m", status: "Late" },
  "2026-05-27": { in: "7:58 AM", out: "5:00 PM", hours: "9h 02m", status: "Present" },
  "2026-05-26": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-05-23": { in: "8:30 AM", out: "5:45 PM", hours: "9h 15m", status: "Late" },
  "2026-05-22": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-05-21": { in: "—", out: "—", hours: "—", status: "Absent" },
  "2026-05-20": { in: "7:55 AM", out: "5:10 PM", hours: "9h 15m", status: "Present" },
  "2026-05-19": { in: "8:05 AM", out: "5:00 PM", hours: "8h 55m", status: "Present" },
  "2026-03-21": { in: "8:02 AM", out: "5:14 PM", hours: "9h 12m", status: "Present" },
  "2026-03-20": { in: "8:15 AM", out: "5:30 PM", hours: "9h 15m", status: "Late" },
  "2026-03-19": { in: "7:58 AM", out: "5:00 PM", hours: "9h 02m", status: "Present" },
  "2026-03-18": { in: "8:30 AM", out: "5:45 PM", hours: "9h 15m", status: "Late" },
  "2026-03-17": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-03-14": { in: "—", out: "—", hours: "—", status: "Absent" },
  "2026-03-13": { in: "7:55 AM", out: "5:10 PM", hours: "9h 15m", status: "Present" },
  "2026-03-12": { in: "8:05 AM", out: "5:00 PM", hours: "8h 55m", status: "Present" },
  "2026-03-11": { in: "8:00 AM", out: "5:05 PM", hours: "9h 05m", status: "Present" },
  "2026-03-10": { in: "7:50 AM", out: "5:00 PM", hours: "9h 10m", status: "Present" },
  "2026-03-07": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-03-06": { in: "8:10 AM", out: "5:15 PM", hours: "9h 05m", status: "Present" },
  "2026-03-05": { in: "8:20 AM", out: "5:30 PM", hours: "9h 10m", status: "Late" },
  "2026-03-04": { in: "7:55 AM", out: "5:00 PM", hours: "9h 05m", status: "Present" },
  "2026-03-03": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-28": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-27": { in: "8:05 AM", out: "5:10 PM", hours: "9h 05m", status: "Present" },
  "2026-02-26": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-25": { in: "7:55 AM", out: "5:00 PM", hours: "9h 05m", status: "Present" },
  "2026-02-24": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
  "2026-02-04": { in: "8:10 AM", out: "5:00 PM", hours: "8h 50m", status: "Present" },
  "2026-02-03": { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" },
};

export type AttendancePolicySlice = {
  dayConfigByDate: Record<string, AttendanceDayConfig | undefined>;
  eventsByDate: Record<string, AttendanceEvent[] | undefined>;
  excusalByInternByDate: Record<string, Record<string, InternExcusalEntry | undefined> | undefined>;
  internName: string;
};

export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getMondayOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

export function getWeekdayDates(weekStartMonday: Date): Date[] {
  return [0, 1, 2, 3, 4].map((offset) => addDays(weekStartMonday, offset));
}

export function parseHours(hoursStr: string): number {
  if (hoursStr === "—") return 0;
  const hMatch = hoursStr.match(/(\d+)h/);
  const mMatch = hoursStr.match(/(\d+)m/);
  const h = hMatch ? Number(hMatch[1]) : 0;
  const m = mMatch ? Number(mMatch[1]) : 0;
  return h + m / 60;
}

export function modelPresentRecord(date: Date, today: Date): AttendanceRecord {
  const isToday = startOfDay(date).getTime() === today.getTime();
  if (isToday) {
    return { in: "8:00 AM", out: "—", hours: "—", status: "Present" };
  }
  return { in: "8:00 AM", out: "5:00 PM", hours: "9h 00m", status: "Present" };
}

export function buildPresentWeekOverrides(today: Date): Record<string, AttendanceRecord> {
  const monday = getMondayOfWeek(today);
  const overrides: Record<string, AttendanceRecord> = {};

  for (let offset = 0; offset < 5; offset++) {
    const date = addDays(monday, offset);
    if (date > today || date < startOfDay(INTERNSHIP_START)) continue;
    overrides[toDateStr(date)] = modelPresentRecord(date, today);
  }

  return overrides;
}

export function getDefaultPresentOverrides(today: Date = startOfDay(new Date())): Record<string, AttendanceRecord> {
  return buildPresentWeekOverrides(today);
}

function getDayConfig(
  dateStr: string,
  dayConfigByDate: Record<string, AttendanceDayConfig | undefined>,
): AttendanceDayConfig {
  const override = dayConfigByDate[dateStr];
  if (override) return override;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return {
    type: dow === 0 || dow === 6 ? "no_work" : "workday",
    startTime: "09:00",
    endTime: "18:00",
  };
}

function isWorkday(dateStr: string, dayConfigByDate: Record<string, AttendanceDayConfig | undefined>): boolean {
  return getDayConfig(dateStr, dayConfigByDate).type === "workday";
}

function myEventsForDate(
  dateStr: string,
  internName: string,
  eventsByDate: Record<string, AttendanceEvent[] | undefined>,
): AttendanceEvent[] {
  return (eventsByDate[dateStr] ?? []).filter((e) => e.internNames.includes(internName));
}

function isRequiredDayForIntern(
  dateStr: string,
  policy: AttendancePolicySlice,
): boolean {
  return isWorkday(dateStr, policy.dayConfigByDate) || myEventsForDate(dateStr, policy.internName, policy.eventsByDate).length > 0;
}

export function resolveInternAttendanceRecord(
  dateStr: string,
  today: Date,
  policy: AttendancePolicySlice,
  presentOverrides: Record<string, AttendanceRecord> = {},
): AttendanceRecord | null {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date > today) return null;
  if (date < startOfDay(INTERNSHIP_START)) return null;
  if (!isRequiredDayForIntern(dateStr, policy)) return null;

  const override = presentOverrides[dateStr];
  if (override) return override;

  const base = ATTENDANCE_RECORDS[dateStr];
  if (base && base.in !== "—") return base;

  const myExcusal = policy.excusalByInternByDate[policy.internName]?.[dateStr];
  if (myExcusal?.excused) {
    return { in: "—", out: "—", hours: "—", status: "Excused" };
  }
  return { in: "—", out: "—", hours: "—", status: "Absent" };
}

export function recordToDayStatus(record: AttendanceRecord | null): DayStatus {
  if (!record) return "none";
  if (record.status === "Present") return "present";
  if (record.status === "Late") return "late";
  if (record.status === "Absent") return "absent";
  if (record.status === "Excused") return "excused";
  return "none";
}

function countProgramWeekdays(from: Date, to: Date): number {
  let count = 0;
  const cursor = startOfDay(from);
  const end = startOfDay(to);
  while (cursor <= end) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

export function formatWeekRange(weekStartMonday: Date): string {
  const weekEnd = addDays(weekStartMonday, 4);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt(weekStartMonday)} – ${fmt(weekEnd)}`;
}

export function formatTotalHours(total: number): string {
  const h = Math.floor(total);
  const m = Math.round((total - h) * 60);
  return `${h}h ${m}m`;
}

export function isSameWeek(weekA: Date, weekB: Date): boolean {
  return toDateStr(getMondayOfWeek(weekA)) === toDateStr(getMondayOfWeek(weekB));
}

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getMonthsInRange(programStart: Date, through: Date): { year: number; month: number }[] {
  const months: { year: number; month: number }[] = [];
  const cursor = new Date(programStart.getFullYear(), programStart.getMonth(), 1);
  const end = new Date(through.getFullYear(), through.getMonth(), 1);

  while (cursor <= end) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

export function buildMonthDays(
  year: number,
  month: number,
  today: Date,
  policy: AttendancePolicySlice,
  presentOverrides: Record<string, AttendanceRecord>,
): ({ day: number; status: DayStatus } | null)[] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const cells: ({ day: number; status: DayStatus } | null)[] = [];

  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = toDateStr(date);
    const record = resolveInternAttendanceRecord(dateStr, today, policy, presentOverrides);
    cells.push({ day, status: recordToDayStatus(record) });
  }
  return cells;
}

export type WeekPreviewStatus = "present" | "late" | "absent" | "excused" | "upcoming" | "none";

export type InternAttendanceStats = {
  daysAttended: number;
  daysRequired: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  currentWeek: { day: string; status: WeekPreviewStatus }[];
};

export function computeInternAttendanceStats(
  today: Date,
  policy: AttendancePolicySlice,
  presentOverrides: Record<string, AttendanceRecord> = getDefaultPresentOverrides(today),
): InternAttendanceStats {
  const todayOnly = startOfDay(today);
  let present = 0;
  let late = 0;
  let absent = 0;
  let excused = 0;

  const cursor = startOfDay(INTERNSHIP_START);
  while (cursor <= todayOnly) {
    const dateStr = toDateStr(cursor);
    const record = resolveInternAttendanceRecord(dateStr, todayOnly, policy, presentOverrides);
    if (record) {
      if (record.status === "Present") present++;
      else if (record.status === "Late") late++;
      else if (record.status === "Absent") absent++;
      else if (record.status === "Excused") excused++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const currentWeek = getWeekdayDates(getMondayOfWeek(todayOnly)).map((date) => {
    const dateStr = toDateStr(date);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    if (date > todayOnly) return { day, status: "upcoming" as const };
    if (date < startOfDay(INTERNSHIP_START)) return { day, status: "none" as const };
    if (!isRequiredDayForIntern(dateStr, policy)) return { day, status: "none" as const };
    const record = resolveInternAttendanceRecord(dateStr, todayOnly, policy, presentOverrides);
    const status = recordToDayStatus(record);
    if (status === "none") return { day, status: "none" as const };
    return { day, status };
  });

  return {
    daysAttended: present + late,
    daysRequired: countProgramWeekdays(INTERNSHIP_START, INTERNSHIP_END),
    present,
    late,
    absent,
    excused,
    currentWeek,
  };
}
