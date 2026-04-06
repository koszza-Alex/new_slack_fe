"use client";

import { useState, useMemo } from "react";
import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { Channel } from "./domi";
import ExternalChannelsSteps from "./ExternalChannelsStep";
import DirectoriesSideshow from "./DirectoriesSideshow";
import HeroSection from "./HeroSection";
import ActionCardsSection from "./ActionCardsSection";

export default function DirectoriesExternal() {
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        const q = search.toLowerCase();

        return Channel.data.filter((item) => {
            return Object.entries(item).some(([key, val]) => {
                let searchable = String(val).toLowerCase();
                if (key === "joined") {
                    searchable = val ? "joined true" : "not joined false";
                }
                return `${key} ${searchable}`.includes(q);
            });
        });
    }, [search]);
    return (
        <div className="w-full h-full overflow-y-scroll  ">
            <div className="w-full px-[250px] flex justify-between items-end mb-[20px]">
                <div className="w-[667px]">
                    <FileSearch
                        value={search}
                        placeholder="Search for people"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <CustomButton
                    label="Create Channel"
                    showIcon={false}
                    bgColor="bg-transparent"
                    hoverColor="hover:bg-[#e1e1e1]"
                    height="h-[40px]"
                    activeColor="active:bg-[#c1c1c1]"
                    textColor="text-[#313131]"
                    paddingX="px-[12px]"
                    radius="rounded-[6px]"
                    suffix={
                        <span className="text-[10px] px-[4px] py-[1px] rounded-[4px] bg-[#2a2d31] text-[#c084fc] ml-[6px]">
                            PRO
                        </span>
                    }
                />
                <CustomButton
                    label="Start a DM"
                    showIcon={false}
                   bgColor="bg-transparent"
                    hoverColor="hover:bg-[#e1e1e1]"
                    height="h-[40px]"
                    activeColor="active:bg-[#c1c1c1]"
                    textColor="text-[#313131]"
                    paddingX="px-[10px]"
                    radius="rounded-[6px]"
                />
            </div>
            <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh] sidebar-scroll">
               
                <>
                <HeroSection/>
                <ActionCardsSection/>
                </>
                <ExternalChannelsSteps />
                <DirectoriesSideshow />

            </div>
        </div>
    );
}