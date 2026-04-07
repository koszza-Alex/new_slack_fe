"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";

export default function CreateButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => { 
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 left-4 z-[999]">
      {/* MENU */}
      <div
        className={`
          absolute bottom-14 left-0
          w-[260px]
          bg-[#f8f8f8]
          rounded-xl
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
          overflow-hidden
          transition-all duration-200
          ${
            open
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          }
        `}
      >
        <div className="px-4 py-3 font-semibold text-[14px]">Create</div>

        {items.map((item, i) => (
          <div
            key={i}
            className="
              flex items-start gap-3
              px-4 py-2
              hover:bg-[#F4EDE4]
              cursor-pointer
            "
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: item.color }}
            >
              <img
                src={`/svg/${item.iconLabel}.svg`}
                className="w-4 h-4"
              />
            </div>

            <div>
              <div className="text-[14px] font-medium flex gap-2">
                {item.title}
                {item.pro && (
                  <span className="text-[10px] bg-purple-600 text-white px-1 rounded">
                    PRO
                  </span>
                )}
              </div>
              <div className="text-[12px] text-gray-500">
                {item.desc}
              </div>
            </div>
          </div>
        ))}

        <div className="border-t my-1" />
        <div className="px-4 py-2 hover:bg-[#F4EDE4] cursor-pointer">
          Invite people
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          w-12 h-12
          rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${
            open
              ? "bg-[#481349]"
              : "bg-white/20 hover:bg-white/30"
          }
        `}
      >
        {/* ICON ANIMATION */}
        <div className="relative w-6 h-6">
          <Plus
            size={24}
            className={`
              absolute inset-0
              transition-all duration-200
              ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}
              text-white
            `}
          />
          <X
            size={24}
            className={`
              absolute inset-0
              transition-all duration-200
              ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}
              text-white
            `}
          />
        </div>
      </button>
    </div>
  );
}

const items = [
  {
    title: "Message",
    desc: "Start a conversation in a DM or channel",
    iconLabel: "CreateMessage",
    color: "#f6e4ff",
  },
  {
    title: "Channel",
    desc: "Start a group conversation by topic",
    iconLabel: "CreateChannel",
    color: "#eaeaea",
  },
  {
    title: "Huddle",
    desc: "Start a video or audio chat",
    iconLabel: "CreateHuddle",
    color: "#c3f6e0",
  },
  {
    title: "Canvas",
    desc: "Create and share content",
    iconLabel: "CreateCanvas",
    color: "#c2e6fd",
    pro: true,
  },
  {
    title: "List",
    desc: "Track and manage projects",
    iconLabel: "CreateList",
    color: "#fde3aa",
    pro: true,
  },
  {
    title: "Workflow",
    desc: "Automate everyday tasks",
    iconLabel: "CreateWorkflow",
    color: "#ffd6d5",
  },
];