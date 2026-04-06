import { create } from 'zustand';
import { ActivityItem } from '@/lib/api/activity';

type ActivityStore = {
    items: ActivityItem[];
    unreadCount: number;

    setItems: (items: ActivityItem[]) => void;
    prependItem: (item: ActivityItem) => void;
    markAllRead: () => void;
    markOneRead: (id: string) => void;
};

export const useActivityStore = create<ActivityStore>((set, get) => ({
    items: [],
    unreadCount: 0,

    setItems: (items) =>
        set({ items, unreadCount: items.filter((i) => !i.isRead).length }),

    prependItem: (item) => {
        const items = [item, ...get().items];
        set({ items, unreadCount: items.filter((i) => !i.isRead).length });
    },

    markAllRead: () =>
        set((state) => ({
            items: state.items.map((i) => ({ ...i, isRead: true })),
            unreadCount: 0,
        })),

    markOneRead: (id) =>
        set((state) => {
            const items = state.items.map((i) => (i.id === id ? { ...i, isRead: true } : i));
            return { items, unreadCount: items.filter((i) => !i.isRead).length };
        }),
}));
