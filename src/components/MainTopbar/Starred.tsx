"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
} from "lucide-react";
import { Tooltip } from "./Tooltip";
import { HiOutlineStar } from "react-icons/hi";

export default function Starred() {
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
      {/* Star BUTTON */}
      <Tooltip children={<button onClick={() => setOpen((prev) => !prev)} className="p-1 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"><HiOutlineStar color="#433934" size={20} />
        </button>} text1="Move channel" />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          
          {/* Templates */}
          <div>
            <p className="text-[15px] pl-5 text-gray-600 mt-3">
              Move to...
            </p>

            <div className="pt-3 space-y-1">
              <MenuItem icon={<HiOutlineStar size={20} />} label="Starred" />
            </div>
          </div>

          <Divider />

          {/* Footer */}
          <div className="pb-3">
            <MenuItem icon={<PlusIcon size={20} />} label="Create your first section" />
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
      <span className="text-[15px] text-black">{label}</span>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 my-1" />;
}