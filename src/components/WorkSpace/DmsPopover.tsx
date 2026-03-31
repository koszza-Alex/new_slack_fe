"use client";

import { useState, useRef } from "react";

export default function DmsPopover({ children }: any) {
    const [onlyUnread, setOnlyUnread] = useState(false);
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 150);
    };

    return (
        
        <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {children}

            {/* Panel */}
            <div
                className={`
                    absolute left-14 top-0 w-80
                    bg-white text-black rounded-xl shadow-2xl overflow-hidden z-50
                    transition-all duration-200 ease-out
                    ${
                        open
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="font-semibold text-sm">
                        Direct messages
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Unreads</span>

                        <div
                            onClick={() => setOnlyUnread(!onlyUnread)}
                            className={`
                                        relative w-9 h-5 rounded-full cursor-pointer transition
                                        ${onlyUnread ? "bg-purple-600" : "bg-gray-300"}
                                    `}
                        >
                            <div
                                className={`
                                absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition
                                ${onlyUnread ? "left-[18px]" : "left-[2px]"}
                                `}
                            />
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto">
                    {[
                        "abe",
                        "Masao",
                        "punchi",
                        "John Smith",
                        "bladmirpedro",
                        "Lucas Johnson",
                        "koszza (you)",
                        "Martinez",
                    ].map((name, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 ml-0 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="w-8 h-8  rounded-md" />
                            <img src="/png/avatarBlurChannelList.png" alt="" className="w-9 h-9"/>
                            <span className="text-sm">{name}</span> 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
