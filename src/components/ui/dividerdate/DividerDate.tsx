"use client";

import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md"; // ChevronDownIcon equivalent

type DividerDateProps = {
  date: string;
};

export default function DividerDate({ date }: DividerDateProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const getSmartDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();

    if (d.toDateString() === today.toDateString()) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return formatDate(date); // your previous function
  };
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();

    // Add suffix (st, nd, rd, th)
    const getSuffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${dayName}, ${month} ${day}${getSuffix(day)}`;
  };

  return (
    <div className="sticky top-0 z-5 flex justify-center py-2 flex items-center w-full bg-white">
      {/* Left Line */}
      <div className="flex-1 h-px bg-[#E0E0E0]" />

      {/* Date Pill */}
      <div
        className="px-3 py-[6px] mx-3 text-[13px] text-[#616061] border border-[#E0E0E0] rounded-full shadow-sm cursor-pointer flex items-center"
        onClick={toggleDropdown}
      >
        {getSmartDate(date)}
        <MdArrowDropDown className="ml-2 text-[#616061]" /> {/* Chevron icon */}
      </div>

      {/* Right Line */}
      <div className="flex-1 h-px bg-[#E0E0E0]" />

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 mt-2 w-60 bg-white border border-[#E0E0E0] rounded-lg shadow-md p-1">
          <div className="p-2">
            <div className="text-sm text-gray-500">Jump to...</div>
            <ul className="space-y-1 mt-2 text-sm text-gray-700">
              <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">Most recent</li>
              <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">Last week</li>
              <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">Last month</li>
              <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">The very beginning</li>
              <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">Jump to a specific date</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}