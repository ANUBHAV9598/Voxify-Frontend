"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { LocalUserChoices } from "@livekit/components-react";
import { toast } from "react-toastify";
import CallLobby from "@/components/call/CallLobby";
import CallRoomView from "@/components/call/CallRoomView";
import { PageMotion } from "@/components/motion-primitives";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api";
import { createCallLink, getCallToken } from "@/services/calls";
import type { CallTokenResponse } from "@/types/call";

export default function CallPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [callSession, setCallSession] = useState<CallTokenResponse | null>(null);
  const [userChoices, setUserChoices] = useState<LocalUserChoices | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const roomName = typeof params.roomId === "string" ? params.roomId : "";
  const joinLink = useMemo(() => createCallLink(roomName), [roomName]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinLink);
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy invite link");
    }
  };

  const handleJoin = async (choices: LocalUserChoices) => {
    if (!roomName) {
      toast.error("Invalid room");
      return;
    }

    setIsJoining(true);

    try {
      const response = await getCallToken({ roomName });
      setUserChoices(choices);
      setCallSession(response);
      toast.success("Joined call");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Failed to join call");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = () => {
    setCallSession(null);
    setUserChoices(null);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Preparing your call...
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageMotion className="min-h-screen">
      {callSession && userChoices ? (
        <CallRoomView
          token={callSession.token}
          serverUrl={callSession.url}
          roomName={callSession.roomName}
          joinLink={joinLink}
          choices={userChoices}
          onCopyLink={handleCopyLink}
          onLeave={handleLeave}
        />
      ) : (
        <CallLobby
          roomName={roomName}
          displayName="Video room"
          defaultUserName={user.name}
          joinLink={joinLink}
          isJoining={isJoining}
          onCopyLink={handleCopyLink}
          onJoin={handleJoin}
        />
      )}
    </PageMotion>
  );
}
