"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { External } from "./domi";
import DirectoriesSideItem from "./DirectoriesSideItem";

export default function TestimonialSlider() {
    const [index, setIndex] = useState(0);

    const prev = () =>
        setIndex((i) => (i === 0 ? External.length - 1 : i - 1));

    const next = () =>
        setIndex((i) => (i === External.length - 1 ? 0 : i + 1));

    return (
        <div className="w-full flex justify-center px-[250px] py-[60px]">
            <div className="relative flex items-center max-w-[1000px] w-full">
                <a
                    onClick={prev}
                    className="absolute left-[-48px] top-1/2 -translate-y-1/2
                        flex items-center justify-center
                        w-[36px] h-[36px] hover:bg-[#717171]
                         rounded-[50%]
                        text-[#313131] hover:text-[white]
                        transition"
                >
                    <ChevronLeft size={22} />
                </a>
                <div className="w-full bg-[#f1f1f1] h-[200px] rounded-[16px] px-[40px] py-[30px] shadow-sm overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${index * 100}%)`,
                            width: `${External.length * 100}%`,
                        }}
                    >
                        {External.map((slide, i) => (
                            <DirectoriesSideItem
                                key={i}
                                quote={slide.quote}
                                name={slide.name}
                                role={slide.role}
                                image={slide.image}
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex gap-[6px]">
                        {External.map((_, i) => (
                            <div
                                key={i}
                                className={`w-[6px] h-[6px] rounded-full ${i === index ? "bg-[white]" : "bg-[#6b7280]"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <a
                    onClick={next}
                    className="absolute right-[-48px] top-1/2 -translate-y-1/2
                        flex items-center justify-center
                        rounded-[50%]
                        w-[36px] h-[36px] hover:bg-[#717171]
                        text-[#313131] hover:text-[white]
                        transition"
                      
                >
                    <ChevronRight size={22} />
                </a>
            </div>
        </div>
    );
}