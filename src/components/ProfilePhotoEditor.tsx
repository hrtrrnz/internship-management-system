import { useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useProfilePhoto } from "@/contexts/ProfilePhotoContext";
import { useRole } from "@/contexts/RoleContext";

const MAX_BYTES = 2 * 1024 * 1024;

type ProfilePhotoEditorProps = {
  size?: "lg" | "xl";
};

export function ProfilePhotoEditor({ size = "xl" }: ProfilePhotoEditorProps) {
  const { role, user } = useRole();
  const { getProfilePhoto, setProfilePhoto } = useProfilePhoto();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPhoto = Boolean(getProfilePhoto(role));

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 2 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(role, reader.result);
        toast.success("Profile photo updated");
      }
    };
    reader.onerror = () => toast.error("Could not read that image. Try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <ProfileAvatar size={size} initials={user.initials} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          aria-label="Change profile photo"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={onFileChange}
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => inputRef.current?.click()}>
          <Camera className="h-4 w-4" />
          {hasPhoto ? "Change photo" : "Add photo"}
        </Button>
        {hasPhoto ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => {
              setProfilePhoto(role, null);
              toast.success("Profile photo removed");
            }}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">JPG, PNG, or WebP · max 2 MB</p>
    </div>
  );
}
