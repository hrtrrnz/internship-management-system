import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProfilePhoto } from "@/contexts/ProfilePhotoContext";
import { useRole, type UserRole } from "@/contexts/RoleContext";

const sizeClasses = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
} as const;

type ProfileAvatarProps = {
  role?: UserRole;
  initials?: string;
  className?: string;
  size?: keyof typeof sizeClasses;
  fallbackClassName?: string;
};

export function ProfileAvatar({
  role,
  initials,
  className,
  size = "md",
  fallbackClassName,
}: ProfileAvatarProps) {
  const { role: activeRole, user } = useRole();
  const { getProfilePhoto } = useProfilePhoto();
  const effectiveRole = role ?? activeRole;
  const photoUrl = getProfilePhoto(effectiveRole);
  const displayInitials = initials ?? (effectiveRole === activeRole ? user.initials : "??");

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {photoUrl ? <AvatarImage src={photoUrl} alt="" /> : null}
      <AvatarFallback
        className={cn(
          "font-bold font-display bg-primary text-primary-foreground",
          fallbackClassName,
        )}
      >
        {displayInitials}
      </AvatarFallback>
    </Avatar>
  );
}
