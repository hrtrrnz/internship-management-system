import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BellOff,
  Check,
  CheckCheck,
  Forward,
  Info,
  MessageSquare,
  Paperclip,
  Pin,
  Plus,
  Search,
  Send,
  Smile,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRole, type UserRole } from "@/contexts/RoleContext";
import { useMessagesThread } from "@/contexts/MessagesThreadContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MockFileDownloadMenu } from "@/components/MockFileDownloadMenu";
import type { ChatMessage, Group } from "@/lib/messagesSeed";
import { MESSAGES_SEED_GROUPS } from "@/lib/messagesSeed";

const quickEmojis = ["👍", "🔥", "✅", "👏", "🙂", "🎉"];

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function initialsFromGroupName(name: string) {
  const alnum = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  const words = alnum.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const roleSubtitle: Record<UserRole, string> = {
  student: "Stay aligned with mentors, your unit, and batch channels.",
  mentor: "Coordinate with interns, units, and leadership in one place.",
  admin: "Broadcast updates and keep batch and department threads organized.",
};

export default function Messages() {
  const { role, user } = useRole();
  const { groups, setGroups, messages, setMessages, pinnedIdsByGroup, setPinnedIdsByGroup, ensurePrivateThread } = useMessagesThread();
  const canCreateGroup = role === "mentor" || role === "admin";
  const canCreatePrivate = true;

  const [selectedGroupId, setSelectedGroupId] = useState<number>(MESSAGES_SEED_GROUPS[0].id);
  const [messageInput, setMessageInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<string[]>([]);
  const [chatSearch, setChatSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [draftByGroup, setDraftByGroup] = useState<Record<number, string>>({});
  const [newMemberName, setNewMemberName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  /** Controls floating pinned-list modal visibility. */
  const [showPinnedListModal, setShowPinnedListModal] = useState(false);
  /** When set, floating modal shows this pinned message (by id). */
  const [pinnedDetailId, setPinnedDetailId] = useState<number | null>(null);
  const [reactionPickerForId, setReactionPickerForId] = useState<number | null>(null);
  const [selectedNameToMessage, setSelectedNameToMessage] = useState<string | null>(null);

  const visibleGroups = useMemo(() => {
    const normalized = chatSearch.trim().toLowerCase();
    return groups
      .filter((g) => (showArchived ? true : !g.archived))
      .filter((g) => !normalized || g.name.toLowerCase().includes(normalized) || g.lastMessage.toLowerCase().includes(normalized))
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [groups, chatSearch, showArchived]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? visibleGroups[0];

  const groupMessages = useMemo(() => {
    const normalized = messageSearch.trim().toLowerCase();
    const list = messages.filter((m) => m.groupId === selectedGroup?.id);
    if (!normalized) return list;
    return list.filter((m) => m.text.toLowerCase().includes(normalized) || m.sender.toLowerCase().includes(normalized));
  }, [messages, selectedGroup?.id, messageSearch]);

  const pinnedMessagesList = useMemo(() => {
    if (!selectedGroup) return [];
    const ids = pinnedIdsByGroup[selectedGroup.id] ?? [];
    return ids
      .map((id) => messages.find((m) => m.id === id && m.groupId === selectedGroup.id))
      .filter((m): m is ChatMessage => m != null);
  }, [messages, selectedGroup, pinnedIdsByGroup]);

  const pinnedDetailMessage = useMemo(() => {
    if (pinnedDetailId == null || !selectedGroup) return null;
    return messages.find((m) => m.id === pinnedDetailId && m.groupId === selectedGroup.id) ?? null;
  }, [pinnedDetailId, messages, selectedGroup]);

  const selectedPinIdSet = useMemo(() => {
    if (!selectedGroup) return new Set<number>();
    return new Set(pinnedIdsByGroup[selectedGroup.id] ?? []);
  }, [selectedGroup, pinnedIdsByGroup]);

  const replyToMessage = useMemo(
    () => (replyToId ? messages.find((m) => m.id === replyToId) ?? null : null),
    [messages, replyToId]
  );

  const editingMessage = useMemo(
    () => (editingMessageId ? messages.find((m) => m.id === editingMessageId) ?? null : null),
    [messages, editingMessageId]
  );

  const handleCreateGroup = () => {
    if (!canCreateGroup) return;
    const name = window.prompt("Enter group name")?.trim() ?? "";
    if (!name) return;
    const newGroup: Group = {
      id: Date.now(),
      name,
      members: [user.name],
      createdBy: role,
      lastSender: user.name,
      lastMessage: "Group created.",
      lastAt: "Just now",
    };
    setGroups((prev) => [newGroup, ...prev]);
    setSelectedGroupId(newGroup.id);
    setDraftByGroup((prev) => ({ ...prev, [newGroup.id]: "" }));
    setPinnedIdsByGroup((prev) => ({ ...prev, [newGroup.id]: [] }));
  };

  const handleCreatePrivateChat = () => {
    const candidateNames = Array.from(new Set(groups.flatMap((g) => g.members))).filter((name) => name !== user.name);
    if (candidateNames.length === 0) return;
    const input = window.prompt(`Start private chat with:\n${candidateNames.join(", ")}`)?.trim();
    if (!input) return;
    const normalized = input.toLowerCase();
    const targetName = candidateNames.find((n) => n.toLowerCase() === normalized);
    if (!targetName) return;

    const privateId = ensurePrivateThread(user.name, targetName, role);
    setSelectedGroupId(privateId);
    setDraftByGroup((prev) => ({ ...prev, [privateId]: prev[privateId] ?? "" }));
  };

  const messagePersonFromName = (name: string) => {
    if (!name || name === user.name) return;
    const privateId = ensurePrivateThread(user.name, name, role);
    setSelectedGroupId(privateId);
    setSelectedNameToMessage(null);
  };

  const handleSend = () => {
    const text = messageInput.trim();
    if ((!text && pendingAttachments.length === 0) || !selectedGroup) return;

    if (editingMessageId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessageId
            ? { ...m, text: text || m.text, edited: true, attachments: pendingAttachments.length ? pendingAttachments : m.attachments }
            : m
        )
      );
      setEditingMessageId(null);
      setReplyToId(null);
      setPendingAttachments([]);
      setMessageInput("");
      return;
    }

    const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const newId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: newId,
        groupId: selectedGroup.id,
        sender: user.name,
        text: text || "(attachment)",
        at: now,
        attachments: pendingAttachments.length ? pendingAttachments : undefined,
        replyToId: replyToId ?? undefined,
        status: "sent",
      },
    ]);
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroup.id ? { ...g, lastSender: user.name, lastMessage: text || "Sent attachment", lastAt: now } : g
      )
    );
    setMessageInput("");
    setDraftByGroup((prev) => ({ ...prev, [selectedGroup.id]: "" }));
    setPendingAttachments([]);
    setReplyToId(null);
    setEmojiOpen(false);

    window.setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newId ? { ...m, status: "delivered" } : m)));
    }, 500);
    window.setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === newId ? { ...m, status: "read" } : m)));
    }, 1200);

    const responder = selectedGroup.members.find((name) => name !== user.name);
    if (responder) {
      setIsTyping(true);
      window.setTimeout(() => {
        const incomingAt = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            groupId: selectedGroup.id,
            sender: responder,
            text: "Received. Thank you!",
            at: incomingAt,
            status: "read",
          },
        ]);
        setGroups((prev) =>
          prev.map((g) => (g.id === selectedGroup.id ? { ...g, lastSender: responder, lastMessage: "Received. Thank you!", lastAt: incomingAt } : g))
        );
        setIsTyping(false);
      }, 1400);
    }
  };

  const handleAttachmentPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).map((file) => file.name);
    if (files.length === 0) return;
    setPendingAttachments((prev) => [...prev, ...files]);
    e.currentTarget.value = "";
  };

  const selectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    setMessageInput(draftByGroup[groupId] ?? "");
    setReplyToId(null);
    setEditingMessageId(null);
    setMessageSearch("");
    setShowGroupInfo(false);
    setShowPinnedListModal(false);
    setPinnedDetailId(null);
    setSelectedNameToMessage(null);
  };

  const closePinnedOverlayAndScrollToMessage = () => {
    if (pinnedDetailId == null) return;
    const id = pinnedDetailId;
    setMessageSearch("");
    setPinnedDetailId(null);
    window.setTimeout(() => {
      document.getElementById(`thread-message-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const onComposerChange = (value: string) => {
    setMessageInput(value);
    if (!selectedGroup) return;
    setDraftByGroup((prev) => ({ ...prev, [selectedGroup.id]: value }));
  };

  const toggleGroupFlag = (groupId: number, key: "pinned" | "muted" | "archived") => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, [key]: !g[key] } : g)));
  };

  const startReply = (messageId: number) => {
    setReplyToId(messageId);
    setEditingMessageId(null);
  };

  const startEdit = (messageId: number, currentText: string) => {
    setEditingMessageId(messageId);
    setReplyToId(null);
    setMessageInput(currentText);
    if (selectedGroup) setDraftByGroup((prev) => ({ ...prev, [selectedGroup.id]: currentText }));
  };

  const deleteMessage = (messageId: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    if (replyToId === messageId) setReplyToId(null);
    if (editingMessageId === messageId) setEditingMessageId(null);
    setPinnedIdsByGroup((prev) => {
      const next: Record<number, number[]> = { ...prev };
      for (const key of Object.keys(next)) {
        const gid = Number(key);
        next[gid] = (next[gid] ?? []).filter((id) => id !== messageId);
      }
      return next;
    });
    if (pinnedDetailId === messageId) setPinnedDetailId(null);
  };

  const forwardMessage = (messageId: number) => {
    const target = messages.find((m) => m.id === messageId);
    if (!target || !selectedGroup) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        groupId: selectedGroup.id,
        sender: user.name,
        text: `Forwarded: ${target.text}`,
        at: now,
        status: "sent",
      },
    ]);
  };

  const reactToMessage = (messageId: number, emoji: string) => {
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
  };

  const togglePinMessage = (messageId: number) => {
    if (!selectedGroup) return;
    setPinnedIdsByGroup((prev) => {
      const gid = selectedGroup.id;
      const cur = [...(prev[gid] ?? [])];
      const i = cur.indexOf(messageId);
      if (i >= 0) cur.splice(i, 1);
      else cur.unshift(messageId);
      return { ...prev, [gid]: cur };
    });
  };

  const unpinMessage = (messageId: number) => {
    if (!selectedGroup) return;
    setPinnedIdsByGroup((prev) => {
      const gid = selectedGroup.id;
      return { ...prev, [gid]: (prev[gid] ?? []).filter((id) => id !== messageId) };
    });
    if (pinnedDetailId === messageId) setPinnedDetailId(null);
  };

  const addMember = () => {
    if (!canCreateGroup || !selectedGroup) return;
    const name = newMemberName.trim();
    if (!name) return;
    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? { ...g, members: Array.from(new Set([...g.members, name])) } : g)));
    setNewMemberName("");
  };

  const removeMember = (name: string) => {
    if (!canCreateGroup || !selectedGroup) return;
    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? { ...g, members: g.members.filter((m) => m !== name) } : g)));
  };

  const msgActionClass =
    "rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  useEffect(() => {
    if (reactionPickerForId == null) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-reaction-picker]")) return;
      setReactionPickerForId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [reactionPickerForId]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Messages</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{roleSubtitle[role]}</p>
        </div>
        {(canCreateGroup || canCreatePrivate) && (
          <div className="flex flex-wrap items-center gap-2">
            {canCreateGroup && (
              <Button type="button" onClick={handleCreateGroup} className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                New group
              </Button>
            )}
            {canCreatePrivate && (
              <Button type="button" variant="outline" onClick={handleCreatePrivateChat} className="gap-2 border-dashed shadow-sm">
                <Users className="h-4 w-4" />
                New private
              </Button>
            )}
            <Button
              type="button"
              variant={showArchived ? "secondary" : "outline"}
              onClick={() => setShowArchived((prev) => !prev)}
              className="gap-2 border-dashed"
            >
              <Archive className="h-4 w-4" />
              {showArchived ? "Hide archived" : "Archived"}
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
        <div className="flex min-h-[min(640px,calc(100vh-11rem))] max-h-[min(720px,calc(100vh-9rem))] flex-col lg:flex-row">
          {/* Sidebar — conversations */}
          <aside className="flex max-h-[40vh] flex-col border-b border-border bg-muted/20 lg:max-h-none lg:w-[min(100%,320px)] lg:shrink-0 lg:border-b-0 lg:border-r lg:border-border">
            <div className="border-b border-border/80 px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversations</p>
                <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground shadow-sm ring-1 ring-border/60">
                  {visibleGroups.length}
                </span>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="h-9 border-border/80 bg-background pl-9 shadow-sm"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
              {visibleGroups.map((group) => {
                const active = group.id === selectedGroupId;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => selectGroup(group.id)}
                    className={cn(
                      "w-full rounded-xl px-3 py-3 text-left transition-all duration-150",
                      active
                        ? "bg-background shadow-md ring-1 ring-border"
                        : "hover:bg-background/80 hover:shadow-sm"
                    )}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold shadow-sm",
                          active ? "bg-primary text-primary-foreground" : "bg-primary/12 text-primary"
                        )}
                      >
                        {initialsFromGroupName(group.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-display text-sm font-semibold leading-snug text-foreground">{group.name}</p>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">{group.lastAt}</span>
                            {typeof group.unread === "number" && group.unread > 0 ? (
                              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
                                {group.unread}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground/80">{group.lastSender}</span>
                          <span className="text-muted-foreground/80"> · </span>
                          {group.lastMessage}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {group.isPrivate && (
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-primary/12 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                              Private
                            </span>
                          )}
                          {group.pinned && (
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-stat-orange-bg px-1.5 py-0.5 text-[10px] font-medium text-stat-orange">
                              <Pin className="h-2.5 w-2.5" /> Pinned
                            </span>
                          )}
                          {group.muted && (
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              <BellOff className="h-2.5 w-2.5" /> Muted
                            </span>
                          )}
                          {!group.isPrivate && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Users className="h-3 w-3 opacity-70" />
                              {group.members.length}
                            </span>
                          )}
                        </div>
                        {canCreateGroup && !group.isPrivate && (
                          <div className="mt-2 flex flex-wrap gap-1 border-t border-border/50 pt-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[10px] font-medium text-muted-foreground"
                              onClick={() => toggleGroupFlag(group.id, "pinned")}
                            >
                              {group.pinned ? "Unpin" : "Pin"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[10px] font-medium text-muted-foreground"
                              onClick={() => toggleGroupFlag(group.id, "muted")}
                            >
                              {group.muted ? "Unmute" : "Mute"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[10px] font-medium text-muted-foreground"
                              onClick={() => toggleGroupFlag(group.id, "archived")}
                            >
                              {group.archived ? "Restore" : "Archive"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main thread */}
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-background">
            <header className="shrink-0 border-b border-border/80 bg-card/30 px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 sm:mr-4 sm:flex-1">
                  <h3 className="font-display text-base font-semibold leading-tight text-foreground sm:text-lg">
                    {selectedGroup?.name ?? "Select a conversation"}
                  </h3>
                  {selectedGroup && (
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/80 px-2 py-0.5 font-medium text-foreground/80">
                        <Users className="h-3 w-3" />
                        {selectedGroup.isPrivate ? "Private chat" : `${selectedGroup.members.length} members`}
                      </span>
                      <span className="hidden sm:inline">·</span>
                      <span>Last activity {selectedGroup.lastAt}</span>
                    </p>
                  )}
                </div>
                <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end">
                  <div className="relative min-w-0 flex-1 sm:w-44 sm:flex-initial">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      placeholder="Search"
                      className="h-9 border-border/80 bg-background pl-9 text-sm shadow-sm"
                      aria-label="Search in this conversation"
                    />
                  </div>
                  <Button
                    type="button"
                    variant={showGroupInfo ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowPinnedListModal(false);
                      setPinnedDetailId(null);
                      setShowGroupInfo((prev) => !prev);
                    }}
                    className="shrink-0 gap-1.5 border-dashed shadow-sm"
                    aria-expanded={showGroupInfo}
                    aria-controls="group-details-panel"
                  >
                    <Info className="h-3.5 w-3.5" />
                    Details
                  </Button>
                </div>
              </div>
              {selectedNameToMessage && selectedNameToMessage !== user.name && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{selectedNameToMessage}</span>
                  </span>
                  <Button type="button" size="sm" className="h-7 px-3 text-xs" onClick={() => messagePersonFromName(selectedNameToMessage)}>
                    Message
                  </Button>
                </div>
              )}
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-left shadow-sm transition-colors hover:bg-amber-100/80 dark:border-amber-900/50 dark:bg-amber-950/30 dark:hover:bg-amber-950/45"
                onClick={() => {
                  setShowGroupInfo(false);
                  setPinnedDetailId(null);
                  setShowPinnedListModal(true);
                }}
                aria-haspopup="dialog"
                aria-expanded={showPinnedListModal}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-900/90 dark:text-amber-200/90">
                  <Pin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Pinned Messages ({pinnedMessagesList.length})
                </span>
                <span className="text-[11px] font-medium text-amber-900/75 dark:text-amber-200/75">View</span>
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-muted/15 to-background px-4 py-4 sm:px-6">
              {groupMessages.length > 0 ? (
                <div className="flex w-full flex-col items-stretch gap-4">
                  {groupMessages.map((message) => {
                    const mine = message.sender === user.name;
                    return (
                      <div
                        key={message.id}
                        id={`thread-message-${message.id}`}
                        className={cn(
                          "group/message flex w-full min-w-0 scroll-mt-4 gap-2.5",
                          mine ? "justify-end" : "justify-start"
                        )}
                      >
                        {!mine && (
                          <div
                            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-[10px] font-bold text-primary shadow-sm ring-1 ring-primary/10"
                            aria-hidden
                          >
                            {initialsFromName(message.sender)}
                          </div>
                        )}
                        <div
                          className={cn(
                            "min-w-0 max-w-[min(100%,26rem)] shrink-0 space-y-1",
                            mine ? "ml-auto flex flex-col items-end" : "mr-auto"
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                              mine
                                ? "rounded-tr-md bg-primary text-primary-foreground"
                                : "rounded-tl-md border border-border/80 bg-card text-foreground"
                            )}
                          >
                            {message.replyToId && (
                              <div
                                className={cn(
                                  "mb-2 border-l-2 pl-2.5 text-[10px] leading-snug",
                                  mine ? "border-primary-foreground/50 text-primary-foreground/85" : "border-primary/40 text-muted-foreground"
                                )}
                              >
                                Replying to #{message.replyToId}
                              </div>
                            )}
                            <div className={cn("text-[11px] font-semibold uppercase tracking-wide", mine ? "text-primary-foreground/75" : "text-muted-foreground")}>
                              <button
                                type="button"
                                onClick={() => setSelectedNameToMessage(message.sender)}
                                className="hover:underline"
                              >
                                {message.sender}
                              </button>
                            </div>
                            <p className={cn("mt-0.5", mine ? "text-primary-foreground" : "text-foreground")}>{message.text}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                {message.attachments.map((file) => (
                                  <div
                                    key={file}
                                    className={cn(
                                      "flex w-full max-w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                                      mine ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted/80 text-foreground"
                                    )}
                                  >
                                    <span className="flex min-w-0 items-center gap-1.5">
                                      <Paperclip className="h-3 w-3 shrink-0 opacity-80" />
                                      <span className="truncate">{file}</span>
                                    </span>
                                    <MockFileDownloadMenu
                                      fileLabel={file}
                                      triggerClassName={
                                        mine
                                          ? "text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
                                          : undefined
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            {message.reactions && Object.keys(message.reactions).length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {Object.entries(message.reactions).map(([emoji, count]) => (
                                  <span
                                    key={emoji}
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-[10px] font-medium tabular-nums",
                                      mine ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-foreground"
                                    )}
                                  >
                                    {emoji} {count}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div
                              className={cn(
                                "mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] tabular-nums",
                                mine ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}
                            >
                              <span>{message.at}</span>
                              {mine && (
                                <>
                                  <span className="opacity-50">·</span>
                                  <span className="inline-flex items-center gap-0.5">
                                    {message.status === "read" ? (
                                      <>
                                        <CheckCheck className="h-3 w-3" /> Read
                                      </>
                                    ) : message.status === "delivered" ? (
                                      <>
                                        <CheckCheck className="h-3 w-3" /> Delivered
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3 w-3" /> Sent
                                      </>
                                    )}
                                  </span>
                                  {message.edited && (
                                    <>
                                      <span className="opacity-50">·</span>
                                      <span>Edited</span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex max-w-full flex-wrap items-center gap-x-0.5 gap-y-1 px-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover/message:opacity-100",
                              mine && "justify-end"
                            )}
                          >
                            <button type="button" onClick={() => startReply(message.id)} className={msgActionClass}>
                              Reply
                            </button>
                            {mine && (
                              <button type="button" onClick={() => startEdit(message.id, message.text)} className={msgActionClass}>
                                Edit
                              </button>
                            )}
                            <button type="button" onClick={() => forwardMessage(message.id)} className={cn(msgActionClass, "inline-flex items-center gap-1")}>
                              <Forward className="h-3 w-3" /> Forward
                            </button>
                            <button type="button" onClick={() => deleteMessage(message.id)} className={cn(msgActionClass, "inline-flex items-center gap-1")}>
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => togglePinMessage(message.id)}
                              className={cn(msgActionClass, "inline-flex items-center gap-1")}
                            >
                              <Pin className="h-3 w-3" /> {selectedPinIdSet.has(message.id) ? "Unpin" : "Pin"}
                            </button>
                            <div data-reaction-picker className="relative inline-flex">
                              <button
                                type="button"
                                onClick={() => setReactionPickerForId((prev) => (prev === message.id ? null : message.id))}
                                className={cn(msgActionClass, "inline-flex items-center gap-1")}
                                aria-haspopup="menu"
                                aria-expanded={reactionPickerForId === message.id}
                              >
                                <Smile className="h-3 w-3" /> React
                              </button>
                              {reactionPickerForId === message.id && (
                                <div className="absolute bottom-full right-0 z-20 mb-1 flex flex-nowrap gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1.5 shadow-lg">
                                  {quickEmojis.map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => {
                                        reactToMessage(message.id, emoji);
                                        setReactionPickerForId(null);
                                      }}
                                      className={cn(
                                        "rounded-md px-2 py-1 text-sm hover:bg-muted",
                                        message.myReaction === emoji && "bg-muted"
                                      )}
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
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-4 text-center">
                  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 shadow-inner">
                    <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <p className="mt-3 font-display text-sm font-semibold text-foreground">No messages yet</p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                      Start the thread with a clear update or question. Attachments and replies are supported below.
                    </p>
                  </div>
                </div>
              )}
              {isTyping && selectedGroup && (
                <div className="mt-2 flex w-full justify-start">
                  <div className="rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-xs text-muted-foreground shadow-sm">
                    <span className="inline-flex gap-0.5 text-muted-foreground/80" aria-hidden>
                      <span className="h-1 w-1 animate-pulse rounded-full bg-current" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
                    </span>{" "}
                    {selectedGroup.members.find((name) => name !== user.name) ?? "Member"} is typing…
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-border/80 bg-card/40 px-4 py-4 sm:px-5">
              {(replyToMessage || editingMessage) && (
                <div className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs shadow-sm">
                  <span className="leading-relaxed text-muted-foreground">
                    {editingMessage ? (
                      <>
                        <span className="font-semibold text-foreground">Editing · </span>
                        {editingMessage.text}
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-foreground">Replying · </span>
                        {replyToMessage?.text ?? ""}
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyToId(null);
                      setEditingMessageId(null);
                    }}
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {pendingAttachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {pendingAttachments.map((file) => (
                    <span
                      key={file}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm"
                    >
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      {file}
                      <button
                        type="button"
                        onClick={() => setPendingAttachments((prev) => prev.filter((f) => f !== file))}
                        className="ml-0.5 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Remove ${file}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {emojiOpen && (
                <div className="mb-3 rounded-xl border border-border bg-background p-2 shadow-sm">
                  <div className="flex flex-wrap gap-1">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          const next = `${messageInput}${emoji}`;
                          onComposerChange(next);
                          setEmojiOpen(false);
                        }}
                        className="rounded-lg px-2 py-1.5 text-base transition-colors hover:bg-muted"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-end gap-2 rounded-2xl border border-border/80 bg-background p-2 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]">
                <label className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Paperclip className="h-4 w-4" />
                  <input type="file" multiple className="hidden" onChange={handleAttachmentPick} />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEmojiOpen((prev) => !prev)}
                  className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
                  aria-label="Emoji"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <textarea
                  value={messageInput}
                  onChange={(e) => onComposerChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Write a message…"
                  rows={1}
                  className="max-h-32 min-h-[40px] flex-1 resize-y border-0 bg-transparent px-1 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  className="h-10 w-10 shrink-0 rounded-xl shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showGroupInfo && selectedGroup && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] dark:bg-black/55"
                role="presentation"
                onClick={() => setShowGroupInfo(false)}
              >
                <div
                  id="group-details-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="group-details-title"
                  className="flex max-h-[min(85vh,36rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-muted/30 px-4 py-3 sm:px-5">
                    <div className="min-w-0 pr-2">
                      <p id="group-details-title" className="font-display text-sm font-semibold text-foreground">
                        Group details
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{selectedGroup.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {selectedGroup.isPrivate
                          ? `Private participants: ${selectedGroup.members.join(", ")}`
                          : `Created by ${selectedGroup.createdBy === "student" ? "intern" : selectedGroup.createdBy}`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowGroupInfo(false)}
                      className="shrink-0 rounded-lg"
                      aria-label="Close details"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                    <div className="space-y-2">
                      {selectedGroup.members.map((member) => (
                        <div
                          key={member}
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/15 px-3 py-2.5 text-sm text-foreground"
                        >
                          <span className="font-medium">{member}</span>
                          <div className="flex items-center gap-1.5">
                            {member !== user.name && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  messagePersonFromName(member);
                                  setShowGroupInfo(false);
                                }}
                                className="h-8 text-xs text-muted-foreground"
                              >
                                Message
                              </Button>
                            )}
                            {canCreateGroup && member !== user.name && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMember(member)}
                                className="h-8 text-xs text-muted-foreground"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {canCreateGroup && !selectedGroup.isPrivate && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          placeholder="Name to add…"
                          className="h-10 border-border/80 shadow-sm sm:flex-1"
                        />
                        <Button type="button" onClick={addMember} className="sm:shrink-0">
                          Add member
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showPinnedListModal && selectedGroup && (
              <div
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] dark:bg-black/55"
                role="presentation"
                onClick={() => setShowPinnedListModal(false)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="pinned-list-title"
                  className="flex max-h-[min(85vh,34rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-amber-200/80 bg-amber-50/95 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/50 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Pin className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                      <p id="pinned-list-title" className="font-display text-sm font-semibold text-amber-950 dark:text-amber-100">
                        Pinned Messages ({pinnedMessagesList.length})
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPinnedListModal(false)}
                      className="shrink-0 rounded-lg"
                      aria-label="Close pinned messages"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                    {pinnedMessagesList.length > 0 ? (
                      <div className="space-y-2">
                        {pinnedMessagesList.map((pm) => (
                          <div key={pm.id} className="flex items-start gap-2 rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5">
                            <button
                              type="button"
                              className="min-w-0 flex-1 text-left text-xs leading-relaxed text-foreground transition-colors hover:opacity-90"
                              onClick={() => {
                                setShowPinnedListModal(false);
                                setShowGroupInfo(false);
                                setPinnedDetailId(pm.id);
                              }}
                            >
                              <span className="font-semibold text-foreground/90">{pm.sender}</span>
                              <span className="text-muted-foreground"> · </span>
                              <span className="line-clamp-2 text-foreground/85">{pm.text}</span>
                            </button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() => unpinMessage(pm.id)}
                              aria-label={`Unpin message from ${pm.sender}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-5 text-center text-xs text-muted-foreground">
                        No pinned messages in this conversation.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {pinnedDetailId != null && pinnedDetailMessage && (
              <div
                className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] dark:bg-black/55"
                role="presentation"
                onClick={() => setPinnedDetailId(null)}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="pinned-message-title"
                  className="flex max-h-[min(85vh,32rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-amber-200/80 bg-amber-50/95 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/50 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Pin className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                      <p id="pinned-message-title" className="font-display text-sm font-semibold text-amber-950 dark:text-amber-100">
                        Pinned message
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setPinnedDetailId(null)}
                      className="shrink-0 rounded-lg"
                      aria-label="Close pinned message"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                    <div className="flex gap-3">
                      <div
                        className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary ring-1 ring-primary/15"
                        aria-hidden
                      >
                        {initialsFromName(pinnedDetailMessage.sender)}
                      </div>
                      <div className="min-w-0 flex-1 rounded-2xl border border-border/80 bg-muted/20 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{pinnedDetailMessage.sender}</p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">{pinnedDetailMessage.text}</p>
                        {pinnedDetailMessage.attachments && pinnedDetailMessage.attachments.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            {pinnedDetailMessage.attachments.map((file) => (
                              <div
                                key={file}
                                className="flex w-full max-w-full items-center justify-between gap-2 rounded-lg bg-muted/80 px-2.5 py-1.5 text-xs font-medium text-foreground"
                              >
                                <span className="flex min-w-0 items-center gap-1.5">
                                  <Paperclip className="h-3 w-3 shrink-0 opacity-80" />
                                  <span className="truncate">{file}</span>
                                </span>
                                <MockFileDownloadMenu fileLabel={file} />
                              </div>
                            ))}
                          </div>
                        )}
                        {pinnedDetailMessage.reactions && Object.keys(pinnedDetailMessage.reactions).length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {Object.entries(pinnedDetailMessage.reactions).map(([emoji, count]) => (
                              <span
                                key={emoji}
                                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tabular-nums text-foreground"
                              >
                                {emoji} {count}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-[11px] tabular-nums text-muted-foreground">{pinnedDetailMessage.at}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-muted/25 px-4 py-3 sm:px-5">
                    <Button type="button" variant="outline" onClick={() => unpinMessage(pinnedDetailMessage.id)}>
                      Unpin
                    </Button>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setPinnedDetailId(null)}>
                        Close
                      </Button>
                      <Button type="button" onClick={closePinnedOverlayAndScrollToMessage}>
                        Show in thread
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
