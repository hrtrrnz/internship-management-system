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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileAccount } from "@/contexts/ProfileAccountContext";

type EditAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditAddressDialog({ open, onOpenChange }: EditAddressDialogProps) {
  const { account, updateAddress } = useProfileAccount();
  const [address, setAddress] = useState(account.address);

  useEffect(() => {
    if (open) setAddress(account.address);
  }, [open, account.address]);

  const handleSave = () => {
    const trimmed = address.trim();
    if (trimmed.length < 5) {
      toast({
        title: "Address too short",
        description: "Enter your full mailing address.",
        variant: "destructive",
      });
      return;
    }
    updateAddress(trimmed);
    toast({
      title: "Address updated",
      description: "Your address has been saved.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update address</DialogTitle>
          <DialogDescription>Enter your current home or mailing address.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          <Label htmlFor="profile-address">Address</Label>
          <Textarea
            id="profile-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="resize-none"
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
            Save address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
