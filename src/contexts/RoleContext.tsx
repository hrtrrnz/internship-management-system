import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "mentor" | "admin";

interface RoleUser {
  name: string;
  initials: string;
  role: UserRole;
  roleLabel: string;
  department: string;
}

const roleUsers: Record<UserRole, RoleUser> = {
  student: { name: "Juan dela Cruz", initials: "JD", role: "student", roleLabel: "Intern", department: "Tech & Innovation" },
  mentor: { name: "Maria Reyes", initials: "MR", role: "mentor", roleLabel: "Senior Engineer", department: "Tech & Innovation" },
  admin: { name: "Carlos Santos", initials: "CS", role: "admin", roleLabel: "Administrator", department: "HYT Foundation" },
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
