import { create } from "zustand";

type PresenceStore = {
    onlineUserIds: Set<string>;
    setOnline: (userId: string) => void;
    setOffline: (userId: string) => void;
    setAllOnline: (userIds: string[]) => void;
    isOnline: (userId: string) => boolean;
};

export const usePresenceStore = create<PresenceStore>((set, get) => ({
    onlineUserIds: new Set(),

    setOnline: (userId) =>
        set((state) => {
            if (state.onlineUserIds.has(userId)) return state; // no-op if already online
            const next = new Set(state.onlineUserIds);
            next.add(userId);
            return { onlineUserIds: next };
        }),

    setOffline: (userId) =>
        set((state) => {
            if (!state.onlineUserIds.has(userId)) return state; // no-op if already offline
            const next = new Set(state.onlineUserIds);
            next.delete(userId);
            return { onlineUserIds: next };
        }),

    /** Replace the entire online set with the snapshot from the server */
    setAllOnline: (userIds) =>
        set({ onlineUserIds: new Set(userIds) }),

    isOnline: (userId) => get().onlineUserIds.has(userId),
}));

/**
 * Returns the correct Tailwind class for the presence dot.
 * @param isOnline  - whether the user is online
 * @param darkBg    - true when the dot sits on the dark purple sidebar (default)
 *                    false when it sits on a white/light background (DmsPopover, etc.)
 */
export function presenceColor(isOnline: boolean, darkBg = true): string {
    if (isOnline) return "bg-green-500";
    return darkBg ? "bg-[#3F0E40]" : "bg-gray-300";
}
