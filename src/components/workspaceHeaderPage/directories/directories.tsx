"use client";
import { useState } from "react";
import { tabs } from "./domi";
import DirectoriesPeople from "./DirectoriesPeople";
import DirectoriesChannel from "./DirectoriesChannels";
import DirectoriesExternal from "./DirectoriesExternal";
import DirectoriesInvitation from "./DirectoriesInvitation";
import DirectoriesUserGroup from "./DirectoriesUserGroups";
import ChannelNavTabvar from "../component/channel_nav_tabvar";

export default function Directories() {
    const [page, setPage] = useState("people")
    return (
        <div className="flex bg-[#ffffff] text-[#313131] border-none border-[#797c814d]
         w-[calc(100vw-430px)] overflow-hidden rounded-tr-[5px] rounded-br-[5px]">
            <div className="w-[100%] h-[100%]">
                <div className="flex items-center justify-between px-[250px]
              h-[49px]  border-none border-[#2c2d30]">
                    <span className="text-[#313131]">Directories</span>
                </div>

                <div className="w-full    border-[#ffffff]">
                    <ChannelNavTabvar setPage={setPage} tabs={tabs} px="px-[250px]" />
                    {page === "people" && <DirectoriesPeople />}
                    {page === "Channels" && <DirectoriesChannel />}
                    {page === "External" && <DirectoriesExternal />}
                    {page === "Invitation" && <DirectoriesInvitation />}
                    {page === "User Groups" && <DirectoriesUserGroup />}
                </div>
            </div>
        </div>
    );
}