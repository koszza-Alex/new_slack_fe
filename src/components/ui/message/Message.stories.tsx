import type { Meta, StoryObj } from "@storybook/react";
import SlackMessage from "./Message";

const meta: Meta<typeof SlackMessage> = {
    title: "Components/SlackMessage",
    component: SlackMessage,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SlackMessage>;

export const Default: Story = {
    args: {
        avatar: "https://i.pravatar.cc/150?img=4",
        username: "John Doe",
        time: "2:45 PM",
        text: "Hey team! Check out these files 👇",
        files: [
            { name: "design.png", type: "PNG" },
            { name: "document.pdf", type: "PDF" },
        ],
        reactions: [
            { emoji: "🔥", count: 3 },
            { emoji: "👍", count: 5 },
        ],
        replies: 4,
        lastReply: "2 minutes ago",
    },
};
