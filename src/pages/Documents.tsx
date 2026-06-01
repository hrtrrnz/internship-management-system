import { useMemo, useState } from "react";
import { FolderOpen, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import { cn } from "@/lib/utils";

type DocCategory = "Personal & School Records" | "Training & Program" | "Templates";

const documents: {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  category: DocCategory;
}[] = [
  {
    id: 1,
    name: "Curriculum Vitae",
    type: "PDF",
    size: "186 KB",
    date: "Feb 3, 2026",
    category: "Personal & School Records",
  },
  {
    id: 2,
    name: "Endorsement/Recommendation Letter",
    type: "PDF",
    size: "142 KB",
    date: "Feb 3, 2026",
    category: "Personal & School Records",
  },
  {
    id: 3,
    name: "Certificate of Registration",
    type: "PDF",
    size: "98 KB",
    date: "Feb 4, 2026",
    category: "Personal & School Records",
  },
  {
    id: 4,
    name: "School ID",
    type: "PDF",
    size: "1.4 MB",
    date: "Feb 4, 2026",
    category: "Personal & School Records",
  },
  {
    id: 5,
    name: "Training Policy",
    type: "PDF",
    size: "320 KB",
    date: "Feb 5, 2026",
    category: "Training & Program",
  },
  {
    id: 6,
    name: "Training Agreement",
    type: "PDF",
    size: "245 KB",
    date: "Feb 5, 2026",
    category: "Training & Program",
  },
  {
    id: 7,
    name: "Transmittal Sheet",
    type: "PDF",
    size: "76 KB",
    date: "Feb 6, 2026",
    category: "Training & Program",
  },
  {
    id: 8,
    name: "Clearance Form Template",
    type: "DOCX",
    size: "64 KB",
    date: "Feb 6, 2026",
    category: "Templates",
  },
  {
    id: 9,
    name: "Daily Log Monitoring Sheet Template",
    type: "XLSX",
    size: "42 KB",
    date: "Feb 6, 2026",
    category: "Templates",
  },
  {
    id: 10,
    name: "Batch Daily Log Monitoring Form Template",
    type: "XLSX",
    size: "48 KB",
    date: "Feb 7, 2026",
    category: "Templates",
  },
];

const categories: DocCategory[] = ["Personal & School Records", "Training & Program", "Templates"];

type FilterCategory = DocCategory | "All";

const filterTabs: FilterCategory[] = ["All", ...categories];

const typeColors: Record<string, string> = {
  PDF: "text-destructive bg-destructive/10",
  DOCX: "text-stat-blue bg-stat-blue-bg",
  XLSX: "text-stat-green bg-stat-green-bg",
};

export default function Documents() {
  const [activeTab, setActiveTab] = useState<FilterCategory>("All");

  const filteredDocuments = useMemo(
    () => (activeTab === "All" ? documents : documents.filter((d) => d.category === activeTab)),
    [activeTab],
  );

  const tabFileCount = (tab: FilterCategory) =>
    tab === "All" ? documents.length : documents.filter((d) => d.category === tab).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Required internship documents and program templates — preview or download each file below.
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        role="tablist"
        aria-label="Document categories"
      >
        {filterTabs.map((tab) => {
          const selected = activeTab === tab;
          const label = tab === "All" ? "All Documents" : tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  selected ? "bg-primary/15" : "bg-muted",
                )}
              >
                <FolderOpen className={cn("h-5 w-5", selected ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="min-w-0">
                <p className={cn("text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>{label}</p>
                <p className="text-xs text-muted-foreground">
                  {tabFileCount(tab)} file{tabFileCount(tab) === 1 ? "" : "s"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Document</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Size</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date Added</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No documents in this category.
                </td>
              </tr>
            ) : (
              filteredDocuments.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="flex items-center gap-2 px-5 py-3 font-medium text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {d.name}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{d.category}</td>
                <td className="px-5 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${typeColors[d.type] ?? "bg-muted text-muted-foreground"}`}>
                    {d.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{d.size}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.date}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                      aria-label={`Preview ${d.name}`}
                      onClick={() =>
                        toast.success("Preview opened", {
                          description: `${d.name} — demo preview only.`,
                        })
                      }
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <MockFileDownloadMenu fileLabel={d.name} />
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
