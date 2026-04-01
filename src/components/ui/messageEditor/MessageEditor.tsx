"use client";

import { useSocket } from "@/providers/SocketProvider";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Mic,
  Plus,
  Strikethrough,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { BsSlashSquare } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { IoCodeSlash } from "react-icons/io5";
import { SlEmotsmile } from "react-icons/sl";
import { VscListSelection } from "react-icons/vsc";
import EmojiPicker from "../emoji-picker/EmojiPicker";
import { useParams } from "next/navigation";

type MessageEditorProps = {
  userData: { id: string; [key: string]: any } | null;
  // When set, the editor operates in thread-reply mode
  parentMessageId?: string | null;
  // Override the placeholder text (e.g. "Reply in thread…")
  placeholder?: string;
  // Called after a message is successfully emitted, with the raw payload
  onMessageSent?: (payload: Record<string, unknown>) => void;
};

export default function MessageEditor({
  userData,
  parentMessageId,
  placeholder,
  onMessageSent,
}: MessageEditorProps) {
  const { socket } = useSocket();

  const params = useParams();
  // channelId from URL — used in channel mode; in thread mode it is passed via props
  // but the thread panel lives inside the same channel route so params still works.
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const handleSend = () => {
    // Common guards: need content, socket, channelId, and an authenticated user
    if (!editor || isEmpty || !socket || !channelId || !userData?.id) return;

    const content = editor.getHTML();

    if (parentMessageId) {
      // ── Thread reply mode ──────────────────────────────────────────────────
      // Guard: parentMessageId must be a non-empty string
      if (!parentMessageId.trim()) return;

      const payload = {
        channelId,
        senderId: userData.id,
        content,
        parentId: parentMessageId,
        createdAt: new Date(),
      };

      socket.emit("send_message", payload);
      onMessageSent?.(payload);
    } else {
      // ── Normal channel message mode ────────────────────────────────────────
      const payload = {
        channelId,
        senderId: userData.id,
        content,
        createdAt: new Date(),
      };

      socket.emit("send_message", payload);
      onMessageSent?.(payload);
    }

    editor.commands.clearContent();
  };

  const [showEmoji, setShowEmoji] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showFormat, setShowFormat] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? "Message #new-channel",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "text-blue-500 font-medium",
        },
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      setIsEmpty(text.length === 0);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // 🚫 stop newline
          handleSend();           // ✅ send message
          return true;
        }
        return false;
      },
    },
  });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file);

    // TODO: upload to server (S3, backend, etc.)
  };

  if (!editor) return null;

  return (
    <div className="border border-[#e0dada] w-full rounded-[10px] bg-white text-gray-700">
      {/* Toolbar */}

      {showFormat ? (
        <div className={`flex px-2.5 py-1.5 rounded-t-[10px] items-center gap-3 bg-[#f8f8f8] mb-1  
           ${isEmpty ? "text-gray-400" : "text-gray-800"} `}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={18} />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough size={18} />
          </button>

          <div className="w-px h-4 bg-gray-400 mx-1" />

          <button><Link size={18} /></button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={18} />
          </button>
          <div className="w-px h-4 bg-gray-400 mx-1" />
          <button >
            <VscListSelection size={18} />
          </button>
          <button onClick={() => editor.chain().focus().toggleCode().run()}>
            <IoCodeSlash size={18} />
          </button>
        </div>
      ) : (
        ""
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="
          min-h-[35px]
          max-h-[350px]
          overflow-y-auto
          px-2.5 py-1
          text-sm
          outline-none
          focus:outline-none
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:border-none"
      />

      {/* Bottom bar */}
      <div className="flex justify-between items-center p-2 text-gray-500 relative">
        <div className="flex gap-3">
          {/* Add file */}
          <button
            onClick={handleFileClick}
            className="cursor-pointer text-4xl hover:rotate-360 transition"
          >
            <Plus size={18} />
          </button>
          {/* Hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Toggle formating */}
          <button
            onClick={() => setShowFormat((prev) => !prev)}
            className="cursor-pointer"
          >
            <u >Aa</u>
          </button>

          {/* Emotion */}
          <button
            onClick={() => setShowEmoji((prev) => !prev)}
            className=" cursor-pointer"
          >
            <SlEmotsmile size={18} />
          </button>
          {showEmoji && (
            <EmojiPicker
              onSelect={(emoji) => {
                editor.chain().focus().insertContent(emoji).run();
                setShowEmoji(false);
              }}
            />
          )}

          {/* Choose members */}
          <button className=" cursor-pointer">@</button>|
          <button className=" cursor-pointer" >
            <Video size={18} />
          </button>
          <button className=" cursor-pointer" >
            <Mic size={18} />
          </button>|
          <button className=" cursor-pointer" >
            <BsSlashSquare size={18} />
          </button>
        </div>

        {/* Message send ✈*/}
        <button
          // disabled={isEmpty}
          className={`
                     flex items-center gap-1 px-2 rounded-md text-sm h-7 transition
                      ${isEmpty
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-green-700"
            }
                    `}
        >
          <IoMdSend size={18} onClick={() => handleSend()} /> | <span className="text-xs">▾</span>
        </button>

      </div>
    </div>
  );
}
