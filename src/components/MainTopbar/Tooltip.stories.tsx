import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
    title: "UI/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    args: {
        text1: "Send message",
        children: (
            <button className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm">
                Hover me
            </button>
        ),
    },
};

export const WithSubtext: Story = {
    args: {
        text1: "Start a Huddle",
        text2: "Audio and video calls",
        children: (
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                Hover me
            </button>
        ),
    },
};

export const WithShortcut: Story = {
    args: {
        text1: "Search",
        shortcut: ["Ctrl", "K"],
        children: (
            <button className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                Hover me
            </button>
        ),
    },
};
