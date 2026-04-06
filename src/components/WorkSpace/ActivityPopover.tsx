"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useActivityStore } from "@/store/activity-store";
import { fetchActivities, markAllActivitiesRead, markActivityRead, ActivityItem, ActivityType } from "@/lib/api/activity";
import { getAvatarUrl } from "@/lib/messageUtils";
import { useRouter, useParams } from "next/navigation";

type Tab = "all" | "mentions" | "reactions" | "replies";

const TAB_FILTERS: Record<Tab, ActivityType[] | null> = {
    all: null,
    mentions: ["mention"],
    reactions: ["reaction"],
    replies: ["reply", "thread"],
};

const TYPE_LABEL: Record<ActivityType, string> = {
    mention: "mentioned you",
    reply: "replied to your message",
    reaction: "reacted to your message",
    thread: "replied in a thread",
};

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function ActivityPopover({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<Tab>("all");
    const [onlyUnread, setOnlyUnread] = useState(false);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { user } = useAuth();
    const { socket } = useSocket();
    const router = useRouter();
    const params = useParams();
    const workspaceId = Array.isArray(params?.workspaceId)
        ? params.workspaceId[0]
        : params?.workspaceId;

    const { items, unreadCount, setItems, markAllRead, markOneRead } = useActivityStore();

    // Load history when popover opens
    useEffect(() => {
        if (!open || !user?.id) return;
        setLoading(true);
        fetchActivities(user.id)
            .then(setItems)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [open, user?.id]);

    // Re-join activity room whenever socket reconnects (userId may not be set at first connect)
    useEffect(() => {
        if (!socket || !user?.id) return;
        socket.emit("join_activity", user.id);
    }, [socket, user?.id]);

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    const handleMarkAllRead = async () => {
        if (!user?.id) return;
        markAllRead();
        await markAllActivitiesRead(user.id).catch(console.error);
        socket?.emit("activity:mark_all_read", user.id);
    };

    const handleItemClick = async (item: ActivityItem) => {
        if (!item.isRead && user?.id) {
            markOneRead(item.id);
            await markActivityRead(item.id, user.id).catch(console.error);
        }
        // Navigate to the relevant channel or DM
        if (workspaceId) {
            if (item.conversationId) {
                router.push(`/${workspaceId}/dm/${item.conversationId}`);
            } else if (item.channelId) {
                const url = item.messageId
                    ? `/${workspaceId}/${item.channelId}?messageId=${item.messageId}`
                    : `/${workspaceId}/${item.channelId}`;
                router.push(url);
            }
        }
        setOpen(false);
    };

    const typeFilter = TAB_FILTERS[tab];
    const filtered = items.filter((item) => {
        if (typeFilter && !typeFilter.includes(item.type)) return false;
        if (onlyUnread && item.isRead) return false;
        return true;
    });

    const tabs: { key: Tab; label: string }[] = [
        { key: "all", label: "All" },
        { key: "mentions", label: "Mentions" },
        { key: "reactions", label: "Reactions" },
        { key: "replies", label: "Replies" },
    ];

    return (
        <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {children}

            <div
                className={`
                    absolute left-14 top-0 w-[360px] bg-white text-black rounded-xl shadow-2xl z-50 overflow-hidden
                    transition-all duration-200 ease-out
                    ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
                    <div className="flex items-center gap-3 text-sm">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`relative pb-1 transition ${
                                    tab === t.key
                                        ? "text-black font-semibold"
                                        : "text-gray-500 hover:text-black"
                                }`}
                            >
                                {t.label}
                                {tab === t.key && (
                                    <span className="absolute left-0 -bottom-[6px] w-full h-[2px] bg-purple-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-purple-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                        <span className="text-xs text-gray-600">Unread</span>
                        <div
                            onClick={() => setOnlyUnread((v) => !v)}
                            className={`relative w-9 h-5 rounded-full cursor-pointer transition ${
                                onlyUnread ? "bg-purple-600" : "bg-gray-300"
                            }`}
                        >
                            <div
                                className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition ${
                                    onlyUnread ? "left-[18px]" : "left-[2px]"
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto">
                    {loading ? (
                        <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {onlyUnread ? "No unread activity" : "No activity yet"}
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                                    !item.isRead ? "bg-purple-50" : ""
                                }`}
                            >
                                {/* Avatar */}
                                <img
                                    src={getAvatarUrl(item.actorAvatar)}
                                    alt={item.actorUsername}
                                    className="w-8 h-8 rounded-md shrink-0 object-cover"
                                />

                                {/* Content */}
                                <div className="flex-1 min-w-0 text-sm">
                                    <div className="font-semibold text-gray-900 truncate">
                                        {item.actorUsername}
                                        <span className="font-normal text-gray-500 ml-1">
                                            {TYPE_LABEL[item.type]}
                                        </span>
                                    </div>
                                    <div className="text-gray-600 truncate mt-0.5">
                                        {item.messagePreview}
                                    </div>
                                </div>

                                {/* Right side */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-xs text-gray-400">{timeAgo(item.createdAt)}</span>
                                    {!item.isRead && (
                                        <span className="w-2 h-2 bg-purple-500 rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
