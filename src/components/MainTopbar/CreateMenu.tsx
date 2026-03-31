"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  FileText,
  List,
  Link,
  Zap,
  Folder,
} from "lucide-react";
import { Tooltip } from "./Tooltip";

export default function CreateMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative cursor-pointer" ref={ref}>
      {/* PLUS BUTTON */}
      <Tooltip children={<button onClick={() => setOpen((prev) => !prev)}
        className={open==false? "p-1 rounded-4xl hover:bg-gray-100 cursor-pointer" : " p-1 rounded-4xl bg-gray-100 hover:bg-gray-100 rotate-225 transition duration-150 ease-out-in-out"}
        >
        <Plus size={18} />
      </button>} text1="Add new tab" text2="Drag files,canvases and lists in here too!"/>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          
          {/* Top Section */}
          <div className="space-y-1 pt-3">
            <MenuItem icon={<FileText size={22} />} label="Canvas" />
            <MenuItem icon={<List size={22} />} label="List" />
            <MenuItem icon={<Link size={22} />} label="Link" />
            <MenuItem icon={<Zap size={22} />} label="Workflow" />
            <MenuItem icon={<Folder size={22} />} label="Folder" />
          </div>

          <Divider />

          {/* Templates */}
          <div>
            <p className="text-[15px] pl-5 font-bold text-black mb-2">
              Try a template
            </p>

            <div className="pt-3 space-y-1">
              <MenuItem label="Project starter kit" />
              <MenuItem label="Bug intake and triage" />
              <MenuItem label="Help requests process" />
              <MenuItem label="Explore more templates" />
            </div>
          </div>

          <Divider />

          {/* Footer */}
          <div className="pb-3">
            <MenuItem label="Edit tabs" />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
}: {
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <button className="w-full cursor-pointer flex items-center gap-1 pt-1 pb-1 pr-2 pl-5 text-sm hover:w-full hover:text-white hover:bg-[#1266a9] text-left">
      {icon && <span className="text-gray-600">{icon}</span>}
      <span className="text-[15px]">{label}</span>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 my-1" />;
}