"use client";

import { useSocket } from "@/providers/SocketProvider";
import { useThreadStore } from "@/store/thread-store";
import { ReactionView } from "@/lib/api/reactions";
import MessageEditor from "@/components/ui/messageEditor/MessageEditor";
import { useEffect, useRef } from "react";
import { FaEllipsisH, FaRegWindowMaximize, FaTimes } from "react-icons/fa";
import SlackMessage from "../ui/message/Message";

interface UserData {
  id: string;
  dispname?: string | null;
  avatar?: string;
}

interface ThreadProps {
  onCloseThread: () => void;
  userData: UserData | null;
  channelId: string;
}

export const Thread: React.FC<ThreadProps> = ({
  onCloseThread,
  userData,
  channelId,
}) => {
  const { socket } = useSocket();
  const {
    selectedMessage,
    threadMessages,
    isLoading,
    appendThreadMessage,
    updateThreadMessageReactions,
  } = useThreadStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket || !selectedMessage) return;

    const handleNewThreadMessage = (msg: any) => {
      const rootId = selectedMessage.threadRootId ?? selectedMessage.id;
      if (msg.parentId === selectedMessage.id || msg.threadRootId === rootId) {
        appendThreadMessage(msg);
      }
    };

    // Sync reaction updates that arrive via socket for any message in this thread
    const handleReactionUpdated = (payload: { messageId: string; reactions: ReactionView[] }) => {
      updateThreadMessageReactions(payload.messageId, payload.reactions);
    };

    socket.on("new_thread_message", handleNewThreadMessage);
    socket.on("reaction_updated", handleReactionUpdated);
    return () => {
      socket.off("new_thread_message", handleNewThreadMessage);
      socket.off("reaction_updated", handleReactionUpdated);
    };
  }, [socket, selectedMessage, appendThreadMessage, updateThreadMessageReactions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const getAvatarUrl = (sender: any) =>
    `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${sender?.avatar ?? "/uploads/avatar.png"}`;

  const getDisplayName = (sender: any) => sender?.dispname || "Slack_User";

  const handleReactionUpdate = (messageId: string, reactions: ReactionView[]) => {
    updateThreadMessageReactions(messageId, reactions);
    if (socket && channelId) {
      socket.emit("toggle_reaction", { channelId, messageId, reactions });
    }
  };

  const rootMsg = threadMessages[0] ?? selectedMessage;
  const replies = threadMessages.slice(1);

  return (
    <div className="w-full h-full bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 text-gray-600 shrink-0">
        <h2 className="text-xl font-bold">Thread</h2>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded-md"><FaRegWindowMaximize size={15} /></button>
          <button className="p-1 hover:bg-gray-100 rounded-md"><FaEllipsisH size={15} /></button>
          <button className="p-1 hover:bg-gray-100 rounded-md" onClick={onCloseThread}><FaTimes size={15} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading thread...
          </div>
        ) : (
          <>
            {rootMsg && (
              <SlackMessage
                state="thread"
                avatar={getAvatarUrl(rootMsg.sender)}
                username={getDisplayName(rootMsg.sender)}
                time={rootMsg.createdAt}
                text={rootMsg.content}
                files={[]}
                reactions={rootMsg.reactions ?? []}
                replies={0}
                lastReply=""
                messageId={rootMsg.id}
                channelId={channelId}
                currentUserId={userData?.id ?? null}
                onCommentClick={() => {}}
                onReactionUpdate={handleReactionUpdate}
              />
            )}

            {replies.length > 0 && (
              <div className="flex items-center w-full px-4 py-2">
                <span className="text-sm text-gray-500 mr-3 whitespace-nowrap">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {replies.map((reply) => (
              <SlackMessage
                key={reply.id}
                state="thread"
                avatar={getAvatarUrl(reply.sender)}
                username={getDisplayName(reply.sender)}
                time={reply.createdAt}
                text={reply.content}
                files={[]}
                reactions={reply.reactions ?? []}
                replies={0}
                lastReply=""
                messageId={reply.id}
                channelId={channelId}
                currentUserId={userData?.id ?? null}
                onCommentClick={() => {}}
                onReactionUpdate={handleReactionUpdate}
              />
            ))}

            {replies.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No replies yet. Be the first to reply.
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Reply editor */}
      <div className="shrink-0 px-3 pb-4 pt-2 border-t border-gray-100">
        <MessageEditor
          userData={userData}
          parentMessageId={selectedMessage?.id ?? null}
          placeholder="Reply in thread..."
        />
      </div>
    </div>
  );
};
