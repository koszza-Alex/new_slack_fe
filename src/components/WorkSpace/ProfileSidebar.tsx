"use client";

import EditProfileModal from "./EditProfileModal";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/api";
import { useSocket } from "@/providers/SocketProvider";
import { useMessageStore } from "@/store/message-store";

type Presence = "online" | "idle" | "offline";

type User = {
    id: string;
    name: string;
    email: string;
    dispname: string;
    avatar?: string | null;
    presence?: Presence;
};

type Props = {
    open: boolean;
    onClose: () => void;
    userdata: any | null;
};

export default function ProfileSidebar({ open, onClose, userdata }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [localTime, setLocalTime] = useState("");

    const { socket } = useSocket();
    const { messages, setMessages } = useMessageStore();
    // ---------------------------
    // Fetch user
    // ---------------------------
    const fetchUser = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getUserById(id);

            // TEMP: simulate presence (replace with socket later)
            const presence: Presence = "online";

            setUser({ ...data, presence });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("userdata.id==============================>", userdata);

        if (open && userdata) fetchUser(userdata.id);
    }, [open, userdata]);

    // ---------------------------
    // Real Local Time (updates every minute)
    // ---------------------------
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = now.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            });
            setLocalTime(formatted);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);
    // ==============soket====================
    useEffect(() => {
        if (!socket) return;

        const handleProfileUpdated = (payload: {
            id?: string;
            userId?: string;
            name?: string;
            dispname?: string;
            avatar?: string;
        }) => {
            const updatedId = payload.id ?? payload.userId;
            setUser((prev) => {
                if (!prev || prev.id !== updatedId) return prev;
                return {
                    ...prev,
                    name: payload.name ?? prev.name,
                    dispname: payload.dispname ?? prev.dispname,
                    avatar: payload.avatar ?? prev.avatar,
                };
            });
        };

        // Listen to both event names — backend emits "updated_profile",
        // some paths emit "profile:updated"
        socket.on("profile:updated", handleProfileUpdated);
        socket.on("updated_profile", handleProfileUpdated);

        return () => {
            socket.off("profile:updated", handleProfileUpdated);
            socket.off("updated_profile", handleProfileUpdated);
        };
    }, [socket]);

    // ---------------------------
    // ESC Close
    // ---------------------------
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // ---------------------------
    // Save profile
    // ---------------------------
    // if (!user?.id) {
    //     console.error("User ID missing. Cannot update profile.");
    //     return;
    // }
    const handleSaveProfile = async (data: any) => {
        try {
            let avatar = user?.avatar ?? null;

            // ✅ SINGLE FormData (avatar + name + dispname)

            const formData = new FormData();

            formData.append("name", data.name ?? "");
            formData.append("dispname", data.dispname ?? data.name ?? "");
            // if (data.avatar) {
            //     formData.append("avatar", data.avatar);
            // }

            if (data.avatar instanceof File) {
                formData.append("avatar", data.avatar);
            }

            // ✅ DEBUG (real visibility)
            for (let [key, value] of formData.entries()) {
                // console.log(key, value);
            }
            console.log("user================>", userdata);

            // ✅ IMPORTANT: correct backend endpoint
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/user/profile/${userdata.id}`,
                {
                    method: "PUT",
                    body: formData,
                },
            );
            // console.log("res===>", res);

            if (!res.ok) {
                throw new Error("Profile update failed");
            }

            // 1. REST update
            const result = await res.json();

            // 2. socket broadcast
            socket?.emit("profile:update", {
                id: user?.id,
                name: result.name,
                dispname: result.dispname,
                avatar: result.avatar,
            });

            avatar = result.avatar ? result.avatar : avatar;

            // update zustand message store — reflect new dispname/avatar on all messages
            setMessages(
                messages.map((m) =>
                    m.sender?.id === userdata.id
                        ? {
                              ...m,
                              sender: {
                                  ...m.sender,
                                  dispname: result.dispname ?? m.sender.dispname,
                                  avatar: result.avatar ?? m.sender.avatar,
                              },
                          }
                        : m,
                ),
            );

            // ✅ KEEP YOUR EXISTING UI LOGIC
            setUser((prev) =>
                prev
                    ? {
                          ...prev,
                          name: result.name ?? data.name,
                          dispname:
                              result.dispname ?? data.dispname ?? data.name,
                          avatar,
                      }
                    : prev,
            );

            // =====================soket===================

            setEditOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // ---------------------------
    // Presence UI
    // ---------------------------
    const getPresence = () => {
        switch (user?.presence) {
            case "online":
                return {
                    color: "bg-green-500",
                    text: "Active",
                };
            case "idle":
                return {
                    color: "bg-yellow-400",
                    text: "Away",
                };
            default:
                return {
                    color: "bg-gray-400",
                    text: "Offline",
                };
        }
    };

    const presence = getPresence();

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`
                  fixed inset-0 z-40 bg-black/30
                  transition-opacity duration-300 ease-out
                  ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            />

            {/* Sidebar */}
            <div
                className={`
                  fixed right-0 top-0 h-full w-[480px] bg-gray-50 z-50
                  shadow-[-8px_0_24px_rgba(0,0,0,0.12)]
                  transform transition-transform duration-300
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 ">
                    <h2 className="text-[18px] font-semibold text-[#1d1c1de3]">
                        Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-xl text-gray-500 hover:text-black transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-5 py-5">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {user && (
                        <>
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden bg-[#7B2B8F] group">
                                    {user?.avatar ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_SOCKET_URL}${user.avatar}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-[100px] h-[100px] bg-white rounded-full" />
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div
                                        onClick={() => setEditOpen(true)}
                                        className="
                                          absolute inset-0 bg-black/40 opacity-0
                                          group-hover:opacity-100
                                          transition duration-200 ease-out
                                          flex items-center justify-center cursor-pointer
                                        "
                                    >
                                        <span className="text-white text-sm font-medium">
                                            Change photo
                                        </span>
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="flex items-start gap-70 mt-5">
                                    <div className=" text-[23px] font-semibold">
                                        {user.dispname}
                                    </div>

                                    <button
                                        onClick={() => setEditOpen(true)}
                                        className="text-[16px] font-bold text-[#1264A3] hover:underline mt-1"
                                    >
                                        Edit
                                    </button>
                                </div>

                                {/* Presence */}
                                <div>+ Add name pronunciation</div>
                                <div className="flex items-center gap-2 mt-3 text-[14px] text-gray-600">
                                    <div
                                        className={`w-[8px] h-[8px] rounded-full ${presence.color}`}
                                    />
                                    {presence.text}
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-2 mt-2 text-[13px] text-gray-500">
                                    🕒 {localTime} local time
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-5">
                                <button className="flex-1 h-[36px] border rounded-md hover:bg-gray-100 transition">
                                    Set a status
                                </button>
                                <button className="flex-1 h-[36px] border rounded-md hover:bg-gray-100 transition">
                                    View as
                                </button>
                                <button className="w-[36px] border rounded-md hover:bg-gray-100 transition">
                                    ⋮
                                </button>
                            </div>

                            {/* Contact */}
                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[14px]">
                                        Contact information
                                    </span>
                                    <button className="text-[#1264A3] text-sm hover:underline">
                                        Edit
                                    </button>
                                </div>

                                <div className="mt-3">
                                    <div className="text-xs text-gray-500">
                                        Email Address
                                    </div>
                                    <div className="text-sm text-[#1264A3]">
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[14px]">
                                        About me
                                    </span>
                                    <button className="text-[#1264A3] text-sm hover:underline">
                                        Edit
                                    </button>
                                </div>

                                <div className="mt-2 text-sm text-[#1264A3] cursor-pointer hover:underline">
                                    + Add Start Date
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <EditProfileModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSave={handleSaveProfile}
                userdata={user}
            />
        </>
    );
}
