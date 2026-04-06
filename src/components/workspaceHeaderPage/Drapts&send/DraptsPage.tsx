"use client";
import { useEffect, useState } from "react";
import DraftsSchedulePage from "./DraptSchedulePage";
import { DraptSection } from "./DraptSection";
import { DraftsHeader } from "./DraptsHeader";
import { DraptSentPage } from "./DtaptSentPage";
import { DraftsHero } from "./HeroArea";
import { DraptTabs } from "./draptsdomi";
import { Drapt1Page } from "./Drapt1Page";
import ChannelNavTabvar from "../component/channel_nav_tabvar";


export function DraftsPage() {
  const[page,setPage] =useState("Drafts1")
  return (
    <div className="flex bg-[#ffffff] text-[#313131] border border-[#797c814d] min-w-[55vw] w-full rounded-tr-[5px] rounded-br-[5px]">
      <div
        className={`
          myHuddle
          h-full
          w-[100%]
          overflow-y-auto
          scrollbar-hidden
          sidebar-scroll
          px-[0px]
          min-w-[800px]
          pt-[20px]
          pb-[100px]
        `}>
        <DraftsHeader />
        <ChannelNavTabvar setPage={setPage} tabs={DraptTabs} px="0px" />
         <DraftsHero/>
        {page==="Sent"&&<DraptSentPage/>}
        {page==="Drafts1"&&<Drapt1Page/>}
        {page==="Schedule"&&<DraftsSchedulePage />}
      </div>
    </div>
  );
}