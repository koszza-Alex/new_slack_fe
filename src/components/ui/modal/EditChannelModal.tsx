"use client";

import { useState, useEffect } from "react";
import { FiHash, FiX } from "react-icons/fi";
import { useSocket } from "@/providers/SocketProvider";
import ModalOverlay from "./ModalOverlay";

export default function EditChannelModal({
  isOpen,
  onClose,
  channel,
  workspaceId,
  userId,
}: any) {
  const { socket } = useSocket();

  const [name, setName] = useState("");
  const [type, setType] = useState<"public" | "private">("public");

  // ✅ FIX: initialize ONLY when modal opens
  useEffect(() => {
    if (isOpen && channel) {
      setName(channel.name);
      setType(channel.channelType);
    }
  }, [isOpen]); // 🔥 IMPORTANT

  // ❌ don't render if closed
  if (!isOpen) return null;

  const handleUpdate = () => {
    socket?.emit("channel:update", {
      channelId: channel.id,
      name,
      type,
      workspaceId,
      userId,
    });

    onClose();
  };

  return (
    <ModalOverlay onClose={onClose} className="w-[400px] p-5">
      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <h2 className="font-bold text-black">Edit Channel</h2>
        <button onClick={onClose}>
          <FiX className="text-gray-500" size={18} />
        </button>
      </div>

        {/* NAME INPUT */}
        <label className="text-sm font-semibold text-gray-800">
          Name:
        </label>

        <div className="mt-2 flex items-center border rounded-md border-gray-400 px-3 py-2">
          <FiHash className="text-gray-400 mr-2" />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none text-black"
            maxLength={80}
          />

          <span className="text-xs text-gray-400">
            {80 - name.length}
          </span>
        </div>

        {/* RADIO SECTION */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Visibility:
          </p>

          <div className="flex gap-5 mb-4">
            {/* PUBLIC */}
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={type === "public"}
                onChange={(e) =>
                  setType(e.target.value as "public")
                }
              />
              Public
            </label>

            {/* PRIVATE */}
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={type === "private"}
                onChange={(e) =>
                  setType(e.target.value as "private")
                }
              />
              Private
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleUpdate}
              disabled={!name.trim()}
              className={`px-4 py-1.5 rounded text-sm ${
                name.trim()
                  ? "bg-[#007a5a] text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              Save
            </button>

            <button
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-1.5 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
    </ModalOverlay>
  );
}