import {
  DEMO_STUDENT_INTERN_ID,
  DEMO_STUDENT_NAME,
  INTERN_ROSTER,
  internInitials,
} from "@/lib/internRoster";
import {
  ATTENDANCE_RECORDS,
  buildProfileAttendanceOverrides,
  PROFILE_CALENDAR_DATE_SET,
  resolveInternAttendanceRecord,
  toDateStr,
  type AttendanceRecord,
} from "@/lib/internAttendance";

export type PortalClockStatus = "Present" | "Late" | "Absent" | "Excused" | "Not clocked in";

export type PortalTodayLog = {
  internId: string;
  name: string;
  dept: string;
  in: string;
  out: string;
  status: PortalClockStatus;
  avatar: string;
};

export type MentorLiveAttendance = {
  internId: string;
  intern: string;
  avatar: string;
  in: string;
  out: string;
  status: "Clocked in" | "Not clocked in" | "Late";
  unit: string;
};

/** Shared demo date for mentor/admin “today” views. */
export const PORTAL_ATTENDANCE_DATE = new Date(2026, 4, 29);

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function emptyPolicy(internName: string) {
  return {
    dayConfigByDate: {},
    eventsByDate: {},
    excusalByInternByDate: {},
    internName,
  };
}

function recordToPortalStatus(record: AttendanceRecord | null): PortalClockStatus {
  if (!record) return "Not clocked in";
  if (record.status === "Present") return record.in !== "—" && record.out === "—" ? "Present" : "Present";
  if (record.status === "Late") return "Late";
  if (record.status === "Excused") return "Excused";
  if (record.status === "Absent") return "Absent";
  return "Not clocked in";
}

function recordToMentorStatus(record: AttendanceRecord | null): MentorLiveAttendance["status"] {
  if (!record || record.in === "—") return "Not clocked in";
  if (record.status === "Late") return "Late";
  if (record.status === "Present") return "Clocked in";
  return "Not clocked in";
}

function getHartRecord(dateStr: string, today: Date): AttendanceRecord | null {
  const overrides = buildProfileAttendanceOverrides(today);
  const policy = emptyPolicy(DEMO_STUDENT_NAME);

  if (PROFILE_CALENDAR_DATE_SET.has(dateStr)) {
    return resolveInternAttendanceRecord(dateStr, today, policy, overrides, {
      attendanceDateWhitelist: PROFILE_CALENDAR_DATE_SET,
    });
  }

  const base = ATTENDANCE_RECORDS[dateStr];
  if (base) return base;

  return resolveInternAttendanceRecord(dateStr, today, policy, overrides);
}

function getOtherInternRecord(internId: string, dateStr: string): AttendanceRecord | null {
  const h = hashString(`${internId}:${dateStr}`);
  const seeded = ATTENDANCE_RECORDS[dateStr];
  if (seeded && h % 4 !== 0) return seeded;

  if (h % 11 === 0) return { in: "—", out: "—", hours: "—", status: "Absent" };
  if (h % 7 === 0) return { in: "8:18 AM", out: "—", hours: "—", status: "Late" };
  if (h % 5 === 0) return null;
  return { in: "7:55 AM", out: "—", hours: "—", status: "Present" };
}

export function getInternAttendanceRecordForDate(
  internId: string,
  internName: string,
  dateStr: string,
  today: Date = PORTAL_ATTENDANCE_DATE,
): AttendanceRecord | null {
  if (internId === DEMO_STUDENT_INTERN_ID) {
    return getHartRecord(dateStr, today);
  }
  return getOtherInternRecord(internId, dateStr);
}

export function getPortalTodayLogs(date: Date = PORTAL_ATTENDANCE_DATE): PortalTodayLog[] {
  const dateStr = toDateStr(date);
  return INTERN_ROSTER.map((intern) => {
    const record = getInternAttendanceRecordForDate(intern.id, intern.name, dateStr, date);
    const portalStatus = recordToPortalStatus(record);
    return {
      internId: intern.id,
      name: intern.name,
      dept: "Tech & Innovation",
      in: record?.in ?? "—",
      out: record?.out ?? "—",
      status: portalStatus,
      avatar: internInitials(intern.name),
    };
  });
}

export function getMentorLiveAttendance(date: Date = PORTAL_ATTENDANCE_DATE): MentorLiveAttendance[] {
  const dateStr = toDateStr(date);
  return INTERN_ROSTER.map((intern) => {
    const record = getInternAttendanceRecordForDate(intern.id, intern.name, dateStr, date);
    return {
      internId: intern.id,
      intern: intern.name,
      avatar: internInitials(intern.name),
      in: record?.in ?? "—",
      out: record?.out ?? "—",
      status: recordToMentorStatus(record),
      unit: "Tech & Innovation",
    };
  });
}

export function getInternRecentActivityRecord(): Record<string, { text: string; when: string }[]> {
  return Object.fromEntries(
    INTERN_ROSTER.map((intern) => [intern.name, getInternRecentActivity(intern.id, intern.name)]),
  );
}

export function getInternRecentActivity(internId: string, internName: string): { text: string; when: string }[] {
  const record = getInternAttendanceRecordForDate(internId, internName, toDateStr(PORTAL_ATTENDANCE_DATE));
  const clockLine =
    record && record.in !== "—"
      ? { text: `Clocked in at ${record.in}`, when: "Today, 7:55 AM" }
      : { text: "Not clocked in yet", when: "Today, 8:00 AM" };

  const h = hashString(internId);
  const extras = [
    { text: "Submitted daily report", when: "Today, 11:05 AM" },
    { text: "Updated task submission", when: "Yesterday, 4:40 PM" },
    { text: "Requested mentor check-in", when: "Yesterday, 2:15 PM" },
  ];
  return [clockLine, extras[h % extras.length]];
}
