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

export const MainPage = (props: { userData: any }) => {
    const { socket } = useSocket();
    const { messages: msg, setMessages, appendMessage } = useMessageStore();
    const [loading, setLoading] = useState(true);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const searchparams = useSearchParams();
    const messageId = searchparams.get('messageId')
    const params = useParams();
    const channelId = Array.isArray(params.channelId)
        ? params.channelId[0]
        : params.channelId;

    const {
        isOpen: showThread,
        selectedMessage,
        openThread,
        closeThread,
        setThreadMessages,
        updateRootMessage,
        updateThreadMessageReactions,
    } = useThreadStore();

    const handleCommentClick = async (message: any) => {
        openThread(message);
        try {
            const res = await api.get(
                `/api/channels/${channelId}/messages/${message.id}/thread`,
            );
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
                const res = await api.get(
                    `/api/channels/${channelId}/messages`,
                );
                // Defense-in-depth: only keep root messages (parentId === null)
                // The backend already filters this, but guard here too so no thread
                // reply can ever leak into the channel view.
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
            // Only append root messages — thread replies must never enter this list
            if (newMsg.parentId) return;
            appendMessage(newMsg);
        });

        socket.on("thread_updated", (updatedRoot: any) => {
            setMessages(
                msg.map((m) =>
                    m.id === updatedRoot.id ? { ...m, ...updatedRoot } : m,
                ),
            );
            updateRootMessage(updatedRoot);
        });

        // Real-time reaction updates from other clients.
        // Payload: { messageId, reactions: ReactionView[] }
        socket.on(
            "reaction_updated",
            (payload: { messageId: string; reactions: ReactionView[] }) => {
                setMessages(
                    msg.map((m) =>
                        m.id === payload.messageId
                            ? { ...m, reactions: payload.reactions }
                            : m,
                    ),
                );
                updateThreadMessageReactions(
                    payload.messageId,
                    payload.reactions,
                );
            },
        );

        return () => {
            socket.off("new_message");
            socket.off("thread_updated");
            socket.off("reaction_updated");
        };
    }, [
        socket,
        channelId,
        msg,
        updateRootMessage,
        updateThreadMessageReactions,
    ]);
    const scrollToMessage = (messageId: string) => {
        setTimeout(() => {
            const element = document.getElementById(`msg-${messageId}`);
            if (!element) {
                console.warn(`No element found with id msg-${messageId}`);
                return;
            }

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const highlightClasses = [
                'bg-blue-100',
                'border-2',
                'border-yellow-400',
                'rounded-lg',
                'shadow-lg',
                'transition-all',
                'duration-300',
            ];

            element.classList.remove(...highlightClasses);
            void element.offsetWidth;

            element.classList.add(...highlightClasses);

            // Remove highlight after 3 seconds
            setTimeout(() => {
                element.classList.remove(...highlightClasses);
            }, 3000);

        }, 100);
    };

    useEffect(() => {
        if (messageId) {
            scrollToMessage(messageId);
        }
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msg]);

    useEffect(() => {
        if (messageId) {
            scrollToMessage(messageId);
        }
    }, [messageId]);
    const groupMessagesByDate = (messages: any[]) => {
        const groups: Record<string, any[]> = {};
        messages.forEach((m) => {
            const date = new Date(m.createdAt).toDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(m);
        });
        return groups;
    };

    // Sort root messages oldest → newest, then group by date
    const sortedMessages = [...msg].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const groupedMessages = groupMessagesByDate(sortedMessages);

    const userMap = useRef<Record<string, number>>({});
    const userCounter = useRef(1);

    const getDisplayName = (sender: any) => {
        if (sender?.dispname) return sender.dispname;
        const id = sender?.id;
        if (!userMap.current[id]) userMap.current[id] = userCounter.current++;
        return `Slack_User${String(userMap.current[id]).padStart(2, "0")}`;
    };

    const formatLastReply = (lastReplyAt: string | null) => {
        if (!lastReplyAt) return "";
        const diff = Date.now() - new Date(lastReplyAt).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return "just now";
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    /**
     * Called by SlackMessage after a successful reaction toggle.
     * Updates local channel state and broadcasts to other clients via socket.
     * Payload shape changed: reactions[] (not reaction).
     */
    const handleReactionUpdate = (
        messageId: string,
        reactions: ReactionView[],
    ) => {
        setMessages(
            msg.map((m) => (m.id === messageId ? { ...m, reactions } : m)),
        );
        updateThreadMessageReactions(messageId, reactions);
        if (socket && channelId) {
            socket.emit("toggle_reaction", { channelId, messageId, reactions });
        }
    };

    if (!channelId)
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                <h1 className="font-weight-bold text-[100px]">
                    Welcome to our slack!!!
                </h1>
            </div>
        );

    if (loading) return <SlackLoader />;

    return (
        <div className="flex h-full">
            <div className="min-w-[320px] w-full h-full bg-white">
                <MainTopBar />
                <MainBar />

                <div className="w-full relative h-[calc(100vh-133px)] flex flex-col justify-between">
                    <div className="h-full overflow-y-scroll flex flex-col">
                        <Introduction />
                        {Object.entries(groupedMessages).map(
                            ([date, messages]) => (
                                <div key={date}>
                                    <DividerDate date={date} />
                                    {messages.map((item: any) => (
                                        <SlackMessage
                                            key={item.id}
                                            id={`msg-${item.id}`}
                                            avatar={`${process.env.NEXT_PUBLIC_SOCKET_URL}${item.sender?.avatar ?? "/uploads/avatar.png"}`}
                                            username={getDisplayName(
                                                item.sender,
                                            )}
                                            time={item.createdAt}
                                            text={item.content}
                                            messageId={item.id}
                                            channelId={channelId ?? ""}
                                            currentUserId={
                                                props.userData?.id ?? null
                                            }
                                            files={item.file ?? []}
                                            reactions={item.reactions ?? []}
                                            replies={item.replyCount ?? 0}
                                            lastReply={formatLastReply(
                                                item.lastReplyAt,
                                            )}
                                            onCommentClick={() =>
                                                handleCommentClick(item)
                                            }
                                            onReactionUpdate={
                                                handleReactionUpdate
                                            }
                                            state="message"
                                        />
                                    ))}
                                </div>
                            ),
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="w-full z-10 px-4 pb-4">
                        <MessageEditor userData={props.userData} />
                    </div>
                </div>
            </div>

            {showThread && selectedMessage && channelId && (
                <div className="w-[550px] shrink-0">
                    <Thread
                        onCloseThread={closeThread}
                        userData={props.userData}
                        channelId={channelId}
                    />
                </div>
            )}
        </div>
    );
};
