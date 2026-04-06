import type { Meta, StoryObj } from "@storybook/react";
import PauseNotificationsMenu from "./PauseNotificationsMenu";

const meta: Meta<typeof PauseNotificationsMenu> = {
    title: "UI/PauseNotificationsMenu",
    component: PauseNotificationsMenu,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof PauseNotificationsMenu>;

export const Default: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between px-4 py-[6px] text-[14px] cursor-pointer hover:bg-[#F4EDE4] w-[260px]">
                <span>Pause notifications</span>
                <span className="text-gray-400">›</span>
            </div>
        ),
    },
};
