import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ChatMessage, Group } from "@/lib/messagesSeed";
import { MESSAGES_SEED_GROUPS, MESSAGES_SEED_MESSAGES } from "@/lib/messagesSeed";

type MessagesThreadContextValue = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

const MessagesThreadContext = createContext<MessagesThreadContextValue | null>(null);

export function MessagesThreadProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(MESSAGES_SEED_GROUPS);
  const [messages, setMessages] = useState<ChatMessage[]>(MESSAGES_SEED_MESSAGES);

  const value = useMemo(
    () => ({
      groups,
      setGroups,
      messages,
      setMessages,
    }),
    [groups, messages]
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
