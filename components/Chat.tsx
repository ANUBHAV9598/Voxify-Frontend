"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmojiPicker, {
  Theme as EmojiTheme,
  type EmojiClickData,
} from "emoji-picker-react";
import { useTheme } from "next-themes";
import type { AuthUser } from "@/types/auth";
import type { User } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import VoxLoader from "@/components/VoxLoader";
import { socket } from "@/services/socket";

interface ChatBoxProps {
  conversationId: string;
  currentUser: AuthUser;
  title?: string;
  subtitle?: string;
  participants?: User[];
  callHref?: string;
}

export default function ChatBox({
  conversationId,
  currentUser,
  title,
  subtitle,
  participants = [],
  callHref,
}: ChatBoxProps) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [showEmojiTray, setShowEmojiTray] = useState(false);
  const emojiTrayRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, members, sendMessage, isLoading, typingUserIds, startTyping, stopTyping } =
    useChat(conversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setInput("");
    setShowEmojiTray(false);
  }, [conversationId]);

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  useEffect(() => {
    if (!showEmojiTray) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!emojiTrayRef.current) {
        return;
      }

      if (emojiTrayRef.current.contains(event.target as Node)) {
        return;
      }

      setShowEmojiTray(false);
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [showEmojiTray]);

  const handleSendMessage = () => {
    if (!input.trim()) {
      return;
    }

    sendMessage(input);
    stopTyping();
    setInput("");
    setShowEmojiTray(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => `${prev}${emojiData.emoji}`);
    startTyping();
  };

  const handleStartCall = () => {
    if (!callHref) return;

    // Send call invite to all other participants
    const otherParticipants = participants.filter((p) => p.id !== currentUser.id);
    if (otherParticipants.length > 0) {
      socket.emit("call:invite", {
        roomId: callHref.split("/").pop()!,
        recipientIds: otherParticipants.map((p) => p.id),
        callerId: currentUser.id,
        callerName: currentUser.name,
      });
    }

    router.push(callHref);
  };

  const typingNames = typingUserIds
    .filter((userId) => userId !== currentUser.id)
    .map(
      (userId) =>
        participants.find((participant) => participant.id === userId)?.name ?? "Someone",
    );

  const typingLabel =
    typingNames.length === 0
      ? ""
      : typingNames.length === 1
        ? `${typingNames[0]} is typing...`
        : `${typingNames.slice(0, 2).join(", ")} are typing...`;

  return (
    <div
      className="flex h-full min-h-screen flex-col"
      style={{ backgroundColor: "var(--workspace-bg)" }}
    >
      <div
        className="flex items-center justify-between border-b px-5 py-4"
        style={{
          borderColor: "var(--divider)",
          backgroundColor: "var(--panel-muted)",
        }}
      >
        <div>
          <p className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
            {title ?? "Conversation"}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug" style={{ color: "var(--fg-muted)" }}>
            {typingLabel || subtitle || "Messages are synced in realtime"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {callHref ? (
            <button
              onClick={handleStartCall}
              className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition hover:brightness-95"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Start Call
            </button>
          ) : null}
          <div className="text-xs" style={{ color: "var(--fg-subtle)" }}>
            {messages.length} messages
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-6 py-5 scroll-smooth">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <VoxLoader size="sm" label="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--fg-subtle)" }}>
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: isOwnMessage
                      ? "var(--bubble-own)"
                      : "var(--bubble-other)",
                    color: isOwnMessage
                      ? "var(--bubble-own-foreground)"
                      : "var(--bubble-other-foreground)",
                  }}
                >
                  <p className="mb-1 text-xs font-semibold opacity-70">
                    {isOwnMessage ? "You" : message.sender.name}
                  </p>
                  <p className="break-words text-sm leading-6">{message.content}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[11px] opacity-60">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {isOwnMessage && (
                      <div className="flex items-center">
                        {(() => {
                          const otherMembers = Object.entries(members).filter(([uid]) => uid !== currentUser.id);
                          if (otherMembers.length === 0) return null;

                          const isReadByAll = otherMembers.every(([_, status]) => 
                            new Date(status.lastReadAt) >= new Date(message.createdAt)
                          );
                          const isDeliveredToAll = otherMembers.every(([_, status]) => 
                            new Date(status.lastDeliveredAt) >= new Date(message.createdAt)
                          );

                          if (isReadByAll) {
                            return (
                              <span className="text-[14px] leading-none text-sky-400" title="Read">
                                ✓✓
                              </span>
                            );
                          }
                          if (isDeliveredToAll) {
                            return (
                              <span className="text-[14px] leading-none opacity-60" title="Delivered">
                                ✓✓
                              </span>
                            );
                          }
                          return (
                            <span className="text-[14px] leading-none opacity-60" title="Sent">
                              ✓
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        className="border-t px-4 py-4"
        style={{
          borderColor: "var(--divider)",
          backgroundColor: "var(--panel-muted)",
        }}
      >
        <div className="relative flex items-center gap-3">
          <div ref={emojiTrayRef} className="relative">
            {showEmojiTray ? (
              <div className="absolute bottom-16 left-0 z-20 overflow-hidden rounded-2xl border shadow-2xl">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={
                    resolvedTheme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT
                  }
                  width={320}
                  height={380}
                  previewConfig={{ showPreview: false }}
                  skinTonesDisabled
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setShowEmojiTray((prev) => !prev)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-xl transition hover:brightness-95"
              style={{
                backgroundColor: "var(--panel-surface)",
                color: "var(--foreground)",
              }}
            >
              🙂
            </button>
          </div>
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);

              if (event.target.value.trim()) {
                startTyping();
              } else {
                stopTyping();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            onBlur={stopTyping}
            placeholder="Type a message..."
            className="h-12 min-w-0 flex-1 rounded-full border border-transparent px-5 text-slate-900 outline-none transition dark:text-slate-100"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="inline-flex h-12 min-w-[112px] items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:brightness-95"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
