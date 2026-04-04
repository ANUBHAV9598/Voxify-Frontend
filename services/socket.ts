import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./api";

export const socket: Socket = io(API_BASE_URL, {
    autoConnect: false,
    transports: ["websocket"],
    withCredentials: true,
});

export const connectSocket = () => {
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
