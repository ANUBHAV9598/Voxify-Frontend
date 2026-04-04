"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { Conversation, User } from "@/types/chat";
import AccountDialog from "@/components/chat/AccountDialog";

interface ChatLeftPanelProps {
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  conversations: Conversation[];
  users: User[];
  onStartConversation: (targetUserId: string) => Promise<void>;
  onCreateGroup: (payload: { name: string; memberIds: string[] }) => Promise<void>;
  onOpenConversation: (conversationId: string) => void;
  onLogout: () => void;
  isStartingConversation: string | null;
  selectedConversationId?: string | null;
}

const getConversationPartner = (
  conversation: Conversation,
  currentUserId: string,
) => conversation.members.find((member) => member.userId !== currentUserId)?.user;

export default function ChatLeftPanel({
  currentUserId,
  currentUserName,
  currentUserEmail,
  conversations,
  users,
  onStartConversation,
  onCreateGroup,
  onOpenConversation,
  onLogout,
  isStartingConversation,
  selectedConversationId,
}: ChatLeftPanelProps) {
  const [search, setSearch] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const query = search.trim().toLowerCase();

  const conversationsByUserId = useMemo(
    () =>
      new Map(
        conversations
          .map((conversation) => {
            const partner = getConversationPartner(conversation, currentUserId);

            if (!partner) {
              return null;
            }

            return [partner.id, conversation] as const;
          })
          .filter((entry): entry is readonly [string, Conversation] => Boolean(entry)),
      ),
    [conversations, currentUserId],
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        if (!query) {
          return true;
        }

        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }),
    [query, users],
  );

  const filteredGroups = useMemo(
    () =>
      conversations.filter((conversation) => {
        if (conversation.type !== "group") {
          return false;
        }

        if (!query) {
          return true;
        }

        return conversation.name?.toLowerCase().includes(query) ?? false;
      }),
    [conversations, query],
  );

  return (
    <div
      className="relative flex h-full min-h-[72vh] flex-col border-r"
      style={{
        borderColor: "var(--divider)",
        backgroundColor: "var(--panel-bg)",
      }}
    >
      <div
        className="border-b px-5 py-4"
        style={{
          borderColor: "var(--divider)",
          backgroundColor: "var(--panel-muted)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAccountOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition hover:scale-[1.03] focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              {currentUserName.slice(0, 1).toUpperCase()}
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {currentUserName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setGroupName("");
                setSelectedGroupMembers([]);
                setIsGroupDialogOpen(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-black/6 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100"
            >
              +
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-black/6 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100"
            >
              •••
            </button>
          </div>
        </div>

        <div className="mt-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search or start a new chat"
            className="w-full rounded-2xl border border-transparent px-4 py-3 text-sm text-slate-900 outline-none transition dark:text-slate-100"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>
      </div>

      <AccountDialog
        currentUserEmail={currentUserEmail}
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onLogout={onLogout}
      />

      {isGroupDialogOpen ? (
        <div className="absolute inset-0 z-20 flex items-start justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]">
          <div
            className="mt-4 w-full max-w-sm rounded-[1.4rem] border p-4 shadow-2xl"
            style={{
              borderColor: "var(--divider)",
              backgroundColor: "var(--panel-bg)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  New group
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Pick up to 9 people and give the group a name.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupDialogOpen(false)}
                className="rounded-full px-2 py-1 text-slate-500 transition hover:bg-black/6 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100"
              >
                x
              </button>
            </div>

            <input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Group name"
              className="mt-4 w-full rounded-xl border border-transparent px-4 py-3 text-sm text-slate-900 outline-none transition dark:text-slate-100"
              style={{ backgroundColor: "var(--input-bg)" }}
            />

            <div
              className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-xl p-2"
              style={{ backgroundColor: "var(--panel-muted)" }}
            >
              {users.map((user) => {
                const isChecked = selectedGroupMembers.includes(user.id);

                return (
                  <label
                    key={user.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-black/4 dark:hover:bg-white/4"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedGroupMembers((prev) =>
                          isChecked
                            ? prev.filter((memberId) => memberId !== user.id)
                            : prev.length >= 9
                              ? prev
                              : [...prev, user.id],
                        );
                      }}
                      className="h-4 w-4"
                    />
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: "var(--accent-soft)",
                        color: "var(--accent-foreground)",
                      }}
                    >
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setIsGroupDialogOpen(false)}
                className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/6"
                style={{ borderColor: "var(--divider)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isCreatingGroup}
                onClick={async () => {
                  if (groupName.trim().length < 2) {
                    toast.error("Group name must be at least 2 characters");
                    return;
                  }

                  if (selectedGroupMembers.length === 0) {
                    toast.error("Pick at least 1 member");
                    return;
                  }

                  setIsCreatingGroup(true);

                  try {
                    await onCreateGroup({
                      name: groupName.trim(),
                      memberIds: selectedGroupMembers,
                    });
                    toast.success("Group created");
                    setIsGroupDialogOpen(false);
                  } catch {
                    toast.error("Failed to create group");
                  } finally {
                    setIsCreatingGroup(false);
                  }
                }}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                }}
              >
                {isCreatingGroup ? "Creating..." : "Create group"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length > 0 ? (
          <div className="px-2 pt-2">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Groups
            </p>
            {filteredGroups.map((conversation) => {
              const isSelected = selectedConversationId === conversation.id;
              const memberCount = conversation.members.length;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onOpenConversation(conversation.id)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    isSelected ? "" : "hover:bg-black/4 dark:hover:bg-white/4"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "var(--panel-selected)" : "transparent",
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent-foreground)",
                    }}
                  >
                    {conversation.name?.slice(0, 1).toUpperCase() ?? "G"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {conversation.name ?? "Group chat"}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {memberCount} members
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="px-2 pt-2">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            People
          </p>
        <div
          className="py-1"
          style={{ backgroundColor: "var(--panel-bg)" }}
        >
          {filteredUsers.map((user) => {
            const existingConversation = conversationsByUserId.get(user.id);
            const isSelected = selectedConversationId === existingConversation?.id;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() =>
                  existingConversation
                    ? onOpenConversation(existingConversation.id)
                    : onStartConversation(user.id)
                }
                disabled={isStartingConversation === user.id}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected ? "" : "hover:bg-black/4 dark:hover:bg-white/4"
                }`}
                style={{
                  backgroundColor: isSelected ? "var(--panel-selected)" : "transparent",
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-slate-900 dark:text-slate-100"
                  style={{
                    backgroundColor: existingConversation
                      ? "var(--accent-soft)"
                      : "var(--panel-muted)",
                    color: existingConversation
                      ? "var(--accent-foreground)"
                      : undefined,
                  }}
                >
                  {user.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {isStartingConversation === user.id
                      ? "Opening chat..."
                      : user.email}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
