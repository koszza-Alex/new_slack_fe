"use client";

import { useSocket } from "@/providers/SocketProvider";
import { getDmCandidates, DmCandidate } from "@/lib/api/dm";
import { getAvatarUrl } from "@/lib/messageUtils";
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
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { BsSlashSquare } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { IoCodeSlash } from "react-icons/io5";
import { SlEmotsmile } from "react-icons/sl";
import { VscListSelection } from "react-icons/vsc";
import EmojiPicker from "../emoji-picker/EmojiPicker";
import MentionList, { MentionListHandle, MentionUser } from "./MentionList";
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

  // Workspace members — stored in state so socket updates trigger re-renders
  const [members, setMembers] = useState<DmCandidate[]>([]);
  // Keep a ref in sync for use inside Tiptap suggestion callbacks (closures)
  const membersRef = useRef<DmCandidate[]>([]);
  useEffect(() => { membersRef.current = members; }, [members]);

  // Mention popup state (rendered via portal)
  const [mentionPopup, setMentionPopup] = useState<{
    items: MentionUser[];
    command: (attrs: { id: string; label: string; email: string; avatar: string }) => void;
    rect: DOMRect;
  } | null>(null);
  const mentionListRef = useRef<MentionListHandle>(null);

  // ── Load workspace members ────────────────────────────────────────────────
  useEffect(() => {
    if (!workspaceId || !userData?.id) return;
    getDmCandidates(workspaceId, userData.id)
      .then((candidates) => setMembers(candidates))
      .catch(() => { /* non-critical */ });
  }, [workspaceId, userData?.id]);

  // ── Real-time avatar / profile updates ───────────────────────────────────
  // When any workspace member changes their avatar, update the members list
  // immediately so the next popup open (and any currently-open popup) shows
  // the fresh avatar.
  useEffect(() => {
    if (!socket) return;

    const handleProfileUpdated = (payload: {
      id?: string;
      userId?: string;
      dispname?: string;
      avatar?: string;
    }) => {
      const updatedId = payload.id ?? payload.userId;
      if (!updatedId) return;

      setMembers((prev) =>
        prev.map((m) =>
          m.id === updatedId
            ? {
                ...m,
                dispname: payload.dispname ?? m.dispname,
                avatar: payload.avatar ?? m.avatar,
              }
            : m,
        ),
      );
    };

    socket.on("updated_profile", handleProfileUpdated);
    socket.on("profile:updated", handleProfileUpdated);

    return () => {
      socket.off("updated_profile", handleProfileUpdated);
      socket.off("profile:updated", handleProfileUpdated);
    };
  }, [socket]);

  // ── Close emoji picker on outside click ──────────────────────────────────
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
    const top =
      rect.top - pickerH - gap >= 0
        ? rect.top - pickerH - gap
        : rect.bottom + gap;
    let left = rect.left;
    if (left + pickerW > window.innerWidth) left = window.innerWidth - pickerW - gap;
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
              (f: { id?: string } & Record<string, unknown>) => f.id ?? f,
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
        workspaceId,
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
            (f: { id?: string } & Record<string, unknown>) => f.id ?? f,
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

  // ── Build MentionUser list from current members state ────────────────────
  // Converts server-relative avatar paths to full URLs using getAvatarUrl,
  // which prepends NEXT_PUBLIC_SOCKET_URL — the same pattern used everywhere
  // else in the app (MessageUtils, ThreadPage, DmPage, etc.)
  const toMentionUsers = useCallback(
    (candidates: DmCandidate[]): MentionUser[] =>
      candidates.map((m) => ({
        id: m.id,
        dispname: m.dispname,
        email: m.email,
        // getAvatarUrl handles null/undefined and prepends the backend base URL
        avatar: getAvatarUrl(m.avatar),
      })),
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? "Message #new-channel" }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        renderHTML({ options, node }) {
          return [
            "span",
            {
              ...options.HTMLAttributes,
              "data-id": node.attrs.id,
              "data-label": node.attrs.label,
              ...(node.attrs.email ? { "data-email": node.attrs.email } : {}),
              ...(node.attrs.avatar ? { "data-avatar": node.attrs.avatar } : {}),
            },
            `@${node.attrs.label}`,
          ];
        },
        suggestion: {
          items: ({ query }: { query: string }) => {
            const q = query.toLowerCase();
            return toMentionUsers(
              membersRef.current.filter((m) =>
                (m.dispname ?? m.email).toLowerCase().includes(q),
              ).slice(0, 8),
            );
          },
          render: () => ({
            onStart: (props: {
              items: MentionUser[];
              command: (attrs: { id: string; label: string; email: string; avatar: string }) => void;
              clientRect?: (() => DOMRect | null) | null;
            }) => {
              const rect = props.clientRect?.();
              if (!rect) return;
              setMentionPopup({ items: props.items, command: props.command, rect });
            },
            onUpdate: (props: {
              items: MentionUser[];
              command: (attrs: { id: string; label: string; email: string; avatar: string }) => void;
              clientRect?: (() => DOMRect | null) | null;
            }) => {
              const rect = props.clientRect?.();
              if (!rect) return;
              setMentionPopup({ items: props.items, command: props.command, rect });
            },
            onKeyDown: (props: { event: KeyboardEvent }) => {
              if (props.event.key === "Escape") {
                setMentionPopup(null);
                return true;
              }
              return mentionListRef.current?.onKeyDown(props) ?? false;
            },
            onExit: () => setMentionPopup(null),
          }),
        },
      }),
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

  // When members state updates while the popup is open, refresh popup items
  // so the avatar change is immediately visible without closing/reopening.
  useEffect(() => {
    if (!mentionPopup) return;
    setMentionPopup((prev) => {
      if (!prev) return null;
      const q = ""; // keep showing all currently-filtered items; Tiptap will re-filter on next keystroke
      const refreshed = toMentionUsers(membersRef.current).slice(0, 8);
      return { ...prev, items: refreshed };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  /** Insert @ to trigger the mention suggestion popup */
  const handleMentionButtonClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent("@").run();
  }, [editor]);

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

  // ── Mention popup position: 15px above the @ caret ───────────────────────
  // rect is the DOMRect of the @ character from Tiptap's clientRect callback.
  // We place the popup so its bottom edge is 15px above rect.top.
  // If there isn't enough space above, fall back to below the caret.
  const mentionPopupStyle: React.CSSProperties = mentionPopup
    ? (() => {
        const { rect } = mentionPopup;
        const POPUP_OFFSET = 15; // required: 15px above the @ location
        const popupH = 240;
        const popupW = 220;
        const margin = 4; // minimum screen edge margin

        // Bottom edge of popup = rect.top - POPUP_OFFSET
        // So top of popup = rect.top - POPUP_OFFSET - popupH
        const preferredTop = rect.top - POPUP_OFFSET - popupH;

        let top: number;
        if (preferredTop >= margin) {
          // Enough space above — use the 15px-above position
          top = preferredTop;
        } else if (window.innerHeight - rect.bottom - POPUP_OFFSET >= popupH) {
          // Not enough space above — fall back to below
          top = rect.bottom + POPUP_OFFSET;
        } else {
          // Neither — clamp to top of viewport
          top = margin;
        }

        let left = rect.left;
        if (left + popupW > window.innerWidth - margin) left = window.innerWidth - popupW - margin;
        if (left < margin) left = margin;

        return { position: "fixed", top, left, zIndex: 9999 };
      })()
    : {};

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
                <img src={entry.preview} className="w-full h-full object-cover" alt="preview" />
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

          {/* Emoji button */}
          <button
            ref={emojiBtnRef}
            onClick={handleEmojiButtonClick}
            className="cursor-pointer hover:text-gray-700 transition"
            aria-label="Insert emoji"
          >
            <SlEmotsmile size={18} />
          </button>

          {/* @ mention button — inserts @ at cursor to trigger suggestion */}
          <button
            onClick={handleMentionButtonClick}
            className="cursor-pointer hover:text-gray-700 transition font-medium"
            aria-label="Mention a user"
          >
            @
          </button>
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

      {/* Emoji picker portal */}
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

      {/* Mention suggestion popup — 15px above the @ caret */}
      {mentionPopup && typeof document !== "undefined" &&
        createPortal(
          <div style={mentionPopupStyle}>
            <MentionList
              ref={mentionListRef}
              items={mentionPopup.items}
              command={mentionPopup.command}
            />
          </div>,
          document.body,
        )
      }
    </div>
  );
}
