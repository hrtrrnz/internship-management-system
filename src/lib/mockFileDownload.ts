import { toast } from "sonner";

/** Demo-only: no server or blob — shows success like a finished download. */
export function mockDownloadAsPdf(documentTitle: string) {
  toast.success("Download complete", {
    description: `${documentTitle} — saved as PDF.`,
  });
}

/** Demo-only: no server or blob — shows success like a finished download. */
export function mockDownloadAsWord(documentTitle: string) {
  toast.success("Download complete", {
    description: `${documentTitle} — saved as Word (.docx).`,
  });
}
