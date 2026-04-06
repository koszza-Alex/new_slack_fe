import { faAdjust, faBaby, faChainBroken, faExternalLink, faIndent, faLock, faTable, faUnlockKeyhole, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import DirectoriesUserGroup from "./DirectoriesUserGroups";
import DirectoriesExternal from "./DirectoriesExternal";

import DirectoriesInvitation from "./DirectoriesInvitation";
import DirectoriesPeople from "./DirectoriesPeople";
import DirectoriesChannel from "./DirectoriesChannels";

export const tabs = [
    {
        ico: faUser,
        label: "people",
        content: <div><DirectoriesPeople/></div>
    },
    {
        ico: faChainBroken
        ,
        label: "Channels",
        content: <div><DirectoriesChannel/></div>,
    },
    {
        ico: faUsers,
        label: "User Groups",
        content: <div><DirectoriesUserGroup/></div>,
    },
    {
        ico: faExternalLink,
        label: "External",
        content: <div><DirectoriesExternal/></div>,
    },
    {
        ico: faIndent,
        label: "Invitation",
        content: <div><DirectoriesInvitation/></div>,
    },

];

export const People = {
    data: [
        { head: "Boss", text: "Leader", avatar: "/Untitled.png" },
        { head: "User", text: "Member", avatar: "/Untitled.png" },
        { head: "Ninja", text: "Anime", avatar: "/Untitled.png" },
        { head: "Default", text: "Guest", avatar: "/Untitled.png" },
        { head: "Green", text: "User", avatar: "/Untitled.png" },
        { head: "A", text: "Role", avatar: "/Untitled.png" },
        { head: "B", text: "Role", avatar: "/Untitled.png" },
        { head: "C", text: "Role", avatar: "/Untitled.png" },
        { head: "D", text: "Role", avatar: "/Untitled.png" },
        { head: "E", text: "Role", avatar: "/Untitled.png" },
        { head: "Boss", text: "Leader", avatar: "/Untitled.png" },
        { head: "User", text: "Member", avatar: "/Untitled.png" },
        { head: "Ninja", text: "Anime", avatar: "/Untitled.png" },
        { head: "Default", text: "Guest", avatar: "/Untitled.png" },
        { head: "Green", text: "User", avatar: "/Untitled.png" },
        { head: "A", text: "Role", avatar: "/Untitled.png" },
        { head: "B", text: "Role", avatar: "/Untitled.png" },
        { head: "C", text: "Role", avatar: "/Untitled.png" },
        { head: "D", text: "Role", avatar: "/Untitled.png" },
        { head: "E", text: "Role", avatar: "/Untitled.png" },
        { head: "Boss", text: "Leader", avatar: "/Untitled.png" },
        { head: "User", text: "Member", avatar: "/Untitled.png" },
        { head: "Ninja", text: "Anime", avatar: "/Untitled.png" },
        { head: "Default", text: "Guest", avatar: "/Untitled.png" },
        { head: "Green", text: "User", avatar: "/Untitled.png" },
        { head: "A", text: "Role", avatar: "/Untitled.png" },
        { head: "B", text: "Role", avatar: "/Untitled.png" },
        { head: "C", text: "Role", avatar: "/Untitled.png" },
        { head: "D", text: "Role", avatar: "/Untitled.png" },
        { head: "E", text: "Role", avatar: "/Untitled.png" },
    ],
    recentlyViewed: [
        { label: "Recently viewed 1" },
        { label: "Recently viewed 2" },
        { label: "Recently viewed 3" },
    ]
}
export const Channel = {
    data: [
        { icon: faUnlockKeyhole, joined: false, title: "beautifulteam2", members: 1, comment: "Other channels are for work.This one's just for fun. Get to know your termmates and show your lignter slaid." },
        { icon: faUnlockKeyhole, joined: false, title: "beautifulteam2", members: 8, comment: "Other channels are for work.This one's just for fun. Get to know your termmates and show your lignter slaid." },
        { icon: faUnlockKeyhole, joined: false, title: "beautifulteam2", members: 8, comment: "Other channels are for work.This one's just for fun. Get to know your termmates and show your lignter slaid." },
       
    ],
    anychanneltype: [
        { label: "Any channel type", icon: faAdjust },
        { label: "public", icon: faLock },
        { label: "Private", icon: faBaby },
        { label: "External", icon: faTable },

    ],
    Allchannels: [
     
        { label: "All channels", },
        { label: "My channels", },
        { label: "Other channels", },
    ],
    Mostrecommended: [
        { label: "Most recommended", },
        { label: "A to Z", },
        { label: "Z to A", },
        { label: "Newest channel", },
        { label: "Oldest channel", },
        { label: "Most members", },
        { label: "Fewest member", },
    ]
}



type Slide = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

export const External: Slide[] = [
    {
      quote:
        "Clients are much more responsive in our channel with them. That’s a win for us because it increases our efficiency in getting the job done.",
      name: "Kylie Baxter",
      role: "Managing partner, IQ Accountants",
      image: "/Untitled.png",
    },
    {
      quote:
        "Working with external teams has never been easier. Everything stays organized and transparent.",
      name: "Daniel Moore",
      role: "Product Lead, TechFlow",
      image: "/df29ea11-e346-4eed-9485-d290ae1b4b38.jfif",
    },
    {
      quote:
        "Our communication improved drastically. No more lost emails or confusion.",
      name: "Sophia Lee",
      role: "Operations Manager, BrightCo",
      image: "/Untitled.png",
    },
  ];
