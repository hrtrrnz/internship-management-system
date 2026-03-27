import { useMemo, useState } from "react";
import { Lock, MessageSquare, Plus, Send, Shield, Users } from "lucide-react";
import { useRole, type UserRole } from "@/contexts/RoleContext";

type Group = {
  id: number;
  name: string;
  members: string[];
  createdBy: UserRole;
};

type ChatMessage = {
  id: number;
  groupId: number;
  sender: string;
  text: string;
  at: string;
};

const initialGroups: Group[] = [
  { id: 1, name: "Intern Cohort - Week 7", members: ["Juan dela Cruz", "Ana Santos", "Mark Rivera"], createdBy: "mentor" },
  { id: 2, name: "Operations Interns", members: ["Peter Lim", "Lisa Tan"], createdBy: "admin" },
];

const initialMessages: ChatMessage[] = [
  { id: 1, groupId: 1, sender: "Maria Reyes", text: "Please submit daily reports before 6:00 PM.", at: "9:12 AM" },
  { id: 2, groupId: 1, sender: "Juan dela Cruz", text: "Noted, mentor. I will submit today.", at: "9:18 AM" },
  { id: 3, groupId: 2, sender: "Carlos Santos", text: "Reminder: attendance logs must be complete today.", at: "10:05 AM" },
];

const roleTitle: Record<UserRole, string> = {
  student: "Intern Messaging",
  mentor: "Mentor Messaging",
  admin: "Admin Messaging",
};

export default function Messages() {
  const { role, user } = useRole();
  const canCreateGroup = role === "mentor" || role === "admin";

  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(initialGroups[0].id);
  const [newGroupName, setNewGroupName] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupMessages = useMemo(() => messages.filter((m) => m.groupId === selectedGroupId), [messages, selectedGroupId]);

  const handleCreateGroup = () => {
    if (!canCreateGroup) return;
    const name = newGroupName.trim();
    if (!name) return;
    const newGroup: Group = {
      id: Date.now(),
      name,
      members: [user.name],
      createdBy: role,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setSelectedGroupId(newGroup.id);
    setNewGroupName("");
  };

  const handleSend = () => {
    const text = messageInput.trim();
    if (!text || !selectedGroup) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        groupId: selectedGroup.id,
        sender: user.name,
        text,
        at: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setMessageInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">{roleTitle[role]}</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          {canCreateGroup ? "Can create groups" : "Chat access only"}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Group Chats</p>
              <span className="text-xs text-muted-foreground">{groups.length}</span>
            </div>
            <div className="space-y-2">
              {groups.map((group) => {
                const active = group.id === selectedGroupId;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      active ? "border-primary/40 bg-primary/5" : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {group.members.length}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Created by {group.createdBy === "student" ? "intern" : group.createdBy}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold text-foreground">Create Group Chat</p>
            {canCreateGroup ? (
              <div className="space-y-2">
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Create Group
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Only mentors and admins can create group chats.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">{selectedGroup?.name ?? "Select a group"}</p>
            <p className="text-xs text-muted-foreground">Role-based messaging permissions are applied in UI</p>
          </div>

          <div className="h-[380px] space-y-3 overflow-auto px-4 py-4">
            {groupMessages.length > 0 ? (
              groupMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === user.name ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 ${message.sender === user.name ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <p className="text-[11px] opacity-80">{message.sender}</p>
                    <p className="text-sm">{message.text}</p>
                    <p className="mt-1 text-[10px] opacity-70">{message.at}</p>
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
          </div>

          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message"
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
    </div>
  );
}
