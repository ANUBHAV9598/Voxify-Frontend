"use client";

import type { Conversation, User } from "@/types/chat";
import PresenceBadge from "./PresenceBadge";

interface ConversationListProps {
  currentUserId: string;
  conversations: Conversation[];
  users: User[];
  onStartConversation: (targetUserId: string) => Promise<void>;
  onOpenConversation: (conversationId: string) => void;
  isStartingConversation: string | null;
  selectedConversationId?: string | null;
}

const getConversationPartner = (
  conversation: Conversation,
  currentUserId: string,
) => conversation.members.find((member) => member.userId !== currentUserId)?.user;

export default function ConversationList({
  currentUserId,
  conversations,
  users,
  onStartConversation,
  onOpenConversation,
  isStartingConversation,
  selectedConversationId,
}: ConversationListProps) {
  return (
    <aside className="flex h-full min-h-[72vh] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
          Voxify
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Chats
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Conversations on top, contacts below.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-800">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Recent conversations
          </p>

          <div className="space-y-1">
            {conversations.length === 0 ? (
              <div className="rounded-2xl px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                No conversations yet.
              </div>
            ) : (
              conversations.map((conversation) => {
                const partner = getConversationPartner(conversation, currentUserId);
                const latestMessage = conversation.messages[0];

                if (!partner) {
                  return null;
                }

                const isSelected = selectedConversationId === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onOpenConversation(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isSelected
                        ? "bg-amber-100 ring-1 ring-amber-300 dark:bg-amber-400/15 dark:ring-amber-400/40"
                        : "hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-amber-400 dark:text-slate-950">
                      {partner.name.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                          {partner.name}
                        </p>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {new Date(conversation.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        {latestMessage
                          ? `${latestMessage.sender.name}: ${latestMessage.content}`
                          : "No messages yet"}
                      </p>

                      <div className="mt-1">
                        <PresenceBadge user={partner} />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="px-3 py-3">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            People
          </p>

          <div className="space-y-1">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-slate-900">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <PresenceBadge user={user} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartConversation(user.id)}
                  disabled={isStartingConversation === user.id}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
                >
                  {isStartingConversation === user.id ? "Opening..." : "Chat"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
