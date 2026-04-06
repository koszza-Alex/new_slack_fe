"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Props = {
  icon: IconDefinition;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function ToolbarIconButton({ icon, children, onClick }: Props) {
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
      <FontAwesomeIcon className="text-[18px] text-[#d5d6d7]" icon={icon} />
      {children && (
        <span className="text-[14px] text-[#d5d6d7]">
          {children}
        </span>
      )}
    </button>
  );
}