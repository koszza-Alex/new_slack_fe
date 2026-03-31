"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, FileText, Layout } from "lucide-react";
import { RiStickyNoteAddLine } from "react-icons/ri";

export function CanvasMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative"  ref={ref}>
            <button onClick={() => setOpen((prev) => !prev)} className="flex p-2 cursor-grab rounded-md hover:text-gray-800 hover:bg-gray-100 items-center text-[13px] text-gray-600 relative">
                <RiStickyNoteAddLine size={20} />
                <span>Add canvas</span>
            </button>
            {open && <div className="absolute left-0 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                <div className="space-y-1 pb-3 pt-3">
                <MenuItem icon={<Plus size={16} />} label="New blank canvas" />
                <MenuItem icon={<FileText size={16} />} label="Add existing canvas" />
                <MenuItem icon={<Layout size={16} />} label="Start with a template" />
                </div>
            </div>}
        </div>
    );
}

function MenuItem({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            className="w-full cursor-pointer flex items-center gap-1 pt-1 pb-1 pr-2 pl-5 text-sm hover:w-full hover:text-white hover:bg-[#1266a9] text-left"
        >
            <span className="text-gray-600 text-[15px]">{icon}</span>
            {label}
        </button>
    );
}