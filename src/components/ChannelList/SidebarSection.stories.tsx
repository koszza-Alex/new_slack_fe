import type { Meta, StoryObj } from "@storybook/react";
import SidebarSection from "./SidebarSection";

const meta: Meta<typeof SidebarSection> = {
    title: "Layout/SidebarSection",
    component: SidebarSection,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        backgrounds: { default: "slack-purple" },
    },
    decorators: [
        (Story) => (
            <div className="w-[260px] bg-[#3F0E40] py-2">
                <Story />
            </div>
        ),
    ],
    args: { onAdd: () => {} },
};

export default meta;
type Story = StoryObj<typeof SidebarSection>;

export const Channels: Story = {
    args: {
        title: "Channels",
        children: (
            <div className="flex flex-col">
                {["general", "random", "design", "engineering"].map((name) => (
                    <div key={name} className="px-7 py-1 text-sm text-white/80 hover:bg-white/10 cursor-pointer">
                        # {name}
                    </div>
                ))}
            </div>
        ),
    },
};

export const DirectMessages: Story = {
    args: {
        title: "Direct Messages",
        children: (
            <div className="flex flex-col gap-1 px-7">
                {["Alice", "Bob", "Carol"].map((name) => (
                    <div key={name} className="flex items-center gap-2 py-1 text-sm text-white/80 cursor-pointer hover:bg-white/10 rounded">
                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        {name}
                    </div>
                ))}
            </div>
        ),
    },
};

export const Empty: Story = {
    args: {
        title: "Channels",
        children: (
            <p className="px-7 text-xs text-white/50 py-1">No channels yet</p>
        ),
    },
};
