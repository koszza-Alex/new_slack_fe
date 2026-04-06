import type { Meta, StoryObj } from "@storybook/react";
import WorkspaceHeader from "./WorkspaceHeader";

const meta: Meta<typeof WorkspaceHeader> = {
    title: "Layout/WorkspaceHeader",
    component: WorkspaceHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        backgrounds: { default: "slack-purple" },
    },
    decorators: [
        (Story) => {
            // Seed localStorage so the component can read workspaceName
            if (typeof window !== "undefined") {
                localStorage.setItem("workspaceName", "Acme Corp");
            }
            return (
                <div className="w-[260px] bg-[#3F0E40] text-white px-2">
                    <Story />
                </div>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof WorkspaceHeader>;

export const Default: Story = {};
