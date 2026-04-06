"use client";

import { useState } from "react";
import { FiHash, FiX } from "react-icons/fi";
import { useSocket } from "@/providers/SocketProvider";
import ModalOverlay from "./ModalOverlay";

export default function CreateChannelModal({
  isOpen,
  onClose,
  workspaceId,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  userId: string;
}) {
  const { socket } = useSocket();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setName("");
    setVisibility("public");
    setLoading(false);
    onClose();
  };

  const handleCreate = async () => {
    if (!socket) return;
    try {
      setLoading(true);
      socket.emit("channel:create", { workspaceId, name, type: visibility, userId });
      handleClose();
    } catch (err) {
      console.error("Create channel failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClose={handleClose} className="w-[500px] p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Create a channel</h2>
          {step === 2 && <p className="text-sm text-gray-500 mt-1"># {name}</p>}
        </div>
        <button onClick={handleClose}>
          <FiX className="text-gray-500" size={18} />
        </button>
      </div>

      {/* Step 1 — Name */}
      {step === 1 && (
        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-800">Name</label>
          <div className="mt-2 flex items-center border rounded-md border-gray-400 px-3 py-2">
            <FiHash className="text-gray-400 mr-2" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. plan-budget"
              className="w-full outline-none text-black"
              maxLength={80}
            />
            <span className="text-xs text-gray-400">{80 - name.length}</span>
          </div>
        </div>
      )}

      {/* Step 2 — Visibility */}
      {step === 2 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-800 mb-3">Visibility</p>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input type="radio" checked={visibility === "public"} onChange={() => setVisibility("public")} />
              Public — anyone
            </label>
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input type="radio" checked={visibility === "private"} onChange={() => setVisibility("private")} />
              Private — only invited
            </label>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-xs text-gray-400">Step {step} of 2</span>
        {step === 1 ? (
          <button
            disabled={!name.trim()}
            onClick={() => setStep(2)}
            className={`px-4 py-1.5 rounded text-sm ${name.trim() ? "bg-[#007a5a] text-white" : "bg-gray-200 text-gray-400"}`}
          >
            Next
          </button>
        ) : (
          <div>
            <button onClick={() => setStep(1)} className="bg-gray-700 px-4 py-1.5 border rounded text-sm mr-2">
              Back
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-[#007a5a] text-white px-4 py-1.5 rounded text-sm"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}
