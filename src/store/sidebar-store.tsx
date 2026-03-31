import  {create}  from "zustand";

export type Item = "home" | "dms" | "activity" | "files" | "more";

const items: Item[] = ["home", "dms", "activity", "files", "more"];

type Store = {
  active: Item;
  unread: Record<Item, number>;

  setActive: (item: Item) => void;
  next: () => void;
  prev: () => void;
};

export const useSidebarStore = create<Store>((set, get) => ({
  active: "home",

  unread: {
    home: 0,
    dms: 3,
    activity: 1,
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
}));