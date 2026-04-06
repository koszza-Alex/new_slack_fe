"use client";

import { useSocket } from "@/providers/SocketProvider";
import { useThreadStore } from "@/store/thread-store";
import { ReactionView } from "@/lib/api/reactions";
import { toggleDmReaction } from "@/lib/api/dm";
import MessageEditor from "@/components/ui/messageEditor/MessageEditor";
import { useEffect, useRef } from "react";
import { FaEllipsisH, FaRegWindowMaximize, FaTimes } from "react-icons/fa";
import SlackMessage from "../ui/message/Message";
interface UserData {
  id: string;
  dispname?: string | null;
  avatar?: string | null;
}

interface ThreadProps {
  onCloseThread: () => void;
  userData: UserData | null;
  /** Set when the thread belongs to a channel conversation */
  channelId?: string;
  /** Set when the thread belongs to a DM conversation */
  dmConversationId?: string;
  /** Required in DM mode to call the DM reaction endpoint */
  workspaceId?: string;
  /** DM-specific edit override — returns updatedAt on success */
  onDmEditSave?: (messageId: string, content: string) => Promise<string>;
  /** DM-specific delete override */
  onDmDeleteConfirm?: (messageId: string) => Promise<any>;
}

export const Thread: React.FC<ThreadProps> = ({
  onCloseThread,
  userData,
  channelId,
  dmConversationId,
  workspaceId,
  onDmEditSave,
  onDmDeleteConfirm,
}) => {
  const { socket } = useSocket();
  const {
    selectedMessage,
    threadMessages,
    isLoading,
    appendThreadMessage,
    updateThreadMessageReactions,
    updateThreadMessageContent,
    removeThreadMessage,
    updateRootMessage,
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

    const handleReactionUpdated = (payload: { messageId: string; reactions: ReactionView[] }) => {
      updateThreadMessageReactions(payload.messageId, payload.reactions);
    };

    const handleMessageEdited = (payload: { messageId: string; content: string; updatedAt: string }) => {
      updateThreadMessageContent(payload.messageId, payload.content, payload.updatedAt);
    };

    const handleMessageDeleted = (payload: { messageId: string }) => {
      removeThreadMessage(payload.messageId);
    };

    const threadEvent = dmConversationId ? "new_dm_thread_message" : "new_thread_message";
    const reactionEvent = dmConversationId ? "dm_reaction_updated" : "reaction_updated";
    const editEvent = dmConversationId ? "dmMessageEdited" : "messageEdited";
    const deleteEvent = dmConversationId ? "dmMessageDeleted" : "messageDeleted";

    socket.on(threadEvent, handleNewThreadMessage);
    socket.on(reactionEvent, handleReactionUpdated);
    socket.on(editEvent, handleMessageEdited);
    socket.on(deleteEvent, handleMessageDeleted);
    return () => {
      socket.off(threadEvent, handleNewThreadMessage);
      socket.off(reactionEvent, handleReactionUpdated);
      socket.off(editEvent, handleMessageEdited);
      socket.off(deleteEvent, handleMessageDeleted);
    };
  }, [socket, selectedMessage, dmConversationId, appendThreadMessage, updateThreadMessageReactions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const getAvatarUrl = (sender: any) =>
    `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${sender?.avatar ?? "/uploads/avatar.png"}`;

  const getDisplayName = (sender: any) => sender?.dispname || "Slack_User";

  // Channel reaction handler — used when channelId is set
  const handleChannelReactionUpdate = (messageId: string, reactions: ReactionView[], messageOwnerId?: string, emoji?: string) => {
    updateThreadMessageReactions(messageId, reactions);
    if (socket && channelId) {
      socket.emit("toggle_reaction", { channelId, messageId, reactions, messageOwnerId, emoji });
    }
  };

  // DM reaction handler — called from onDmReactionSelect in SlackMessage
  const handleDmReactionSelect = async (messageId: string, emoji: string) => {
    if (!userData?.id || !workspaceId || !dmConversationId) return;
    try {
      const result = await toggleDmReaction(workspaceId, dmConversationId, messageId, emoji, userData.id);
      updateThreadMessageReactions(messageId, result.reactions);
      socket?.emit("toggle_dm_reaction", {
        conversationId: dmConversationId,
        messageId,
        reactions: result.reactions,
      });
    } catch (err) {
      console.error("Failed to toggle DM thread reaction:", err);
    }
  };

  const handleThreadMessageUpdate = (messageId: string, newContent: string, newUpdatedAt: string) => {
    updateThreadMessageContent(messageId, newContent, newUpdatedAt);
    // Broadcast to other subscribers
    if (socket) {
      if (dmConversationId) {
        socket.emit('dm_message_edit', { conversationId: dmConversationId, messageId, content: newContent, updatedAt: newUpdatedAt });
      } else if (channelId) {
        socket.emit('message_edit', { channelId, messageId, content: newContent, updatedAt: newUpdatedAt });
      }
    }
  };

  const handleThreadMessageDelete = (messageId: string, updatedRoot?: any) => {
    removeThreadMessage(messageId);
    // Broadcast to other subscribers, including updatedRoot so they refresh replyCount
    if (socket) {
      if (dmConversationId) {
        socket.emit('dm_message_delete', { conversationId: dmConversationId, messageId, updatedRoot });
      } else if (channelId) {
        socket.emit('message_delete', { channelId, messageId, updatedRoot });
      }
    }
    // Update the root message replyCount locally if this was a reply
    if (updatedRoot) {
      updateRootMessage(updatedRoot);
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
                createdAt={rootMsg.createdAt}
                updatedAt={rootMsg.updatedAt}
                text={rootMsg.content}
                files={rootMsg.files ?? []}
                reactions={rootMsg.reactions ?? []}
                replies={0}
                lastReply=""
                messageId={rootMsg.id}
                channelId={channelId ?? ""}
                currentUserId={userData?.id ?? null}
                senderId={rootMsg.sender?.id}
                onCommentClick={() => {}}
                onReactionUpdate={handleChannelReactionUpdate}
                onDmReactionSelect={dmConversationId
                  ? (emoji) => handleDmReactionSelect(rootMsg.id, emoji)
                  : undefined}
                onMessageUpdate={handleThreadMessageUpdate}
                onMessageDelete={handleThreadMessageDelete}
                onEditSave={onDmEditSave}
                onDeleteConfirm={onDmDeleteConfirm}
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
                createdAt={reply.createdAt}
                updatedAt={reply.updatedAt}
                text={reply.content}
                files={reply.files ?? []}
                reactions={reply.reactions ?? []}
                replies={0}
                lastReply=""
                messageId={reply.id}
                channelId={channelId ?? ""}
                currentUserId={userData?.id ?? null}
                senderId={reply.sender?.id}
                onCommentClick={() => {}}
                onReactionUpdate={handleChannelReactionUpdate}
                onDmReactionSelect={dmConversationId
                  ? (emoji) => handleDmReactionSelect(reply.id, emoji)
                  : undefined}
                onMessageUpdate={handleThreadMessageUpdate}
                onMessageDelete={handleThreadMessageDelete}
                onEditSave={onDmEditSave}
                onDeleteConfirm={onDmDeleteConfirm}
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
          dmConversationId={dmConversationId ?? null}
          placeholder="Reply in thread..."
        />
      </div>
    </div>
  );
};
