"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<{ socket: Socket | null }>({
    socket: null,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

        if (!socketUrl) {
            console.error("❌ Socket URL is missing in .env");
            return;
        }

        const socketInstance = io(socketUrl);

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            console.log("✅ Connected:", socketInstance.id);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}