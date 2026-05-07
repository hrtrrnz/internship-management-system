import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, MessageSquare, Pin, Reply, Send, SmilePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRole, type UserRole } from "@/contexts/RoleContext";
import { useMessagesThread } from "@/contexts/MessagesThreadContext";
import type { ChatMessage, Group } from "@/lib/messagesSeed";

/** Open at most N floating panels from the FAB; see full inbox on Messages. */
const MAX_FLOATING_CONVOS_OPEN = 6;

/** One horizontal step when paging: card width (`w-[18rem]`) + `gap-4` (inside a `translateX(calc(...))`). */
const CARD_STRIDE_LEN = "(18rem + 1rem)";

/** Visible window: exactly 3 cards + 2 gaps — no fractional fourth panel. */
const THREE_CARD_CLIP_CSS = "calc(18rem * 3 + 1rem * 2)";

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
  threadMessages,
  currentUserName,
  pinnedIds,
  messagesHref,
  onSend,
  onReact,
  onTogglePin,
  onMessagePerson,
  onClose,
}: {
  chat: Group;
  threadMessages: ChatMessage[];
  currentUserName: string;
  pinnedIds: number[];
  messagesHref: string;
  onSend: (groupId: number, text: string, replyToId: number | null) => void;
  onReact: (messageId: number, emoji: string) => void;
  onTogglePin: (groupId: number, messageId: number) => void;
  onMessagePerson: (name: string) => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [composer, setComposer] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [reactionPickerForId, setReactionPickerForId] = useState<number | null>(null);
  const pinSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const displayLines = threadMessages.length > 0 ? threadMessages : [];
  const replyToMessage = replyToId ? threadMessages.find((m) => m.id === replyToId) ?? null : null;
  const pinnedMessages = useMemo(
    () => pinnedIds.map((id) => threadMessages.find((m) => m.id === id)).filter((m): m is ChatMessage => m != null),
    [pinnedIds, threadMessages]
  );

  const sendFromFloating = () => {
    const text = composer.trim();
    if (!text) return;
    onSend(chat.id, text, replyToId);
    setComposer("");
    setReplyToId(null);
  };

  useEffect(() => {
    if (reactionPickerForId == null) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-floating-reaction-picker]")) return;
      setReactionPickerForId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [reactionPickerForId]);

  return (
    <div
      role="dialog"
      aria-label={`Conversation: ${chat.name}`}
      className="pointer-events-auto relative flex h-[min(22rem,calc(100vh-9rem))] w-[18rem] max-w-[18rem] shrink-0 animate-in fade-in zoom-in-95 duration-150 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/80 bg-primary px-3 py-2 text-primary-foreground">
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 font-display text-[10px] font-bold hover:bg-primary-foreground/25"
          onClick={() => setShowMembersModal(true)}
          aria-label={`Open members for ${chat.name}`}
        >
          {chatInitials(chat.name)}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xs font-semibold leading-tight">{chat.name}</p>
          <p className="truncate text-[10px] opacity-80">Active · {chat.lastAt}</p>
        </div>
        <button
          type="button"
          className="rounded-lg px-1.5 py-1 text-[10px] font-semibold hover:bg-primary-foreground/15"
          onClick={() => setShowPinnedModal(true)}
          aria-label={`Pinned messages (${pinnedMessages.length})`}
        >
          <span className="inline-flex items-center gap-1">
            <Pin className="h-3 w-3" />
            {pinnedMessages.length}
          </span>
        </button>
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
        {displayLines.map((line) => {
          const mine = line.sender === currentUserName;
          return (
          <div key={line.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-2.5 py-1.5 text-xs leading-relaxed shadow-sm whitespace-pre-wrap",
                mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border/80 bg-card text-foreground"
              )}
            >
              {!mine && (
                <button
                  type="button"
                  className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:underline"
                  onClick={() => onMessagePerson(line.sender)}
                >
                  {line.sender}
                </button>
              )}
              {line.replyToId && (
                <p className={cn("mb-1 text-[10px]", mine ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  Replying to #{line.replyToId}
                </p>
              )}
              <p>{line.text}</p>
              {line.reactions && Object.keys(line.reactions).length > 0 && (
                <div className={cn("mt-1.5 flex flex-wrap gap-1", mine && "justify-end")}>
                  {Object.entries(line.reactions).map(([emoji, count]) => (
                    <span
                      key={emoji}
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px]",
                        mine ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      {emoji} {count}
                    </span>
                  ))}
                </div>
              )}
              <div className={cn("mt-1.5 flex flex-wrap items-center gap-1 text-[10px]", mine && "justify-end")}>
                <button type="button" className="rounded px-1 py-0.5 hover:bg-black/10" onClick={() => setReplyToId(line.id)}>
                  <span className="inline-flex items-center gap-1"><Reply className="h-3 w-3" />Reply</span>
                </button>
                <button type="button" className="rounded px-1 py-0.5 hover:bg-black/10" onClick={() => onTogglePin(chat.id, line.id)}>
                  <span className="inline-flex items-center gap-1"><Pin className="h-3 w-3" />{pinSet.has(line.id) ? "Unpin" : "Pin"}</span>
                </button>
                <div data-floating-reaction-picker className="relative inline-flex">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-black/10"
                    onClick={() => setReactionPickerForId((prev) => (prev === line.id ? null : line.id))}
                    aria-haspopup="menu"
                    aria-expanded={reactionPickerForId === line.id}
                  >
                    <SmilePlus className="h-3.5 w-3.5" />
                  </button>
                  {reactionPickerForId === line.id && (
                    <div className="absolute bottom-full right-0 z-20 mb-1 flex flex-nowrap gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1.5 shadow-lg">
                      {["👍", "🔥", "✅", "👏", "🙂", "🎉"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            onReact(line.id, emoji);
                            setReactionPickerForId(null);
                          }}
                          className={cn("rounded-md px-2 py-1 text-sm hover:bg-muted", line.myReaction === emoji && "bg-muted")}
                          aria-label={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>

      <div className="shrink-0 space-y-2 border-t border-border/80 bg-card p-2">
        {replyToMessage && (
          <div className="flex items-start justify-between gap-1 rounded-md border border-border/80 bg-muted/30 px-2 py-1 text-[10px]">
            <span className="line-clamp-2">
              <span className="font-semibold">Replying: </span>
              {replyToMessage.text}
            </span>
            <button type="button" className="rounded p-0.5 hover:bg-muted" onClick={() => setReplyToId(null)}>
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <div className="flex gap-1.5">
          <Input
            placeholder="Message…"
            className="h-8 flex-1 text-xs"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendFromFloating();
              }
            }}
          />
          <Button type="button" size="icon" className="h-8 w-8 shrink-0" aria-label="Send" onClick={sendFromFloating}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {showMembersModal && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 p-2"
          role="presentation"
          onClick={() => setShowMembersModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85%] w-full max-w-[16.5rem] overflow-y-auto rounded-xl border border-border/80 bg-card p-2 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold">{chat.isPrivate ? "Private participants" : "Group members"}</p>
              <button type="button" className="rounded p-0.5 hover:bg-muted" onClick={() => setShowMembersModal(false)}>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {chat.members.map((member) => (
                <div key={member} className="flex items-center justify-between gap-1 rounded-md border border-border/70 bg-muted/20 px-2 py-1.5 text-[11px]">
                  <span className="truncate font-medium text-foreground">{member}</span>
                  {member !== currentUserName && (
                    <button
                      type="button"
                      className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted"
                      onClick={() => {
                        onMessagePerson(member);
                        setShowMembersModal(false);
                      }}
                    >
                      Message
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-primary hover:bg-muted/60"
              onClick={() => navigate(messagesHref)}
            >
              <ExternalLink className="h-3 w-3" />
              Open in Messages
            </button>
          </div>
        </div>
      )}

      {showPinnedModal && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-2"
          role="presentation"
          onClick={() => setShowPinnedModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85%] w-full max-w-[16.5rem] overflow-y-auto rounded-xl border border-border/80 bg-card p-2 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold">Pinned Messages ({pinnedMessages.length})</p>
              <button type="button" className="rounded p-0.5 hover:bg-muted" onClick={() => setShowPinnedModal(false)}>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {pinnedMessages.length > 0 ? (
              <div className="space-y-1.5">
                {pinnedMessages.map((pm) => (
                  <div key={pm.id} className="rounded-lg border border-border/70 bg-muted/20 px-2 py-1.5 text-[11px]">
                    <p className="font-semibold">{pm.sender}</p>
                    <p className="line-clamp-2 text-foreground/85">{pm.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-border p-2 text-center text-[11px] text-muted-foreground">
                No pinned messages yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FloatingMessagesLauncher() {
  const { pathname } = useLocation();
  const { role, user } = useRole();
  const { groups, setGroups, messages, setMessages, pinnedIdsByGroup, setPinnedIdsByGroup, ensurePrivateThread, floatingChatRequestId, requestOpenFloatingChat, clearFloatingChatRequest } = useMessagesThread();
  const [launcherActive, setLauncherActive] = useState(false);
  const [openChatIds, setOpenChatIds] = useState<number[]>([]);
  /** Leftmost visible index among `openChatIds` (shows 3 panels when length > 3). */
  const [floatingPageStart, setFloatingPageStart] = useState(0);
  const messagesByGroupId = useMemo(() => {
    const map = new Map<number, ChatMessage[]>();
    for (const g of groups) {
      map.set(
        g.id,
        [...messages].filter((m) => m.groupId === g.id).sort((a, b) => a.id - b.id)
      );
    }
    return map;
  }, [groups, messages]);

  const exitLauncher = useCallback(() => {
    setLauncherActive(false);
    setOpenChatIds([]);
  }, []);

  const enterLauncher = useCallback(() => {
    setLauncherActive(true);
    setFloatingPageStart(0);
    setOpenChatIds(groups.slice(0, MAX_FLOATING_CONVOS_OPEN).map((g) => g.id));
  }, [groups]);

  const closeChat = useCallback((id: number) => {
    setOpenChatIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const messagePersonFromName = useCallback(
    (name: string) => {
      if (!name || name === user.name) return;
      const privateId = ensurePrivateThread(user.name, name, role);
      requestOpenFloatingChat(privateId);
    },
    [ensurePrivateThread, requestOpenFloatingChat, role, user.name]
  );

  useEffect(() => {
    if (floatingChatRequestId == null) return;
    const id = floatingChatRequestId;
    setLauncherActive(true);
    setOpenChatIds((prev) => {
      const without = prev.filter((x) => x !== id);
      if (without.length === prev.length && prev.includes(id)) return prev;
      const next = [...without, id].slice(-MAX_FLOATING_CONVOS_OPEN);
      const newStart = Math.max(0, next.indexOf(id) - 0 - 2);
      setFloatingPageStart(newStart);
      return next;
    });
    clearFloatingChatRequest();
  }, [floatingChatRequestId, clearFloatingChatRequest]);

  const reactToMessage = useCallback((messageId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const nextReactions = { ...(m.reactions ?? {}) };
        if (m.myReaction) {
          const oldCount = (nextReactions[m.myReaction] ?? 0) - 1;
          if (oldCount > 0) nextReactions[m.myReaction] = oldCount;
          else delete nextReactions[m.myReaction];
        }
        nextReactions[emoji] = (nextReactions[emoji] ?? 0) + 1;
        return { ...m, reactions: nextReactions, myReaction: emoji };
      })
    );
  }, [setMessages]);

  const togglePinMessage = useCallback((groupId: number, messageId: number) => {
    setPinnedIdsByGroup((prev) => {
      const cur = [...(prev[groupId] ?? [])];
      const i = cur.indexOf(messageId);
      if (i >= 0) cur.splice(i, 1);
      else cur.unshift(messageId);
      return { ...prev, [groupId]: cur };
    });
  }, []);

  const sendFloatingMessage = useCallback(
    (groupId: number, text: string, replyToId: number | null) => {
      const clean = text.trim();
      if (!clean) return;
      const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          groupId,
          sender: user.name,
          text: clean,
          at: now,
          status: "sent",
          replyToId: replyToId ?? undefined,
        },
      ]);
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, lastSender: user.name, lastMessage: clean, lastAt: now } : g))
      );
    },
    [setGroups, setMessages, user.name]
  );

  useEffect(() => {
    if (openChatIds.length === 0) setLauncherActive(false);
  }, [openChatIds.length]);

  const chatById = useCallback((id: number) => groups.find((g) => g.id === id), [groups]);

  const floatingMaxPageStart = Math.max(0, openChatIds.length - 3);

  useEffect(() => {
    setFloatingPageStart((p) => Math.min(p, floatingMaxPageStart));
  }, [floatingMaxPageStart]);

  const showFloatingPagination = openChatIds.length > 3;
  const canFloatingNextPage = floatingPageStart < floatingMaxPageStart;
  const canFloatingPrevPage = floatingPageStart > 0;

  /** Left control: reveal the next trio (indices shift +1). */
  const floatingNextPage = useCallback(() => {
    setFloatingPageStart((p) => Math.min(floatingMaxPageStart, p + 1));
  }, [floatingMaxPageStart]);

  /** Right control: reveal the previous trio (indices shift −1). */
  const floatingPrevPage = useCallback(() => {
    setFloatingPageStart((p) => Math.max(0, p - 1));
  }, []);

  if (isMessagesRoute(pathname)) {
    return null;
  }

  const messagesHref = messagesPathByRole[role];

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[70] pb-[env(safe-area-inset-bottom,0px)] sm:right-10">
      <div className={cn("flex flex-nowrap items-end justify-end gap-3", launcherActive ? "max-w-none" : "max-w-[calc(100vw-2rem)]")}>
        {!launcherActive ? (
          <button
            type="button"
            aria-label="Open messages"
            aria-expanded={false}
            className={cn(
              "pointer-events-auto flex h-14 w-14 shrink-0 touch-manipulation items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background",
              "transition-[box-shadow,transform] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            onClick={enterLauncher}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        ) : (
          <>
            <div className="pointer-events-none flex shrink-0 items-center gap-2">
              {showFloatingPagination && (
                <button
                  type="button"
                  aria-label="Show next conversations"
                  title="Next conversations"
                  disabled={!canFloatingNextPage}
                  className={cn(
                    "pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "border border-border bg-card/95 text-foreground shadow-md backdrop-blur-sm",
                    "hover:bg-muted disabled:pointer-events-none disabled:opacity-35"
                  )}
                  onClick={floatingNextPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}

              <div
                className={cn(
                  "pointer-events-auto overflow-hidden py-4",
                  showFloatingPagination ? "" : "w-max max-w-[calc(18rem*3+1rem*2)]"
                )}
                style={showFloatingPagination ? { width: THREE_CARD_CLIP_CSS } : undefined}
                role="region"
                aria-label="Floating conversations"
              >
                <div
                  className="flex flex-nowrap items-end gap-4 transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translateX(calc(${-floatingPageStart} * ${CARD_STRIDE_LEN}))`,
                  }}
                >
                  {openChatIds.map((id) => {
                    const chat = chatById(id);
                    if (!chat) return null;
                    return (
                      <div key={id} className="shrink-0 self-end">
                        <FloatingChatBox
                          chat={chat}
                          threadMessages={messagesByGroupId.get(chat.id) ?? []}
                          currentUserName={user.name}
                          pinnedIds={pinnedIdsByGroup[chat.id] ?? []}
                          messagesHref={messagesHref}
                          onSend={sendFloatingMessage}
                          onReact={reactToMessage}
                          onTogglePin={togglePinMessage}
                          onMessagePerson={messagePersonFromName}
                          onClose={() => closeChat(id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {showFloatingPagination && (
                <button
                  type="button"
                  aria-label="Show previous conversations"
                  title="Previous conversations"
                  disabled={!canFloatingPrevPage}
                  className={cn(
                    "pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "border border-border bg-card/95 text-foreground shadow-md backdrop-blur-sm",
                    "hover:bg-muted disabled:pointer-events-none disabled:opacity-35"
                  )}
                  onClick={floatingPrevPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              aria-label="Exit messenger — closes all conversations"
              className={cn(
                "pointer-events-auto flex h-14 w-14 shrink-0 touch-manipulation items-center justify-center rounded-full border-2 border-background bg-muted text-foreground shadow-lg",
                "self-end transition-[box-shadow,transform]",
                "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:bg-muted/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              onClick={exitLauncher}
            >
              <X className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
