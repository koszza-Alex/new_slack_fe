"use client";

import { useState, useRef } from "react";

export default function UserTooltip({
    children,
    name = "koszza",
}: {
    children: React.ReactNode;
    name?: string;
}) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const openTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const closeTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 120);
    };

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            onClick={closeTooltip}
        >
            {/* Trigger */}
            {children}

            {/* Tooltip */}
            <div
                className={`
          absolute left-[52px] top-1/2 -translate-y-1/2
          z-50 flex items-center
          transition-all duration-150 ease-out
          ${
              open
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 -translate-x-1 scale-95 pointer-events-none"
          }
        `}
            >
                {/* Arrow */}
                <div className="w-2 h-2 bg-[#1D1C1D] rotate-45 mr-[-4px]" />

                {/* Body */}
                <div className="bg-[#1D1C1D] text-white text-[13px] px-3 py-[6px] rounded-md shadow-lg flex items-center gap-2 whitespace-nowrap">
                    <span className="font-medium">{name}</span>
                    <div className="w-[6px] h-[6px] bg-green-500 rounded-full" />
                </div>
            </div>
        </div>
    );
}
