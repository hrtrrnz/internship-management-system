/** Official Dream Academy intern roster — single source for names and batches. */
export const MENTOR_NAME = "James Aeron Borja";
export const ADMIN_NAME = "Ma. Thea Nicole Tabao";
export const ADMIN_EMAIL = "matheanicoletabao@hytfoundation.org";

export type InternBatch = "B14" | "B15" | "B16";

export type InternRosterEntry = {
  id: string;
  name: string;
  batch: InternBatch;
};

export const INTERN_ROSTER: InternRosterEntry[] = [
  { id: "kim-gamot", name: "Kim Gamot", batch: "B14" },
  { id: "hart-lawrence-binay", name: "Hart Lawrence Binay", batch: "B16" },
  { id: "ian-belarmino", name: "Ian Belarmino", batch: "B16" },
  { id: "kasandra-bumagat", name: "Kasandra Bumagat", batch: "B16" },
  { id: "jean-arves", name: "Jean Arves", batch: "B16" },
  { id: "john-mar-vincent-lat", name: "John Mar Vincent Lat", batch: "B16" },
  { id: "lenar-andrei-yolola", name: "Lenar Andrei Yolola", batch: "B16" },
  { id: "gerald-jhudiel-atiennza", name: "Gerald Jhudiel Atiennza", batch: "B16" },
  { id: "karylle-rose-balela", name: "Karylle Rose Balela", batch: "B16" },
  { id: "ellaine-rose-balatbat", name: "Ellaine Rose Balatbat", batch: "B16" },
  { id: "mikaela-jan-villegas", name: "Mikaela Jan Villegas", batch: "B16" },
  { id: "josephine-mission", name: "Josephine Mission", batch: "B15" },
  { id: "justice-tanudra", name: "Justice Tanudra", batch: "B15" },
  { id: "karylle-lubiano", name: "Karylle Lubiano", batch: "B15" },
  { id: "chent-nov-agas", name: "Chent Nov Agas", batch: "B15" },
  { id: "john-andrei-bonito", name: "John Andrei Bonito", batch: "B15" },
  { id: "marlon-carreon", name: "Marlon Carreon", batch: "B15" },
  { id: "joemary-calubayan-ii", name: "Joemary Calubayan II", batch: "B15" },
  { id: "christine-mae-encio", name: "Christine Mae Encio", batch: "B15" },
  { id: "shakiah-jehn-angela-lapak", name: "Shakiah Jehn Angela Lapak", batch: "B15" },
  { id: "gabriel-tabinas", name: "Gabriel Tabiñas", batch: "B15" },
];

export const DEMO_STUDENT_INTERN_ID = "hart-lawrence-binay";
export const DEMO_STUDENT_NAME = "Hart Lawrence Binay";

export const LSPU_SAN_PABLO_CAMPUS = "Laguna State Polytechnic University - San Pablo City Campus";

const DEFAULT_DEPARTMENT = "Tech & Innovation";
const DEFAULT_SCHOOL = "Dream Academy Partner University";

export function schoolForBatch(batch: InternBatch): string {
  return batch === "B16" ? LSPU_SAN_PABLO_CAMPUS : DEFAULT_SCHOOL;
}

export function internInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** e.g. Hart Lawrence Binay → hartlawrencebinay.dreamacademy@gmail.com */
export function internEmail(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return `${slug}.dreamacademy@gmail.com`;
}

export function getAllInternNames(): string[] {
  return INTERN_ROSTER.map((i) => i.name);
}

export function getInternsByBatch(batch: InternBatch): InternRosterEntry[] {
  return INTERN_ROSTER.filter((i) => i.batch === batch);
}

export type AdminInternRow = {
  name: string;
  department: string;
  batch: InternBatch;
  mentor: string;
  week: number;
  progress: number;
  status: "On Track" | "At Risk" | "New";
};

function demoProgressFor(entry: InternRosterEntry, index: number): Pick<AdminInternRow, "week" | "progress" | "status"> {
  if (entry.id === DEMO_STUDENT_INTERN_ID) {
    return { week: 7, progress: 78, status: "On Track" };
  }
  if (entry.batch === "B14") {
    return { week: 3, progress: 28, status: "On Track" };
  }
  if (entry.batch === "B15") {
    return { week: 5, progress: 58 + (index % 4) * 6, status: "On Track" };
  }
  return { week: 7, progress: 72 + (index % 5) * 4, status: "On Track" };
}

export function getAdminInternRows(): AdminInternRow[] {
  return INTERN_ROSTER.map((entry, index) => ({
    name: entry.name,
    department: DEFAULT_DEPARTMENT,
    batch: entry.batch,
    mentor: MENTOR_NAME,
    ...demoProgressFor(entry, index),
  }));
}

export type MentorInternInfo = {
  department: string;
  batch: InternBatch;
  mentor: string;
  week: number;
  status: "On Track" | "At Risk" | "New";
  progress: number;
  lastUpdate: string;
};

export type MentorPortalIntern = {
  name: string;
  unit: string;
  batch: InternBatch;
  week: number;
  progress: number;
  tasks: number;
  status: string;
  avatar: string;
  email: string;
  phone: string;
  school: string;
  startDate: string;
};

export function getMentorPortalInterns(): MentorPortalIntern[] {
  const startByBatch: Record<InternBatch, string> = {
    B14: "Jul 7, 2025",
    B15: "Oct 7, 2025",
    B16: "Jan 6, 2026",
  };
  return getAdminInternRows().map((row, index) => ({
    name: row.name,
    unit: "Technology & Innovation",
    batch: row.batch,
    week: row.week,
    progress: row.progress,
    tasks: 6 + (index % 12),
    status: row.status,
    avatar: internInitials(row.name),
    email: internEmail(row.name),
    phone: `+63 917 100 ${String(1000 + index).padStart(4, "0")}`,
    school: schoolForBatch(row.batch),
    startDate: startByBatch[row.batch],
  }));
}

export function getMentorInternInfoRecord(): Record<string, MentorInternInfo> {
  const updates = ["Today, 11:05 AM", "Today, 9:40 AM", "Yesterday, 4:40 PM", "Today, 8:55 AM"];
  return Object.fromEntries(
    getAdminInternRows().map((row, index) => [
      row.name,
      {
        department: row.department,
        batch: row.batch,
        mentor: row.mentor,
        week: row.week,
        status: row.status,
        progress: row.progress,
        lastUpdate: updates[index % updates.length],
      },
    ]),
  );
}
