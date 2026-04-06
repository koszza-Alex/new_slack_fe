"use client";

import WorkspaceAvatar from "@/components/WorkSpace/WorkspaceAvatar";
import NavItem from "@/components/WorkSpace/NavItem";
import CreateMenu from "@/components/WorkSpace/CreateMenu";
import WorkspaceMenu from "@/components/WorkSpace/WorkspaceMenu";
import { useSocket } from "@/providers/SocketProvider";
import { useSidebarStore } from "@/store/sidebar-store";
import { useActivityStore } from "@/store/activity-store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const WorkSpace = (props: { userData: any }) => {
    const { socket } = useSocket();
    const { next, prev, incrementUnread, clearUnread, setUnread, active } = useSidebarStore();
    const { unreadCount: activityUnread } = useActivityStore();
    const [userstate, setUserState] = useState<any>(null);
    const pathname = usePathname();

    // Sync activity unread count into the sidebar badge
    useEffect(() => {
        setUnread("activity", activityUnread);
    }, [activityUnread, setUnread]);

    useEffect(() => {
        if (props.userData) setUserState(props.userData);
    }, [props.userData]);

    // Clear unread for the currently active section when the user is on it
    useEffect(() => {
        if (pathname?.includes("/dm/")) {
            clearUnread("dms");
        } else if (pathname?.match(/\/[^/]+\/[^/]+/)) {
            // On a channel page
            clearUnread("home");
        }
    }, [pathname, clearUnread]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") next();
            if (e.key === "ArrowUp") prev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [next, prev]);

    // Socket: profile updates + unread badge increments
    useEffect(() => {
        if (!socket) return;

        socket.on("updated_profile", (data: any) => {
            // Accept both "id" and "userId" — ProfileSidebar emits with "id",
            // other paths may use "userId"
            const updatedId = data?.userId ?? data?.id;
            if (updatedId && props.userData?.id && updatedId === props.userData.id) {
                setUserState((prev: any) => prev ? { ...prev, dispname: data.dispname, avatar: data.avatar } : prev);
            }
        });

        // New channel message → increment "home" badge if user is not on a channel page
        socket.on("new_message", () => {
            if (!pathname?.match(/\/[^/]+\/[^/]+/) || pathname?.includes("/dm/")) {
                incrementUnread("home");
            }
        });

        // New DM message → increment "dms" badge if user is not on a DM page
        socket.on("new_dm_message", () => {
            if (!pathname?.includes("/dm/")) {
                incrementUnread("dms");
            }
        });

        return () => {
            socket.off("updated_profile");
            socket.off("new_message");
            socket.off("new_dm_message");
        };
    }, [socket, pathname, incrementUnread]);

    return (
        <div className="w-[75px] min-w-[75px] bg-gradient-to-b from-[#3F0E40] to-[#4A154B] flex flex-col items-center py-2">
            {/* Workspace avatar — shows first letter of workspace name */}
            <div className="mb-3">
                <WorkspaceAvatar userData={props.userData} />
            </div>

            <div className="flex flex-col items-center gap-4 mt-2">
                {/* hasDot removed — badge is now driven by real unread count in the store */}
                <NavItem id="home" label="Home" />
                <NavItem id="dms" label="DMs" />
                <NavItem id="activity" label="Activity" />
                <NavItem id="files" label="Files" />
                <NavItem id="more" label="More" />
            </div>

            {/* Bottom */}
            <div className="mt-auto flex flex-col items-center gap-4">
                <CreateMenu />
                <WorkspaceMenu userData={userstate} />
            </div>
        </div>
    );
};
