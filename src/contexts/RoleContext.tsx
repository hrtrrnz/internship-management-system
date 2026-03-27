import { createContext, useContext, useState, ReactNode } from "react";

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

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("student");
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
