"use client";

import {  faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Tab = {
    ico?: IconDefinition;
    label: string;
    
 
};

type TabsProps = {
    tabs: Tab[];
    px?:string
};

export default function ChannelNavTabvar({ tabs,setPage ,px}: TabsProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className={`w-full bg-[unset] `}>
            {/* Tab headers */}
            <div className={`flex bg-[unset]  border-b h-[38px] ${px&&px} border-[#d5d6d7]`}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => {setActiveIndex(index);
                            setPage(tab.label)
                        }}
                        className={`px-[16px] py-[8px] text-[14px]  bg-[unset] 
                                    border-none font-[500] transition-all duration-200 relative
                        ${activeIndex === index
                               
                            }`}
                    >
                        {tab.ico &&<FontAwesomeIcon icon={tab.ico} className="text-[16px]" />}
                        {tab.label}

                        {/* underline */}
                        {activeIndex === index && (
                            <span className="absolute left-[0px] bottom-[0px] w-full 
                                h-[2px] bg-[#83388a]" />
                        )}
                    </button>
                ))}
                 {px?"":<button
                    className={`flex items-center justify-center bg-[#1e1e1e] border-none
                        rounded-[50%] hover:bg-[#313131] hover:text-[#ffffff] mt-[10px]
                        text-[#9ca3af] w-[20px] h-[20px] transition-all duration-[0.2s] relative`}
                >
                    <FontAwesomeIcon icon={faPlus} className="text-[16px]" />
                </button>}
            </div>
        </div>
    );
}