"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { usePresenceStore } from "@/store/presence-store";

const SocketContext = createContext<{ socket: Socket | null }>({
    socket: null,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { setOnline, setOffline } = usePresenceStore();

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

        if (!socketUrl) {
            console.error("❌ Socket URL is missing in .env");
            return;
        }

        // Pass userId as query param so the gateway can track presence on connect
        const userId = typeof window !== "undefined"
            ? localStorage.getItem("userId") ?? undefined
            : undefined;

        const socketInstance = io(socketUrl, {
            query: userId ? { userId } : {},
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            console.log("✅ Connected:", socketInstance.id);
            // Also emit register_user in case query param wasn't available yet
            const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
            if (uid) {
                socketInstance.emit("register_user", uid);
            }
        });

        // Listen for presence updates from the backend
        socketInstance.on("user_presence", (payload: { userId: string; isOnline: boolean }) => {
            if (payload.isOnline) {
                setOnline(payload.userId);
            } else {
                setOffline(payload.userId);
            }
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [setOnline, setOffline]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}