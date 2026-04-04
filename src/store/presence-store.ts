import { create } from "zustand";

/**
 * Tracks which userIds are currently online (socket-connected).
 * Shared by WorkspaceMenu and DMList so both use the same source of truth.
 */
type PresenceStore = {
  onlineUserIds: Set<string>;
  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
  isOnline: (userId: string) => boolean;
};

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  onlineUserIds: new Set(),

  setOnline: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.add(userId);
      return { onlineUserIds: next };
    }),

  setOffline: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.delete(userId);
      return { onlineUserIds: next };
    }),

  isOnline: (userId) => get().onlineUserIds.has(userId),
}));

/** Tailwind/style helper — centralises the joined/unjoined color rule */
export function presenceColor(isOnline: boolean): string {
  return isOnline ? "bg-green-500" : "bg-[#3F0E40]";
}
