import type { Meta, StoryObj } from "@storybook/react";
import HuddleModal from "./HuddleModal";

const meta: Meta<typeof HuddleModal> = {
    title: "Modals/HuddleModal",
    component: HuddleModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    args: { onClose: () => {} },
};

export default meta;
type Story = StoryObj<typeof HuddleModal>;

export const Open: Story = {
    args: { open: true },
};

export const Closed: Story = {
    args: { open: false },
};
