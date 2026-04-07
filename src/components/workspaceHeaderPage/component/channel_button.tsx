"use client";

import { FiPlus } from "react-icons/fi";
import { IconType } from "react-icons";

type ButtonProps = {
  label?: string;
  onClick?: () => void;

  bgColor?: string;
  hoverColor?: string;
  activeColor?: string;
  textColor?: string;
  width?: string;
  height?: string;
  paddingX?: string;
  radius?: string;
  showIcon?: boolean;
  icon?: IconType;
};

export default function CustomButton({
  label = "New",
  onClick,

  bgColor = "bg-[#007a5a]",
  hoverColor = "hover:bg-[#148567]",
  activeColor = "active:bg-[#006644]",
  textColor = "text-[#ffffff]",
  width = "w-[28px]",
  height = "h-[32px]",
  paddingX = "px-[12px]",
  radius = "rounded-[6px]",

  showIcon = true,
  icon: Icon = FiPlus,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        items-center
        border 
        border-[#a1a1a1]
        gap-[6px]
        ${paddingX}
        ${height}
        ${radius}
        ${bgColor}
        ${hoverColor}
        ${activeColor}
        ${textColor}
        text-[14px]
        font-[500]
        transition-all
        duration-[120ms]
        cursor-pointer
      `}
    >
      {showIcon && <Icon size={12} />}
      <span>{label}</span>
    </button>
  );
}