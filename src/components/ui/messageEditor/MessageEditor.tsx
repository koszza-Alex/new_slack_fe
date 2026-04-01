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
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { BsSlashSquare } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { IoCodeSlash } from "react-icons/io5";
import { SlEmotsmile } from "react-icons/sl";
import { VscListSelection } from "react-icons/vsc";
import EmojiPicker from "../emoji-picker/EmojiPicker";

export default function MessageEditor(props: { userData: any }) {
  const { socket } = useSocket();

  const params = useParams();
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const [showEmoji, setShowEmoji] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showFormat, setShowFormat] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ file: File; url: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleSendRef = useRef<() => void>(() => {});

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Message #new-channel" }),
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
          handleSendRef.current();
          return true;
        }
        return false;
      },
    },
  });

  const handleSend = () => {
    if (!editor || isEmpty || !socket) return;
    socket.emit("send_message", {
      channelId,
      senderId: props.userData.id,
      content: editor.getHTML(),
      createdAt: new Date(),
    });
    editor.commands.clearContent();
  };

  // Keep the ref in sync with the latest handleSend
  handleSendRef.current = handleSend;

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedFile({ file, url });
  };

  if (!editor) return null;

  return (
    <div className="border border-[#e0dada] w-full rounded-[10px] bg-white text-gray-700">
      {/* Toolbar */}
      {showFormat && (
        <div className={`flex px-2.5 py-1.5 rounded-t-[10px] items-center gap-3 bg-[#f8f8f8] mb-1 ${isEmpty ? "text-gray-400" : "text-gray-800"}`}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></button>
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

      {/* File preview */}
      {selectedFile && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
          {selectedFile.file.type.startsWith("image/") ? (
            <img
              src={selectedFile.url}
              alt={selectedFile.file.name}
              className="h-16 w-16 object-cover rounded"
            />
          ) : (
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700">
              <span>📄</span>
              <span className="max-w-[200px] truncate">{selectedFile.file.name}</span>
            </div>
          )}
          <button
            onClick={() => setSelectedFile(null)}
            className="text-gray-400 hover:text-red-500 text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[35px] max-h-[350px] overflow-y-auto px-2.5 py-1 text-sm outline-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none"
      />

      {/* Bottom bar */}
      <div className="flex justify-between items-center p-2 text-gray-500 relative">
        <div className="flex gap-3">
          <button onClick={handleFileClick} className="cursor-pointer hover:rotate-360 transition">
            <Plus size={18} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

          <button onClick={() => setShowFormat((prev) => !prev)} className="cursor-pointer">
            <u>Aa</u>
          </button>

          <button onClick={() => setShowEmoji((prev) => !prev)} className="cursor-pointer">
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

          <button className="cursor-pointer">@</button>|
          <button className="cursor-pointer"><Video size={18} /></button>
          <button className="cursor-pointer"><Mic size={18} /></button>|
          <button className="cursor-pointer"><BsSlashSquare size={18} /></button>
        </div>

        <button
          className={`flex items-center gap-1 px-2 rounded-md text-sm h-7 transition ${
            isEmpty
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-green-700"
          }`}
        >
          <IoMdSend size={18} onClick={handleSend} /> | <span className="text-xs">▾</span>
        </button>
      </div>
    </div>
  );
}
