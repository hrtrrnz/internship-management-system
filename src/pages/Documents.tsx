import { FolderOpen, FileText, Download, Eye } from "lucide-react";

const documents = [
  { id: 1, name: "Internship Agreement", type: "PDF", size: "245 KB", date: "Feb 3, 2026", category: "Contracts" },
  { id: 2, name: "NDA - Non-Disclosure Agreement", type: "PDF", size: "180 KB", date: "Feb 3, 2026", category: "Contracts" },
  { id: 3, name: "Weekly Report Template", type: "DOCX", size: "52 KB", date: "Feb 5, 2026", category: "Templates" },
  { id: 4, name: "Daily Log Sheet Template", type: "XLSX", size: "38 KB", date: "Feb 5, 2026", category: "Templates" },
  { id: 5, name: "Company Handbook", type: "PDF", size: "1.2 MB", date: "Feb 3, 2026", category: "Resources" },
  { id: 6, name: "Development Guidelines", type: "PDF", size: "890 KB", date: "Feb 10, 2026", category: "Resources" },
  { id: 7, name: "Certificate of Completion (Draft)", type: "PDF", size: "120 KB", date: "Mar 15, 2026", category: "Certificates" },
];

const typeColors: Record<string, string> = {
  PDF: "text-destructive bg-destructive/10",
  DOCX: "text-stat-blue bg-stat-blue-bg",
  XLSX: "text-stat-green bg-stat-green-bg",
};

export default function Documents() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Documents</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {["Contracts", "Templates", "Resources", "Certificates"].map(cat => (
          <div key={cat} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{cat}</p>
              <p className="text-xs text-muted-foreground">{documents.filter(d => d.category === cat).length} files</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">File Name</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Size</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date Added</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {d.name}
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[d.type]}`}>{d.type}</span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{d.size}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.date}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Download className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
