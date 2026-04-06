"use client";

import { useAuth } from "@/context/Authcontext";
import {
    getDmCandidates,
    getDmConversations,
    getOrCreateDmConversation,
    DmCandidate,
    DmConversationItem,
} from "@/lib/api/dm";
import { usePresenceStore, presenceColor } from "@/store/presence-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";

interface MemberEntry {
    id: string;
    dispname: string | null;
    email: string;
    avatar: string;
    conversationId: string | null;
    unreadCount: number;
}

export default function DmsPopover({ children }: { children: React.ReactNode }) {
    const [onlyUnread, setOnlyUnread] = useState(false);
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState<MemberEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [navigating, setNavigating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { user } = useAuth();
    const { socket } = useSocket();
    const router = useRouter();
    const params = useParams();
    const workspaceId = Array.isArray(params.workspaceId)
        ? params.workspaceId[0]
        : params.workspaceId;

    const { isOnline } = usePresenceStore();

    const BASE = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";

    const getAvatarUrl = (avatar: string | null | undefined) =>
        `${BASE}${avatar ?? "/uploads/avatar.png"}`;

    /**
     * Merge workspace candidates with existing conversations so we can show
     * all workspace members (not just those with existing DMs) and attach
     * unread counts where conversations exist.
     */
    const loadMembers = async () => {
        if (!workspaceId || !user?.id) return;
        setLoading(true);
        try {
            const [candidates, conversations] = await Promise.all([
                getDmCandidates(workspaceId, user.id),
                getDmConversations(workspaceId, user.id),
            ]);

            // Build a map from otherUserId → conversation
            const convByUser = new Map<string, DmConversationItem>();
            for (const conv of conversations) {
                if (conv.otherUser?.id) {
                    convByUser.set(conv.otherUser.id, conv);
                }
            }

            const merged: MemberEntry[] = candidates.map((c) => {
                const conv = convByUser.get(c.id);
                return {
                    id: c.id,
                    dispname: c.dispname,
                    email: c.email,
                    avatar: c.avatar,
                    conversationId: conv?.id ?? null,
                    unreadCount: conv?.unreadCount ?? 0,
                };
            });

            setMembers(merged);
        } catch (err) {
            console.error("Failed to load DM members:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load when popover opens
    useEffect(() => {
        if (open) loadMembers();
    }, [open, workspaceId, user?.id]);

    // Real-time: refresh unread counts when a new DM arrives
    useEffect(() => {
        if (!socket) return;

        const handleNewDm = () => {
            if (open) loadMembers();
        };

        socket.on("new_dm_message", handleNewDm);
        return () => { socket.off("new_dm_message", handleNewDm); };
    }, [socket, open]);

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    const handleSelect = async (member: MemberEntry) => {
        if (!workspaceId || !user?.id || navigating) return;
        setNavigating(true);
        try {
            let convId = member.conversationId;
            if (!convId) {
                const conv = await getOrCreateDmConversation(workspaceId, user.id, member.id);
                convId = conv.id;
            }
            setOpen(false);
            router.push(`/${workspaceId}/dm/${convId}`);
        } catch (err) {
            console.error("Failed to open DM:", err);
        } finally {
            setNavigating(false);
        }
    };

    const displayed = onlyUnread ? members.filter((m) => m.unreadCount > 0) : members;

    return (
        <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {children}

            {/* Panel */}
            <div
                className={`
                    absolute left-14 top-0 w-80
                    bg-white text-black rounded-xl shadow-2xl overflow-hidden z-50
                    transition-all duration-200 ease-out
                    ${open
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="font-semibold text-sm">Direct messages</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Unreads</span>
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
                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="py-6 text-center text-sm text-gray-400">Loading...</div>
                    ) : displayed.length === 0 ? (
                        <div className="py-6 text-center text-sm text-gray-400">
                            {onlyUnread ? "No unread messages" : "No workspace members"}
                        </div>
                    ) : (
                        displayed.map((member) => {
                            const online = isOnline(member.id);
                            const name = member.dispname || member.email;
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => handleSelect(member)}
                                    disabled={navigating}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer text-left transition"
                                >
                                    {/* Avatar with presence dot */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={getAvatarUrl(member.avatar)}
                                            alt={name}
                                            className="w-9 h-9 rounded-md object-cover"
                                        />
                                        <span
                                            className={`absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 rounded-full border-2 border-white ${presenceColor(online, false)}`}
                                        />
                                    </div>

                                    {/* Name */}
                                    <span className="text-sm flex-1 truncate">{name}</span>

                                    {/* Unread badge */}
                                    {member.unreadCount > 0 && (
                                        <span className="ml-auto shrink-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {member.unreadCount > 99 ? "99+" : member.unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
