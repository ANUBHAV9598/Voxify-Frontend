import { apiRequest } from "@/services/api";
import type { CallTokenResponse, JoinCallPayload } from "@/types/call";

export const getCallRoomName = (conversationId: string) => `voxify-room-${conversationId}`;

export const createCallLink = (roomName: string) => {
  if (typeof window === "undefined") {
    return `/call/${roomName}`;
  }

  return `${window.location.origin}/call/${roomName}`;
};

export const getCallToken = (payload: JoinCallPayload) =>
  apiRequest<CallTokenResponse>("/calls/token", {
    method: "POST",
    body: payload,
  });
