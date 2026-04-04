"use client";

import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import {
    getDmMessages,
    getDmConversations,
    getDmThread,
    toggleDmReaction,
    markDmConversationAsRead,
    DmMessageItem,
    DmConversationItem,
} from "@/lib/api/dm";
import SlackLoader from "@/common/Loading";
import SlackMessage from "@/components/ui/message/Message";
import MessageEditor from "@/components/ui/messageEditor/MessageEditor";
import DividerDate from "@/components/ui/dividerdate/DividerDate";
import { Thread } from "@/components/ThreadPage/ThreadPage";
import { ReactionView } from "@/lib/api/reactions";
import { useThreadStore } from "@/store/thread-store";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface DmPageProps {
    conversationId: string;
}

/**
 * DM conversation view.
 * Reuses SlackMessage, MessageEditor, Thread, DividerDate from the channel UI.
 * Reactions and threads work identically to channels.
 */
export default function DmPage({ conversationId }: DmPageProps) {
    const { user } = useAuth();
    const { socket } = useSocket();
    const params = useParams();
    const workspaceId = Array.isArray(params.workspaceId)
        ? params.workspaceId[0]
        : params.workspaceId;

    const [messages, setMessages] = useState<DmMessageItem[]>([]);
    const [conversation, setConversation] = useState<DmConversationItem | null>(null);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const {
        isOpen: showThread,
        selectedMessage,
        openThread,
        closeThread,
        setThreadMessages,
        updateRootMessage,
        updateThreadMessageReactions,
    } = useThreadStore();

    // Load conversation info + root messages, and mark as read
    useEffect(() => {
        if (!conversationId || !user?.id || !workspaceId) return;
        setLoading(true);

        Promise.all([
            getDmMessages(workspaceId, conversationId, user.id),
            getDmConversations(workspaceId, user.id),
        ])
            .then(([msgs, convs]) => {
                setMessages(msgs);
                const found = convs.find((c) => c.id === conversationId) ?? null;
                setConversation(found);
                // Mark as read when the conversation is opened
                markDmConversationAsRead(workspaceId, conversationId, user.id).catch(() => {});
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [conversationId, user?.id, workspaceId]);

    // Socket: join room, listen for new root messages, thread updates, reaction updates
    useEffect(() => {
        if (!socket || !conversationId) return;

        socket.emit("join_dm", conversationId);

        // New root DM message
        socket.on("new_dm_message", (msg: DmMessageItem) => {
            if (msg.parentId) return; // thread replies must not enter root list
            setMessages((prev) => [...prev, msg]);
        });

        // Root message thread metadata updated (replyCount, lastReplyAt)
        socket.on("dm_thread_updated", (updatedRoot: DmMessageItem) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === updatedRoot.id ? { ...m, ...updatedRoot } : m)),
            );
            updateRootMessage(updatedRoot as any);
        });

        // Reaction update on any DM message in this conversation
        socket.on("dm_reaction_updated", (payload: { messageId: string; reactions: ReactionView[] }) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m)),
            );
            updateThreadMessageReactions(payload.messageId, payload.reactions);
        });

        return () => {
            socket.off("new_dm_message");
            socket.off("dm_thread_updated");
            socket.off("dm_reaction_updated");
        };
    }, [socket, conversationId, updateRootMessage, updateThreadMessageReactions]);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Open thread for a DM message — fetches thread from DM-specific endpoint
    const handleCommentClick = async (message: DmMessageItem) => {
        openThread(message as any);
        try {
            if (!workspaceId || !user?.id) return;
            const thread = await getDmThread(workspaceId, conversationId, message.id, user.id);
            setThreadMessages(thread as any[]);
        } catch (err) {
            console.error("Failed to load DM thread:", err);
            setThreadMessages([message as any]);
        }
    };

    // Reaction toggle for DM messages — calls DM-specific endpoint then broadcasts via socket
    const handleReactionUpdate = async (messageId: string, emoji: string) => {
        if (!user?.id || !workspaceId) return;
        try {
            const result = await toggleDmReaction(workspaceId, conversationId, messageId, emoji, user.id);
            // Update local state
            setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, reactions: result.reactions } : m)),
            );
            updateThreadMessageReactions(messageId, result.reactions);
            // Broadcast to other clients
            socket?.emit("toggle_dm_reaction", { conversationId, messageId, reactions: result.reactions });
        } catch (err) {
            console.error("Failed to toggle DM reaction:", err);
        }
    };

    // ── helpers ───────────────────────────────────────────────────────────────

    const groupMessagesByDate = (msgs: DmMessageItem[]) => {
        const groups: Record<string, DmMessageItem[]> = {};
        msgs.forEach((m) => {
            const date = new Date(m.createdAt).toDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(m);
        });
        return groups;
    };

    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const groupedMessages = groupMessagesByDate(sortedMessages);

    const getDisplayName = (sender: DmMessageItem["sender"]) =>
        sender?.dispname || sender?.email || "User";

    const getAvatarUrl = (sender: DmMessageItem["sender"]) =>
        `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${sender?.avatar ?? "/uploads/avatar.png"}`;

    const formatLastReply = (lastReplyAt: string | null) => {
        if (!lastReplyAt) return "";
        const diff = Date.now() - new Date(lastReplyAt).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return "just now";
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    const otherUserName =
        conversation?.otherUser?.dispname ||
        conversation?.otherUser?.email ||
        "Direct Message";

    const otherUserAvatar = conversation?.otherUser?.avatar
        ? `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${conversation.otherUser.avatar}`
        : `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}/uploads/avatar.png`;

    if (loading) return <SlackLoader />;

    return (
        <div className="flex h-full">
            {/* Main DM chat area */}
            <div className="flex flex-col flex-1 h-full bg-white min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 h-[49px] border-b border-gray-200 shrink-0">
                    <img src={otherUserAvatar} alt={otherUserName} className="w-7 h-7 rounded-lg" />
                    <span className="font-semibold text-gray-800 text-base">{otherUserName}</span>
                </div>

                {/* Sub-header */}
                <div className="w-full h-[44px] border-b border-gray-200 flex items-center px-4 text-gray-500 text-sm shrink-0">
                    <span>Direct Message</span>
                </div>

                {/* Message list — same structure as channel view */}
                <div className="flex-1 overflow-y-scroll flex flex-col">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No messages yet. Say hello!
                        </div>
                    ) : (
                        Object.entries(groupedMessages).map(([date, msgs]) => (
                            <div key={date}>
                                <DividerDate date={date} />
                                {msgs.map((item) => (
                                    <SlackMessage
                                        key={item.id}
                                        id={`dm-msg-${item.id}`}
                                        state="message"
                                        avatar={getAvatarUrl(item.sender)}
                                        username={getDisplayName(item.sender)}
                                        time={item.createdAt}
                                        text={item.content}
                                        messageId={item.id}
                                        // channelId is empty — reactions use handleReactionUpdate below
                                        channelId=""
                                        currentUserId={user?.id ?? null}
                                        files={[]}
                                        reactions={item.reactions ?? []}
                                        replies={item.replyCount ?? 0}
                                        lastReply={formatLastReply(item.lastReplyAt)}
                                        onCommentClick={() => handleCommentClick(item)}
                                        onReactionUpdate={(_msgId, _reactions) => {
                                            // Reactions are handled via handleReactionUpdate
                                            // which is called from the emoji picker directly
                                        }}
                                        onDmReactionSelect={(emoji) => handleReactionUpdate(item.id, emoji)}
                                    />
                                ))}
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Editor */}
                <div className="w-full z-10 px-4 pb-4 shrink-0">
                    <MessageEditor
                        userData={user}
                        dmConversationId={conversationId}
                        placeholder={`Message ${otherUserName}`}
                    />
                </div>
            </div>

            {/* Thread panel — reuses Thread.tsx with dmConversationId */}
            {showThread && selectedMessage && (
                <div className="w-[550px] shrink-0">
                    <Thread
                        onCloseThread={closeThread}
                        userData={user}
                        dmConversationId={conversationId}
                        workspaceId={workspaceId}
                    />
                </div>
            )}
        </div>
    );
}
