import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockDownloadAsPdf, mockDownloadAsWord } from "@/lib/mockFileDownload";

type MockFileDownloadMenuProps = {
  /** Display name used in the toast (e.g. file name or report title). */
  fileLabel: string;
  /** Ghost icon trigger (default) or labeled button. */
  variant?: "icon" | "button";
  className?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
};

export function MockFileDownloadMenu({
  fileLabel,
  variant = "icon",
  className,
  triggerClassName,
  align = "end",
}: MockFileDownloadMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant === "icon" ? "ghost" : "outline"}
          size={variant === "icon" ? "icon" : "sm"}
          className={cn(variant === "icon" ? "h-8 w-8 shrink-0" : "gap-1.5", className, triggerClassName)}
          aria-label={`Download ${fileLabel}`}
        >
          <Download className="h-4 w-4" aria-hidden />
          {variant === "button" && (
            <>
              Download
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="z-[200] min-w-[12rem]">
        <DropdownMenuItem onClick={() => mockDownloadAsPdf(fileLabel)}>Download as PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => mockDownloadAsWord(fileLabel)}>Download as Word</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
