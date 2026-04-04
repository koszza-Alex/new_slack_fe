"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import SlackMessage from "../ui/message/Message";

export default function SearchBox(props: { userData: any }) {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    /* ✅ FIXED: find workspaceId correctly */

    const params = useParams();
    // const workspaceID = params('workspaceId')
    const workspaceID = Array.isArray(params.workspaceId)
        ? params.workspaceId[0]
        : params.workspaceId;
    const channelId = Array.isArray(params.channelId)
        ? params.channelId[0]
        : params.channelId;
    /* search */
    const [search_keyword, setSearchKeyword] = useState("");

    const [results, setResults] = useState<any[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    /* Ctrl + K */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen(true);
            }

            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    /* click outside */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* autofocus */
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open]);

    /* 🔥 SEARCH API */
    useEffect(() => {
        if (!search_keyword.trim() || !workspaceID) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                console.log("workspaceID:", workspaceID);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/multi-search?keyword=${search_keyword}&workspaceId=${workspaceID}`,
                );

                const data = await res.json();

                if (!res.ok) {
                    console.error(data);
                    return;
                }

                setResults(data);
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search_keyword, workspaceID]);

    /* 🔥 CLICK RESULT → MAIN PAGE */
    const handleItemClick = (item: any) => {
        setOpen(false);
        setSearchKeyword("");

        console.log("Clicked:", item);

        /* Navigate based on type */

        if (item.type === "channel") {
            router.push(
                // `/workspace/${workspaceID}/channel/${item.id}`
                `/${workspaceID}/${item.id}`,
            );
        } else if (item.type === "message") {
            router.push(`/${workspaceID}/${item.channelId}?messageId=${item.id}`);
        }
    };
    // console.log(results, "-------------------------------<<<<<<<<<<<<<<<<<<<<<<<<")
    return (
        <div className="flex-1 flex justify-center">
            <div ref={containerRef} className="w-full relative">
                {/* COLLAPSED */}

                {!open && (
                    <div
                        onClick={() => setOpen(true)}
                        className="
              h-[28px]
              flex items-center px-2
              rounded-md
              bg-white/[0.10]
              hover:bg-white/[0.14]
              cursor-text
            "
                    >
                        <FiSearch
                            size={15}
                            className="text-white/50 mr-[6px]"
                        />

                        <input
                            readOnly
                            placeholder='Try asking "Where is the message about ___?"'
                            className="
                w-full
                bg-transparent
                outline-none
                text-[13px]
                placeholder:text-white/90
                cursor-text
              "
                        />
                    </div>
                )}

                {/* EXPANDED */}

                {open && (
                    <div
                        className="
              absolute left-0 w-full
              bg-white text-black
              rounded-md shadow-lg
              border
              overflow-hidden
              z-500
            "
                    >
                        {/* INPUT */}

                        <div className="flex items-center px-3 h-[40px] border-b">
                            <FiSearch
                                size={16}
                                className="text-gray-500 mr-2"
                            />

                            <input
                                ref={inputRef}
                                value={search_keyword}
                                onChange={(e) =>
                                    setSearchKeyword(e.target.value)
                                }
                                placeholder="Search..."
                                className="flex-1 outline-none text-[14px]"
                            />

                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        {/* RESULTS */}

                        <div className="max-h-[300px] overflow-y-auto">
                            {results.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    Search messages, files and more
                                </div>
                            ) : (
                                // null
                                results.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            handleItemClick(item);
                                        }}
                                    >
                                        <SlackMessage
                                            avatar="/avatar.png"
                                            username={item.title}
                                            time={""}
                                            text={item.desc}
                                            messageId={item.id}
                                            files={[]}
                                            reactions={[]}
                                            replies={0}
                                            lastReply="16 hours ago"
                                            onCommentClick={() => {}}
                                            state="search"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-between px-4 py-2 text-xs text-gray-500 border-t">
                            <div>↑ ↓ Select</div>

                            <div className="text-blue-500 cursor-pointer">
                                Give feedback
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ITEM COMPONENT */

function Item({
    title,
    desc,
    onClick,
}: {
    title: string;
    desc: string;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="
        px-4 py-2
        hover:bg-gray-100
        cursor-pointer
      "
        >
            <div className="font-medium text-sm">{title}</div>

            <div className="text-xs text-gray-500">{desc}</div>
        </div>
    );
}
