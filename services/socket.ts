import { io, Socket } from "socket.io-client";
import { API_BASE_URL, getStoredToken } from "./api";

export const socket: Socket = io(API_BASE_URL, {
    autoConnect: false,
    // Use polling first so it works on every host (e.g. Vercel → Render),
    // then upgrades to WebSocket when available.
    transports: ["polling", "websocket"],
    withCredentials: true,
});

export const connectSocket = () => {
    // Always attach the latest JWT so cross-domain deployments authenticate.
    const token = getStoredToken();
    if (token) {
        socket.auth = { token };
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }

    socket.auth = {};
};
