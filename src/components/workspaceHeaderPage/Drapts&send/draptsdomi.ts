import { FiLock } from "react-icons/fi";
import { IconType } from "react-icons";

export const DraptTabs = [
  { label: "Drafts1" },
  { label: "Schedule" },
  { label: "Sent" },
];

export const Draptlist = [
  { name: "new-channel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "frontend-devs-group", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "github-report-general-channel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-chsfdsannel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-chfdfannel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-sdsddfsdfs", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-chanssssssnel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-chansdfsdfdnel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-channel", avatarUrl: "/untitled.png", content: "4weeks ago" },
  { name: "new-csdfhannel", avatarUrl: "/untitled.png", content: "4weeks ago" },
];

export type DraptSentItem =
  | {
      channelIcon: IconType;
      channelName: string;
      isthread: true;
      content: string;
      time: string;
    }
  | {
      avatarUrl: string;
      dm_name: string;
      isthread: false;
      content: string;
      time: string;
    };

export type DraptSentGroup = {
  day: string;
  date: string;
  list: DraptSentItem[];
};

export const DraptSent: DraptSentGroup[] = [
  {
    day: "Sun",
    date: " 2026/11/2",
    list: [
      { channelIcon: FiLock, channelName: "sdfsdfsdf", isthread: true, content: "hello", time: "12313123" },
      { channelIcon: FiLock, channelName: "sdfsdfsdf", isthread: true, content: "hello", time: "12313123" },
      { avatarUrl: "/untitled.png", dm_name: "victor", isthread: false, content: "hello", time: "12313123" },
      { channelIcon: FiLock, channelName: "sdfsdfsdf", isthread: true, content: "hello", time: "12313123" },
    ],
  },
  {
    day: "Sun",
    date: " 2026/11/2",
    list: [
      { channelIcon: FiLock, channelName: "sdfsdfsdf", isthread: true, content: "hello", time: "12313123" },
      { channelIcon: FiLock, channelName: "sdfsdfsdf", isthread: true, content: "hello", time: "12313123" },
      { avatarUrl: "/untitled.png", dm_name: "victor", isthread: false, content: "hello", time: "12313123" },
      { channelIcon: FiLock, channelName: "sdfsdfsdf", isthread: true, content: "hello", time: "12313123" },
    ],
  },
];
