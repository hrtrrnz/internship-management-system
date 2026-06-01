export type InternAccomplishmentReport = {
  id: number;
  date: string;
  dateSort: number;
  status: "Submitted";
  fileName: string;
  pdfUrl: string;
};

const reportPdfModules = import.meta.glob<string>(
  "../assets/Accomplishment Reports/*.pdf",
  { eager: true, query: "?url", import: "default" },
);

function parseReportFileName(fileName: string): Date | null {
  const match = fileName.match(/^Accomplishment Report \((.+)\)\.pdf$/i);
  if (!match) return null;
  const parsed = new Date(match[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatReportDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getInternAccomplishmentReports(): InternAccomplishmentReport[] {
  const rows = Object.entries(reportPdfModules)
    .map(([path, pdfUrl]) => {
      const fileName = path.split("/").pop() ?? path;
      const reportDate = parseReportFileName(fileName);
      if (!reportDate) return null;
      return {
        date: formatReportDate(reportDate),
        dateSort: reportDate.getTime(),
        status: "Submitted" as const,
        fileName,
        pdfUrl,
      };
    })
    .filter((row): row is Omit<InternAccomplishmentReport, "id"> => row !== null)
    .sort((a, b) => b.dateSort - a.dateSort);

  return rows.map((row, index) => ({ ...row, id: index + 1 }));
}

/** Hart Lawrence Binay — submitted accomplishment reports (newest first). */
export const INTERN_ACCOMPLISHMENT_REPORTS = getInternAccomplishmentReports();
