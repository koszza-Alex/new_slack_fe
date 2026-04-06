import type { Meta, StoryObj } from "@storybook/react";
import InvitePeopleModal from "./InvitePeopleModal";

const meta: Meta<typeof InvitePeopleModal> = {
    title: "Modals/InvitePeopleModal",
    component: InvitePeopleModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        // useSearchParams returns null in Storybook — the component handles null gracefully
        nextjs: { appDirectory: true },
    },
    args: { onClose: () => {} },
};

export default meta;
type Story = StoryObj<typeof InvitePeopleModal>;

export const Open: Story = {
    args: { open: true },
};

export const Closed: Story = {
    args: { open: false },
};
