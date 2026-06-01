import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileAccount } from "@/contexts/ProfileAccountContext";

type EditEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function EditEmailDialog({ open, onOpenChange }: EditEmailDialogProps) {
  const { account, updateEmail } = useProfileAccount();
  const [email, setEmail] = useState(account.email);

  useEffect(() => {
    if (open) setEmail(account.email);
  }, [open, account.email]);

  const handleSave = () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      toast({
        title: "Invalid email",
        description: "Enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    updateEmail(trimmed);
    toast({
      title: "Email updated",
      description: `Your email is now ${trimmed}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update email</DialogTitle>
          <DialogDescription>Change the email address linked to your account.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          <Label htmlFor="profile-email">Email address</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleSave}
          >
            Save email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
