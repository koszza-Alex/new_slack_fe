import Link from "next/link";
import { useParams } from "next/navigation";
import { FiHash, FiX } from "react-icons/fi";
import { FaLock } from "react-icons/fa6";
import { useSocket } from "@/providers/SocketProvider";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import EditChannelModal from "../ui/modal/EditChannelModal";
import { useRouter } from "next/navigation";

export default function ChannelItem({ name, id, type }: { name: string, id: string, type: string }) {
  const { socket } = useSocket();
  const router = useRouter();
  const params = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const workspaceId = Array.isArray(params.workspaceId)
    ? params.workspaceId[0]
    : params.workspaceId;
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const isActive = channelId === id;
  const handleDelete = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    socket?.emit("channel:delete", {
      channelId: id,
      workspaceId,
    });
  };
  const linkChannel = () =>{
    router.push(`/${workspaceId}/${id}`)
  }
  return (
    <div onClick={linkChannel}>
      <div
        className={`group flex items-center justify-between px-7 py-1 rounded cursor-pointer ${isActive
          ? "bg-[#f9edff] text-[#39063a] font-medium"
          : "hover:bg-white/10 text-white/80"
          }`}
      >
        <div className="flex items-center gap-2">
          {type == "public" ? <FiHash size={14} /> : <FaLock size={14} />}
          {name}
        </div>
        <div className={`hidden p-1 rounded group-hover:block hover: ${isActive ?
          "" : "bg-[#704a71]"
          } `}>
          <div className="flex gap-2">
            <FaEdit size={14} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditOpen(true); }} />
            <FiX size={14} onClick={handleDelete} />
          </div>
        </div>
      </div>
      <EditChannelModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        workspaceId={workspaceId}
        channel={{
          id,
          name,
          channelType: type,
        }}
      />
    </div>
  );
}
