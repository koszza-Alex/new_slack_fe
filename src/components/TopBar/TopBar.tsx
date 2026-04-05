"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiClock,
  FiHelpCircle,
  FiSearch,
} from "react-icons/fi";
import SearchBox from "./SearchBox";
// import SearchModal from "./SearchModal";

export default function TopBar() {
  const inputRef = useRef<HTMLInputElement>(null);


  return (
    <header className="h-[38px] px-2 bg-[#410f41] text-white flex items-center relative z-10">

      {/* LEFT */}

      {/* CENTER (TRUE CENTERED) */}
      <div className="
    absolute left-1/2 -translate-x-1/2
    w-full max-w-[50%] min-w-[480px]
    px-2 flex
    ">
    <div className="flex items-center gap-[4px] ml-[2px] z-10 mr-[4px]">
      <IconBtn>
        <FiArrowLeft size={18} className="text-white/90" />
      </IconBtn>
      <IconBtn>
        <FiArrowRight size={18} className="text-white/30" />
      </IconBtn>
      <IconBtn>
        <FiClock size={18} className="text-white/90" />
      </IconBtn>
    </div>
        <SearchBox />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-[6px] ml-auto mr-[2px] z-10">
        

        <IconBtn>
          <FiHelpCircle size={18} className="text-white/90" />
        </IconBtn>
      </div>
    </header>

  );
}

/* Icon Button */
function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="
      w-[26px] h-[26px]
      flex items-center justify-center
      rounded
      hover:bg-white/[0.10]
      active:bg-white/[0.16]
      transition-all duration-100
    ">
      {children}
    </button>
  );
}

function Item({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  );
}