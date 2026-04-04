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

    apiRequest<MessagesResponse>(`/conversations/${conversationId}/messages`)
      .then((response) => {
        if (!isActive) {
          return;
        }

        setMessages(response.messages);
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
    };

    if (socket.connected) {
      joinConversation();
    }

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) {
        return;
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

    socket.on("connect", joinConversation);
    socket.on("message:new", handleNewMessage);
    socket.on("typing:update", handleTypingUpdate);

    return () => {
      socket.off("connect", joinConversation);
      socket.off("message:new", handleNewMessage);
      socket.off("typing:update", handleTypingUpdate);
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

  return { messages, sendMessage, isLoading, typingUserIds, startTyping, stopTyping };
};
