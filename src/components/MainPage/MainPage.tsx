"use client";
import { api } from "@/api";
import SlackLoader from "@/common/Loading";
import { useSocket } from "@/providers/SocketProvider";
import { useThreadStore } from "@/store/thread-store";
import { useParams } from "next/navigation";
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
  const [msg, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

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
  } = useThreadStore();

  // Open thread panel and fetch thread data for a message
  const handleCommentClick = async (message: any) => {
    openThread(message);
    try {
      const res = await api.get(`/api/channels/${channelId}/messages/${message.id}/thread`);
      setThreadMessages(res.data);
    } catch (err) {
      console.error("Failed to load thread:", err);
      setThreadMessages([message]); // fallback: show just the root
    }
  };

  // Load initial messages
  useEffect(() => {
    if (!channelId) return;
    const loadMessages = async () => {
      try {
        const res = await api.get(`/api/channels/${channelId}/messages`);
        setMessages(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [channelId]);

  // Socket: receive new root messages and thread metadata updates
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_channel", channelId);

    socket.on("new_message", (newMsg: any) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    // When a thread reply is sent, the backend emits thread_updated with the
    // updated root message (new replyCount / lastReplyAt). Sync it here.
    socket.on("thread_updated", (updatedRoot: any) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedRoot.id ? { ...m, ...updatedRoot } : m))
      );
      updateRootMessage(updatedRoot);
    });

    return () => {
      socket.off("new_message");
      socket.off("thread_updated");
    };
  }, [socket, channelId]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const groupMessagesByDate = (messages: any[]) => {
    const groups: Record<string, any[]> = {};
    messages.forEach((m) => {
      const date = new Date(m.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  };

  const sortedMessages = [...msg].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  if (!channelId)
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100">
        <h1 className="font-weight-bold text-[100px]">Welcome to our slack!!!</h1>
      </div>
    );

  if (loading) return <SlackLoader />;

  return (
    <div className="flex h-full">
      <div className="min-w-[320px] w-full h-full bg-white">
        <MainTopBar />
        <MainBar />

        <div className="w-full relative h-[calc(100vh-133px)] flex flex-col justify-between">
          {/* Messages container */}
          <div className="h-full overflow-y-scroll flex flex-col">
            <Introduction />
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                <DividerDate date={date} />
                {messages.map((item: any) => (
                  <SlackMessage
                    key={item.id}
                    avatar={`${process.env.NEXT_PUBLIC_SOCKET_URL}${item.sender?.avatar ?? "/uploads/avatar.png"}`}
                    username={getDisplayName(item.sender)}
                    time={item.createdAt}
                    text={item.content}
                    messageId={item.id}
                    files={item.file ?? []}
                    reactions={item.emoticon ?? []}
                    replies={item.replyCount ?? 0}
                    lastReply={formatLastReply(item.lastReplyAt)}
                    onCommentClick={() => handleCommentClick(item)}
                    state="message"
                  />
                ))}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Editor */}
          <div className="w-full z-10 px-4 pb-4">
            <MessageEditor userData={props.userData} />
          </div>
        </div>
      </div>

      {/* Thread panel — only render when thread is open AND a message is selected */}
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