"use client";

import { useSocket } from "@/providers/SocketProvider";
import { useThreadStore } from "@/store/thread-store";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaRegWindowMaximize, FaTimes } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
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
  const { selectedMessage, threadMessages, isLoading, appendThreadMessage } =
    useThreadStore();

  const [isEmpty, setIsEmpty] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Reply in thread..." }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.getText().trim().length === 0);
    },
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSend();
          return true;
        }
        return false;
      },
    },
  });

  // Listen for real-time thread replies from other users in this channel
  useEffect(() => {
    if (!socket || !selectedMessage) return;

    const handleNewThreadMessage = (msg: any) => {
      const rootId = selectedMessage.threadRootId ?? selectedMessage.id;
      if (msg.parentId === selectedMessage.id || msg.threadRootId === rootId) {
        appendThreadMessage(msg);
      }
    };

    socket.on("new_thread_message", handleNewThreadMessage);
    return () => {
      socket.off("new_thread_message", handleNewThreadMessage);
    };
  }, [socket, selectedMessage, appendThreadMessage]);

  // Auto-scroll to bottom when replies arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const handleSend = () => {
    // Guard: require editor content, socket, selected message, and authenticated user
    if (!editor || isEmpty || !socket || !selectedMessage || !userData?.id) return;

    socket.emit("send_message", {
      channelId,
      senderId: userData.id,
      content: editor.getHTML(),
      parentId: selectedMessage.id,
      createdAt: new Date(),
    });

    editor.commands.clearContent();
  };

  const getAvatarUrl = (sender: any) =>
    `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${
      sender?.avatar ?? "/uploads/avatar.png"
    }`;

  const getDisplayName = (sender: any) =>
    sender?.dispname || "Slack_User";

  // threadMessages[0] is always the root; rest are replies
  const rootMsg = threadMessages[0] ?? selectedMessage;
  const replies = threadMessages.slice(1);

  return (
    <div className="w-full h-full bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 text-gray-600 shrink-0">
        <h2 className="text-xl font-bold">Thread</h2>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <FaRegWindowMaximize size={15} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <FaEllipsisH size={15} />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded-md"
            onClick={onCloseThread}
          >
            <FaTimes size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading thread...
          </div>
        ) : (
          <>
            {/* Root (parent) message */}
            {rootMsg && (
              <SlackMessage
                state="thread"
                avatar={getAvatarUrl(rootMsg.sender)}
                username={getDisplayName(rootMsg.sender)}
                time={rootMsg.createdAt}
                text={rootMsg.content}
                files={[]}
                reactions={[]}
                replies={0}
                lastReply=""
                messageId={rootMsg.id}
                onCommentClick={() => {}}
              />
            )}

            {/* Reply count divider */}
            {replies.length > 0 && (
              <div className="flex items-center w-full px-4 py-2">
                <span className="text-sm text-gray-500 mr-3 whitespace-nowrap">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {/* Thread replies */}
            {replies.map((reply) => (
              <SlackMessage
                key={reply.id}
                state="thread"
                avatar={getAvatarUrl(reply.sender)}
                username={getDisplayName(reply.sender)}
                time={reply.createdAt}
                text={reply.content}
                files={[]}
                reactions={[]}
                replies={0}
                lastReply=""
                messageId={reply.id}
                onCommentClick={() => {}}
              />
            ))}

            {/* Empty state */}
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
        <div className="border border-gray-200 rounded-lg bg-white">
          <EditorContent
            editor={editor}
            className="min-h-[60px] max-h-[200px] overflow-y-auto px-3 py-2 text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none"
          />
          <div className="flex justify-end items-center px-2 pb-2">
            <button
              onClick={handleSend}
              disabled={isEmpty || !userData?.id}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition ${
                isEmpty || !userData?.id
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-800 text-white hover:bg-green-700"
              }`}
            >
              <IoMdSend size={16} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
