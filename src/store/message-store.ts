import { create } from "zustand";

type Message = any;

type MessageStore = {
  messages: Message[];
  loading: boolean;
  setMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  loading: true,

  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ loading }),
  clearMessages: () => set({ messages: [], loading: true }),
}));
