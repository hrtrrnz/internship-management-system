import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/contexts/RoleContext";
import type { ChatMessage, Group } from "@/lib/messagesSeed";
import { MESSAGES_SEED_GROUPS, MESSAGES_SEED_MESSAGES } from "@/lib/messagesSeed";

type MessagesThreadContextValue = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  pinnedIdsByGroup: Record<number, number[]>;
  setPinnedIdsByGroup: React.Dispatch<React.SetStateAction<Record<number, number[]>>>;
  /** Ensures a 1:1 private thread exists and returns its group id. */
  ensurePrivateThread: (currentUserName: string, targetName: string, createdBy: UserRole) => number;
  /** Ask floating launcher to open this group as a box outside Messages page. */
  floatingChatRequestId: number | null;
  requestOpenFloatingChat: (groupId: number) => void;
  clearFloatingChatRequest: () => void;
};

const MessagesThreadContext = createContext<MessagesThreadContextValue | null>(null);

export function MessagesThreadProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(MESSAGES_SEED_GROUPS);
  const [messages, setMessages] = useState<ChatMessage[]>(MESSAGES_SEED_MESSAGES);
  const [pinnedIdsByGroup, setPinnedIdsByGroup] = useState<Record<number, number[]>>({
    1: [1],
    2: [],
    3: [],
    4: [],
    5: [],
  });
  const [floatingChatRequestId, setFloatingChatRequestId] = useState<number | null>(null);

  const ensurePrivateThread = (currentUserName: string, targetName: string, createdBy: UserRole) => {
    const existing = groups.find(
      (g) => g.isPrivate && g.members.length === 2 && g.members.includes(currentUserName) && g.members.includes(targetName)
    );
    if (existing) return existing.id;

    const newGroup: Group = {
      id: Date.now(),
      name: targetName,
      members: [currentUserName, targetName],
      createdBy,
      isPrivate: true,
      lastSender: targetName,
      lastMessage: "Private chat started.",
      lastAt: "Just now",
    };
    setGroups((prev) => [newGroup, ...prev]);
    setPinnedIdsByGroup((prev) => ({ ...prev, [newGroup.id]: [] }));
    return newGroup.id;
  };

  const value = useMemo(
    () => ({
      groups,
      setGroups,
      messages,
      setMessages,
      pinnedIdsByGroup,
      setPinnedIdsByGroup,
      ensurePrivateThread,
      floatingChatRequestId,
      requestOpenFloatingChat: (groupId: number) => setFloatingChatRequestId(groupId),
      clearFloatingChatRequest: () => setFloatingChatRequestId(null),
    }),
    [groups, messages, pinnedIdsByGroup, floatingChatRequestId]
  );

  return <MessagesThreadContext.Provider value={value}>{children}</MessagesThreadContext.Provider>;
}

export function useMessagesThread() {
  const ctx = useContext(MessagesThreadContext);
  if (!ctx) {
    throw new Error("useMessagesThread must be used within MessagesThreadProvider");
  }
  return ctx;
}
