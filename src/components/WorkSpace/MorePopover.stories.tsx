import type { Meta, StoryObj } from "@storybook/react";
import MorePopover from "./MorePopover";

const meta: Meta<typeof MorePopover> = {
    title: "UI/MorePopover",
    component: MorePopover,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MorePopover>;

export const Default: Story = {
    args: {
        children: (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 cursor-pointer text-white text-xs font-bold">
                More
            </div>
        ),
    },
};
