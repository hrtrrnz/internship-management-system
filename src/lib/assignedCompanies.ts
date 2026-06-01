/** Partner companies available on the intern daily log (clock-in form). */
export const ASSIGNED_COMPANY_OPTIONS = [
  "Brains Infinite Innovations Inc.",
  "Klassic Solutions Inc.",
  "Klassic Marketing Inc.",
  "Westwood Law Firm",
  "Westwood Development Corporation",
  "ASAP",
  "Z Corp (Thehco)",
  "MILLENIUM",
  "CONNECTOR",
  "KLASSMALL",
  "The Beauty Alley",
  "The Green Oasis",
  "The Finest Fit",
  "Luxurious Cleaning Co.",
  "Pest Busters",
  "No Assignment Yet",
] as const;

export type AssignedCompany = (typeof ASSIGNED_COMPANY_OPTIONS)[number];

const STORAGE_KEY = "ims_assigned_company";

export function loadAssignedCompany(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && ASSIGNED_COMPANY_OPTIONS.includes(stored as AssignedCompany)) {
      return stored;
    }
  } catch {
    // ignore
  }
  return "";
}

export function saveAssignedCompany(company: string) {
  try {
    if (company) window.localStorage.setItem(STORAGE_KEY, company);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
