"use client";

import React, { useEffect, useRef } from "react";

export interface MentionProfile {
  id: string;
  dispname: string | null;
  email: string;
  avatar: string;
}

interface MentionProfileTooltipProps {
  profile: MentionProfile;
  position: { top: number; left: number };
  onClose: () => void;
}

export default function MentionProfileTooltip({
  profile,
  position,
  onClose,
}: MentionProfileTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ position: "fixed", top: position.top, left: position.left, zIndex: 9999 }}
      className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-64"
    >
      <div className="flex items-center gap-3">
        <img
          src={profile.avatar || "/uploads/avatar.png"}
          alt={profile.dispname ?? profile.email}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-gray-900 truncate">
            {profile.dispname ?? profile.email}
          </span>
          <span className="text-xs text-gray-500 truncate">{profile.email}</span>
        </div>
      </div>
    </div>
  );
}
