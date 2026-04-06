"use client";

import { useState } from "react";
import { DirectMessagesSection } from "./DirectMessageSection";
import { HuddleHeroSection } from "./HuddleHeroSection";
import { ChannelsSection } from "./ChannelsSection";
import { FloatingActionButton } from "./FloatingActionButton";
import { HuddlesHeader } from "./HuddleHeader";
import DirectoriesDropdownBtn from "../directories/DirectoriesDropdownBtn";
import { HuddlieBase } from "./huddleDomi";

export default function HuddlePage() {
  const [showHero, setShowHero] = useState(true);

  return (
    <div
      className={`
          myHuddle
    h-full
    w-[100%]
    bg-[#ffffff]
    overflow-y-auto
    scrollbar-hidden
    sidebar-scroll
    px-[0px]
    min-w-[800px]
    pt-[20px]
    pb-[100px]
  `}>
      <div className="max-w-[1064px] mx-auto px-[48px] pt-[20px] pb-[100px]">

        <HuddlesHeader />

        {showHero && (
          <div className="mt-[20px]">
            <HuddleHeroSection onClose={() => setShowHero(false)} />
          </div>
        )}

        <div className={showHero ? "mt-[24px]" : "mt-[20px]"}>
          <DirectMessagesSection />
        </div>
        <div className="w-[100%] mb-[20px] border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="All channels" />
              <DirectoriesDropdownBtn.Content>
                {HuddlieBase.allHuddlies.map((item, i) => (
                  <DirectoriesDropdownBtn.Radio key={i} label={item} />
                ))}
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>

            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="with" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>

            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="in" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                <DirectoriesDropdownBtn.Radio label="Workspaces" />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>
          </div>


        </div>
        <div className="mt-[28px]">
          <ChannelsSection />
        </div>

      </div>

      <FloatingActionButton />
    </div>
  );
}