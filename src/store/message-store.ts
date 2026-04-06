import { create } from "zustand";

type Message = any;

type MessageStore = {
  messages: Message[];
  loading: boolean;
  flag: string | null;
  setMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setFlag: (flag: string | null) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  loading: true,
  flag: null,

  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ loading }),
  clearMessages: () => set({ messages: [], loading: true }),
  setFlag: (flag) => set({ flag }),
}));
