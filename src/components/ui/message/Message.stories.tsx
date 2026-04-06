import type { Meta, StoryObj } from "@storybook/react";
import SlackMessage from "./Message";
import type { ReactionView } from "@/lib/api/reactions";

const meta: Meta<typeof SlackMessage> = {
    title: "UI/SlackMessage",
    component: SlackMessage,
    tags: ["autodocs"],
    parameters: { layout: "padded" },
    args: {
        onCommentClick: () => {},
        onReactionUpdate: () => {},
        onMessageUpdate: () => {},
        onMessageDelete: () => {},
    },
};

export default meta;
type Story = StoryObj<typeof SlackMessage>;

const NOW = new Date().toISOString();

const BASE: Partial<Parameters<typeof SlackMessage>[0]> = {
    state: "message",
    avatar: "https://i.pravatar.cc/150?img=4",
    username: "Alice",
    time: NOW,
    createdAt: NOW,
    text: "<p>Hey team! Just pushed the new feature branch. 🚀</p>",
    files: [],
    reactions: [],
    replies: 0,
    lastReply: "",
    messageId: "msg-001",
    channelId: "ch-001",
    currentUserId: "user-002",
    senderId: "user-001",
};

export const Default: Story = { args: { ...BASE } };

export const WithReplies: Story = {
    args: { ...BASE, replies: 4, lastReply: "2 minutes ago" },
};

export const WithReactions: Story = {
    args: {
        ...BASE,
        reactions: [
            { emoji: "🔥", count: 3, reactedUserIds: ["user-003"], reactedUsers: [] },
            { emoji: "👍", count: 5, reactedUserIds: ["user-002"], reactedUsers: [] },
        ] satisfies ReactionView[],
    },
};

export const OwnMessage: Story = {
    name: "Own message (edit/delete menu)",
    args: {
        ...BASE,
        currentUserId: "user-001",
        senderId: "user-001",
        text: "<p>This is my own message — hover to see the action menu.</p>",
    },
};

export const Edited: Story = {
    args: {
        ...BASE,
        text: "<p>This message was edited after sending.</p>",
        createdAt: new Date(Date.now() - 60_000).toISOString(),
        updatedAt: NOW,
    },
};

export const WithFiles: Story = {
    args: {
        ...BASE,
        text: "<p>Here are the files from today's meeting:</p>",
        files: [
            { name: "design-mockup.png", type: "png" },
            { name: "requirements.pdf", type: "pdf" },
        ],
    },
};

export const ThreadState: Story = {
    name: "Thread view (no reply button)",
    args: { ...BASE, state: "thread", text: "<p>This is a reply inside a thread.</p>" },
};

export const FullFeatured: Story = {
    name: "Full featured",
    args: {
        ...BASE,
        text: "<p>Full message with reactions, replies, and files.</p>",
        reactions: [
            { emoji: "🔥", count: 2, reactedUserIds: ["user-002"], reactedUsers: [] },
            { emoji: "tick", count: 1, reactedUserIds: [], reactedUsers: [] },
        ] satisfies ReactionView[],
        replies: 7,
        lastReply: "5 minutes ago",
        files: [{ name: "screenshot.png", type: "png" }],
    },
};
