"use client";

import { useEffect, useRef, useState } from "react";
import UserTooltip from "@/components/WorkSpace/UserTooltip";
import HuddleModal from "@/components/WorkSpace/HuddleModal";
import InvitePeopleModal from "@/components/WorkSpace/InvitePeopleModal";
import { Plus, X } from "lucide-react";

const items = [
    {
        title: "Message",
        desc: "Start a conversation in a DM or channel",
        icon: "✏️",
        iconLabel: "CreateMessage",
        color: "#f6e4ff",
        hoverColor: "#611f69",
    },
    {
        title: "Channel",
        desc: "Start a group conversation by topic",
        icon: "#",
        iconLabel: "CreateChannel",
        color: "#eaeaea",
        hoverColor: "#333133",
    },
    {
        title: "Huddle",
        desc: "Start a video or audio chat",
        icon: "🎧",
        iconLabel: "CreateHuddle",
        color: "#c3f6e0",
        hoverColor: "#0e674d",
    },
    {
        title: "Canvas",
        desc: "Create and share content",
        icon: "📄",
        iconLabel: "CreateCanvas",
        pro: true,
        color: "#c2e6fd",
        hoverColor: "#0b4c8c",
    },
    {
        title: "List",
        desc: "Track and manage projects",
        icon: "📋",
        iconLabel: "CreateList",
        pro: true,
        color: "#fde3aa",
        hoverColor: "#8e5b00",
    },
    {
        title: "Workflow",
        desc: "Automate everyday tasks",
        icon: "▶",
        iconLabel: "CreateWorkflow",
        color: "#ffd6d5",
        hoverColor: "#92220c",
    },
];

export default function CreateMenu() {
    const [open, setOpen] = useState(false);
    const [openHuddle, setOpenHuddle] = useState(false);
    const [openInvite, setOpenInvite] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative flex justify-center">
            {/* TRIGGER */}
            <UserTooltip name="Create new">
                <div
                    onClick={() => setOpen((v) => !v)}
                    className={`    w-10 h-10
                        rounded-full
                        flex items-center justify-center
                        transition-all duration-200    
                         ${
                             open
                                 ? "bg-white/70"
                                 : "bg-white/20 hover:bg-white/30"
                         }
                          text-white
                         rounded-full cursor-pointer transition`}
                >
                    <Plus
                        size={23}
                        className={`
                            absolute 
                            transition-all duration-20
                            ${open ? "rotate-0 opacity-0" : "rotate-180 opacity-100"}
                            text-white
                        `}
                    />
                    <X
                        size={24}
                        className={`
                            absolute 
                            transition-all duration-200
                            ${open ? "rotate-180 opacity-100" : "-rotate-180 opacity-0"}
                            text-white
                        `}
                    />
                </div>
            </UserTooltip>

            {/* MENU */}
            <div
                className={`
                  absolute left-[50px] bottom-[-30px]
                  w-[320px]
                  bg-white text-[#1D1C1D]
                  rounded-xl shadow-2xl
                  z-50 overflow-hidden
                  transition-all duration-150 ease-out
                  ${
                      open
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2 pointer-events-none"
                  }
                `}
            >
                {/* HEADER */}
                <div className="px-4 py-3 text-[14px] font-semibold">
                    Create
                </div>

                {/* ITEMS */}
                <div className="pb-2">
                    {items.map((item, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                            <div
                                key={i}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    if (item.title === "Huddle") {
                                        setOpenHuddle(true);
                                    }
                                }}
                                className="
                              flex items-start gap-3
                              px-4 py-2
                              cursor-pointer
                              hover:bg-[#F4EDE4]
                              transition
                            "
                            >
                                {/* ICON */}
                                <div
                                    style={{
                                        backgroundColor: isHovered
                                            ? item.hoverColor
                                            : item.color,
                                    }}
                                    className={`w-10 h-10 rounded-full  flex items-center justify-center text-[14px] hover: bg-[#611f69]`}
                                >
                                    <img
                                        src={`/svg/${item.iconLabel}.svg`}
                                        alt=""
                                        className={`w-5 h-5 transition ${isHovered ? "invert" : `#611f69`}`}
                                    />
                                </div>

                                {/* TEXT */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-20  text-[#413f41] font-bold text-[14px]">
                                        <span>{item.title}</span>
                                        {item.pro && (
                                            <span className="text-[10px] bg-purple-600 text-white px-1.5 rounded">
                                                PRO
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[12px] text-gray-500">
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Divider />

                {/* FOOTER */}
                <div
                    onMouseEnter={() => setHoveredIndex(10)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setOpenInvite(true)}
                    className=" px-2  py-2 gap-2 text-[15px]   font-bold text-[#413f41] flex items-center hover:bg-[#F4EDE4] cursor-pointer"
                >
                    <div
                        className={`ml-2 px-3 py-3 rounded-full ${hoveredIndex === 10 ? "bg-[#413f41]" : ""} `}
                    >
                        <img
                            src="/svg/InvitePeople.svg"
                            className={`w-5 h-5 transition ${hoveredIndex === 10 ? "invert" : ""}`}
                            alt=""
                        />
                    </div>
                    Invite people
                </div>
            </div>
            <HuddleModal
                open={openHuddle}
                onClose={() => setOpenHuddle(false)}
            />
            <InvitePeopleModal
                open={openInvite}
                onClose={() => setOpenInvite(false)}
            />
        </div>
    );
}

function Divider() {
    return <div className="h-[1px] bg-gray-200 my-1" />;
}
