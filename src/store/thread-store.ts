import { create } from "zustand";

export interface ThreadMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  threadRootId: string | null;
  replyCount: number;
  lastReplyAt: string | null;
  sender: {
    id: string;
    dispname: string | null;
    avatar: string;
  };
}

type ThreadStore = {
  // The root message whose thread is open
  selectedMessage: ThreadMessage | null;
  // All messages in the thread (root + replies), ordered ASC
  threadMessages: ThreadMessage[];
  isOpen: boolean;
  isLoading: boolean;

  openThread: (message: ThreadMessage) => void;
  closeThread: () => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  appendThreadMessage: (message: ThreadMessage) => void;
  setLoading: (loading: boolean) => void;
  // Update replyCount/lastReplyAt on a root message in the thread
  updateRootMessage: (updated: ThreadMessage) => void;
};

export const useThreadStore = create<ThreadStore>((set) => ({
  selectedMessage: null,
  threadMessages: [],
  isOpen: false,
  isLoading: false,

  openThread: (message) =>
    set({ selectedMessage: message, isOpen: true, threadMessages: [], isLoading: true }),

  closeThread: () =>
    set({ isOpen: false, selectedMessage: null, threadMessages: [] }),

  setThreadMessages: (messages) => set({ threadMessages: messages, isLoading: false }),

  appendThreadMessage: (message) =>
    set((state) => ({
      threadMessages: [...state.threadMessages, message],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  updateRootMessage: (updated) =>
    set((state) => ({
      // Update selectedMessage metadata if it matches
      selectedMessage:
        state.selectedMessage?.id === updated.id ? updated : state.selectedMessage,
      // Update the root message inside threadMessages list too
      threadMessages: state.threadMessages.map((m) =>
        m.id === updated.id ? { ...m, ...updated } : m
      ),
    })),
}));
