import type { Meta, StoryObj } from "@storybook/react";
import FilesPopover from "./FilesPopover";

const meta: Meta<typeof FilesPopover> = {
    title: "UI/FilesPopover",
    component: FilesPopover,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FilesPopover>;

export const Default: Story = {
    args: {
        children: (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 cursor-pointer">
                <img src="/svg/files.svg" alt="Files" className="w-5 invert" />
            </div>
        ),
    },
};
