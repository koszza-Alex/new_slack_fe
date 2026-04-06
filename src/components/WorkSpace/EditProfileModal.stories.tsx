import type { Meta, StoryObj } from "@storybook/react";
import EditProfileModal from "./EditProfileModal";

const meta: Meta<typeof EditProfileModal> = {
    title: "Modals/EditProfileModal",
    component: EditProfileModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    args: {
        onClose: () => {},
        onSave: () => {},
        userdata: {
            dispname: "Alice",
            avatar: null,
        },
    },
};

export default meta;
type Story = StoryObj<typeof EditProfileModal>;

export const Open: Story = {
    args: { open: true },
};

export const Closed: Story = {
    args: { open: false },
};
