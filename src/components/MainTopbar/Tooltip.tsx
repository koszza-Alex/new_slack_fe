"use client";

import {
    useFloating,
    offset,
    flip,
    shift,
} from "@floating-ui/react";

type TooltipProps = {
    text1: string;
    text2?: string;
    children: React.ReactNode;
    shortcut?: string[];
};

export function Tooltip({ text1, text2, children, shortcut }: TooltipProps) {
    const { refs, floatingStyles } = useFloating({
        placement: "bottom",
        middleware: [
            offset(8),
            flip(),   // auto change direction
            shift(),  // prevent overflow
        ],
    });
    return (
        <div ref={refs.setReference} className="relative group inline-flex">
            {/* Trigger */}
            {children}

            {/* Tooltip */}
            <div
                className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 max-w-[70vw] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 ease-out pointer-events-none flex justify-center">
                {/* Inner wrapper prevents overflow */}
                <div ref={refs.setFloating}
                    style={floatingStyles} className="relative ">
                    {/* Arrow */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1d1c1d] rotate-45"></div>

                    {/* Content */}
                    <div className="text-center content-center items-center  bg-[#1D1C1D] text-white text-[12px] leading-tight rounded-md shadow-lg px-3 py-2 min-w-max pointer-events-none">
                        <div className="font-semibold text-[13px]">{text1}</div>
                        <div className="text-gray-300">{text2}</div>
                        {/* Shortcut keys */}
                        {shortcut && (
                            <div className="flex gap-[4px] ml-[15%] mt-1">
                                {shortcut.map((key, i) => (
                                    <span
                                        key={i}
                                        className=" px-[5px] py-[2px] text-[12px] bg-black rounded-md font-medium">
                                        {key}
                                    </span>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}