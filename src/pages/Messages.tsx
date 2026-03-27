import { useMemo, useState } from "react";
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

type Group = {
  id: number;
  name: string;
  members: string[];
  createdBy: UserRole;
  lastSender: string;
  lastMessage: string;
  lastAt: string;
  unread?: number;
  pinned?: boolean;
  muted?: boolean;
  archived?: boolean;
};

type ChatMessage = {
  id: number;
  groupId: number;
  sender: string;
  text: string;
  at: string;
  attachments?: string[];
  replyToId?: number;
  edited?: boolean;
  status?: "sent" | "delivered" | "read";
  reactions?: Record<string, number>;
};

const initialGroups: Group[] = [
  {
    id: 1,
    name: "DA B16 - Attendance Monitoring",
    members: ["Nora", "Alex Cruz", "Bea Santos", "Marco Reyes"],
    createdBy: "mentor",
    lastSender: "Nora",
    lastMessage: "March 27, 2026 | Friday | 11:00 AM attendance check",
    lastAt: "12:47",
    unread: 4,
    pinned: true,
  },
  {
    id: 2,
    name: "B16 : TECH UNIT",
    members: ["Tristan Lee", "Alex Cruz", "Bea Santos", "Marco Reyes"],
    createdBy: "mentor",
    lastSender: "Tristan Lee",
    lastMessage: "Please submit your outputs after your shift.",
    lastAt: "12:57",
    muted: true,
  },
  {
    id: 3,
    name: "Official Batch 16 - Dream Academy",
    members: ["Nora", "Adrian Cole", "Alex Cruz", "Bea Santos", "Marco Reyes", "Lia Tan"],
    createdBy: "admin",
    lastSender: "Nora",
    lastMessage: "Acknowledged.",
    lastAt: "Feb 24",
  },
];

const initialMessages: ChatMessage[] = [
  { id: 1, groupId: 1, sender: "Nora", text: "March 27, 2026 | Friday | 11:00 AM attendance check", at: "12:47", status: "read" },
  { id: 2, groupId: 1, sender: "Alex Cruz", text: "Noted, submitting shortly.", at: "12:49", attachments: ["daily-log-march27.pdf"], status: "read", reactions: { "👍": 2 } },
  { id: 3, groupId: 2, sender: "Tristan Lee", text: "Please submit your outputs after your shift.", at: "12:57", status: "delivered" },
  { id: 4, groupId: 3, sender: "Nora", text: "Acknowledged.", at: "Feb 24", status: "read" },
];

const quickEmojis = ["👍", "🔥", "✅", "👏", "🙂", "🎉"];

export default function Messages() {
  const { role, user } = useRole();
  const canCreateGroup = role === "mentor" || role === "admin";

  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(initialGroups[0].id);
  const [messageInput, setMessageInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<string[]>([]);
  const [chatSearch, setChatSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [pinnedMessageByGroup, setPinnedMessageByGroup] = useState<Record<number, number | null>>({ 1: 1, 2: null, 3: null });
  const [draftByGroup, setDraftByGroup] = useState<Record<number, string>>({});
  const [newMemberName, setNewMemberName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

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

  const pinnedMessage = useMemo(() => {
    const pinnedId = selectedGroup ? pinnedMessageByGroup[selectedGroup.id] : null;
    return pinnedId ? messages.find((m) => m.id === pinnedId) ?? null : null;
  }, [messages, selectedGroup, pinnedMessageByGroup]);

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
      prev.map((m) => (m.id === messageId ? { ...m, reactions: { ...(m.reactions ?? {}), [emoji]: (m.reactions?.[emoji] ?? 0) + 1 } } : m))
    );
  };

  const pinMessage = (messageId: number) => {
    if (!selectedGroup) return;
    setPinnedMessageByGroup((prev) => ({ ...prev, [selectedGroup.id]: messageId }));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Messages</h2>
        </div>
        {canCreateGroup && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateGroup}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Group
            </button>
            <button
              type="button"
              onClick={() => setShowArchived((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                showArchived ? "border-primary/40 bg-primary/5 text-primary" : "border-border bg-card text-foreground"
              }`}
            >
              <Archive className="h-4 w-4" />
              {showArchived ? "Hide Archived" : "Show Archived"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Group Chats</p>
              <span className="text-xs text-muted-foreground">{visibleGroups.length}</span>
            </div>
            <div className="mb-3 relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Search chats"
                className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              {visibleGroups.map((group) => {
                const active = group.id === selectedGroupId;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => selectGroup(group.id)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      active ? "border-primary/40 bg-primary/5" : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{group.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          <span className="font-medium">{group.lastSender}:</span> {group.lastMessage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {group.pinned && <Pin className="h-3 w-3" />}
                          {group.muted && <BellOff className="h-3 w-3" />}
                          <span className="text-[10px]">{group.lastAt}</span>
                        </div>
                        {typeof group.unread === "number" && group.unread > 0 ? (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                            {group.unread}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {group.members.length}
                          </span>
                        )}
                      </div>
                    </div>
                    {canCreateGroup && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroupFlag(group.id, "pinned");
                          }}
                          className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
                        >
                          {group.pinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroupFlag(group.id, "muted");
                          }}
                          className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
                        >
                          {group.muted ? "Unmute" : "Mute"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroupFlag(group.id, "archived");
                          }}
                          className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
                        >
                          {group.archived ? "Unarchive" : "Archive"}
                        </button>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{selectedGroup?.name ?? "Select a group"}</p>
              <button
                type="button"
                onClick={() => setShowGroupInfo((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                <Info className="h-3.5 w-3.5" />
                Group Info
              </button>
            </div>
            {pinnedMessage && (
              <button
                type="button"
                className="mt-2 w-full rounded-lg bg-muted/50 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                onClick={() => setMessageSearch(pinnedMessage.text)}
              >
                <span className="font-semibold text-muted-foreground">Pinned:</span> {pinnedMessage.text}
              </button>
            )}
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search in conversation"
                className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="h-[380px] space-y-3 overflow-auto px-4 py-4">
            {groupMessages.length > 0 ? (
              groupMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === user.name ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 ${message.sender === user.name ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {message.replyToId && (
                      <div className={`mb-1 rounded-md border-l-2 pl-2 text-[10px] ${message.sender === user.name ? "border-primary-foreground/60" : "border-accent"}`}>
                        Replying to message #{message.replyToId}
                      </div>
                    )}
                    <p className="text-[11px] opacity-80">{message.sender}</p>
                    <p className="text-sm">{message.text}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((file) => (
                          <div
                            key={file}
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                              message.sender === user.name
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-background text-foreground"
                            }`}
                          >
                            <Paperclip className="h-3 w-3" />
                            {file}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                          <span key={emoji} className={`rounded-full px-1.5 py-0.5 text-[10px] ${message.sender === user.name ? "bg-primary-foreground/20" : "bg-background"}`}>
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-[10px] opacity-70">{message.at}</p>
                    {message.sender === user.name && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] opacity-80">
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
                        {message.edited && <span>(edited)</span>}
                      </div>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
                      <button type="button" onClick={() => startReply(message.id)} className="rounded border border-transparent px-1 py-0.5 hover:border-border">
                        Reply
                      </button>
                      {message.sender === user.name && (
                        <button type="button" onClick={() => startEdit(message.id, message.text)} className="rounded border border-transparent px-1 py-0.5 hover:border-border">
                          Edit
                        </button>
                      )}
                      <button type="button" onClick={() => forwardMessage(message.id)} className="rounded border border-transparent px-1 py-0.5 hover:border-border inline-flex items-center gap-1">
                        <Forward className="h-3 w-3" /> Forward
                      </button>
                      <button type="button" onClick={() => deleteMessage(message.id)} className="rounded border border-transparent px-1 py-0.5 hover:border-border inline-flex items-center gap-1">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                      <button type="button" onClick={() => pinMessage(message.id)} className="rounded border border-transparent px-1 py-0.5 hover:border-border inline-flex items-center gap-1">
                        <Pin className="h-3 w-3" /> Pin
                      </button>
                      {quickEmojis.map((emoji) => (
                        <button key={emoji} type="button" onClick={() => reactToMessage(message.id, emoji)} className="rounded border border-transparent px-1 py-0.5 hover:border-border">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                <div>
                  <MessageSquare className="mx-auto mb-2 h-5 w-5" />
                  No messages yet in this group.
                </div>
              </div>
            )}
            {isTyping && selectedGroup && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {selectedGroup.members.find((name) => name !== user.name) ?? "Member"} is typing...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border px-4 py-3">
            {(replyToMessage || editingMessage) && (
              <div className="mb-2 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs">
                <span className="text-muted-foreground">
                  {editingMessage ? `Editing: "${editingMessage.text}"` : `Replying to: "${replyToMessage?.text ?? ""}"`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setReplyToId(null);
                    setEditingMessageId(null);
                  }}
                  className="rounded p-0.5 hover:bg-background"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            )}
            {pendingAttachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {pendingAttachments.map((file) => (
                  <span key={file} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground">
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                    {file}
                    <button
                      type="button"
                      onClick={() => setPendingAttachments((prev) => prev.filter((f) => f !== file))}
                      className="ml-1 rounded p-0.5 hover:bg-background"
                      aria-label={`Remove ${file}`}
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {emojiOpen && (
              <div className="mb-2 rounded-lg border border-border bg-background p-2">
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
                      className="rounded px-1.5 py-1 text-base hover:bg-muted"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted">
                <Paperclip className="h-4 w-4" />
                <input type="file" multiple className="hidden" onChange={handleAttachmentPick} />
              </label>
              <button
                type="button"
                onClick={() => setEmojiOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted"
              >
                <Smile className="h-4 w-4" />
              </button>
              <textarea
                value={messageInput}
                onChange={(e) => onComposerChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message or attach files"
                rows={1}
                className="max-h-28 min-h-[40px] flex-1 resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-opacity hover:opacity-90"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showGroupInfo && selectedGroup && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Group Info</p>
            <button type="button" onClick={() => setShowGroupInfo(false)} className="rounded p-1 hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Created by {selectedGroup.createdBy === "student" ? "intern" : selectedGroup.createdBy}
          </p>
          <div className="space-y-1.5">
            {selectedGroup.members.map((member) => (
              <div key={member} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-sm text-foreground">
                <span>{member}</span>
                {canCreateGroup && member !== user.name && (
                  <button
                    type="button"
                    onClick={() => removeMember(member)}
                    className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-background"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {canCreateGroup && (
            <div className="mt-3 flex items-center gap-2">
              <input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Add member name"
                className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={addMember}
                className="inline-flex h-9 items-center rounded-lg bg-accent px-3 text-sm font-medium text-accent-foreground"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
