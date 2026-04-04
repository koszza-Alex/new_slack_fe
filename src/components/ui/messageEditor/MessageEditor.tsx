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
  // When set, the editor operates in DM mode — emits send_dm_message instead of send_message
  dmConversationId?: string | null;
  // Override the placeholder text (e.g. "Reply in thread…")
  placeholder?: string;
  // Called after a message is successfully emitted, with the raw payload
  onMessageSent?: (payload: Record<string, unknown>) => void;
};

export default function MessageEditor({
  userData,
  parentMessageId,
  dmConversationId,
  placeholder,
  onMessageSent,
}: MessageEditorProps) {
  const { socket } = useSocket();

  const params = useParams();
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const handleSend = async () => {
    if (!editor || isEmpty || !socket || !userData?.id) return;

    // DM mode — requires dmConversationId, no channelId needed
    if (dmConversationId) {
      const content = editor.getHTML();
      const payload: Record<string, unknown> = {
        conversationId: dmConversationId,
        senderId: userData.id,
        content,
      };
      // Include parentId if this is a DM thread reply
      if (parentMessageId?.trim()) {
        payload.parentId = parentMessageId;
      }
      socket.emit("send_dm_message", payload);
      onMessageSent?.(payload);
      editor.commands.clearContent();
      return;
    }

    // Channel / thread mode — requires channelId
    if (!channelId) return;

    const content = editor.getHTML();

    // Upload any selected files first, collect returned file IDs
    let fileIds: string[] = [];
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((entry) => formData.append("files", entry.file));
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/files`,
          { method: "POST", body: formData },
        );
        if (res.ok) {
          const data = await res.json();
          // backend returns array of file objects or ids
          fileIds = (Array.isArray(data) ? data : data.files ?? []).map(
            (f: any) => f.id ?? f,
          );
        }
      } catch (err) {
        console.error("File upload failed:", err);
      }
      // clear previews
      selectedFiles.forEach((e) => { if (e.preview) URL.revokeObjectURL(e.preview); });
      setSelectedFiles([]);
    }

    if (parentMessageId) {
      if (!parentMessageId.trim()) return;
      const payload = {
        channelId,
        senderId: userData.id,
        content,
        parentId: parentMessageId,
        fileIds,
        createdAt: new Date(),
      };
      socket.emit("send_message", payload);
      onMessageSent?.(payload);
    } else {
      const payload = {
        channelId,
        senderId: userData.id,
        content,
        fileIds,
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
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string | null }[]>([]);

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
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const entries = files.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setSelectedFiles((prev) => [...prev, ...entries]);
    // reset input so the same file can be re-selected
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const entry = prev[index];
      if (entry.preview) URL.revokeObjectURL(entry.preview);
      return prev.filter((_, i) => i !== index);
    });
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

      {/* File preview strip */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2.5 py-2 border-t border-gray-100">
          {selectedFiles.map((entry, i) => (
            <div key={i} className="relative group w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              {entry.preview ? (
                <img src={entry.preview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[10px] text-center text-gray-500 px-1 break-all leading-tight">
                  {entry.file.name}
                </div>
              )}
              <button
                onClick={() => removeFile(i)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

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
            multiple
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
