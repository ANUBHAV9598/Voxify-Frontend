"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Conversation, User } from "@/types/chat";
import { apiRequest, ApiError } from "@/services/api";
import { connectSocket } from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";
import { ItemMotion, PageMotion } from "@/components/motion-primitives";
import ChatLeftPanel from "@/components/chat/ChatLeftPanel";
import ChatShell from "@/components/chat/ChatShell";
import ChatWorkspace from "@/components/chat/ChatWorkspace";
import ChatEmptyState from "@/components/chat/ChatEmptyState";

interface UsersResponse {
  users: User[];
}

interface ConversationsResponse {
  conversations: Conversation[];
}

interface DirectConversationResponse {
  conversation: Conversation;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStartingConversation, setIsStartingConversation] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!user) {
      if (!isLoading) {
        router.replace("/login");
      }
      return;
    }

    connectSocket();

    Promise.all([
      apiRequest<UsersResponse>("/users"),
      apiRequest<ConversationsResponse>("/conversations"),
    ])
      .then(([usersResponse, conversationsResponse]) => {
        setUsers(usersResponse.users);
        setConversations(conversationsResponse.conversations);
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to load chats");
      })
      .finally(() => {
        setIsPageLoading(false);
      });
  }, [isLoading, router, user]);

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

  const handleOpenConversation = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
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

  if (isLoading || isPageLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading your chat workspace...
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
                selectedConversationId={null}
              />
            }
            workspace={
              <ChatWorkspace>
                <ChatEmptyState />
              </ChatWorkspace>
            }
          />
        </ItemMotion>
      </PageMotion>
    </main>
  );
}
