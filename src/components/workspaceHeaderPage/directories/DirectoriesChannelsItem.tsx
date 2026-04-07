"use client";

import { IconType } from "react-icons";
import { useState } from "react";
import CustomButton from "../component/channel_button";

type ChannelsItemProps = {
  title?: string;
  comment?: string;
  active?: boolean;
  icon?: IconType;
  members?: number;
  joined?: boolean;
  onClick?: () => void;
};

export default function DirectoriesChannelsItem({
  title, comment, members, active, icon: Icon, joined, onClick,
}: ChannelsItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full h-[80px] flex items-center relative px-[12px] transition-all duration-[120ms] cursor-pointer border-b-[1px] border-[#767676]"
    >
      <div className="ml-[10px]">
        <div className="w-[100%] h-[60%]">
          <div className="flex items-center gap-[10px]">
            {Icon && <Icon size={12} className="text-black" />}
            <div className="flex flex-col justify-center">
              <div className="text-[#313131] text-[14px] font-[500]">
                <span className="text-[18px] font-bold mr-[15px]">{title}</span>
                {hovered && "view channel"}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[40%]">
          <div className="text-[#9ca3af] mt-[20px] text-[12px]">
            {joined && <span className="text-[green]">√ Joined · </span>}
            {members && `members${members} · `}
            {comment && comment}
          </div>
        </div>
      </div>

      <div className="flex absolute right-[10px] items-center gap-[12px]">
        {hovered && (
          <div className="flex items-center gap-[8px]">
            <CustomButton label="Open in Home" showIcon={false} bgColor="bg-transparent" hoverColor="hover:bg-[#e1e1e1]" activeColor="active:bg-[#a1a1a1]" textColor="text-[#313131]" paddingX="px-[12px]" height="h-[32px]" radius="rounded-[6px]" />
            <CustomButton label="Join" showIcon={false} bgColor="bg-transparent" hoverColor="hover:bg-[#e1e1e1]" activeColor="active:bg-[#a1a1a1]" textColor="text-[#313131]" paddingX="px-[12px]" height="h-[32px]" radius="rounded-[6px]" />
          </div>
        )}
      </div>
    </div>
  );
}
