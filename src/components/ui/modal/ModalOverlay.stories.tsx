import type { Meta, StoryObj } from "@storybook/react";
import ModalOverlay from "./ModalOverlay";

const meta: Meta<typeof ModalOverlay> = {
    title: "UI/ModalOverlay",
    component: ModalOverlay,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    args: { onClose: () => {} },
};

export default meta;
type Story = StoryObj<typeof ModalOverlay>;

export const Default: Story = {
    args: {
        className: "w-[400px] p-6",
        children: (
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">Modal title</h2>
                <p className="text-sm text-gray-600">This is the modal body content.</p>
                <div className="mt-4 flex justify-end gap-2">
                    <button className="px-4 py-1.5 rounded text-sm bg-gray-200 text-gray-700">Cancel</button>
                    <button className="px-4 py-1.5 rounded text-sm bg-[#007a5a] text-white">Confirm</button>
                </div>
            </div>
        ),
    },
};
