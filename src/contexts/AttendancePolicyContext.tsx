import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type InternExcusalEntry = {
  /** Date is marked excused for this intern. */
  excused: true;
  /** Uploaded excuse letter filenames (mock). */
  excuseLetters: string[];
  /** Admin-entered description / note. */
  description: string;
};

type AttendancePolicyContextValue = {
  /** Per-date override; when undefined, default schedule applies (Mon–Fri workdays). */
  workdayOverrideByDate: Record<string, boolean | undefined>;
  setWorkdayOverrideByDate: React.Dispatch<React.SetStateAction<Record<string, boolean | undefined>>>;
  /** Excusals are per-intern (keyed by intern display name), per-date. */
  excusalByInternByDate: Record<string, Record<string, InternExcusalEntry | undefined> | undefined>;
  setExcusalByInternByDate: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, InternExcusalEntry | undefined> | undefined>>
  >;
};

const AttendancePolicyContext = createContext<AttendancePolicyContextValue | null>(null);

export function AttendancePolicyProvider({ children }: { children: ReactNode }) {
  const [workdayOverrideByDate, setWorkdayOverrideByDate] = useState<Record<string, boolean | undefined>>({});
  const [excusalByInternByDate, setExcusalByInternByDate] = useState<
    Record<string, Record<string, InternExcusalEntry | undefined> | undefined>
  >({});

  const value = useMemo(
    () => ({
      workdayOverrideByDate,
      setWorkdayOverrideByDate,
      excusalByInternByDate,
      setExcusalByInternByDate,
    }),
    [workdayOverrideByDate, excusalByInternByDate]
  );

  return <AttendancePolicyContext.Provider value={value}>{children}</AttendancePolicyContext.Provider>;
}

export function useAttendancePolicy() {
  const ctx = useContext(AttendancePolicyContext);
  if (!ctx) throw new Error("useAttendancePolicy must be used within AttendancePolicyProvider");
  return ctx;
}

