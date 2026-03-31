"use client";

import WorkspaceAvatar from "@/components/WorkSpace/WorkspaceAvatar";

import NavItem from "@/components/WorkSpace/NavItem";
// import UserTooltip from "@/components/WorkSpace/UserTooltip";
import CreateMenu from "@/components/WorkSpace/CreateMenu";
import WorkspaceMenu from "@/components/WorkSpace/WorkspaceMenu";
import { useSocket } from "@/providers/SocketProvider";
import { useSidebarStore } from "@/store/sidebar-store";
import { useEffect, useState } from "react";
export const WorkSpace = (props: { userData: any }) => {
    const { socket } = useSocket();
    const { next, prev } = useSidebarStore();
    const [userstate, setUserState] = useState([]);
    useEffect(()=>setUserState(props.userData),[props])
    // ======================= KEYBOARD NAVIGATION (Slack-like)===================
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") next();
            if (e.key === "ArrowUp") prev();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [next, prev]);

    // ==============================socket========================================
    useEffect(() => {
        if (!socket) return;

        socket.on("updated_profile", (data) => {
            setUserState(data)
        });

        return () => {
            socket.off("update_profile");
        };
    }, [socket]);
    // ===========================================================================
    return (
        <div className="w-[75px] min-w-[75px]  bg-gradient-to-b from-[#4A154B] to-[#3F0E40] flex flex-col items-center py-2">
            {/* Workspace */}
            <div className="w-10 h-10 text-[22px] cursor-pointer rounded-xl bg-[#867688] flex items-center justify-center font-medium mb-3">
                <WorkspaceAvatar userData={props.userData} />
            </div>

            <div className="flex flex-col items-center gap-4 mt-2">
                <NavItem id="home" label="Home" hasDot />
                <NavItem id="dms" label="DMs" />
                <NavItem id="activity" label="Activity" />
                <NavItem id="files" label="Files" />
                <NavItem id="more" label="More" />
            </div>

            {/* Bottom */}
            <div className="mt-auto flex flex-col items-center gap-4 bt-[40px]">
                {/* <UserTooltip name="Create new"> */}
                {/* <CreateButton /> */}

                <CreateMenu />

                {/* <UserTooltip name="koszza"> */}
                <WorkspaceMenu userData={userstate} />
                {/* </UserTooltip> */}
            </div>
        </div>
    );
};
