"use client";

import SidebarSection from "./SidebarSection";
import ChannelItem from "./ChannelItem";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import CreateChannelModal from "../ui/modal/CreateChannelModal";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function ChannelListComponent() {
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = useWorkspaceId();
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!socket || !workspaceId) return;

    setLoading(true);

    // JOIN ROOM
    socket.emit("join_workspace", { workspaceId });

    // REQUEST CHANNEL LIST
    socket.emit("channel:list", { workspaceId });

    // LISTENER: LIST
    const handleList = (data: any[]) => {
      setChannels(data);
      setLoading(false);
    };

    // LISTENER: CREATE
    const handleCreated = (newChannel: any) => {
      setChannels((prev) => {
        // prevent duplicates
        if (prev.find((c) => c.id === newChannel.id)) return prev;
        return [...prev, newChannel];
      });
    };

    // LISTENER: DELETE
    const handleDeleted = ({ channelId }: { channelId: string }) => {
      setChannels((prev) =>
        prev.filter((c) => c.id !== channelId)
      );
    };

    // LISTENER: update
    socket.on("channel:updated", (updatedChannel) => {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === updatedChannel.id ? updatedChannel : c
        )
      );
    })

    socket.on("channel:list", handleList);
    socket.on("channel:created", handleCreated);
    socket.on("channel:deleted", handleDeleted);

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off("channel:list", handleList);
      socket.off("channel:created", handleCreated);
      socket.off("channel:deleted", handleDeleted);
    };
  }, [socket, workspaceId]);

  return (
    <>
      <SidebarSection title="Channels" onAdd={() => setOpen(true)}>
        {loading ? (
          <p className="px-7 text-sm text-gray-300">Loading...</p>
        ) : channels.length > 0 ? (
          channels.map((c) => (
            <ChannelItem
              key={c.id}
              type={c.channelType}
              id={c.id}
              name={c.name}
              creatorId={c.creatorId ?? null}
              currentUserId={userId ?? null}
            />
          ))
        ) : (
          <p className="px-7 text-sm text-gray-300">No channels</p>
        )}

        <div
          className="group flex items-center justify-between px-7 py-1 rounded cursor-pointer hover:bg-white/10 text-white/80"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2">
            <FiPlus size={14} />
            Add Channel
          </div>
        </div>
      </SidebarSection>

      {workspaceId && userId && (
        <CreateChannelModal
          isOpen={open}
          onClose={() => setOpen(false)}
          workspaceId={workspaceId}
          userId={userId}
        />
      )}
    </>
  );
}