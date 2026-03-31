"use client";

import { useState, useRef } from "react";

type Tab = "activity" | "all" | "dms";

type ActivityItem = {
    id: number;
    user: string;
    text: string;
    type: "dm" | "channel";
    unread: boolean;
    time: string;
};

export default function ActivityPopover({ children }: any) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<Tab>("activity");
    const [onlyUnread, setOnlyUnread] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    //  hover behavior
    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 150);
    };

    //  MOCK DATA (replace later with backend)
    const data: ActivityItem[] = [
        {
            id: 1,
            user: "abe",
            text: "Please create your branch quickly.",
            type: "channel",
            unread: true,
            time: "Yesterday",
        },
        {
            id: 2,
            user: "Masao",
            text: "Thread in #security",
            type: "channel",
            unread: false,
            time: "Wednesday",
        },
        {
            id: 3,
            user: "abe",
            text: "Reacted in #chatting_english",
            type: "channel",
            unread: true,
            time: "Wednesday",
        },
        {
            id: 4,
            user: "abe",
            text: "Invitation to #security",
            type: "dm",
            unread: false,
            time: "Wednesday",
        },
    ];

    // FILTER LOGIC (Slack-like)
    const filtered = data.filter((item) => {
        if (tab === "dms" && item.type !== "dm") return false;
        if (onlyUnread && !item.unread) return false;
        return true;
    });

    return (
        <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {children} 

            {open && (
                <div className="absolute left-14 top-0 w-[340px] bg-white text-black rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/*  HEADER */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
                        {/* Tabs */}
                        <div className="flex items-center gap-4 text-sm">
                            {[
                                { key: "activity", label: "Activity" },
                                { key: "all", label: "All" },
                                { key: "dms", label: "DMs" },
                            ].map((t) => (
                                <div
                                    key={t.key}
                                    onClick={() => setTab(t.key as Tab)}
                                    className={`
                                        relative cursor-pointer transition
                                        ${
                                            tab === t.key
                                                ? "text-black font-semibold"
                                                : "text-gray-500 hover:text-black"
                                        }
                                    `}
                                >
                                    {t.label}

                                    {tab === t.key && (
                                        <div className="absolute left-0 -bottom-[6px] w-full h-[2px] bg-purple-600 rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Unread toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                                Unread
                            </span>

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

                    {/*  LIST */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {filtered.length === 0 && (
                            <div className="p-4 text-sm text-gray-500 text-center">
                                No activity found
                            </div>
                        )}

                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            >
                                {/* Avatar */}
                                <img
                                    src="/avatar.png"
                                    className="w-8 h-8 rounded-md"
                                />

                                {/* Content */}
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {item.user}
                                    </div>
                                    <div className="text-gray-600">
                                        {item.text}
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="ml-auto text-xs text-gray-400">
                                    {item.time}
                                </div>

                                {/* Unread dot */}
                                {item.unread && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full self-center" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
