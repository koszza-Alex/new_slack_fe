"use client";

import { AiFillCaretDown } from "react-icons/ai";
import { FiHash, FiPlus } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { PiChatsCircleBold } from "react-icons/pi";

export default function SidebarSection({
  title,
  children,
  onAdd, // ✅ receive handler
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-12 text-gray-300 mb-1">
        <div className="group w-full h-8 flex items-center justify-between px-1 py-1 rounded-md cursor-pointer hover:bg-white/10">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 px-1 text-[13px] font-semibold text-white/70 tracking-wide">
            {title === "Channels" ? (
              <div className="w-3 group-hover:hidden h-full border rounded-sm">
                <FiHash size={11} />
              </div>
            ) : (
              <div className="w-3 group-hover:hidden">
                <PiChatsCircleBold size={14} />
              </div>
            )}

            <div className="hidden group-hover:flex">
              <AiFillCaretDown size={12} className="text-white/60" />
            </div>

            <span className="group-hover:text-white">{title}</span>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              className="p-1 rounded hover:bg-white/20"
              onClick={onAdd} // ✅ trigger parent
            >
              <FiPlus size={14} />
            </button>

            <button className="p-1 rounded hover:bg-white/20">
              <HiDotsVertical size={14} />
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}