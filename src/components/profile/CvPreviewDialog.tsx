import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import resumePdf from "@/assets/Binay_Resume.pdf";

type CvPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internName?: string;
};

export function CvPreviewDialog({ open, onOpenChange, internName }: CvPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(90vh,52rem)] w-[min(95vw,56rem)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4 text-left">
          <DialogTitle className="font-display">Curriculum Vitae</DialogTitle>
          <DialogDescription>
            {internName ? `${internName} — resume preview` : "Resume preview"}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 bg-muted/30 p-4">
          <iframe
            src={resumePdf}
            title="Curriculum Vitae preview"
            className="h-full min-h-[50vh] w-full rounded-lg border border-border bg-background"
          />
        </div>

        <DialogFooter className="shrink-0 border-t border-border px-6 py-4 sm:justify-between">
          <p className="text-xs text-muted-foreground hidden sm:block">Binay_Resume.pdf</p>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="button" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href={resumePdf} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open in new tab
              </a>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
