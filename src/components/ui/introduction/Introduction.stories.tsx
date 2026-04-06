import type { Meta, StoryObj } from "@storybook/react";
import Introduction from "./Introduction";

const meta: Meta<typeof Introduction> = {
    title: "UI/Introduction",
    component: Introduction,
    tags: ["autodocs"],
    parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Introduction>;

export const Default: Story = {};
