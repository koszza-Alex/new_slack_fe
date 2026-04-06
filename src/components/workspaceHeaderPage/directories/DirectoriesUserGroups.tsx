"use client";

import { useState, useMemo } from "react";
import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { Channel } from "./domi";

export default function DirectoriesUserGroup() {
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
    <div className="w-full h-full ">
      <div className="w-full px-[250px] flex justify-between items-end mb-[20px]">
       
          <FileSearch
            value={search}
            placeholder="Search for people"
            onChange={(e) => setSearch(e.target.value)}
          />
        

      </div>
      <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh] sidebar-scroll">
        <div className="w-[100%] px-[250px] mb-[20px] border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
          

            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="Workspaces" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                <DirectoriesDropdownBtn.Radio label="Workspaces" />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>

           
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

        {/* <div className="max-w-[100%] overflow-hidden overflow-y-scroll w-[calc(100vw-950px)] min-h-[100px] border-[1px] rounded-[15px]">
          {filteredData.map((item, i) => (
            <DirectoriesChannelsItem
              key={i}
              icon={faLock}
              title={item.title}
              comment={item.comment}
              members={item.members}
              joined={item.joined}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}