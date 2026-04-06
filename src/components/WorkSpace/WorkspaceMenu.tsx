"use client";

import { useState, useRef, useEffect } from "react";
import UserTooltip from "@/components/WorkSpace/UserTooltip";
import ProfileSidebar from "@/components/WorkSpace//ProfileSidebar";
import PauseNotificationsMenu from "@/components/WorkSpace/PauseNotificationsMenu";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import { usePresenceStore, presenceColor } from "@/store/presence-store";
import { useThreadStore } from "@/store/thread-store";

export default function WorkspaceMenu(props: { userData: any }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const router = useRouter();
    const { socket } = useSocket();

    // Real presence: current user is online if their id is in the presence store
    const { isOnline } = usePresenceStore();
    const currentUserId: string | undefined = props.userData?.id;
    const joined = currentUserId ? isOnline(currentUserId) : false;
    const { closeThread } = useThreadStore();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const signOut = () => {
        const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

        // 1. Immediately broadcast offline to all other clients
        if (socket && userId) {
            socket.emit("user_signed_out", userId);
        }

        // 2. Clear local auth state
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // 3. Disconnect the socket so handleDisconnect fires on the backend
        //    (cleans up any remaining socket→user mappings)
        if (socket) {
            socket.disconnect();
        }

        router.push("/auth/sign_in");
    };

    return (
        <div ref={ref} className="relative flex justify-center">
            <UserTooltip name={props.userData?.dispname || "User"}>
                <div
                    onClick={() => { setOpen((v) => !v); closeThread(); }}
                    className="relative w-9.5 h-9.5 rounded-xl bottom-[4.5px]"
                >
                    <img
                        src={`${process.env.NEXT_PUBLIC_SOCKET_URL}${props.userData?.avatar}`}
                        className="w-full h-full object-cover rounded-[10px] cursor-pointer"
                    />
                    {/* Status dot — green when joined, #3F0E40 when unjoined */}
                    <div
                        className={`absolute bottom-[-2px] right-[-2px] w-2/5 h-2/5 border-2 border-[#3F0E40] rounded-full ${presenceColor(joined)}`}
                    />
                </div>
            </UserTooltip>

            {/* Dropdown */}
            <div
                className={`
                    absolute left-[50px] bottom-0
                    w-[300px]
                    bg-white text-[#1D1C1D]
                    rounded-xl shadow-2xl
                    overflow-visible z-50
                    transition-all duration-150 ease-out
                    ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
               `}
            >
                {/* HEADER */}
                <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-white font-semibold">
                        <img src="/avatar.png" alt="" className="rounded-[10px]" />
                    </div>

                    <div>
                        <div className="text-[15px] font-semibold">
                            {props.userData?.dispname || "User"}
                        </div>
                        <div className="text-[13px] text-gray-500 flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${presenceColor(joined)}`} />
                            {joined ? "Active" : "Away"}
                        </div>
                    </div>
                </div>

                {/* STATUS INPUT */}
                <div className="px-4 pb-3">
                    <div className="group flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-[14px] text-gray-500 cursor-pointer transition">
                        <span className="text-gray-400 group-hover:hidden">🙂</span>
                        <span className="hidden group-hover:inline">😃</span>
                        <span className="group-hover:text-[#1D1C1D]">Update your status</span>
                    </div>
                </div>

                <Divider />

                <MenuItem label="Set yourself as away" />
                <PauseNotificationsMenu>
                    <MenuItem label="Pause notifications" arrow />
                </PauseNotificationsMenu>

                <Divider />

                <MenuItem
                    label="Profile"
                    onClick={() => {
                        setOpen(false);
                        setProfileOpen(true);
                    }}
                />
                <MenuItem label="Preferences" />

                <Divider />

                <MenuItem label="Sign out of NC" onClick={signOut} />
            </div>

            <ProfileSidebar
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                userdata={props.userData}
            />
        </div>
    );
}

function Divider() {
    return <div className="h-[1px] bg-gray-200 my-1" />;
}

function MenuItem({
    label,
    arrow,
    onClick,
}: {
    label: string;
    arrow?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between px-4 py-[6px] text-[14px] cursor-pointer transition hover:bg-[#F4EDE4]"
        >
            <span>{label}</span>
            {arrow && <span className="text-gray-400">›</span>}
        </div>
    );
}
