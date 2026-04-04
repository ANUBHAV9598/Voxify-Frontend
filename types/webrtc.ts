export interface OfferPayload {
    offer: RTCSessionDescriptionInit;
    roomId: string;
}

export interface AnswerPayload {
    answer: RTCSessionDescriptionInit;
    roomId: string;
}

export interface IceCandidatePayload {
    candidate: RTCIceCandidate;
}