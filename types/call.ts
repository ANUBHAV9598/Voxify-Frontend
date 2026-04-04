export interface CallTokenResponse {
  token: string;
  url: string;
  roomName: string;
  maxParticipants: number;
}

export interface JoinCallPayload {
  roomName: string;
}
