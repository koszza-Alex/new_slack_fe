"use client";

import {
  FiEdit,
  FiHeadphones,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";
import { TbAddressBook } from "react-icons/tb";
import { useEffect, useState } from "react";

const items = [
  { label: "Threads", icon: FiMessageCircle },
  { label: "Huddles", icon: FiHeadphones },
  { label: "Directories", icon: TbAddressBook },
];

export default function WorkspaceHeader() {
  const [workspaceName, setWorkspaceName] = useState();
  useEffect(() => {
    const name = localStorage.getItem("workspaceName");
    setWorkspaceName(name);
  }, [])

  return (
    <div className="py-3 border-b border-white/10">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[25px] p-1 px-2 rounded cursor-pointer hover:bg-white/10">
          {workspaceName}
        </h1>

        <div className="flex gap-2">
          <button className="p-1 border border-white/20 rounded-sm">
            <FiSettings />
          </button>

          <button className="p-1 border border-white/20 rounded-sm">
            <FiEdit />
          </button>
        </div>
      </div>

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex items-center gap-3 px-2 py-1.5 rounded-md text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition"
          >
            <Icon size={16} />
            <span className="text-sm">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}