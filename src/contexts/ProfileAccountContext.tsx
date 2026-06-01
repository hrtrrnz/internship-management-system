import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ADMIN_EMAIL, DEMO_STUDENT_NAME, internEmail } from "@/lib/internRoster";
import { useRole, type UserRole } from "@/contexts/RoleContext";

export type ProfileAccountData = {
  email: string;
  phone: string;
  address: string;
  passwordLastUpdated: string;
};

const DEFAULT_ACCOUNTS: Record<UserRole, ProfileAccountData> = {
  student: {
    email: internEmail(DEMO_STUDENT_NAME),
    phone: "+63 912 345 6789",
    address: "Manila, Philippines",
    passwordLastUpdated: "March 10, 2026",
  },
  mentor: {
    email: "james.aeron.borja@hytfoundation.org",
    phone: "+63 917 555 1234",
    address: "Manila, Philippines",
    passwordLastUpdated: "March 8, 2026",
  },
  admin: {
    email: ADMIN_EMAIL,
    phone: "+63 918 200 1100",
    address: "Manila, Philippines",
    passwordLastUpdated: "March 5, 2026",
  },
};

const STORAGE_PREFIX = "ims_profile_account_";

function loadAccount(role: UserRole): ProfileAccountData {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + role);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProfileAccountData>;
      return { ...DEFAULT_ACCOUNTS[role], ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_ACCOUNTS[role];
}

function persistAccount(role: UserRole, data: ProfileAccountData) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + role, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function formatPasswordDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

type ProfileAccountContextType = {
  account: ProfileAccountData;
  updateEmail: (email: string) => void;
  updatePhone: (phone: string) => void;
  updateAddress: (address: string) => void;
  recordPasswordChange: () => void;
};

const ProfileAccountContext = createContext<ProfileAccountContextType | null>(null);

export function ProfileAccountProvider({ children }: { children: ReactNode }) {
  const { role } = useRole();
  const [accounts, setAccounts] = useState<Record<UserRole, ProfileAccountData>>(() => ({
    student: loadAccount("student"),
    mentor: loadAccount("mentor"),
    admin: loadAccount("admin"),
  }));

  const account = accounts[role];

  const patchAccount = useCallback((targetRole: UserRole, patch: Partial<ProfileAccountData>) => {
    setAccounts((prev) => {
      const next = { ...prev[targetRole], ...patch };
      persistAccount(targetRole, next);
      return { ...prev, [targetRole]: next };
    });
  }, []);

  const updateEmail = useCallback(
    (email: string) => patchAccount(role, { email }),
    [patchAccount, role],
  );

  const updatePhone = useCallback(
    (phone: string) => patchAccount(role, { phone }),
    [patchAccount, role],
  );

  const updateAddress = useCallback(
    (address: string) => patchAccount(role, { address }),
    [patchAccount, role],
  );

  const recordPasswordChange = useCallback(
    () => patchAccount(role, { passwordLastUpdated: formatPasswordDate(new Date()) }),
    [patchAccount, role],
  );

  const value = useMemo(
    () => ({ account, updateEmail, updatePhone, updateAddress, recordPasswordChange }),
    [account, updateEmail, updatePhone, updateAddress, recordPasswordChange],
  );

  return (
    <ProfileAccountContext.Provider value={value}>{children}</ProfileAccountContext.Provider>
  );
}

export function useProfileAccount() {
  const ctx = useContext(ProfileAccountContext);
  if (!ctx) throw new Error("useProfileAccount must be used within ProfileAccountProvider");
  return ctx;
}
