import { create } from "zustand";

export type Item = "home" | "dms" | "activity" | "files" | "more";

const items: Item[] = ["home", "dms", "activity", "files", "more"];

type Store = {
  active: Item;
  /** Real unread counts — driven by socket events, not hardcoded */
  unread: Record<Item, number>;

  setActive: (item: Item) => void;
  next: () => void;
  prev: () => void;
  /** Increment unread count for a nav item */
  incrementUnread: (item: Item) => void;
  /** Clear unread count for a nav item (called when user opens that section) */
  clearUnread: (item: Item) => void;
  /** Set an explicit count */
  setUnread: (item: Item, count: number) => void;
};

export const useSidebarStore = create<Store>((set, get) => ({
  active: "home",

  // All start at 0 — populated by real socket events
  unread: {
    home: 0,
    dms: 0,
    activity: 0,
    files: 0,
    more: 0,
  },

  setActive: (item) => set({ active: item }),

  next: () => {
    const { active } = get();
    const i = items.indexOf(active);
    set({ active: items[(i + 1) % items.length] });
  },

  prev: () => {
    const { active } = get();
    const i = items.indexOf(active);
    set({ active: items[(i - 1 + items.length) % items.length] });
  },

  incrementUnread: (item) =>
    set((state) => ({
      unread: { ...state.unread, [item]: state.unread[item] + 1 },
    })),

  clearUnread: (item) =>
    set((state) => ({
      unread: { ...state.unread, [item]: 0 },
    })),

  setUnread: (item, count) =>
    set((state) => ({
      unread: { ...state.unread, [item]: count },
    })),
}));
