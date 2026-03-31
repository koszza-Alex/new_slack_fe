"use client"

import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { BsPerson, BsThreeDotsVertical } from "react-icons/bs";
import { CiHeadphones } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { HiOutlineStar } from "react-icons/hi";
import { LuBell } from "react-icons/lu";
import { Tooltip } from "./Tooltip";
import Starred from "./Starred";


export default function MainTopBar  ( ) {
  const params = useParams();
  const activeChannel = params.id;
  return (
    <div className="flex justify-between items-center h-[49px] px-4 py-2 ">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Starred />
        {/* <Tooltip children={<span className="font-semibold text-x cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"> 
          {userlength==2? <img src={avatar} className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center" /> : "#" }</span>} text1="Get channel details" /> */}
        <Tooltip children={<span className="font-semibold text-x text-gray-700 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"> 
         #{activeChannel}</span>} text1="Get channel details" />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* Members */}
        <Tooltip children={<button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
          <BsPerson color="#5d524c" size={20} />
          <span className="text-sm text-[#5d524c]">2</span>
        </button>} text1="View all members of this channel" />


        {/* Huddle */}
        {/* LEFT: Main Action */}
        <div
          className="
        flex items-center
        border border-gray-300
        rounded-md
        bg-white
        transition
      "
        >
          <Tooltip children={<button
            className="flex items-center gap-1 p-1 text-sm hover:bg-gray-200 cursor-pointer">
            <CiHeadphones color="#5d524c" size={20} className="text-[15px]" />
            <span className="text-[#5d524c]">Huddle</span>
          </button>
          } text1={`Start Huddle in #${activeChannel}`} shortcut={["Ctrl", "Alt", "Shift", "H"]} />

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300" />

          {/* RIGHT: Dropdown */}
          <Tooltip children={<button
            className="
          p-1.5
          hover:bg-gray-200
          cursor-pointer
        "
          >
            <ChevronDown color="#5d524c" size={15} />
          </button>} text1="More Huddles options" />
        </div>

        {/* Bell */}
        <Tooltip children={<button className="p-1 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer">
          <LuBell color="#5d524c" size={20} />
        </button>} text1="Edit notifications" text2="Current: All new posts" />

        {/* Search */}
        <Tooltip children={<button className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
          <FiSearch color="#5d524c" size={20} />
        </button>} text1="Search in channel(Ctrl+F)" />


        {/* More */}
        <Tooltip children={<button className="p-2 border border-white rounded-md hover:bg-gray-100 cursor-pointer">
          <BsThreeDotsVertical color="#5d524c" size={20} />
        </button>
        } text1="More actions" />

      </div>
    </div>
  );
}