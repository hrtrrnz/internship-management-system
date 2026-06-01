import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserRole } from "@/contexts/RoleContext";

const STORAGE_KEY = "ims_profile_photos";

type ProfilePhotos = Partial<Record<UserRole, string>>;

function loadPhotos(): ProfilePhotos {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProfilePhotos;
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

function savePhotos(photos: ProfilePhotos) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // ignore quota / private mode errors
  }
}

type ProfilePhotoContextType = {
  getProfilePhoto: (role: UserRole) => string | null;
  setProfilePhoto: (role: UserRole, dataUrl: string | null) => void;
};

const ProfilePhotoContext = createContext<ProfilePhotoContextType | null>(null);

export function ProfilePhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<ProfilePhotos>(loadPhotos);

  useEffect(() => {
    savePhotos(photos);
  }, [photos]);

  const getProfilePhoto = useCallback((role: UserRole) => photos[role] ?? null, [photos]);

  const setProfilePhoto = useCallback((role: UserRole, dataUrl: string | null) => {
    setPhotos((prev) => {
      const next = { ...prev };
      if (dataUrl) next[role] = dataUrl;
      else delete next[role];
      return next;
    });
  }, []);

  return (
    <ProfilePhotoContext.Provider value={{ getProfilePhoto, setProfilePhoto }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
}

export function useProfilePhoto() {
  const ctx = useContext(ProfilePhotoContext);
  if (!ctx) throw new Error("useProfilePhoto must be used within ProfilePhotoProvider");
  return ctx;
}
