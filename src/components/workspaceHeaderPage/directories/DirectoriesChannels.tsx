"use client";

import { useState, useMemo } from "react";
import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { Channel } from "./domi";
import { FiLock } from "react-icons/fi";
import DirectoriesChannelsItem from "./DirectoriesChannelsItem";
import BannerSection from "./BannerSection";

export default function DirectoriesChannel() {
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
        <div className="w-ull h-full overflow-y-scroll">
            <div className="w-full px-[250px]  flex justify-between items-end mb-[20px]">
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
                    activeColor="active:bg-[#c1c1c1]"
                    textColor="text-[#313131]"
                    height="h-[32px]"
                    paddingX="px-[12px]"
                    radius="rounded-[6px]"
                    suffix={
                        <span className="text-[10px] px-[4px] py-[1px] rounded-[4px] bg-[#2a2d31] text-[#313131] ml-[6px]">
                            PRO
                        </span>
                    }
                />
             
            </div>
            <BannerSection />
            <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh] sidebar-scroll">
                <div className="w-[100%] px-[250px] mb-[20px] border-[#e1e1e1] flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="All channels" />
                            <DirectoriesDropdownBtn.Content>
                                {Channel.Allchannels.map((item, i) => (
                                    <DirectoriesDropdownBtn.Radio key={i} label={item.label} />
                                ))}
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Any channel type" />
                            <DirectoriesDropdownBtn.Content>
                                {Channel.anychanneltype.map((item, i) => (
                                    <DirectoriesDropdownBtn.Radio
                                        key={i}
                                        label={item.label}
                                        icon={item.icon}
                                    />
                                ))}
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Workspaces" />
                            <DirectoriesDropdownBtn.Content>
                                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                                <DirectoriesDropdownBtn.Radio label="Workspaces" />
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Organization" />
                            <DirectoriesDropdownBtn.Content>
                                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <div className="flex items-center gap-[6px] ml-[8px] text-[#313131] text-[14px] font-[500] cursor-pointer">
                            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#38bdf8]">
                                <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
                            </svg>
                            <span>Filters</span>
                        </div>
                    </div>

                    <DirectoriesDropdownBtn>
                        <DirectoriesDropdownBtn.Trigger placeholder="Most recommended" />
                        <DirectoriesDropdownBtn.Content>
                            {Channel.Mostrecommended.map((item, i) => (
                                <DirectoriesDropdownBtn.Radio key={i} label={item.label} />
                            ))}
                        </DirectoriesDropdownBtn.Content>
                    </DirectoriesDropdownBtn>
                </div>

                <div className="max-w-[100%]   w-[calc(100vw-950px)] overflow-hidden border-[1px] rounded-[15px]">
                    {filteredData.map((item, i) => (
                        <DirectoriesChannelsItem
                            key={i}
                            icon={FiLock}
                            title={item.title}
                            comment={item.comment}
                            members={item.members}
                            joined={item.joined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}