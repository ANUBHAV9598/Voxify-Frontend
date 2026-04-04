"use client";

import { PreJoin, type LocalUserChoices } from "@livekit/components-react";

interface CallLobbyProps {
  roomName: string;
  displayName: string;
  defaultUserName: string;
  joinLink: string;
  isJoining: boolean;
  onCopyLink: () => void;
  onJoin: (choices: LocalUserChoices) => void;
}

export default function CallLobby({
  roomName,
  displayName,
  defaultUserName,
  joinLink,
  isJoining,
  onCopyLink,
  onJoin,
}: CallLobbyProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-10"
      style={{ backgroundColor: "var(--app-bg)" }}
    >
      <div
        className="grid w-full max-w-6xl gap-8 overflow-hidden rounded-[28px] border lg:grid-cols-[1.05fr_minmax(380px,460px)]"
        style={{
          borderColor: "var(--divider)",
          backgroundColor: "var(--panel-bg)",
        }}
      >
        <div className="flex flex-col justify-between p-8 lg:p-10">
          <div>
            <div
              className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              V
            </div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Voxify Call
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-50">
              {displayName}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Join a secure video room with built-in mic, camera, and speaker
              controls. Share the link below and up to 10 people can hop in.
            </p>
          </div>

          <div
            className="mt-10 rounded-[24px] border p-5"
            style={{
              borderColor: "var(--divider)",
              backgroundColor: "var(--panel-surface)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Join Via Link
            </p>
            <p className="mt-3 break-all text-sm leading-7 text-slate-700 dark:text-slate-200">
              {joinLink}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onCopyLink}
                className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:brightness-95"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                }}
              >
                Copy invite link
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Room ID: {roomName}
              </span>
            </div>
          </div>
        </div>

        <div
          className="border-l p-6 lg:p-8"
          style={{
            borderColor: "var(--divider)",
            backgroundColor: "var(--panel-muted)",
          }}
        >
          <div className="mb-5">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              Ready check
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Pick your mic and camera, then enter the room.
            </p>
          </div>
          <div className={isJoining ? "pointer-events-none opacity-70" : ""} data-lk-theme="default">
            <PreJoin
              defaults={{
                username: defaultUserName,
                audioEnabled: true,
                videoEnabled: true,
              }}
              joinLabel={isJoining ? "Joining..." : "Join call"}
              persistUserChoices={false}
              onSubmit={onJoin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
