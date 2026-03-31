"use client";
import { api } from "@/api";
import SlackLoader from "@/common/Loading";
import { useSocket } from "@/providers/SocketProvider";
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
  const [showThread, setShowThread] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const handleCommentClick = () => setShowThread(true);
  const handleCloseThread = () => setShowThread(false);

  // ✅ Load initial messages
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

  // ✅ Socket: receive new messages
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_channel", channelId);

    socket.on("new_message", (newMsg) => {
      console.log('New_message--------------->',newMsg)
      setMessages((prev) => [...prev, newMsg]); // ✅ append (IMPORTANT)
    });

    return () => {
      socket.off("new_message");
      socket.off("join_channel");
    };
  }, [socket, channelId]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  // ✅ Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: Record<string, any[]> = {};

    messages.forEach((m) => {
      const date = new Date(m.createdAt).toDateString();

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(m);
    });

    return groups;
  };

  // ✅ Sort messages (old → new)
  const sortedMessages = [...msg].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  const groupedMessages = groupMessagesByDate(sortedMessages);

  const userMap = useRef<Record<string, number>>({});
  const userCounter = useRef(1);

  const getDisplayName = (sender: any) => {
    if (sender?.dispname) return sender.dispname;

    const id = sender?.id;

    if (!userMap.current[id]) {
      userMap.current[id] = userCounter.current++;
    }

    const num = userMap.current[id];
    return `Slack_User${String(num).padStart(2, "0")}`;
  };

  if (!channelId) return <div className="flex flex-col items-center justify-center h-full bg-gray-100">
    <h1 className="font-weight-bold text-[100px]">
      Welcome to our slack!!!
    </h1>
  </div>

  if (loading) return <SlackLoader />;

  return (
    <div className="flex">
      <div className="min-w-[320px] w-full h-full bg-white">
        <MainTopBar />
        <MainBar />

        <div className="w-full relative h-[calc(100vh-133px)] flex flex-col justify-between">

          {/* ✅ Messages container */}
          <div className="h-full overflow-y-scroll flex flex-col">

            <Introduction />
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>

                {/* ✅ Date Divider */}
                <DividerDate date={date} />

                {/* ✅ Messages */}
                {messages.map((item: any) => (
                  <SlackMessage
                    key={item.id}
                    avatar={`${process.env.NEXT_PUBLIC_SOCKET_URL}${item.sender.avatar}`}
                    username={item.sender.dispname ? item.sender.dispname : getDisplayName(item.sender)}
                    time={item.createdAt}
                    text={item.content}
                    messageId={item.id}
                    files={item.file}
                    reactions={item.emoticon}
                    replies={0}
                    lastReply="16 hours ago"
                    onCommentClick={handleCommentClick}
                    state="message"
                  />
                ))}
              </div>
            ))}


            {/* ✅ Scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* ✅ Editor */}
          <div className="w-full z-10 px-4 pb-4">
            <MessageEditor userData={props.userData} />
          </div>
        </div>
      </div>

      {/* ✅ Thread panel */}
      {showThread && (
        <div className="w-[550px]">
          <Thread onCloseThread={handleCloseThread} />
        </div>
      )}
    </div>
  );
};