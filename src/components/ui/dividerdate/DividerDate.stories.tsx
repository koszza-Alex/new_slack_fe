import type { Meta, StoryObj } from "@storybook/react";
import DividerDate from "./DividerDate";

const meta: Meta<typeof DividerDate> = {
    title: "UI/DividerDate",
    component: DividerDate,
    tags: ["autodocs"],
    parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DividerDate>;

export const Today: Story = {
    args: { date: new Date().toDateString() },
};

export const Yesterday: Story = {
    args: {
        date: new Date(Date.now() - 86_400_000).toDateString(),
    },
};

export const OlderDate: Story = {
    args: { date: "Mon Apr 01 2024" },
};
