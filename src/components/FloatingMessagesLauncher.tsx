import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRole, type UserRole } from "@/contexts/RoleContext";
import { useMessagesThread } from "@/contexts/MessagesThreadContext";
import type { Group } from "@/lib/messagesSeed";
import { getFloatingLinesForGroup, type FloatingThreadLine } from "@/lib/messagesSeed";

const messagesPathByRole: Record<UserRole, string> = {
  student: "/messages",
  mentor: "/mentor/messages",
  admin: "/admin/messages",
};

function isMessagesRoute(pathname: string) {
  return (
    pathname === "/messages" ||
    pathname === "/mentor/messages" ||
    pathname === "/admin/messages"
  );
}

function chatInitials(name: string) {
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function FloatingChatBox({
  chat,
  lines,
  messagesHref,
  onClose,
}: {
  chat: Group;
  lines: FloatingThreadLine[];
  messagesHref: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const displayLines =
    lines.length > 0
      ? lines
      : [{ sender: chat.lastSender, text: chat.lastMessage }];

  return (
    <div
      role="dialog"
      aria-label={`Conversation: ${chat.name}`}
      className="pointer-events-auto flex h-[min(22rem,calc(100vh-7rem))] w-[min(calc(100vw-5rem),18rem)] shrink-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-200 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10 sm:w-72"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/80 bg-primary px-3 py-2.5 text-primary-foreground">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 font-display text-[10px] font-bold">
          {chatInitials(chat.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xs font-semibold leading-tight">{chat.name}</p>
          <p className="truncate text-[10px] opacity-80">Active · {chat.lastAt}</p>
        </div>
        <button
          type="button"
          className="rounded-lg p-1 text-primary-foreground/90 hover:bg-primary-foreground/15"
          aria-label={`Close ${chat.name}`}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-muted/20 to-background px-3 py-3">
        {displayLines.map((line, i) => (
          <div key={i} className={cn("flex", line.mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-2.5 py-1.5 text-xs leading-relaxed shadow-sm whitespace-pre-wrap",
                line.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border/80 bg-card text-foreground"
              )}
            >
              {!line.mine && <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{line.sender}</p>}
              <p>{line.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 space-y-2 border-t border-border/80 bg-card p-2">
        <div className="flex gap-1.5">
          <Input placeholder="Message…" className="h-8 flex-1 text-xs" disabled readOnly />
          <Button type="button" size="icon" className="h-8 w-8 shrink-0" disabled aria-label="Send">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-primary hover:bg-muted/60"
          onClick={() => navigate(messagesHref)}
        >
          <ExternalLink className="h-3 w-3" />
          Open in Messages
        </button>
      </div>
    </div>
  );
}

export default function FloatingMessagesLauncher() {
  const { pathname } = useLocation();
  const { role, user } = useRole();
  const { groups, messages } = useMessagesThread();
  const [launcherActive, setLauncherActive] = useState(false);
  const [openChatIds, setOpenChatIds] = useState<number[]>([]);

  const linesByGroupId = useMemo(() => {
    const map = new Map<number, FloatingThreadLine[]>();
    for (const g of groups) {
      map.set(g.id, getFloatingLinesForGroup(messages, g.id, user.name));
    }
    return map;
  }, [groups, messages, user.name]);

  const exitLauncher = useCallback(() => {
    setLauncherActive(false);
    setOpenChatIds([]);
  }, []);

  const enterLauncher = useCallback(() => {
    setLauncherActive(true);
    setOpenChatIds(groups.map((g) => g.id));
  }, [groups]);

  const closeChat = useCallback((id: number) => {
    setOpenChatIds((prev) => prev.filter((x) => x !== id));
  }, []);

  useEffect(() => {
    if (openChatIds.length === 0) setLauncherActive(false);
  }, [openChatIds.length]);

  const chatById = useCallback((id: number) => groups.find((g) => g.id === id), [groups]);

  if (isMessagesRoute(pathname)) {
    return null;
  }

  const messagesHref = messagesPathByRole[role];

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-6 right-6 z-[70] flex max-w-[calc(100vw-1.5rem)] flex-row-reverse items-end gap-2 pb-1 sm:gap-3",
        launcherActive ? "overflow-x-auto" : "overflow-x-hidden"
      )}
    >
      {launcherActive && (
        <>
          <button
            type="button"
            aria-label="Exit messenger — closes all conversations"
            className={cn(
              "pointer-events-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-foreground shadow-lg transition-transform hover:scale-105 hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            onClick={exitLauncher}
          >
            <X className="h-6 w-6" />
          </button>

          {[...openChatIds].reverse().map((id) => {
            const chat = chatById(id);
            if (!chat) return null;
            return (
              <FloatingChatBox
                key={id}
                chat={chat}
                lines={linesByGroupId.get(chat.id) ?? []}
                messagesHref={messagesHref}
                onClose={() => closeChat(id)}
              />
            );
          })}
        </>
      )}

      {!launcherActive && (
        <button
          type="button"
          aria-label="Open messages"
          aria-expanded={false}
          className={cn(
            "pointer-events-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          onClick={enterLauncher}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
