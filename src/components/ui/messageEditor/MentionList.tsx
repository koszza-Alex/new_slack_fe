"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export interface MentionUser {
  id: string;
  dispname: string | null;
  email: string;
  /** Full URL — already resolved via getAvatarUrl() before being passed in */
  avatar: string;
}

interface MentionListProps {
  items: MentionUser[];
  /** Tiptap suggestion command — attrs become node.attrs on the mention node */
  command: (attrs: { id: string; label: string; email: string; avatar: string }) => void;
}

export interface MentionListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

/** Fallback shown when an avatar URL fails to load */
const FALLBACK_AVATAR = "/avatar.png";

const MentionList = forwardRef<MentionListHandle, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = items[index];
      if (!item) return;
      command({
        id: item.id,
        label: item.dispname ?? item.email,
        email: item.email,
        avatar: item.avatar || FALLBACK_AVATAR,
      });
    };

    // Reset selection when the filtered list changes
    useEffect(() => setSelectedIndex(0), [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }: { event: KeyboardEvent }) {
        if (event.key === "ArrowUp") {
          setSelectedIndex((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (!items.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm text-gray-400 min-w-[220px]">
          No users found
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[220px] max-h-[240px] overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition ${
              index === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onMouseDown={(e) => {
              // preventDefault keeps editor focus so Tiptap can insert the mention
              e.preventDefault();
              selectItem(index);
            }}
          >
            {/* Avatar — full URL already resolved; onError falls back to /avatar.png */}
            <img
              src={item.avatar || FALLBACK_AVATAR}
              alt={item.dispname ?? item.email}
              className="w-7 h-7 rounded-md object-cover shrink-0"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== window.location.origin + FALLBACK_AVATAR) {
                  img.src = FALLBACK_AVATAR;
                }
              }}
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-medium text-gray-800 truncate">
                {item.dispname ?? item.email}
              </span>
              {item.dispname && (
                <span className="text-xs text-gray-400 truncate">{item.email}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  },
);

MentionList.displayName = "MentionList";
export default MentionList;
