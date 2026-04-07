"use client";

import { toggleReaction, ReactionView } from '@/lib/api/reactions';
import { renderMentions } from '@/lib/renderMentions';
import DOMPurify from 'dompurify';
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import MentionProfileTooltip, { MentionProfile } from "@/components/ui/messageEditor/MentionProfileTooltip";
import {
  FaEllipsisV,
  FaRegBookmark,
  FaRegCommentDots,
  FaRegShareSquare,
} from "react-icons/fa";
import { LuSmilePlus } from "react-icons/lu";
import { PiListStarBold } from "react-icons/pi";

/** Stable keys for the three custom image-based emoticons */
const IMAGE_EMOTICONS: Record<string, string> = {
  tick: "/emoticons/tick.png",
  eye: "/emoticons/eye.png",
  welcome: "/emoticons/welcome.png",
};

const EmojiPicker = dynamic(() => import("../emoji-picker/EmojiPicker"), { ssr: false });

interface FileItem {
  name: string;
  type: string;
  /** Server path — e.g. /uploads/uuid.png */
  path?: string;
}

interface SlackMessageProps {
  id?: string;
  state: string;
  avatar: string;
  username: string;
  time: string;
  /** ISO string — used with createdAt to detect edited state */
  updatedAt?: string;
  /** ISO string — used with updatedAt to detect edited state */
  createdAt?: string;
  text: string;
  files: FileItem[];
  reactions: ReactionView[];
  replies: number;
  lastReply: string;
  messageId: string;
  channelId: string;
  currentUserId: string | null;
  /** The id of the user who sent this message — used to gate the action menu */
  senderId?: string;
  onCommentClick: () => void;
  onReactionUpdate: (messageId: string, reactions: ReactionView[], messageOwnerId?: string, emoji?: string) => void;
  /** Called after a successful edit so the parent can update its list */
  onMessageUpdate?: (messageId: string, newContent: string, updatedAt: string) => void;
  /** Called after a successful delete so the parent can remove it from its list */
  onMessageDelete?: (messageId: string, updatedRoot?: any) => void;
  /**
   * When provided, replaces the internal channel PATCH fetch for edit.
   * Used in DM context where the endpoint is different.
   * Must return the updatedAt ISO string on success, or throw on failure.
   */
  onEditSave?: (messageId: string, content: string) => Promise<string>;
  /**
   * When provided, replaces the internal channel DELETE fetch.
   * Used in DM context where the endpoint is different.
   * May return an updatedRoot object if the deleted message was a thread reply.
   */
  onDeleteConfirm?: (messageId: string) => Promise<any>;
  /** Hide the thread/reply button — used in DM mode where threads don't apply */
  hideThreadButton?: boolean;
  /**
   * When set, emoji selection calls this instead of the channel toggleReaction API.
   * Used in DM mode where reactions go through a different endpoint.
   */
  onDmReactionSelect?: (emoji: string) => void;
}

export const SlackMessage: React.FC<SlackMessageProps> = ({
  id,
  state,
  avatar,
  username,
  time,
  updatedAt,
  createdAt,
  text,
  files,
  reactions,
  replies,
  lastReply,
  messageId,
  channelId,
  currentUserId,
  senderId,
  onCommentClick,
  onReactionUpdate,
  onMessageUpdate,
  onMessageDelete,
  onEditSave,
  onDeleteConfirm,
  hideThreadButton = false,
  onDmReactionSelect,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showFiles, setShowFiles] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const [downloadTxt, setDownloadTxt] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Mention profile tooltip
  const [mentionProfile, setMentionProfile] = useState<MentionProfile | null>(null);
  const [mentionTooltipPos, setMentionTooltipPos] = useState({ top: 0, left: 0 });
  /** URL of the image currently shown in the lightbox modal (null = closed) */
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Action menu (Edit / Delete) — only for own messages
  const [showActionMenu, setShowActionMenu] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(text);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);

  // Whether the current user is the sender of this message
  const isOwnMessage = !!currentUserId && !!senderId && currentUserId === senderId;

  // Whether this message has been edited (updatedAt meaningfully later than createdAt)
  const isEdited = !!updatedAt && !!createdAt &&
    new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 2000;

  /** Strip HTML tags to get plain text for the edit textarea */
  const toPlainText = (html: string): string => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent ?? div.innerText ?? "";
  };

  // Close action menu on outside click
  useEffect(() => {
    if (!showActionMenu) return;
    const handler = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setShowActionMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActionMenu]);

  const handleEmojiSelect = async (emoji: string) => {
    if (!messageId || !emoji || !currentUserId) return;
    if (isPending) return;

    setShowEmoji(false);

    // DM mode — delegate to parent handler which calls the DM reaction endpoint
    if (onDmReactionSelect) {
      onDmReactionSelect(emoji);
      return;
    }

    // Channel mode — requires channelId
    if (!channelId) return;

    setIsPending(true);
    try {
      const result = await toggleReaction(channelId, messageId, emoji, currentUserId);
      onReactionUpdate(result.messageId, result.reactions, senderId, emoji);
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleEmojiClick = () => {
    if (!emojiBtnRef.current) return;

    const rect = emojiBtnRef.current.getBoundingClientRect();
    const pickerWidth = 320;
    const pickerHeight = 400;
    const offset = 8;

    let top: number;
    let left = rect.left;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow >= pickerHeight + offset) {
      top = rect.bottom + offset;
    } else if (spaceAbove >= pickerHeight + offset) {
      top = rect.top - pickerHeight - offset - 34;
    } else {
      top = Math.max(offset, window.innerHeight - pickerHeight - offset);
    }

    if (window.innerWidth - rect.left < pickerWidth) {
      left = rect.right - pickerWidth;
    }
    if (left < offset) left = offset;

    setPickerStyle({ position: "fixed", top: `${top}px`, left: `${left}px`, zIndex: 9999 });
    setShowEmoji((v) => !v);
  };

  const handleEditSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || !messageId) return;
    setIsSavingEdit(true);
    try {
      let newUpdatedAt: string;
      if (onEditSave) {
        // DM (or other) context provides its own fetch
        newUpdatedAt = await onEditSave(messageId, trimmed);
      } else {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/channels/${channelId}/messages/${messageId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ content: trimmed, senderId: currentUserId }),
          },
        );
        if (!res.ok) throw new Error("Failed to update message");
        const data = await res.json();
        newUpdatedAt = data?.updatedAt ?? new Date().toISOString();
      }
      onMessageUpdate?.(messageId, trimmed, newUpdatedAt);
      setIsEditing(false);
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!messageId) return;
    setShowActionMenu(false);
    try {
      let updatedRoot: any = undefined;
      if (onDeleteConfirm) {
        const result = await onDeleteConfirm(messageId);
        updatedRoot = result?.updatedRoot ?? undefined;
      } else {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/channels/${channelId}/messages/${messageId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ senderId: currentUserId }),
          },
        );
        if (!res.ok) throw new Error("Failed to delete message");
        const data = await res.json();
        updatedRoot = data?.updatedRoot ?? undefined;
      }
      onMessageDelete?.(messageId, updatedRoot);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const isImage = (type: string) =>
    ["png", "jpg", "jpeg", "gif", "webp"].includes(type.toLowerCase());

  /** Handle clicks on @mention spans rendered inside message HTML */
  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const mentionEl = target.closest(".mention") as HTMLElement | null;
    if (!mentionEl) return;
    const id = mentionEl.getAttribute("data-id");
    const label = mentionEl.getAttribute("data-label");
    if (!id || !label) return;

    const rect = mentionEl.getBoundingClientRect();
    const tooltipW = 256;
    const tooltipH = 80;
    const gap = 6;
    let top = rect.bottom + gap;
    let left = rect.left;
    if (top + tooltipH > window.innerHeight) top = rect.top - tooltipH - gap;
    if (left + tooltipW > window.innerWidth) left = window.innerWidth - tooltipW - gap;
    if (left < gap) left = gap;

    // Build a minimal profile from what we have in the DOM; avatar falls back to default
    setMentionTooltipPos({ top, left });
    setMentionProfile({
      id,
      dispname: label,
      email: mentionEl.getAttribute("data-email") ?? label,
      avatar: mentionEl.getAttribute("data-avatar") ?? "/uploads/avatar.png",
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date
      .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      .replace(":", ".");
  };

  return (
    <div
      id={id}
      className="relative flex gap-3 px-[25px] py-2 bg-white text-gray-500 hover:bg-gray-100 w-full"
      onMouseOver={() => setShowToolbar(true)}
      onMouseLeave={() => {
        setShowToolbar(false);
        setShowEmoji(false);
      }}
    >
      {/* Hover toolbar */}
      {state !== "search" && showToolbar && (
        <div className="absolute right-4 top-[-20px] flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-1 z-11">
          <img src="/emoticons/tick.png" className="p-1 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleEmojiSelect("tick")} />
          <img src="/emoticons/eye.png" className="p-1 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleEmojiSelect("eye")} />
          <img src="/emoticons/welcome.png" className="p-1 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleEmojiSelect("welcome")} />

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            ref={emojiBtnRef}
            className="p-1.5 rounded-md hover:bg-gray-100"
            onClick={handleEmojiClick}
            disabled={isPending}
          >
            <LuSmilePlus />
          </button>

          {state === "message" && !hideThreadButton && (
            <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100" onClick={onCommentClick}>
              <FaRegCommentDots />
            </button>
          )}

          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <FaRegShareSquare />
          </button>
          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <FaRegBookmark />
          </button>
          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <PiListStarBold />
          </button>

          {/* FaEllipsisV — opens action menu only for own messages */}
          <div className="relative" ref={isOwnMessage ? actionMenuRef : undefined}>
            <button
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={() => {
                if (!isOwnMessage) return;
                setShowActionMenu((v) => !v);
              }}
            >
              <FaEllipsisV />
            </button>

            {isOwnMessage && showActionMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setEditContent(toPlainText(text));
                    setIsEditing(true);
                    setShowActionMenu(false);
                  }}
                >
                  Edit message
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  Delete message
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Avatar */}
      <img src={avatar} className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center" />

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 hover:underline cursor-pointer">{username}</span>
          <span className="text-sm text-gray-500">{formatTime(time)}</span>
          {isEdited && <span className="text-xs text-gray-400 italic">(edited)</span>}
        </div>

        {/* Inline edit mode */}
        {isEditing ? (
          <div className="mt-1">
            <textarea
              className="w-full border border-blue-400 rounded-md px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSave(); }
                if (e.key === "Escape") { setIsEditing(false); setEditContent(text); }
              }}
              autoFocus
            />
            <div className="flex gap-2 mt-1">
              <button
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleEditSave}
                disabled={isSavingEdit || !editContent.trim()}
              >
                {isSavingEdit ? "Saving…" : "Save"}
              </button>
              <button
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                onClick={() => { setIsEditing(false); setEditContent(text); }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-gray-800 mt-1"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                renderMentions(text, currentUserId),
                { ADD_ATTR: ["data-id", "data-label", "data-email", "data-avatar"] },
              ),
            }}
            onClick={handleMessageClick}
          />
        )}

        {state !== "search" && (
          <div>
            {/* Files */}
            {files && files.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <span className="cursor-pointer flex items-center gap-1" onClick={() => setShowFiles(!showFiles)}>
                    {files.length} {files.length === 1 ? "file" : "files"} {showFiles ? "▲" : "▼"}
                  </span>
                  <a
                    className="relative group cursor-pointer hover:underline"
                    onMouseOver={() => setDownloadTxt(`${files.length} files available to download`)}
                    onMouseLeave={() => setDownloadTxt('')}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      files.forEach((file) => {
                        const url = file.path
                          ? `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${file.path}`
                          : `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}/${file.name}`;
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = file.name;
                        a.target = "_blank";
                        a.click();
                      });
                    }}
                  >
                    Download all
                    {downloadTxt && (
                      <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {downloadTxt}
                      </span>
                    )}
                  </a>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${showFiles ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                  <div className="flex gap-3 flex-wrap">
                    {files.map((file, i) => {
                      const fileUrl = file.path
                        ? `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}${file.path}`
                        : `${process.env.NEXT_PUBLIC_SOCKET_URL ?? ""}/${file.name}`;
                      const img = isImage(file.type);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm w-[220px] hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => img ? setLightboxUrl(fileUrl) : undefined}
                        >
                          {/* Thumbnail / icon */}
                          <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center text-sm text-white shrink-0 overflow-hidden">
                            {img ? (
                              <img src={fileUrl} alt={file.name} className="w-10 h-10 object-cover rounded-xl" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-semibold uppercase">
                                {(file.type ?? "?").charAt(0)}
                              </div>
                            )}
                          </div>
                          {/* Name + type */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-bold text-gray-900 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">{file.type}</span>
                          </div>
                          {/* Download button — always visible */}
                          <a
                            href={fileUrl}
                            download={file.name}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
                            title="Download"
                          >
                            ↓
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reactions */}
            {reactions && reactions.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap items-center">
                {reactions.map((r) => {
                  const userReacted = !!currentUserId && r.reactedUserIds.includes(currentUserId);

                  // Build tooltip: "You", "alice@example.com", "You, bob@example.com", etc.
                  const tooltipLabel = (() => {
                    const users = r.reactedUsers ?? [];
                    if (users.length === 0) {
                      // Fallback when reactedUsers isn't populated yet
                      return userReacted ? "You" : `${r.count} ${r.count === 1 ? "person" : "people"}`;
                    }
                    return users
                      .map((u) => u.id === currentUserId ? "You" : (u.email ?? u.dispname ?? "Unknown"))
                      .join(", ");
                  })();

                  return (
                    <div key={r.emoji} className="relative group">
                      <button
                        onClick={() => handleEmojiSelect(r.emoji)}
                        disabled={isPending}                        className={`flex items-center gap-1 px-2 py-[3px] rounded-full text-xs border ${
                          userReacted ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-blue-50 border-blue-300 text-gray-600"
                        }`}
                      >
                        {IMAGE_EMOTICONS[r.emoji] ? (
                          <img src={IMAGE_EMOTICONS[r.emoji]} alt={r.emoji} className="w-4 h-4 object-contain" />
                        ) : (
                          <span>{r.emoji}</span>
                        )}
                        <span className="font-bold">{r.count}</span>
                      </button>
                      {/* Tooltip — shown on hover via CSS */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex">
                        <span className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                          {tooltipLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Replies */}
            {replies > 0 && state === "message" && !hideThreadButton && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <img src="/avatar.png" className="w-[25px] h-[25px] rounded-lg bg-yellow-100" />
                <span className="text-blue-600 cursor-pointer hover:underline" onClick={onCommentClick}>
                  {replies} {replies === 1 ? "reply" : "replies"}
                </span>
                {lastReply && <span>Last reply {lastReply}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {showEmoji && (
        <div style={pickerStyle}>
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>
      )}

      {/* Image lightbox modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxUrl}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg hover:bg-black/80 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mention profile tooltip */}
      {mentionProfile && (
        <MentionProfileTooltip
          profile={mentionProfile}
          position={mentionTooltipPos}
          onClose={() => setMentionProfile(null)}
        />
      )}
    </div>
  );
};

export default SlackMessage;
