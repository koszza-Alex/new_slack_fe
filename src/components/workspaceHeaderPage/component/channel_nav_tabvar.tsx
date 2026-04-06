"use client";

import { FiPlus } from "react-icons/fi";
import { IconType } from "react-icons";
import { useState } from "react";

type Tab = {
  ico?: IconType;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  setPage: (label: string) => void;
  px?: string;
};

export default function ChannelNavTabvar({ tabs, setPage, px }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full bg-[unset]">
      <div className={`flex bg-[unset] border-b h-[38px] ${px ?? ""} border-[#d5d6d7]`}>
        {tabs.map((tab, index) => {
          const Icon = tab.ico;
          return (
            <button
              key={index}
              onClick={() => { setActiveIndex(index); setPage(tab.label); }}
              className={`px-[16px] py-[8px] flex items-center gap-1 text-[14px] bg-[unset] border-none font-[500] transition-all duration-200 relative`}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
              {activeIndex === index && (
                <span className="absolute left-[0px] bottom-[0px] w-full h-[2px] bg-[#83388a]" />
              )}
            </button>
          );
        })}
        {!px && (
          <button className="flex items-center justify-center bg-[#1e1e1e] border-none rounded-[50%] hover:bg-[#313131] hover:text-[#ffffff] mt-[10px] text-[#9ca3af] w-[20px] h-[20px] transition-all duration-[0.2s] relative">
            <FiPlus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
