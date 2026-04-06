"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type ButtonProps = {
  label?: string;
  onClick?: () => void;

  bgColor?: string;        
  hoverColor?: string;     
  activeColor?: string;    
  textColor?: string;      
  width?: string
  height?: string;         
  paddingX?: string;       
  radius?: string;         
  showIcon?: boolean;
  icon?: any;
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
  icon = faPlus,
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
      {showIcon && (
        <FontAwesomeIcon icon={icon} className="text-[12px]" />
      )}

      <span>{label}</span>
    </button>
  );
}