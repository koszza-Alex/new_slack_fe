"use client";

import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function ToolbarIconButton({ icon: Icon, children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-center gap-[6px]
        h-[28px] w-[28px] px-[10px]
        cursor-pointer
        rounded-[6px]
        border-none
        bg-transparent
        hover:bg-[#1d74c9]
        transition-all duration-[120ms]
      "
    >
      <Icon className="text-[18px] text-[#d5d6d7]" />
      {children && (
        <span className="text-[14px] text-[#d5d6d7]">{children}</span>
      )}
    </button>
  );
}
