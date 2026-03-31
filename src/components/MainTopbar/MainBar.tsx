"use client";

import { BiSolidMessageRounded } from "react-icons/bi";
import { CanvasMenu } from "./CanvasMenu";
import CreateMenu from "./CreateMenu";

export default function TopBar() {

    return (
        <div className="w-full h-[44px] border-b border-gray-200 flex items-end justify-between px-3 text-gray-700">

            {/* LEFT */}
            <div className="flex items-end gap-2 h-full">
                <button className="flex items-center rounded-md hover:bg-gray-100 gap-2 text-[13px] font-medium text-black relative p-2 cursor-pointer">
                    <BiSolidMessageRounded size={20} />
                    <span>Messages</span>

                    {/* underline */}
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#410f41] rounded-full" />
                </button>
                <CanvasMenu />
                <CreateMenu />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 pb-1">

            </div>
        </div>
    );
}