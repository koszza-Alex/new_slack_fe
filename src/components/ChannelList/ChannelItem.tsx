"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FiHash, FiX } from "react-icons/fi";
import { FaLock } from "react-icons/fa6";
import { useSocket } from "@/providers/SocketProvider";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import EditChannelModal from "../ui/modal/EditChannelModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useMessageStore } from "@/store/message-store";

interface ChannelItemProps {
  name: string;
  id: string;
  type: string;
  creatorId: string | null;
  currentUserId: string | null;
}

export default function ChannelItem({ name, id, type, creatorId, currentUserId }: ChannelItemProps) {
  const { socket } = useSocket();
  const router = useRouter();
  const params = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setFlag, flag } = useMessageStore();

  const workspaceId = useWorkspaceId();
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const isActive = channelId === id && !flag;
  const isCreator = !!currentUserId && (creatorId === null || creatorId === currentUserId);

  // Auto-dismiss error after 3 s
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 3000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  // Listen for server-side channel errors directed at this client
  useEffect(() => {
    if (!socket) return;
    const handler = ({ message }: { message: string }) => {
      setErrorMsg(message);
    };
    socket.on("channel:error", handler);
    return () => { socket.off("channel:error", handler); };
  }, [socket]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCreator) {
      setErrorMsg("You can only delete channels you created");
      return;
    }
    socket?.emit("channel:delete", {
      channelId: id,
      workspaceId,
      userId: currentUserId,
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCreator) {
      setErrorMsg("You can only edit channels you created");
      return;
    }
    setEditOpen(true);
  };

  const linkChannel = () => {
    router.push(`/${workspaceId}/${id}`);
    setFlag("")
  };

  return (
    <div onClick={linkChannel}>
      <div
        className={`group flex items-center justify-between px-7 py-1 rounded cursor-pointer ${
          isActive
            ? "bg-[#f9edff] text-[#39063a] font-medium"
            : "hover:bg-white/10 text-white/80"
        }`}
      >
        <div className="flex items-center gap-2">
          {type === "public" ? <FiHash size={14} /> : <FaLock size={14} />}
          {name}
        </div>
        <div
          className={`hidden p-1 rounded group-hover:block ${
            isActive ? "" : "bg-[#704a71]"
          }`}
        >
          <div className="flex gap-2">
            <FaEdit size={14} onClick={handleEditClick} />
            <FiX size={14} onClick={handleDelete} />
          </div>
        </div>
      </div>

      {/* Inline error toast */}
      {errorMsg && (
        <div className="mx-7 mt-1 px-2 py-1 bg-red-100 border border-red-300 text-red-700 text-xs rounded">
          {errorMsg}
        </div>
      )}

      <EditChannelModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        workspaceId={workspaceId}
        channel={{ id, name, channelType: type }}
        userId={currentUserId}

/>
    </div>
  );
}
