"use client";

import { toggleReaction, ReactionView } from '@/lib/api/reactions';
import DOMPurify from 'dompurify';
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import {
  FaEllipsisV,
  FaRegBookmark,
  FaRegCommentDots,
  FaRegShareSquare,
} from "react-icons/fa";
import { LuSmilePlus } from "react-icons/lu";
import { PiListStarBold } from "react-icons/pi";

const EmojiPicker = dynamic(() => import("../emoji-picker/EmojiPicker"), { ssr: false });

interface FileItem {
  name: string;
  type: string;
}

interface SlackMessageProps {
  state: string;
  avatar: string;
  username: string;
  time: string;
  text: string;
  files: FileItem[];
  reactions: ReactionView[];
  replies: number;
  lastReply: string;
  messageId: string;
  channelId: string;
  currentUserId: string | null;
  onCommentClick: () => void;
  onReactionUpdate: (messageId: string, reactions: ReactionView[]) => void;
}

export const SlackMessage: React.FC<SlackMessageProps> = ({
  state,
  avatar,
  username,
  time,
  text,
  files,
  reactions,
  replies,
  lastReply,
  messageId,
  channelId,
  currentUserId,
  onCommentClick,
  onReactionUpdate,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showFiles, setShowFiles] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const [downloadTxt, setDownloadTxt] = useState('');
  const [isPending, setIsPending] = useState(false);

  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleEmojiSelect = async (emoji: string) => {
    if (!messageId || !emoji || !currentUserId || !channelId) return;
    if (isPending) return;

    setShowEmoji(false);
    setIsPending(true);

    try {
      const result = await toggleReaction(channelId, messageId, emoji, currentUserId);
      onReactionUpdate(result.messageId, result.reactions);
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

    // Prefer below, fallback to above
    if (spaceBelow >= pickerHeight + offset) {
      top = rect.bottom + offset;
    } else if (spaceAbove >= pickerHeight + offset) {
      top = rect.top - pickerHeight - offset-40;
    } else {
      // fallback clamp
      top = Math.max(offset, window.innerHeight - pickerHeight - offset);
    }

    // Prevent right overflow
    if (window.innerWidth - rect.left < pickerWidth) {
      left = rect.right - pickerWidth;
    }

    // Prevent left overflow
    if (left < offset) {
      left = offset;
    }

    setPickerStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
    });

    setShowEmoji((v) => !v);
  };

  const isImage = (type: string) =>
    ["png", "jpg", "jpeg", "gif", "webp"].includes(type.toLowerCase());

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(":", ".");
  };

  return (
    <div
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
          <img src="/emoticons/tick.png" className="p-1 rounded-md hover:bg-gray-100" />
          <img src="/emoticons/eye.png" className="p-1 rounded-md hover:bg-gray-100" />
          <img src="/emoticons/welcome.png" className="p-1 rounded-md hover:bg-gray-100" />

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Emoji trigger */}
          <button
            ref={emojiBtnRef}
            className="p-1.5 rounded-md hover:bg-gray-100"
            onClick={handleEmojiClick}
            disabled={isPending}
          >
            <LuSmilePlus />
          </button>

          {state === "message" && (
            <button
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={onCommentClick}
            >
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
          <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
            <FaEllipsisV />
          </button>
        </div>
      )}

      {/* Avatar */}
      <img
        src={avatar}
        className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center"
      />

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
            {username}
          </span>
          <span className="text-sm text-gray-500">{formatTime(time)}</span>
        </div>

        <div
          className="text-gray-800 mt-1"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        />

        {state !== "search" && (
          <div>
            {/* Files */}
            {files && files.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <span
                    className="cursor-pointer flex items-center gap-1"
                    onClick={() => setShowFiles(!showFiles)}
                  >
                    {files.length} files {showFiles ? "▲" : "▼"}
                  </span>
                  <span
                    className="relative group cursor-pointer"
                    onMouseOver={() =>
                      setDownloadTxt(`${files.length} files available to download`)
                    }
                    onMouseLeave={() => setDownloadTxt('')}
                  >
                    Download all
                    {downloadTxt && (
                      <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {downloadTxt}
                      </span>
                    )}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    showFiles ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex gap-3 flex-wrap">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm w-[220px]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center text-sm text-white">
                          {isImage(file.type) ? (
                            <img
                              src={"/" + file.name}
                              alt={file.name}
                              className="w-10 h-10 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-semibold uppercase">
                              {file.type?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500">{file.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reactions */}
            {reactions && reactions.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap items-center">
                {reactions.map((r) => {
                  const userReacted =
                    !!currentUserId && r.reactedUserIds.includes(currentUserId);
                  return (
                    <button
                      key={r.emoji}
                      onClick={() => handleEmojiSelect(r.emoji)}
                      disabled={isPending}
                      className={`flex items-center gap-1 px-2 py-[3px] rounded-full text-xs border ${
                        userReacted
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "bg-blue-50 border-blue-300 text-gray-600"
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span className="font-bold">{r.count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Replies */}
            {replies > 0 && state === "message" && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <img
                  src="/avatar.png"
                  className="w-[25px] h-[25px] rounded-lg bg-yellow-100"
                />
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={onCommentClick}
                >
                  {replies} {replies === 1 ? "reply" : "replies"}
                </span>
                {lastReply && <span>Last reply {lastReply}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ FINAL FIXED PICKER */}
      {showEmoji && (
        <div style={pickerStyle}>
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default SlackMessage;