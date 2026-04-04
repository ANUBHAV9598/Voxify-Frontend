"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  VideoConference,
} from "@livekit/components-react";
import type { LocalUserChoices } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import { apiRequest } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import type { User } from "@/types/chat";

interface CallRoomViewProps {
  token: string;
  serverUrl: string;
  roomName: string;
  joinLink: string;
  choices: LocalUserChoices;
  onCopyLink: () => void;
  onLeave: () => void;
}

export default function CallRoomView({
  token,
  serverUrl,
  roomName,
  joinLink,
  choices,
  onCopyLink,
  onLeave,
}: CallRoomViewProps) {
  const { user: currentUser } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (isInviteModalOpen && availableUsers.length === 0) {
      setIsLoadingUsers(true);
      apiRequest<{ users: User[] }>("/users")
        .then((res) => {
          setAvailableUsers(res.users.filter((u) => u.id !== currentUser?.id));
        })
        .catch(() => {
          toast.error("Failed to load users");
        })
        .finally(() => setIsLoadingUsers(false));
    }
  }, [isInviteModalOpen, availableUsers.length, currentUser]);

  const handleInvite = (recipientId: string) => {
    if (!currentUser) return;
    socket.emit("call:invite", {
      roomId: roomName,
      recipientIds: [recipientId],
      callerId: currentUser.id,
      callerName: currentUser.name,
    });
    toast.success("Invitation sent");
    setIsInviteModalOpen(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--app-bg)" }}
    >
      <div
        className="flex items-center justify-between border-b px-5 py-4"
        style={{
          borderColor: "var(--divider)",
          backgroundColor: "var(--panel-muted)",
        }}
      >
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Live call
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {roomName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen((prev) => !prev)}
              className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition hover:brightness-95"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Invite users
            </button>
            {isInviteModalOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border shadow-xl" style={{ backgroundColor: "var(--panel-surface)", borderColor: "var(--divider)" }}>
                <div className="p-3 text-sm font-semibold" style={{ color: "var(--foreground)", borderBottom: "1px solid var(--divider)" }}>
                  Invite to call
                </div>
                <div className="max-h-60 overflow-y-auto p-2">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-sm" style={{ color: "var(--fg-subtle)" }}>Loading...</div>
                  ) : availableUsers.length === 0 ? (
                    <div className="p-4 text-center text-sm" style={{ color: "var(--fg-subtle)" }}>No users available</div>
                  ) : (
                    availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleInvite(u.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: "var(--foreground)" }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              u.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                          <span className="truncate">{u.name}</span>
                        </div>
                        <span className="shrink-0 text-[10px] uppercase ml-2" style={{ color: "var(--accent)" }}>Invite</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition hover:brightness-95"
            style={{
              backgroundColor: "var(--panel-surface)",
              color: "var(--foreground)",
            }}
            title={joinLink}
          >
            Copy link
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="inline-flex h-10 items-center justify-center rounded-full bg-rose-600 px-4 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Leave
          </button>
        </div>
      </div>

      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        audio={choices.audioEnabled}
        video={choices.videoEnabled}
        connect
        className="h-[calc(100vh-73px)]"
        data-lk-theme="default"
        onDisconnected={onLeave}
      >
        <RoomAudioRenderer />
        <StartAudio label="Tap to enable call audio" />
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
