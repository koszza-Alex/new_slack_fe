
"use client";

import { HuddleCustomButton } from "../huddle/HuddleCustomButton";


export default function DraftsScheduledPage() {
    const ticks = Array.from({ length: 12 });

    return (
        <div className="max-h-full flex flex-col text-white relative">
            <div className="flex-1 flex items-center justify-center ">
                <div className="flex flex-col items-center text-center pt-[20vh]">
                    <div className="mb-[18px]">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <ellipse cx="60" cy="70" rx="36" ry="12" fill="#6b2c91" />
                            <ellipse cx="60" cy="60" rx="36" ry="14" fill="#d1a3ff" />
                            {ticks.map((_, i) => {
                                const angle = (360 / 12) * i;
                                return (
                                    <line
                                        key={i}
                                        x1="60"
                                        y1="48"
                                        x2="60"
                                        y2="44"
                                        stroke="#4a154b"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        transform={`rotate(${angle} 60 60)`}
                                    />
                                );
                            })}
                            <line
                                x1="60"
                                y1="60"
                                x2="60"
                                y2="50"
                                stroke="#4a154b"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="60"
                                y1="60"
                                x2="70"
                                y2="60"
                                stroke="#4a154b"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-[18px] font-[700] mb-[8px]">
                        Write now, send later
                    </h2>
                    <p className="text-[14px] text-[#c4c4c4] leading-[20px] max-w-[420px] mb-[18px]">
                        Schedule messages to be sent at a later time, or another day
                        altogether. They’ll wait here until they’re delivered.
                    </p>
                    <HuddleCustomButton
                        label="Start New Message"
                        bgColor="#e8e8e8"
                        textColor="#1d1c1d"
                        hoverColor="#dcdcdc"
                        activeColor="#cfcfcf"
                        height="36px"
                        px="16px"
                        rounded="6px"
                        fontSize="14px"
                        border="1px solid #cfcfcf"
                    />

                </div>
            </div>
        </div>
    );
}