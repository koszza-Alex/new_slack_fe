// MessageEditor depends on socket context and useParams — render a placeholder.
import type { Meta, StoryObj } from "@storybook/react";

function MessageEditorPlaceholder() {
    return (
        <div className="border border-[#e0dada] w-full rounded-[10px] bg-white text-gray-700">
            {/* Toolbar mock */}
            <div className="flex px-2.5 py-1.5 rounded-t-[10px] items-center gap-3 bg-[#f8f8f8] mb-1 text-gray-400">
                <span className="font-bold text-sm">B</span>
                <span className="italic text-sm">I</span>
                <span className="underline text-sm">U</span>
                <span className="line-through text-sm">S</span>
                <span className="w-px h-4 bg-gray-400 mx-1" />
                <span className="text-sm">🔗</span>
            </div>
            {/* Editor area mock */}
            <div className="min-h-[35px] px-2.5 py-1 text-sm text-gray-400 italic">
                Message #channel
            </div>
            {/* Bottom bar mock */}
            <div className="flex justify-between items-center p-2 text-gray-400">
                <div className="flex gap-3 text-sm">
                    <span>+</span>
                    <span className="underline">Aa</span>
                    <span>🙂</span>
                    <span>@</span>
                </div>
                <div className="flex items-center gap-1 px-2 rounded-md text-sm h-7 bg-gray-200 text-gray-400">
                    ➤
                </div>
            </div>
        </div>
    );
}

const meta: Meta<typeof MessageEditorPlaceholder> = {
    title: "UI/MessageEditor",
    component: MessageEditorPlaceholder,
    parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MessageEditorPlaceholder>;

export const Default: Story = {};
