"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  VideoConference,
} from "@livekit/components-react";
import type { LocalUserChoices } from "@livekit/components-react";

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
