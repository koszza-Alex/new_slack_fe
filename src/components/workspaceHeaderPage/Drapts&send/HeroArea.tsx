
"use client";

import { useState } from "react";

export function DraftsHero() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="px-[24px] pt-[20px] mb-[50px]">
      <div
        className="
          w-full flex items-center justify-between
          bg-[#f4ede4]
          border-none 
          rounded-[12px]
          px-[20px] py-[18px]
        "
      >
        {/* Left Content */}
        <div>
          <h2 className="text-[16px] font-[700] text-white">
            All your outgoing messages
          </h2>
          <p className="text-[13px] text-[#c4c4c4] mt-[4px]">
            Everything you send, draft, and schedule can now be found here.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-start gap-[12px]">
          {/* Illustration */}
         <div className="w-[100px] h-[100px] rounded-full bg-[#611f69] flex items-center justify-center">
                        <svg
                            width="100"
                            height="100"
                            viewBox="0 0 56 56"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Background Circle */}
                            <circle cx="28" cy="28" r="28" fill="#611f69" />

                            {/* Hand */}
                            <path
                                d="M10 36c4-6 10-8 16-6l6 2c2 1 4 0 5-2l2-4c1-2 3-3 5-2 2 1 2 3 1 5l-3 6c-2 4-6 6-10 5l-10-3c-4-1-8-1-12-1z"
                                fill="#f2a46f"
                            />

                            {/* Envelope */}
                            <rect x="20" y="18" width="22" height="14" rx="3" fill="#f4c6cc" />

                            {/* Envelope flap */}
                            <path
                                d="M20 20L31 27L42 20"
                                stroke="#1d1c1d"
                                strokeWidth="1.5"
                            />

                            {/* Paper */}
                            <rect x="24" y="14" width="14" height="8" rx="2" fill="#ffffff" />
                            <line x1="26" y1="17" x2="34" y2="17" stroke="#ccc" strokeWidth="1" />
                            <line x1="26" y1="19" x2="32" y2="19" stroke="#ccc" strokeWidth="1" />
                        </svg>
                    </div>

          {/* Close Button */}
          <button
            onClick={() => setVisible(false)}
            className="
              text-[#313131]
              text-[26px]
              leading-none
              bg-[unset]
              border-none
              px-[6px] py-[2px]
              rounded-[4px]
              transition-colors duration-200
              hover:bg-[#e1e1e1]
            "
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}