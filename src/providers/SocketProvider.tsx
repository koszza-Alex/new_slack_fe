"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { usePresenceStore } from "@/store/presence-store";
import { useActivityStore } from "@/store/activity-store";
import { ActivityItem } from "@/lib/api/activity";

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    // Stable refs — never change identity, so the socket useEffect runs exactly once
    const setOnlineRef    = useRef(usePresenceStore.getState().setOnline);
    const setOfflineRef   = useRef(usePresenceStore.getState().setOffline);
    const setAllOnlineRef = useRef(usePresenceStore.getState().setAllOnline);
    const prependItemRef  = useRef(useActivityStore.getState().prependItem);

    // Keep refs current without triggering re-renders
    useEffect(() => {
        return usePresenceStore.subscribe((state) => {
            setOnlineRef.current    = state.setOnline;
            setOfflineRef.current   = state.setOffline;
            setAllOnlineRef.current = state.setAllOnline;
        });
    }, []);
    useEffect(() => {
        return useActivityStore.subscribe((state) => {
            prependItemRef.current = state.prependItem;
        });
    }, []);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        if (!socketUrl) {
            console.error("❌ NEXT_PUBLIC_SOCKET_URL is not set");
            return;
        }

        // Read userId at connection time — may be empty if auth hasn't run yet
        const userId = typeof window !== "undefined"
            ? localStorage.getItem("userId") ?? undefined
            : undefined;

        const socketInstance = io(socketUrl, {
            query: userId ? { userId } : {},
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        setSocket(socketInstance);

        // ── on connect / reconnect ──────────────────────────────────────────
        socketInstance.on("connect", () => {
            const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
            if (uid) {
                // register_user triggers a presence:snapshot response from the server
                socketInstance.emit("register_user", uid);
                socketInstance.emit("join_activity", uid);
                // Mark self online immediately — don't wait for the snapshot echo
                setOnlineRef.current(uid);
            }
        });

        // ── snapshot: authoritative full list of online users ───────────────
        // Sent by the server on connect AND after register_user.
        // Replaces the local set entirely so stale entries are cleared.
        socketInstance.on("presence:snapshot", (onlineIds: string[]) => {
            setAllOnlineRef.current(onlineIds);
            // Re-apply self as online in case the snapshot arrived before register_user
            const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
            if (uid) setOnlineRef.current(uid);
        });

        // ── incremental presence updates ────────────────────────────────────
        socketInstance.on("user_presence", (payload: { userId: string; isOnline: boolean }) => {
            if (payload.isOnline) setOnlineRef.current(payload.userId);
            else setOfflineRef.current(payload.userId);
        });

        // ── activity ────────────────────────────────────────────────────────
        socketInstance.on("new_activity", (item: ActivityItem) => {
            prependItemRef.current(item);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []); // ← intentionally empty: socket is created once per mount

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
