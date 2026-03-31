"use client";

import { useState, useRef } from "react";
import { Wrench } from "lucide-react";

export default function MorePopover({ children }: any) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Hover behavior
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

            {open && (
                <div className="absolute left-14 top-0 w-[300px] bg-white text-black rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/*  HEADER */}
                    <div className="px-4 pt-3 pb-2 text-sm font-semibold">
                        More
                    </div>

                    {/* CONTENT */}
                    <div className="px-2 pb-2">
                        {/* Tools item */}
                        <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer transition">
                            {/* Icon */}
                            <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
                                <Wrench size={18} className="text-purple-700" />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col text-sm">
                                <span className="font-medium">Tools</span>
                                <span className="text-gray-500 text-xs">
                                    Create and find workflows and apps
                                </span>
                            </div>
                        </div>
                    </div>

                    {/*  FOOTER */}
                    <div className="border-t px-4 py-3 text-sm text-blue-600 hover:underline cursor-pointer">
                        Customize navigation bar
                    </div>
                </div>
            )}
        </div>
    );
}
