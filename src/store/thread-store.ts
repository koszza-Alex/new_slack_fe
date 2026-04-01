import { create } from "zustand";
import { ReactionView } from "@/lib/api/reactions";

export interface ThreadMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  threadRootId: string | null;
  replyCount: number;
  lastReplyAt: string | null;
  reactions: ReactionView[];
  sender: {
    id: string;
    dispname: string | null;
    avatar: string;
  };
}

type ThreadStore = {
  selectedMessage: ThreadMessage | null;
  threadMessages: ThreadMessage[];
  isOpen: boolean;
  isLoading: boolean;

  openThread: (message: ThreadMessage) => void;
  closeThread: () => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  appendThreadMessage: (message: ThreadMessage) => void;
  setLoading: (loading: boolean) => void;
  updateRootMessage: (updated: Partial<ThreadMessage> & { id: string }) => void;
  /** Replace the reactions array on a specific message inside the thread */
  updateThreadMessageReactions: (messageId: string, reactions: ReactionView[]) => void;
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
      selectedMessage:
        state.selectedMessage?.id === updated.id
          ? { ...state.selectedMessage, ...updated }
          : state.selectedMessage,
      threadMessages: state.threadMessages.map((m) =>
        m.id === updated.id ? { ...m, ...updated } : m
      ),
    })),

  updateThreadMessageReactions: (messageId, reactions) =>
    set((state) => ({
      threadMessages: state.threadMessages.map((m) =>
        m.id === messageId ? { ...m, reactions } : m
      ),
      selectedMessage:
        state.selectedMessage?.id === messageId
          ? { ...state.selectedMessage, reactions }
          : state.selectedMessage,
    })),
}));
