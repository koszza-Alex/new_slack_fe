"use client";

import { addReaction } from '@/lib/api/reactions';
import DOMPurify from 'dompurify';
import dynamic from "next/dynamic"; // For dynamic imports
import React, { useState } from "react";
import { FaEllipsisV, FaFileAlt, FaFileImage, FaRegBookmark, FaRegCommentDots, FaRegShareSquare } from "react-icons/fa";
import { LuSmilePlus } from "react-icons/lu";
import { PiListStarBold } from "react-icons/pi";
// Dynamically import the EmojiPicker to disable SSR
const EmojiPicker = dynamic(() => import("../emoji-picker/EmojiPicker"), { ssr: false });

interface Reaction {
    emoji: string;
    count: number;
}

interface FileItem {
    name: string;
    type: string;
}

interface SlackMessageProps {
    state: string;
    avatar: string;
    username: string;
    time: string;
    text: string;
    files: FileItem[];
    reactions: Reaction[];
    replies: number;
    lastReply: string;
    messageId: string;
    onCommentClick: () => void; // Function to handle the comment click
}

export const SlackMessage: React.FC<SlackMessageProps> = ({
    state,
    avatar,
    username,
    time,
    text,
    files,
    reactions,
    replies,
    lastReply,
    messageId,
    onCommentClick, // Add onCommentClick as a prop

}) => {


    const [showToolbar, setshowToolbar] = useState(false);
    const [showFiles, setShowFiles] = useState(true);
    const [downloadTxt, setDownloadTxt] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSmileyClick = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiSelect = async (emoji: string) => {
        try {
            setShowEmojiPicker(false);

            const updated = await addReaction(messageId, emoji);

            console.log("Updated reactions:", updated);

            // TODO (next step): update UI state
        } catch (err) {
            console.error(err);
        }
    };
    // const texthtml = generateHTML({text}, [StarterKit]);
    const isImage = (type: string) => {
        return ["png", "jpg", "jpeg", "gif", "webp"].includes(type.toLowerCase());
    };
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(":", ".");
    };
    return (
        <div className="relative flex gap-3 px-[25px] py-2 bg-white text-gray-500 hover:bg-gray-100 w-full" onMouseOver={() => setshowToolbar(true)} onMouseLeave={() => { setshowToolbar(false), setShowEmojiPicker(false) }}>
            {/* Slack-style Hover Toolbar */}
            {state !== "search" && showToolbar ?
                <div className="absolute right-4 top-[-20px] flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-1 z-11">
                    {/* Reactions */}
                    <img src="/emoticons/tick.png" className="p-1 rounded-md hover:bg-gray-100" />
                    <img src="/emoticons/eye.png" className="p-1 rounded-md hover:bg-gray-100" />
                    <img src="/emoticons/welcome.png" className="p-1 rounded-md hover:bg-gray-100" />

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Actions */}
                    <button className="p-1.5 rounded-md hover:bg-gray-100" onClick={handleSmileyClick}>
                        <LuSmilePlus />
                    </button>
                    {state === "message" ?
                        <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100" onClick={onCommentClick}>
                            <FaRegCommentDots />
                        </button>
                        :
                        null
                    }
                    <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
                        <FaRegShareSquare />
                    </button>
                    <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
                        <FaRegBookmark />
                    </button>
                    <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
                        {/* <FaStar /> */}
                        <PiListStarBold />
                    </button>
                    <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
                        <FaEllipsisV />
                    </button>
                </div>
                :
                null
            }


            {/* Avatar */}
            <img src={avatar} className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center" />

            {/* Content */}
            <div className="flex-1 w-full">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                        {username}
                    </span>
                    <span className="text-sm text-gray-500">{formatTime(time)}</span>
                </div>

                <div className="text-gray-800 mt-1" dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(text),
                }} />
                {
                    state == "search" ? null :
                        <div>
                            {/* Files */}
                            {files ?
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                                        <span className="cursor-pointer flex items-center gap-1" onClick={() => setShowFiles(!showFiles)}>
                                            {files.length} files {showFiles ? "▲" : "▼"}
                                        </span>
                                        <span className="relative group cursor-pointer" onMouseOver={() => setDownloadTxt(`${files.length} files available to download`)} onMouseLeave={() => setDownloadTxt('')}>
                                            Download all
                                            {downloadTxt ? <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">{downloadTxt}</span> : null}
                                        </span>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFiles ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                                        <div className="flex gap-3 flex-wrap">
                                            {files?.map((file, i) => (
                                                <div key={i} style={{ transitionDelay: `${i * 50}ms` }} className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm w-[220px] transform transition-all duration-300 ${showFiles ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center text-sm text-white">
                                                        {isImage(file.type) ? (
                                                            <img
                                                                src={'/' + file.name}
                                                                alt={file.name}
                                                                className="w-10 h-10 object-cover rounded-xl"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-semibold uppercase">
                                                                {file.type?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">{file.name}</span>
                                                        <span className="text-xs text-gray-500">{file.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                            }
                            {reactions ?
                                <div className="flex gap-2 mt-3 flex-wrap items-center">
                                    {reactions?.map((r, i) => (
                                        <div key={i} className="flex items-center gap-1 px-2 py-[4px] bg-blue-50 border border-blue-500 rounded-full text-xs hover:bg-gray-100 cursor-pointer shadow-sm">
                                            <span>{r.emoji}</span>
                                            <span className="text-blue-500 font-bold">{r.count}</span>
                                        </div>
                                    ))}
                                    <LuSmilePlus />
                                </div>
                                : null
                            }

                            {/* Replies */}
                            {replies && state === "message" ?
                                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                    <img src="/avatar.png" alt="no_avatar" className="w-[25px] h-[25px] rounded-lg bg-yellow-100" />
                                    <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => onCommentClick()}>{replies} replies</span>
                                    <span>Last reply {lastReply}</span>
                                </div>
                                :
                                null
                            }
                        </div>
                }
            </div>

            {/* Show Emoji Picker if visible */}
            {showEmojiPicker && (
                <div className="absolute top-125 right-92 z-20">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                </div>
            )}
        </div>
    );
};
export default SlackMessage;
