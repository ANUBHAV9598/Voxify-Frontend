"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ItemMotion } from "@/components/motion-primitives";
import { socket } from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";

interface IncomingCallPayload {
  roomId: string;
  callerId: string;
  callerName: string;
}

export default function CallNotification() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);

  useEffect(() => {
    if (!user) return;

    const handleCallIncoming = (payload: IncomingCallPayload) => {
      // If we're already in this specific call room, ignore the notification
      if (pathname === `/call/${payload.roomId}`) {
        return;
      }
      setIncomingCall(payload);
    };

    socket.on("call:incoming", handleCallIncoming);

    return () => {
      socket.off("call:incoming", handleCallIncoming);
    };
  }, [user, pathname]);

  if (!incomingCall) return null;

  const handleAccept = () => {
    router.push(`/call/${incomingCall.roomId}`);
    setIncomingCall(null);
  };

  const handleDecline = () => {
    setIncomingCall(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <ItemMotion>
        <div className="flex flex-col gap-3 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5" style={{ backgroundColor: "var(--panel-surface)" }}>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-rose-500 animate-pulse">
              Incoming Call
            </p>
            <p className="mt-1 text-base font-medium" style={{ color: "var(--foreground)" }}>
              {incomingCall.callerName} is calling you
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleDecline}
              className="flex-1 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
            >
              Accept
            </button>
          </div>
        </div>
      </ItemMotion>
    </div>
  );
}
