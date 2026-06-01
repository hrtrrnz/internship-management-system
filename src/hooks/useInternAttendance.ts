import { useMemo } from "react";
import { useAttendancePolicy } from "@/contexts/AttendancePolicyContext";
import { useRole } from "@/contexts/RoleContext";
import {
  buildProfileAttendanceOverrides,
  computeInternAttendanceStats,
  getDefaultPresentOverrides,
  PROFILE_CALENDAR_DATE_SET,
  startOfDay,
  type AttendanceResolveOptions,
  type InternAttendanceStats,
} from "@/lib/internAttendance";

export function useInternAttendance(
  presentOverrides?: Record<string, import("@/lib/internAttendance").AttendanceRecord>,
  options?: { profileAttendance?: boolean },
) {
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

  const resolveOptions: AttendanceResolveOptions | undefined = useMemo(
    () => (options?.profileAttendance ? { attendanceDateWhitelist: PROFILE_CALENDAR_DATE_SET } : undefined),
    [options?.profileAttendance],
  );

  const overrides = useMemo(() => {
    if (options?.profileAttendance) {
      return buildProfileAttendanceOverrides(today);
    }
    return presentOverrides ?? getDefaultPresentOverrides(today);
  }, [options?.profileAttendance, presentOverrides, today]);

  const stats: InternAttendanceStats = useMemo(
    () => computeInternAttendanceStats(today, policySlice, overrides, resolveOptions),
    [today, policySlice, overrides, resolveOptions],
  );

  return { today, policySlice, overrides, stats, resolveOptions };
}
