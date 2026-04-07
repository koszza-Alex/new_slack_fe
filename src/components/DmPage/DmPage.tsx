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
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useThreadResize } from "@/hooks/useThreadResize";
import { getAvatarUrl, getDisplayName, formatLastReply, groupMessagesByDate, sortByDate } from "@/lib/messageUtils";
import { useMessageStore } from "@/store/message-store";
import { useEffect, useRef, useState } from "react";
import Directories from "../workspaceHeaderPage/directories/directories";
import { DraftsPage } from "../workspaceHeaderPage/Drapts&send/DraptsPage";
import HuddlePage from "../workspaceHeaderPage/huddle/HuddlePage";

interface DmPageProps {
    conversationId: string;
}

export default function DmPage({ conversationId }: DmPageProps) {
    const { flag } = useMessageStore();
    const { user } = useAuth();
    const { socket } = useSocket();
    const workspaceId = useWorkspaceId();

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
        updateThreadMessageContent,
        removeThreadMessage,
    } = useThreadStore();

    const { threadWidth, onDragStart: onThreadDragStart, THREAD_MIN, THREAD_MAX } = useThreadResize();

    // Close thread when the active DM conversation changes
    useEffect(() => { closeThread(); }, [conversationId]);

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
                markDmConversationAsRead(workspaceId, conversationId, user.id).catch(() => { });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [conversationId, user?.id, workspaceId]);

    // Socket: join room, listen for new root messages, thread updates, reaction updates
    useEffect(() => {
        if (!socket || !conversationId) return;

        socket.emit("join_dm", conversationId);

        // ── All handlers are scoped to THIS conversationId ──────────────────
        // This prevents messages from other DM conversations leaking in when
        // the user navigates between DMs without a full unmount/remount.

        const onNewMessage = (msg: DmMessageItem) => {
            if (msg.conversationId !== conversationId) return; // wrong conversation — ignore
            if (msg.parentId) return; // thread reply — not in root list
            setMessages((prev) => [...prev, msg]);
        };

        const onThreadUpdated = (updatedRoot: DmMessageItem) => {
            if (updatedRoot.conversationId !== conversationId) return;
            setMessages((prev) => prev.map((m) => (m.id === updatedRoot.id ? { ...m, ...updatedRoot } : m)));
            updateRootMessage(updatedRoot as any);
        };

        const onReactionUpdated = (payload: { messageId: string; reactions: ReactionView[]; conversationId?: string }) => {
            if (payload.conversationId && payload.conversationId !== conversationId) return;
            setMessages((prev) => prev.map((m) => (m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m)));
            updateThreadMessageReactions(payload.messageId, payload.reactions);
        };

        const onMessageEdited = (payload: { messageId: string; content: string; updatedAt: string; conversationId?: string }) => {
            if (payload.conversationId && payload.conversationId !== conversationId) return;
            setMessages((prev) => prev.map((m) => m.id === payload.messageId ? { ...m, content: payload.content, updatedAt: payload.updatedAt } : m));
            updateThreadMessageContent(payload.messageId, payload.content, payload.updatedAt);
        };

        const onMessageDeleted = (payload: { messageId: string; conversationId?: string }) => {
            if (payload.conversationId && payload.conversationId !== conversationId) return;
            setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
            removeThreadMessage(payload.messageId);
        };

        const onProfileUpdated = (data: { userId?: string; id?: string; dispname?: string; avatar?: string }) => {
            const updatedUserId = data?.userId ?? data?.id;
            if (!updatedUserId) return;
            setMessages((prev) =>
                prev.map((m) =>
                    m.senderId === updatedUserId
                        ? { ...m, sender: { ...m.sender, dispname: data.dispname ?? m.sender?.dispname ?? null, avatar: data.avatar ?? m.sender?.avatar ?? "/uploads/avatar.png" } }
                        : m,
                ),
            );
            setConversation((prev) => {
                if (!prev || prev.otherUser?.id !== updatedUserId) return prev;
                return { ...prev, otherUser: { ...prev.otherUser, dispname: data.dispname ?? prev.otherUser.dispname, avatar: data.avatar ?? prev.otherUser.avatar } };
            });
        };

        socket.on("new_dm_message", onNewMessage);
        socket.on("dm_thread_updated", onThreadUpdated);
        socket.on("dm_reaction_updated", onReactionUpdated);
        socket.on("dmMessageEdited", onMessageEdited);
        socket.on("dmMessageDeleted", onMessageDeleted);
        socket.on("updated_profile", onProfileUpdated);

        return () => {
            // Remove the exact handler references — not all listeners for the event
            socket.off("new_dm_message", onNewMessage);
            socket.off("dm_thread_updated", onThreadUpdated);
            socket.off("dm_reaction_updated", onReactionUpdated);
            socket.off("dmMessageEdited", onMessageEdited);
            socket.off("dmMessageDeleted", onMessageDeleted);
            socket.off("updated_profile", onProfileUpdated);
        };
    }, [socket, conversationId, updateRootMessage, updateThreadMessageReactions]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    const handleReactionUpdate = async (messageId: string, emoji: string) => {
        if (!user?.id || !workspaceId) return;
        try {
            const result = await toggleDmReaction(workspaceId, conversationId, messageId, emoji, user.id);
            setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions: result.reactions } : m)));
            updateThreadMessageReactions(messageId, result.reactions);
            socket?.emit("toggle_dm_reaction", { conversationId, messageId, reactions: result.reactions });
        } catch (err) {
            console.error("Failed to toggle DM reaction:", err);
        }
    };

    const handleDmMessageUpdate = (messageId: string, newContent: string, newUpdatedAt: string) => {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: newContent, updatedAt: newUpdatedAt } : m)));
        socket?.emit("dm_message_edit", { conversationId, messageId, content: newContent, updatedAt: newUpdatedAt });
    };

    const handleDmMessageDelete = (messageId: string, updatedRoot?: any) => {
        setMessages((prev) =>
            prev.filter((m) => m.id !== messageId).map((m) =>
                updatedRoot && m.id === updatedRoot.id
                    ? { ...m, replyCount: updatedRoot.replyCount, lastReplyAt: updatedRoot.lastReplyAt }
                    : m,
            ),
        );
        socket?.emit("dm_message_delete", { conversationId, messageId, updatedRoot });
        if (updatedRoot) updateRootMessage(updatedRoot as any);
    };

    const dmEditSave = async (messageId: string, content: string): Promise<string> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/workspaces/${workspaceId}/dm/conversations/${conversationId}/messages/${messageId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ content, senderId: user?.id }),
            },
        );
        if (!res.ok) throw new Error("Failed to update DM message");
        const data = await res.json();
        return data?.updatedAt ?? new Date().toISOString();
    };

    const dmDeleteConfirm = async (messageId: string): Promise<{ updatedRoot: any | null }> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/workspaces/${workspaceId}/dm/conversations/${conversationId}/messages/${messageId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ senderId: user?.id }),
            },
        );
        if (!res.ok) throw new Error("Failed to delete DM message");
        const data = await res.json();
        return { updatedRoot: data?.updatedRoot ?? null };
    };

    const groupedMessages = groupMessagesByDate(sortByDate(messages));

    const otherUserName = conversation?.otherUser?.dispname || conversation?.otherUser?.email || "Direct Message";
    const otherUserAvatar = getAvatarUrl(conversation?.otherUser?.avatar);

    if (loading) return <SlackLoader />;

    return (
        <div className="flex h-full">
            {/* Main DM chat area */}
            {flag === "Threads" ? <div></div> :
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

                    {/* Message list */}
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
                                            avatar={getAvatarUrl(item.sender?.avatar)}
                                            username={getDisplayName(item.sender)}
                                            time={item.createdAt}
                                            createdAt={item.createdAt}
                                            updatedAt={item.updatedAt}
                                            text={item.content}
                                            messageId={item.id}
                                            channelId=""
                                            currentUserId={user?.id ?? null}
                                            senderId={item.senderId}
                                            files={item.files ?? []}
                                            reactions={item.reactions ?? []}
                                            replies={item.replyCount ?? 0}
                                            lastReply={formatLastReply(item.lastReplyAt)}
                                            onCommentClick={() => handleCommentClick(item)}
                                            onReactionUpdate={(_msgId, _reactions) => { }}
                                            onDmReactionSelect={(emoji) => handleReactionUpdate(item.id, emoji)}
                                            onMessageUpdate={handleDmMessageUpdate}
                                            onMessageDelete={handleDmMessageDelete}
                                            onEditSave={dmEditSave}
                                            onDeleteConfirm={dmDeleteConfirm}
                                        />
                                    ))}
                                </div>
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Editor */}
                    <div className="w-full z-10 px-4 pb-4 shrink-0">
                        <MessageEditor userData={user} dmConversationId={conversationId} placeholder={`Message ${otherUserName}`} />
                    </div>
                </div>
            }

            {/* Thread panel */}
            {showThread && selectedMessage && (
                <div
                    className="relative shrink-0"
                    style={{ width: `${threadWidth}px`, minWidth: `${THREAD_MIN}px`, maxWidth: `${THREAD_MAX}px` }}
                >
                    <div
                        onMouseDown={onThreadDragStart}
                        className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-gray-300/50 transition-colors z-10"
                    />
                    <Thread
                        onCloseThread={closeThread}
                        userData={user}
                        dmConversationId={conversationId}
                        workspaceId={workspaceId}
                        onDmEditSave={dmEditSave}
                        onDmDeleteConfirm={dmDeleteConfirm}
                    />
                </div>
            )}
        </div>
    );
}
