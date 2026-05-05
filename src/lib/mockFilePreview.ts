import { toast } from "sonner";

/** Demo-only: no server — toast acts as a lightweight “opened preview”. */
export function mockPreviewFile(fileLabel: string) {
  toast.success("Preview opened", {
    description: `${fileLabel} — demo preview only.`,
  });
}
