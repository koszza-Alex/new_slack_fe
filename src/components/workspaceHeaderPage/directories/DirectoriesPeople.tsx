"use client";

import { useState, useMemo } from "react";
import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import Card from "./directories_card";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { People } from "./domi";

export default function DirectoriesPeople() {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return People.data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(q)
      )
    );
  }, [search]);

  return (
    <>
      <div className="w-full px-[250px]  flex justify-between items-end mb-[20px]">
        <div className="w-[667px]">
          <FileSearch
            value={search}
            placeholder="Search for people"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <CustomButton
          label="Invite People"
          showIcon={false}
          bgColor="bg-transparent"
          hoverColor="hover:bg-[#e1e1e1]"
          activeColor="active:bg-[#c1c1c1]"
          textColor="text-[#313131]"
          height="h-[40px]"
          paddingX="px-[10px]"
          radius="rounded-[6px]"
        />
      </div>

      <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh] overflow-y-scroll sidebar-scroll">
        <div className="w-[100%] px-[250px] mb-[20px] border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="Title" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                <DirectoriesDropdownBtn.Check label="Winrar" />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>

            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="Location" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>

            <div className="flex items-center gap-[6px] ml-[8px] text-[#38bdf8] text-[14px] font-[500] cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#38bdf8]">
                <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
              </svg>
              <span>Filters</span>
            </div>
          </div>

          <DirectoriesDropdownBtn>
            <DirectoriesDropdownBtn.Trigger placeholder="recentlyViewed" />
            <DirectoriesDropdownBtn.Content>
              {People.recentlyViewed.map((item, idx) => (
                <DirectoriesDropdownBtn.List key={idx} label={item.label} />
              ))}
            </DirectoriesDropdownBtn.Content>
          </DirectoriesDropdownBtn>
        </div>

        <div className="max-w-[100%] grid grid-cols-5 gap-[20px]">
          {filteredData.map((item, i) => (
            <Card
              key={i}
              head={item.head}
              text={item.text}
              avatar={item.avatar}
            />
          ))}
        </div>
      </div>
    </>
  );
}