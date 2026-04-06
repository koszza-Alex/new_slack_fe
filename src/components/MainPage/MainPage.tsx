"use client";
import { api } from "@/api";
import SlackLoader from "@/common/Loading";
import { useSocket } from "@/providers/SocketProvider";
import { useThreadStore } from "@/store/thread-store";
import { useMessageStore } from "@/store/message-store";
import { ReactionView } from "@/lib/api/reactions";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MainBar from "../MainTopbar/MainBar";
import MainTopBar from "../MainTopbar/MainTopbar";
import { Thread } from "../ThreadPage/ThreadPage";
import DividerDate from "../ui/dividerdate/DividerDate";
import Introduction from "../ui/introduction/Introduction";
import SlackMessage from "../ui/message/Message";
import MessageEditor from "../ui/messageEditor/MessageEditor";
import { useThreadResize } from "@/hooks/useThreadResize";
import { getAvatarUrl, getDisplayName, formatLastReply, groupMessagesByDate, sortByDate } from "@/lib/messageUtils";
import type { User } from "@/context/Authcontext";
import Directories from "../workspaceHeaderPage/directories/directories";
import { DraftsPage } from "../workspaceHeaderPage/Drapts&send/DraptsPage";
import HuddlePage from "../workspaceHeaderPage/huddle/HuddlePage";

export const MainPage = (props: { userData: User | null }) => {
    const { socket } = useSocket();
    const { messages: msg, setMessages, appendMessage } = useMessageStore();
    const [loading, setLoading] = useState(true);
    const { flag } = useMessageStore();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const searchparams = useSearchParams();
    const messageId = searchparams.get("messageId");
    const params = useParams();
    const channelId = Array.isArray(params.channelId)
        ? params.channelId[0]
        : params.channelId;
    const workspaceId = Array.isArray(params.workspaceId)
        ? params.workspaceId[0]
        : params.workspaceId;

    const { threadWidth, onDragStart: onThreadDragStart, THREAD_MIN, THREAD_MAX } = useThreadResize();

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

    // Close thread when the active channel changes
    useEffect(() => {
        closeThread();
    }, [channelId]);

    const handleCommentClick = async (message: any) => {
        openThread(message);
        try {
            const res = await api.get(`/api/channels/${channelId}/messages/${message.id}/thread`);
            setThreadMessages(res.data);
        } catch (err) {
            console.error("Failed to load thread:", err);
            setThreadMessages([message]);
        }
    };

    useEffect(() => {
        if (!channelId) return;
        const loadMessages = async () => {
            try {
                const res = await api.get(`/api/channels/${channelId}/messages`);
                const rootOnly = (res.data as any[]).filter((m) => !m.parentId);
                setMessages(rootOnly);
            } finally {
                setLoading(false);
            }
        };
        loadMessages();
    }, [channelId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("join_channel", channelId);

        socket.on("new_message", (newMsg: any) => {
            if (newMsg.parentId) return;
            appendMessage(newMsg);
        });

        socket.on("thread_updated", (updatedRoot: any) => {
            setMessages(msg.map((m) => m.id === updatedRoot.id ? { ...m, ...updatedRoot } : m));
            updateRootMessage(updatedRoot);
        });

        socket.on("reaction_updated", (payload: { messageId: string; reactions: ReactionView[] }) => {
            setMessages(msg.map((m) => m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m));
            updateThreadMessageReactions(payload.messageId, payload.reactions);
        });

        socket.on("messageEdited", (payload: { messageId: string; content: string; updatedAt: string }) => {
            setMessages(msg.map((m) => m.id === payload.messageId ? { ...m, content: payload.content, updatedAt: payload.updatedAt } : m));
            updateThreadMessageContent(payload.messageId, payload.content, payload.updatedAt);
        });

        socket.on("messageDeleted", (payload: { messageId: string }) => {
            setMessages(msg.filter((m) => m.id !== payload.messageId));
            removeThreadMessage(payload.messageId);
        });

        return () => {
            socket.off("new_message");
            socket.off("thread_updated");
            socket.off("reaction_updated");
            socket.off("messageEdited");
            socket.off("messageDeleted");
        };
    }, [socket, channelId, msg, updateRootMessage, updateThreadMessageReactions]);

    const scrollToMessage = (msgId: string) => {
        setTimeout(() => {
            const element = document.getElementById(`msg-${msgId}`);
            if (!element) return;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            const classes = ["bg-blue-100", "border-2", "border-yellow-400", "rounded-lg", "shadow-lg", "transition-all", "duration-300"];
            element.classList.remove(...classes);
            void element.offsetWidth;
            element.classList.add(...classes);
            setTimeout(() => element.classList.remove(...classes), 3000);
        }, 100);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msg]);

    useEffect(() => {
        if (messageId) scrollToMessage(messageId);
    }, [messageId]);

    const groupedMessages = groupMessagesByDate(sortByDate(msg));

    const handleReactionUpdate = (messageId: string, reactions: ReactionView[], messageOwnerId?: string, emoji?: string) => {
        setMessages(msg.map((m) => (m.id === messageId ? { ...m, reactions } : m)));
        updateThreadMessageReactions(messageId, reactions);
        if (socket && channelId) {
            socket.emit("toggle_reaction", {
                channelId,
                messageId,
                reactions,
                workspaceId,
                senderId: props.userData?.id,
                messageOwnerId,
                actorUsername: props.userData?.dispname || props.userData?.email || 'Someone',
                actorAvatar: props.userData?.avatar ?? '/uploads/avatar.png',
                emoji,
            });
        }
    };

    const handleMessageUpdate = (messageId: string, newContent: string, newUpdatedAt: string) => {
        setMessages(msg.map((m) => m.id === messageId ? { ...m, content: newContent, updatedAt: newUpdatedAt } : m));
        if (socket && channelId) {
            socket.emit("message_edit", { channelId, messageId, content: newContent, updatedAt: newUpdatedAt });
        }
    };

    const handleMessageDelete = (messageId: string, updatedRoot?: any) => {
        setMessages(
            msg.filter((m) => m.id !== messageId).map((m) =>
                updatedRoot && m.id === updatedRoot.id
                    ? { ...m, replyCount: updatedRoot.replyCount, lastReplyAt: updatedRoot.lastReplyAt }
                    : m,
            ),
        );
        if (socket && channelId) {
            socket.emit("message_delete", { channelId, messageId, updatedRoot });
        }
        if (updatedRoot) updateRootMessage(updatedRoot);
    };

    if (!channelId)
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                <h1 className="font-weight-bold text-[100px]">Welcome to our slack!!!</h1>
            </div>
        );

    if (loading) return <SlackLoader />;

    return (
        <div className="flex h-full overflow-hidden">
            <div className="flex-1 min-w-0 h-full bg-white">
                {flag === "Directories" && <Directories />}
                {flag === "Drafts % Sent" && <DraftsPage />}
                {flag === "Huddles" && <HuddlePage />}
                {flag === "" &&
                    <div>
                        <MainTopBar />
                        <MainBar />
                        <div className="w-full relative h-[calc(100vh-133px)] flex flex-col justify-between">
                            <div className="h-full overflow-y-scroll flex flex-col">
                                <Introduction />
                                {Object.entries(groupedMessages).map(([date, messages]) => (
                                    <div key={date}>
                                        <DividerDate date={date} />
                                        {messages.map((item: any) => (
                                            <SlackMessage
                                                key={item.id}
                                                id={`msg-${item.id}`}
                                                avatar={getAvatarUrl(item.sender?.avatar)}
                                                username={getDisplayName(item.sender)}
                                                time={item.createdAt}
                                                createdAt={item.createdAt}
                                                updatedAt={item.updatedAt}
                                                text={item.content}
                                                messageId={item.id}
                                                channelId={channelId ?? ""}
                                                currentUserId={props.userData?.id ?? null}
                                                senderId={item.sender?.id}
                                                files={item.files ?? []}
                                                reactions={item.reactions ?? []}
                                                replies={item.replyCount ?? 0}
                                                lastReply={formatLastReply(item.lastReplyAt)}
                                                onCommentClick={() => handleCommentClick(item)}
                                                onReactionUpdate={handleReactionUpdate}
                                                onMessageUpdate={handleMessageUpdate}
                                                onMessageDelete={handleMessageDelete}
                                                state="message"
                                            />
                                        ))}
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>

                            <div className="w-full z-10 px-4 pb-4">
                                <MessageEditor userData={props.userData} />
                            </div>
                        </div>
                    </div>
                }
            </div>

            {showThread && selectedMessage && channelId && (
                <div
                    className="relative shrink-0"
                    style={{ width: `${threadWidth}px`, minWidth: `${THREAD_MIN}px`, maxWidth: `${THREAD_MAX}px` }}
                >
                    <div
                        onMouseDown={onThreadDragStart}
                        className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-gray-300/50 transition-colors z-10"
                    />
                    <Thread onCloseThread={closeThread} userData={props.userData} channelId={channelId} />
                </div>
            )}
        </div>
    );
};
