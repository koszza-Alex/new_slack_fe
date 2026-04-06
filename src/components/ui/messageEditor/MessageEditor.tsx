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
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsSlashSquare } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { IoCodeSlash } from "react-icons/io5";
import { SlEmotsmile } from "react-icons/sl";
import { VscListSelection } from "react-icons/vsc";
import EmojiPicker from "../emoji-picker/EmojiPicker";
import { useParams } from "next/navigation";

type MessageEditorProps = {
  userData: { id: string; [key: string]: any } | null;
  parentMessageId?: string | null;
  dmConversationId?: string | null;
  placeholder?: string;
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
  const workspaceId = Array.isArray(params.workspaceId)
    ? params.workspaceId[0]
    : params.workspaceId;

  const [showEmoji, setShowEmoji] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showFormat, setShowFormat] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string | null }[]>([]);

  // Emoji picker portal positioning
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e: MouseEvent) => {
      if (emojiBtnRef.current?.contains(e.target as Node)) return;
      setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const handleEmojiButtonClick = () => {
    if (!emojiBtnRef.current) return;
    const rect = emojiBtnRef.current.getBoundingClientRect();
    const pickerH = 400;
    const pickerW = 320;
    const gap = 8;

    // Prefer opening upward (above the toolbar)
    const top =
      rect.top - pickerH - gap >= 0
        ? rect.top - pickerH - gap
        : rect.bottom + gap;

    let left = rect.left;
    if (left + pickerW > window.innerWidth) {
      left = window.innerWidth - pickerW - gap;
    }
    if (left < gap) left = gap;

    setPickerStyle({ position: "fixed", top, left, zIndex: 9999 });
    setShowEmoji((v) => !v);
  };

  const handleSend = async () => {
    if (!editor || !socket || !userData?.id) return;
    if (isEmpty && selectedFiles.length === 0) return;

    if (dmConversationId) {
      const content = editor.getHTML();
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
            fileIds = (Array.isArray(data) ? data : data.files ?? []).map(
              (f: any) => f.id ?? f,
            );
          }
        } catch (err) {
          console.error("File upload failed:", err);
        }
        selectedFiles.forEach((e) => { if (e.preview) URL.revokeObjectURL(e.preview); });
        setSelectedFiles([]);
      }
      const payload: Record<string, unknown> = {
        conversationId: dmConversationId,
        senderId: userData.id,
        content,
        fileIds,
      };
      if (parentMessageId?.trim()) payload.parentId = parentMessageId;
      socket.emit("send_dm_message", payload);
      onMessageSent?.(payload);
      editor.commands.clearContent();
      return;
    }

    if (!channelId) return;
    const content = editor.getHTML();
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
          fileIds = (Array.isArray(data) ? data : data.files ?? []).map(
            (f: any) => f.id ?? f,
          );
        }
      } catch (err) {
        console.error("File upload failed:", err);
      }
      selectedFiles.forEach((e) => { if (e.preview) URL.revokeObjectURL(e.preview); });
      setSelectedFiles([]);
    }

    if (parentMessageId) {
      if (!parentMessageId.trim()) return;
      const payload = { channelId, senderId: userData.id, content, parentId: parentMessageId, fileIds, workspaceId, createdAt: new Date() };
      socket.emit("send_message", payload);
      onMessageSent?.(payload);
    } else {
      const payload = { channelId, senderId: userData.id, content, fileIds, workspaceId, createdAt: new Date() };
      socket.emit("send_message", payload);
      onMessageSent?.(payload);
    }
    editor.commands.clearContent();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? "Message #new-channel" }),
      Mention.configure({ HTMLAttributes: { class: "text-blue-500 font-medium" } }),
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

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setSelectedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      })),
    ]);
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
      {/* Formatting toolbar */}
      {showFormat && (
        <div className={`flex px-2.5 py-1.5 rounded-t-[10px] items-center gap-3 bg-[#f8f8f8] mb-1 ${isEmpty ? "text-gray-400" : "text-gray-800"}`}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={18} /></button>
          <div className="w-px h-4 bg-gray-400 mx-1" />
          <button><Link size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></button>
          <div className="w-px h-4 bg-gray-400 mx-1" />
          <button><VscListSelection size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleCode().run()}><IoCodeSlash size={18} /></button>
        </div>
      )}

      {/* Tiptap editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[35px] max-h-[350px] overflow-y-auto px-2.5 py-1 text-sm outline-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none"
      />

      {/* File preview strip */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2.5 py-2 border-t border-gray-100">
          {selectedFiles.map((entry, i) => (
            <div key={i} className="relative group w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              {entry.preview ? (
                <img src={entry.preview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[10px] text-center text-gray-500 px-1 break-all leading-tight">{entry.file.name}</div>
              )}
              <button
                onClick={() => removeFile(i)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom toolbar */}
      <div className="flex justify-between items-center p-2 text-gray-500">
        <div className="flex gap-3 items-center">
          <button onClick={handleFileClick} className="cursor-pointer hover:text-gray-700 transition">
            <Plus size={18} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />

          <button onClick={() => setShowFormat((v) => !v)} className="cursor-pointer">
            <u>Aa</u>
          </button>

          {/* Emoji button — picker rendered in a portal so it never affects layout */}
          <button
            ref={emojiBtnRef}
            onClick={handleEmojiButtonClick}
            className="cursor-pointer hover:text-gray-700 transition"
            aria-label="Insert emoji"
          >
            <SlEmotsmile size={18} />
          </button>

          <button className="cursor-pointer">@</button>
          <span>|</span>
          <button className="cursor-pointer"><Video size={18} /></button>
          <button className="cursor-pointer"><Mic size={18} /></button>
          <span>|</span>
          <button className="cursor-pointer"><BsSlashSquare size={18} /></button>
        </div>

        <button
          className={`flex items-center gap-1 px-2 rounded-md text-sm h-7 transition ${
            isEmpty && selectedFiles.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-green-700"
          }`}
          onClick={handleSend}
        >
          <IoMdSend size={18} /> | <span className="text-xs">▾</span>
        </button>
      </div>

      {/* Emoji picker — rendered in a portal so it floats outside the editor's layout flow */}
      {showEmoji && typeof document !== "undefined" &&
        createPortal(
          <div style={pickerStyle}>
            <EmojiPicker
              onSelect={(emoji) => {
                editor.chain().focus().insertContent(emoji).run();
                setShowEmoji(false);
              }}
            />
          </div>,
          document.body,
        )
      }
    </div>
  );
}
