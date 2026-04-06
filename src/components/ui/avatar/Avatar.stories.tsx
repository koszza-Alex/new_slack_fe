import type { Meta, StoryObj } from "@storybook/react";
import { LargeAvatar, SmallAvatar } from "./Avatar";

const meta: Meta<typeof LargeAvatar> = {
    title: "UI/Avatar",
    component: LargeAvatar,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
    args: { src: "https://i.pravatar.cc/150?img=12", alt: "User avatar" },
};

export default meta;
type Story = StoryObj<typeof LargeAvatar>;

export const LargeOnline: Story = {
    name: "Large — online",
    args: { showPresence: true, isOnline: true },
};

export const LargeOffline: Story = {
    name: "Large — offline",
    args: { showPresence: true, isOnline: false },
};

export const LargeNoPresence: Story = {
    name: "Large — no presence dot",
    args: { showPresence: false },
};

export const Small: Story = {
    name: "Small — online",
    render: (args) => <SmallAvatar {...args} />,
    args: { showPresence: true, isOnline: true },
};

export const SmallOffline: Story = {
    name: "Small — offline",
    render: (args) => <SmallAvatar {...args} />,
    args: { showPresence: true, isOnline: false },
};
