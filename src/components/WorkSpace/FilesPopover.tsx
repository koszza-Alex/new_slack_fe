"use client";

import { useState, useRef } from "react";

type FileItem = {
    id: number;
    title: string;
    isTemplate?: boolean;
    starred?: boolean;
    updated: string;
};

export default function FilesPopover({ children }: any) {
    const [open, setOpen] = useState(false);
    const [onlyStarred, setOnlyStarred] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Hover logic
    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 150);
    };

    //  Mock data
    const files: FileItem[] = [
        {
            id: 1,
            title: "Weekly 1:1",
            isTemplate: true,
            starred: true,
            updated: "Updated 7 months ago",
        },
    ];

    // Filter
    const filtered = files.filter((f) => {
        if (onlyStarred && !f.starred) return false;
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
                <div className="absolute left-14 top-0 w-[320px] bg-white text-black rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/*  HEADER */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <span className="font-semibold text-sm">Files</span>

                        {/* Starred toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                                Starred
                            </span>

                            <div
                                onClick={() => setOnlyStarred(!onlyStarred)}
                                className={`
                                    relative w-9 h-5 rounded-full cursor-pointer transition
                                    ${onlyStarred ? "bg-purple-600" : "bg-gray-300"}
                                `}
                            >
                                <div
                                    className={`
                                        absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition
                                        ${onlyStarred ? "left-[18px]" : "left-[2px]"}
                                    `}
                                />
                            </div>
                        </div>
                    </div>

                    {/*  LIST */}
                    <div className="p-2">
                        {filtered.length === 0 && (
                            <div className="p-4 text-sm text-gray-500 text-center">
                                No files found
                            </div>
                        )}

                        {filtered.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                                {/* File icon */}
                                <div className="w-9 h-9 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                                    F
                                </div>

                                {/* Content */}
                                <div className="flex flex-col text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {file.title}
                                        </span>

                                        {file.isTemplate && (
                                            <span className="text-[11px] text-blue-600 bg-blue-50 px-1.5 py-[1px] rounded">
                                                Template
                                            </span>
                                        )}
                                    </div>

                                    <span className="text-xs text-gray-500">
                                        {file.updated}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
