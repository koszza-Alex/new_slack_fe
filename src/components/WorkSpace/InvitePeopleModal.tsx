"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function InvitePeopleModal({ open, onClose }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const workspaceName = useSearchParams().get("workspace_name");

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;
    const onSubmit = async () => {
        if (!inviteEmail) return alert("input email!");
        const res = await fetch("http://192.168.137.98:5050/api/auth/invited-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: inviteEmail,
                workspaceName: workspaceName,
            }),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/30" />

            {/* MODAL */}
            <div
                ref={ref}
                className="
          relative z-10
          w-[680px]
          bg-white
          rounded-lg
          shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4">
                    <h2 className="text-[18px] font-semibold text-[#1D1C1D]">
                        Invite people to NC
                    </h2>

                    <button
                        className="text-gray-500 cursor-pointer hover:text-black"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="px-6 pb-5 space-y-4">
                    {/* TO */}
                    <div>
                        <div className="text-[13px] mb-1 text-[#1D1C1D]">
                            To:
                        </div>
                        <input
                            placeholder="name@outlook.com"
                            value={inviteEmail}
                            onChange={(e) => {
                                setInviteEmail(e.target.value);
                            }}
                            className="
                              w-full
                              h-[77px]
                              px-3
                              text-[14px]
                              text-black
                              border border-gray-300
                              rounded-md
                              outline-none
                              align-top
                              focus:ring-2 focus:ring-[#1d9bd1]
                              focus:border-[#1d9bd1]
                            "
                        />
                    </div>

                    {/* OR DIVIDER */}
                    <div className="flex items-center gap-3 text-[12px] text-gray-400">
                        <div className="flex-1 h-[1px] bg-gray-200" />
                        <span>OR</span>
                        <div className="flex-1 h-[1px] bg-gray-200" />
                    </div>

                    {/* GOOGLE */}
                    <button
                        className="
                          w-full h-[40px]
                          flex items-center justify-center gap-2
                          border border-gray-300 rounded-md
                          text-[14px]
                          hover:bg-gray-50
                        "
                    >
                        <img src="/svg/google.png" className="w-4 h-4" />
                        Continue with Google Workspace
                    </button>

                    {/* ROLE */}
                    <div>
                        <div className="text-[13px] mb-1 text-[#1D1C1D]">
                            Invite as:
                        </div>
                        <div
                            className="
                              h-[40px]
                              px-3
                              border border-gray-300
                              rounded-md
                              flex items-center justify-between
                              text-[14px]
                              cursor-pointer
                            "
                        >
                            Member
                            <span className="text-gray-400">▾</span>
                        </div>
                    </div>

                    {/* INFO */}
                    <div
                        className="
                          bg-[#f8f8f8]
                          border border-gray-200
                          text-[13px]
                          px-3 py-2.5
                          rounded-md
                          relative
                        "
                    >
                        Working with people from external organizations? See
                        options for inviting them to your channel with{" "}
                        <span className="text-blue-600 cursor-pointer">
                            Slack Connect
                        </span>{" "}
                        or guest accounts.
                        <button className="absolute cursor-pointer right-2 top-2 text-gray-400">
                            ✕
                        </button>
                    </div>

                    {/* CHANNEL */}
                    <div>
                        <div className="text-[13px] text-[#1D1C1D] font-medium">
                            Add to team channels{" "}
                            <span className="text-gray-400 font-normal">
                                (optional)
                            </span>
                        </div>

                        <div className="text-[12px] text-gray-500 mb-2">
                            Make sure your teammates are in the right
                            conversations from the get go.
                        </div>

                        <div className="text-[12px] mb-2">
                            Suggested:{" "}
                            <span className="bg-blue-100 text-blue-700 px-2 py-[2px] rounded">
                                + #security
                            </span>
                        </div>

                        <input
                            placeholder="Search channels"
                            className="
                              w-full
                              h-[40px]
                              px-3
                              text-[14px]
                              border border-gray-300
                              rounded-md
                            "
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between px-6 py-3 border-t">
                    <button className="text-[13px] cursor-pointer text-blue-600 hover:underline">
                        Copy invite link
                    </button>

                    <button
                        className="
                          h-[36px]
                          px-4
                          rounded-md
                          text-[14px]
                          bg-gray-200 text-gray-500
                          pointer
                        "
                        onClick={onSubmit}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
