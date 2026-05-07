import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AttendanceDayType = "no_work" | "workday" | "holiday";

export type AttendanceDayConfig = {
  type: AttendanceDayType;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

export type AttendanceEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  internNames: string[];
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

export type InternExcusalEntry = {
  /** Date is marked excused for this intern. */
  excused: true;
  /** Uploaded excuse letter filenames (mock). */
  excuseLetters: string[];
  /** Admin-entered description / note. */
  description: string;
};

type AttendancePolicyContextValue = {
  /** Per-date override; when undefined, default schedule applies (Mon–Fri workdays, weekends no work). */
  dayConfigByDate: Record<string, AttendanceDayConfig | undefined>;
  setDayConfigByDate: React.Dispatch<React.SetStateAction<Record<string, AttendanceDayConfig | undefined>>>;
  eventsByDate: Record<string, AttendanceEvent[] | undefined>;
  setEventsByDate: React.Dispatch<React.SetStateAction<Record<string, AttendanceEvent[] | undefined>>>;
  /** Excusals are per-intern (keyed by intern display name), per-date. */
  excusalByInternByDate: Record<string, Record<string, InternExcusalEntry | undefined> | undefined>;
  setExcusalByInternByDate: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, InternExcusalEntry | undefined> | undefined>>
  >;
};

const AttendancePolicyContext = createContext<AttendancePolicyContextValue | null>(null);

export function AttendancePolicyProvider({ children }: { children: ReactNode }) {
  const [dayConfigByDate, setDayConfigByDate] = useState<Record<string, AttendanceDayConfig | undefined>>({});
  const [eventsByDate, setEventsByDate] = useState<Record<string, AttendanceEvent[] | undefined>>({});
  const [excusalByInternByDate, setExcusalByInternByDate] = useState<
    Record<string, Record<string, InternExcusalEntry | undefined> | undefined>
  >({});

  const value = useMemo(
    () => ({
      dayConfigByDate,
      setDayConfigByDate,
      eventsByDate,
      setEventsByDate,
      excusalByInternByDate,
      setExcusalByInternByDate,
    }),
    [dayConfigByDate, eventsByDate, excusalByInternByDate]
  );

  return <AttendancePolicyContext.Provider value={value}>{children}</AttendancePolicyContext.Provider>;
}

export function useAttendancePolicy() {
  const ctx = useContext(AttendancePolicyContext);
  if (!ctx) throw new Error("useAttendancePolicy must be used within AttendancePolicyProvider");
  return ctx;
}

