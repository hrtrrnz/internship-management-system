import { useMemo } from "react";
import { useAttendancePolicy } from "@/contexts/AttendancePolicyContext";
import { useRole } from "@/contexts/RoleContext";
import {
  computeInternAttendanceStats,
  getDefaultPresentOverrides,
  startOfDay,
  type InternAttendanceStats,
} from "@/lib/internAttendance";

export function useInternAttendance(presentOverrides?: Record<string, import("@/lib/internAttendance").AttendanceRecord>) {
  const { user } = useRole();
  const policy = useAttendancePolicy();

  const today = useMemo(() => startOfDay(new Date()), []);

  const policySlice = useMemo(
    () => ({
      dayConfigByDate: policy.dayConfigByDate,
      eventsByDate: policy.eventsByDate,
      excusalByInternByDate: policy.excusalByInternByDate,
      internName: user.name,
    }),
    [policy.dayConfigByDate, policy.eventsByDate, policy.excusalByInternByDate, user.name],
  );

  const overrides = useMemo(
    () => presentOverrides ?? getDefaultPresentOverrides(today),
    [presentOverrides, today],
  );

  const stats: InternAttendanceStats = useMemo(
    () => computeInternAttendanceStats(today, policySlice, overrides),
    [today, policySlice, overrides],
  );

  return { today, policySlice, overrides, stats };
}
