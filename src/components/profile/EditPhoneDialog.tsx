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

type EditPhoneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function EditPhoneDialog({ open, onOpenChange }: EditPhoneDialogProps) {
  const { account, updatePhone } = useProfileAccount();
  const [phone, setPhone] = useState(account.phone);

  useEffect(() => {
    if (open) setPhone(account.phone);
  }, [open, account.phone]);

  const handleSave = () => {
    const trimmed = phone.trim();
    if (!isValidPhone(trimmed)) {
      toast({
        title: "Invalid phone number",
        description: "Enter a valid number with at least 10 digits.",
        variant: "destructive",
      });
      return;
    }
    updatePhone(trimmed);
    toast({
      title: "Phone updated",
      description: `Your phone number is now ${trimmed}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update phone</DialogTitle>
          <DialogDescription>Change the phone number linked to your account.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          <Label htmlFor="profile-phone">Phone number</Label>
          <Input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+63 912 345 6789"
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
            Save phone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
