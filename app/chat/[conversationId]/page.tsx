"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ChatBox from "@/components/Chat";
import type { Conversation, User } from "@/types/chat";
import { apiRequest, ApiError } from "@/services/api";
import { createCallLink, getCallRoomName } from "@/services/calls";
import { connectSocket } from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";
import { ItemMotion, PageMotion } from "@/components/motion-primitives";
import ChatLeftPanel from "@/components/chat/ChatLeftPanel";
import ChatShell from "@/components/chat/ChatShell";
import ChatWorkspace from "@/components/chat/ChatWorkspace";

interface ConversationsResponse {
  conversations: Conversation[];
}

interface UsersResponse {
  users: User[];
}

interface DirectConversationResponse {
  conversation: Conversation;
}

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams<{ conversationId: string }>();
  const { user, isLoading, logout } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isStartingConversation, setIsStartingConversation] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : null;
  const callRoomName = conversationId ? getCallRoomName(conversationId) : null;

  useEffect(() => {
    if (!user) {
      if (!isLoading) {
        router.replace("/login");
      }
      return;
    }

    if (!conversationId) {
      setError("Invalid conversation");
      toast.error("Invalid conversation");
      setIsPageLoading(false);
      return;
    }

    connectSocket();

    Promise.all([
      apiRequest<ConversationsResponse>("/conversations"),
      apiRequest<UsersResponse>("/users"),
    ])
      .then(([conversationsResponse, usersResponse]) => {
        setConversations(conversationsResponse.conversations);
        setUsers(usersResponse.users);

        const matchedConversation =
          conversationsResponse.conversations.find((item) => item.id === conversationId) ??
          null;

        if (!matchedConversation) {
          setError("Conversation not found");
          toast.error("Conversation not found");
          return;
        }

        setConversation(matchedConversation);
      })
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : "Failed to load conversation";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        setIsPageLoading(false);
      });
  }, [conversationId, isLoading, router, user]);

  const handleStartConversation = async (targetUserId: string) => {
    setIsStartingConversation(targetUserId);

    try {
      const response = await apiRequest<DirectConversationResponse>(
        "/conversations/direct",
        {
          method: "POST",
          body: { targetUserId },
        },
      );

      router.push(`/chat/${response.conversation.id}`);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to start conversation",
      );
    } finally {
      setIsStartingConversation(null);
    }
  };

  const handleOpenConversation = (nextConversationId: string) => {
    router.push(`/chat/${nextConversationId}`);
  };

  const handleCreateGroup = async (payload: {
    name: string;
    memberIds: string[];
  }) => {
    try {
      const response = await apiRequest<DirectConversationResponse>(
        "/conversations/group",
        {
          method: "POST",
          body: payload,
        },
      );

      router.push(`/chat/${response.conversation.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create group");
      throw err;
    }
  };

  const handleLogout = () => {
    logout().finally(() => {
      router.replace("/login");
    });
  };

  const handleCopyCallLink = async () => {
    if (!callRoomName) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createCallLink(callRoomName));
      toast.success("Call link copied");
    } catch {
      toast.error("Could not copy call link");
    }
  };

  const conversationPartner = useMemo(() => {
    if (!conversation || !user) {
      return null;
    }

    return (
      conversation.members.find((member) => member.userId !== user.id)?.user ?? null
    );
  }, [conversation, user]);

  if (isLoading || isPageLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading conversation...
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--app-bg)" }}
    >
      <PageMotion className="min-h-screen">
        <ItemMotion className="min-h-screen">
          <ChatShell
            leftPanel={
              <ChatLeftPanel
                currentUserId={user.id}
                currentUserName={user.name}
                currentUserEmail={user.email}
                conversations={conversations}
                users={users}
                onStartConversation={handleStartConversation}
                onCreateGroup={handleCreateGroup}
                onOpenConversation={handleOpenConversation}
                onLogout={handleLogout}
                isStartingConversation={isStartingConversation}
                selectedConversationId={conversationId}
              />
            }
            workspace={
              <ChatWorkspace>
                {conversationId && !error ? (
                  <ChatBox
                    conversationId={conversationId}
                    currentUser={user}
                    title={
                      conversation?.type === "group"
                        ? conversation.name ?? "Group chat"
                        : conversationPartner?.name ?? "Conversation"
                    }
                    subtitle={
                      conversation?.type === "group"
                        ? `${conversation.members.length} members`
                        : conversationPartner?.email ?? "Direct conversation"
                    }
                    participants={conversation?.members.map((member) => member.user) ?? []}
                    callHref={callRoomName ? `/call/${callRoomName}` : undefined}
                    onCopyCallLink={callRoomName ? handleCopyCallLink : undefined}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-10 text-slate-500 dark:text-slate-400">
                    Conversation unavailable.
                  </div>
                )}
              </ChatWorkspace>
            }
          />
        </ItemMotion>
      </PageMotion>
    </main>
  );
}
