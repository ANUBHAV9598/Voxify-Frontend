"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Message, TypingUpdate } from "@/types/chat";
import { apiRequest } from "@/services/api";
import { socket } from "@/services/socket";

interface MessagesResponse {
  messages: Message[];
}

export const useChat = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Record<string, { lastReadAt: string; lastDeliveredAt: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      setTypingUserIds([]);
      return;
    }

    let isActive = true;
    setIsLoading(true);

    apiRequest<{ messages: Message[]; members: any[] }>(`/conversations/${conversationId}/messages`)
      .then((response) => {
        if (!isActive) {
          return;
        }

        setMessages(response.messages);
        
        // Initialize members mapping
        const statusMap: Record<string, { lastReadAt: string; lastDeliveredAt: string }> = {};
        response.members?.forEach(m => {
          statusMap[m.userId] = {
            lastReadAt: m.lastReadAt,
            lastDeliveredAt: m.lastDeliveredAt
          };
        });
        setMembers(statusMap);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const joinConversation = () => {
      socket.emit("conversation:join", { conversationId });
      socket.emit("conversation:read", { conversationId });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        socket.emit("conversation:read", { conversationId });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (socket.connected) {
      joinConversation();
    }

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) {
        return;
      }

      socket.emit("message:delivered", { conversationId: message.conversationId });

      if (document.visibilityState === "visible") {
        socket.emit("conversation:read", { conversationId });
      }

      setMessages((prev) => {
        if (prev.some((existing) => existing.id === message.id)) {
          return prev;
        }

        return [...prev, message];
      });
    };

    const handleTypingUpdate = (payload: TypingUpdate) => {
      if (payload.conversationId !== conversationId) {
        return;
      }

      setTypingUserIds((prev) => {
        if (payload.isTyping) {
          return prev.includes(payload.userId) ? prev : [...prev, payload.userId];
        }

        return prev.filter((userId) => userId !== payload.userId);
      });
    };

    const handleReadUpdate = (payload: { conversationId: string; userId: string; lastReadAt: string }) => {
      if (payload.conversationId !== conversationId) return;
      setMembers(prev => ({
        ...prev,
        [payload.userId]: { ...prev[payload.userId], lastReadAt: payload.lastReadAt }
      }));
    };

    const handleDeliveredUpdate = (payload: { conversationId: string; userId: string; lastDeliveredAt: string }) => {
      if (payload.conversationId !== conversationId) return;
      setMembers(prev => ({
        ...prev,
        [payload.userId]: { ...prev[payload.userId], lastDeliveredAt: payload.lastDeliveredAt }
      }));
    };

    socket.on("connect", joinConversation);
    socket.on("message:new", handleNewMessage);
    socket.on("typing:update", handleTypingUpdate);
    socket.on("conversation:read_update", handleReadUpdate);
    socket.on("conversation:delivered_update", handleDeliveredUpdate);

    return () => {
      socket.off("connect", joinConversation);
      socket.off("message:new", handleNewMessage);
      socket.off("typing:update", handleTypingUpdate);
      socket.off("conversation:read_update", handleReadUpdate);
      socket.off("conversation:delivered_update", handleDeliveredUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      setTypingUserIds([]);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!conversationId || !content.trim()) {
        return;
      }

      socket.emit("message:send", {
        conversationId,
        content: content.trim(),
      });
    },
    [conversationId],
  );

  const startTyping = useCallback(() => {
    if (!conversationId) {
      return;
    }

    socket.emit("typing:start", { conversationId });

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      socket.emit("typing:stop", { conversationId });
      typingTimeoutRef.current = null;
    }, 1400);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (!conversationId) {
      return;
    }

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket.emit("typing:stop", { conversationId });
  }, [conversationId]);

  return { messages, members, sendMessage, isLoading, typingUserIds, startTyping, stopTyping };
};
