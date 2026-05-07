import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type UserRole = "student" | "mentor" | "admin";

interface RoleUser {
  name: string;
  initials: string;
  role: UserRole;
  roleLabel: string;
  unit: string;
  batch: string;
}

const roleUsers: Record<UserRole, RoleUser> = {
  student: { name: "Juan dela Cruz", initials: "JD", role: "student", roleLabel: "Intern", unit: "Tech & Innovation", batch: "B16" },
  mentor: { name: "Maria Reyes", initials: "MR", role: "mentor", roleLabel: "Senior Engineer", unit: "Tech & Innovation", batch: "N/A" },
  admin: { name: "Carlos Santos", initials: "CS", role: "admin", roleLabel: "Administrator", unit: "Administration", batch: "N/A" },
};

interface RoleContextType {
  role: UserRole;
  user: RoleUser;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

const ROLE_STORAGE_KEY = "ims_role";

function inferRoleFromPath(pathname: string): UserRole {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/mentor")) return "mentor";
  return "student";
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  const initialRole = useMemo<UserRole>(() => {
    const fromPath = inferRoleFromPath(window.location.pathname);
    try {
      const stored = window.localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (stored === "student" || stored === "mentor" || stored === "admin") {
        // If the URL clearly indicates mentor/admin, prefer URL on load.
        if (fromPath !== "student") return fromPath;
        return stored;
      }
    } catch {
      // ignore storage read errors
    }
    return fromPath;
  }, []);

  const [role, setRole] = useState<UserRole>(initialRole);

  // Keep role in sync with route namespace on navigation.
  useEffect(() => {
    const inferred = inferRoleFromPath(location.pathname);
    if (inferred !== "student" && inferred !== role) {
      setRole(inferred);
    }
  }, [location.pathname, role]);

  // Persist role changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // ignore storage write errors
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, user: roleUsers[role], setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
