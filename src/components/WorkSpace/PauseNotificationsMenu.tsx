"use client";

import { useState, useRef } from "react";

export default function PauseNotificationsMenu({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 120);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {/* Parent */}
            {children}

            {/* Submenu (IMPORTANT: no gap, aligned perfectly) */}
            <div
                className={`
                  absolute top-[-230px] left-full
                  ml-[-2px]
                  w-[260px]
                  bg-white text-[#1D1C1D]
                  rounded-xl shadow-2xl
                  overflow-hidden z-10
                  transition-all duration-150 ease-out
                  ${
                      open
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-2 pointer-events-none"
                  }
                `}
            >
                {/* Header */}
                <div className="px-4 py-2 text-[13px] text-gray-500 flex justify-between">
                    <span>Pause notifications...</span>
                    <span className="text-gray-400">?</span>
                </div>

                <Divider />

                <SubItem label="For 30 minutes" />
                <SubItem label="For 1 hour" />
                <SubItem label="For 2 hours" />
                <SubItem label="Until tomorrow" />
                <SubItem label="Until next week" />
                <SubItem label="Custom..." />

                <Divider />

                <div className="px-4 py-2 text-[12px] text-gray-500">
                    Pause for all except VIPs
                    <div className="text-[11px] text-gray-400 mt-1">
                        Always allow notifications from certain people by adding
                        them as a VIP.
                    </div>
                </div>

                <Divider />

                <div className="px-4 py-2 text-[13px] flex justify-between hover:bg-[#F4EDE4] cursor-pointer">
                    <span>Set a notification schedule</span>
                    <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded">
                        NEW
                    </span>
                </div>
            </div>
        </div>
    );
}

function Divider() {
    return <div className="h-[1px] bg-gray-200 my-1" />;
}

function SubItem({ label }: { label: string }) {
    return (
        <div className="px-4 py-[6px] text-[14px] cursor-pointer hover:bg-[#F4EDE4]">
            {label}
        </div>
    );
}
