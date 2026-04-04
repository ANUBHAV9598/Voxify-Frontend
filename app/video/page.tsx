"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/services/socket";

export default function VideoPage() {
    const localVideo = useRef<HTMLVideoElement | null>(null);
    const remoteVideo = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        if (localVideo.current) {
            localVideo.current.srcObject = stream;
        }

        peerConnection.current = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, stream);
        });

        peerConnection.current.ontrack = (event: RTCTrackEvent) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = event.streams[0];
            }
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", event.candidate);
            }
        };

        setupSocketListeners();
    };

    const setupSocketListeners = () => {
        socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
            await peerConnection.current?.setRemoteDescription(offer);

            const answer = await peerConnection.current?.createAnswer();
                if (!answer) return;

                await peerConnection.current?.setLocalDescription(answer);

                socket.emit("answer", answer);
            });

            socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
                await peerConnection.current?.setRemoteDescription(answer);
            });

            socket.on("ice-candidate", async (candidate: RTCIceCandidate) => {
                await peerConnection.current?.addIceCandidate(candidate);
            });
    };

    return (
        <div className="flex gap-4">
            <video ref={localVideo} autoPlay muted className="w-1/2" />
            <video ref={remoteVideo} autoPlay className="w-1/2" />
        </div>
    );
}