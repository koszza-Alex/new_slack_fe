"use client";

import { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FiHash, FiPlus } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { PiChatsCircleBold } from "react-icons/pi";

export default function SidebarSection({
  title,
  children,
  onAdd,
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
}) {
  // Persist collapsed state per section title so it survives page reloads
  const storageKey = `sidebar-collapsed-${title}`;

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(storageKey);
    return stored === "true";
  });

  // Keep localStorage in sync whenever collapsed changes
  useEffect(() => {
    localStorage.setItem(storageKey, String(collapsed));
  }, [collapsed, storageKey]);

  const handleToggle = () => setCollapsed((v) => !v);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-12 text-gray-300 mb-1">
        <div
          className="group w-full h-8 flex items-center justify-between px-1 py-1 rounded-md cursor-pointer hover:bg-white/10"
          onClick={handleToggle}
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 px-1 text-[13px] font-semibold text-white/70 tracking-wide">
            {/* Section icon — hidden on hover, replaced by caret */}
            {title === "Channels" ? (
              <div className="w-3 group-hover:hidden h-full border rounded-sm">
                <FiHash size={11} />
              </div>
            ) : (
              <div className="w-3 group-hover:hidden">
                <PiChatsCircleBold size={14} />
              </div>
            )}

            {/* Caret — always visible on hover, rotates when collapsed */}
            <div className="hidden group-hover:flex">
              <AiFillCaretDown
                size={12}
                className={`text-white/60 transition-transform duration-200 ${
                  collapsed ? "-rotate-90" : "rotate-0"
                }`}
              />
            </div>

            <span className="group-hover:text-white">{title}</span>
          </div>

          {/* RIGHT SIDE — stop propagation so + / ⋮ don't toggle collapse */}
          <div
            className="hidden group-hover:flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="p-1 rounded hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onAdd?.();
              }}
            >
              <FiPlus size={14} />
            </button>

            <button className="p-1 rounded hover:bg-white/20">
              <HiDotsVertical size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Children — hidden when collapsed */}
      {!collapsed && children}
    </div>
  );
}
