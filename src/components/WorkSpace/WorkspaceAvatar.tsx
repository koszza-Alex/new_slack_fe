"use client";

import { useWorkspace } from "@/context/Workspacecontext";
import { useState, useRef, useEffect } from "react";

export default function WorkspaceAvatar(props: { userData: any }) {

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { workspace } = useWorkspace();
    const workspace_name = workspace?.name ?? null;


    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Hover handlers (same behavior as click)
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
            ref={ref}
            className="relative flex justify-center"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {/* Avatar trigger — shows first letter of current workspace name */}
            <div
                onClick={() => setOpen((prev) => !prev)}
                className="w-10 h-10 rounded-xl bg-[#867688] flex items-center justify-center text-white text-[18px] font-semibold cursor-pointer hover:brightness-110 transition select-none"
            >
                {workspace_name ? workspace_name.charAt(0).toUpperCase() : "?"}
            </div>

            {/* Dropdown */}
            <div
                className={`
                    absolute left-[-9px] top-11 w-[350px]
                    bg-white text-black rounded-xl shadow-2xl overflow-hidden z-50
                    transform transition-all duration-200 ease-out
                    ${open
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                    }
                `}
            >
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="font-semibold">{workspace_name}</div>
                    <div className="text-sm text-gray-500">
                        {workspace_name}.slack.com
                    </div>
                </div>

                {/* Notification */}
                <div className="p-4 border-b text-sm">
                    <div className="font-medium">Never miss a notification</div>
                    <div className="text-blue-600 cursor-pointer">
                        Get the Slack app
                    </div>
                </div>

                {/* Workspace list */}
                <div className="p-2">
                    <div className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100">
                        <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white">
                            {props.userData?.dispname?.slice(0, 1) || ''}
                        </div>
                        <div>
                            <div className="font-medium">{props.userData?.dispname || ''}</div>
                            <div className="text-xs text-gray-500">
                                {props.userData?.dispname || ''}.slack.com
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-lg">
                            +
                        </div>
                        <div className="text-sm">Add a workspace</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
