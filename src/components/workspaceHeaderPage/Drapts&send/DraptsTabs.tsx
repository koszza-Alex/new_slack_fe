"use client";

import { FiMessageCircle, FiPlus } from "react-icons/fi";
import { IconType } from "react-icons";
import { useState } from "react";

type Tab = {
  ico: IconType;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  px?: string;
};

export default function DraptsTabs({ tabs, px }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div className={`flex border-b h-[38px] ${px ?? ""} border-[#d5d6d7]`}>
        {tabs.map((tab, index) => {
          const Icon = tab.ico;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-[16px] py-[8px] text-[14px] bg-[#1a1d21] border-none font-[500] transition-all duration-200 relative ${
                activeIndex === index ? "text-[#ffffff]" : "text-[#9ca3af] hover:text-[#ffffff]"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {activeIndex === index && (
                <span className="absolute left-[0px] bottom-[0px] w-full h-[2px] bg-[#3b82f6]" />
              )}
            </button>
          );
        })}
        {!px && (
          <button
            onClick={() => alert()}
            className="flex items-center justify-center bg-[#1e1e1e] border-none rounded-[50%] hover:bg-[#313131] hover:text-[#ffffff] mt-[10px] text-[#9ca3af] w-[20px] h-[20px] transition-all duration-[0.2s] relative"
          >
            <FiPlus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
