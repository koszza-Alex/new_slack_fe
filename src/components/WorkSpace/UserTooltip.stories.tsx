import type { Meta, StoryObj } from "@storybook/react";
import UserTooltip from "./UserTooltip";

const meta: Meta<typeof UserTooltip> = {
    title: "UI/UserTooltip",
    component: UserTooltip,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof UserTooltip>;

export const Default: Story = {
    args: {
        name: "Alice",
        children: (
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer">
                A
            </div>
        ),
    },
};

export const LongName: Story = {
    args: {
        name: "Bob the Builder",
        children: (
            <img
                src="https://i.pravatar.cc/150?img=8"
                className="w-9 h-9 rounded-xl object-cover cursor-pointer"
                alt="avatar"
            />
        ),
    },
};
