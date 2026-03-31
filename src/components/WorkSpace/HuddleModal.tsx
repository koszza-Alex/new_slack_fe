"use client";

import { useEffect, useRef } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function HuddleModal({ open, onClose }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);

    // Close on ESC
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* MODAL */}
            <div
                ref={ref}
                className="
                  relative z-10
                  w-[550px]
                  bg-white
                  rounded-xl
                  shadow-2xl
                  p-5
                  animate-in fade-in zoom-in-95 duration-150
                "
            >
                {/* HEADER */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <div className="text-[16px] font-semibold text-[#1D1C1D]">
                            Start a Huddle
                        </div>
                        <div className="text-[13px] text-gray-500">
                            Find a person or channel to huddle with
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* INPUT */}
                <input
                    type="text"
                    placeholder="Search by name"
                    className="
                      w-full
                      px-3 py-2
                      text-[14px]
                      border border-gray-300
                      rounded-md
                      outline-none
                      focus:ring-2 focus:ring-[#1d9bd1]
                      focus:border-[#1d9bd1]
                    "
                />

                {/* INFO BOX */}
                <div className="mt-3 p-3 rounded-md bg-[#f4ede4]     border border-gray-300 border-color-[red] text-[13px] text-[#1D1C1D]">
                    <b>Huddles with more than two people is a paid feature,</b>
                    available with your free trial through April 16th.
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-10">
                    <button
                        onClick={onClose}
                        className="
                          px-4 py-1.5
                          text-[14px]
                          rounded-md
                          border border-gray-300
                          hover:bg-gray-100
                          font-bold
                        "
                    >
                        Cancel
                    </button>

                    <button
                        className="
                          px-4 py-1.5
                          text-[14px]
                          rounded-md
                          bg-gray-200 text-gray-500
                          cursor-not-allowed
                          font-bold
                        "
                    >
                        Start a Huddle
                    </button>
                </div>
            </div>
        </div>
    );
}
