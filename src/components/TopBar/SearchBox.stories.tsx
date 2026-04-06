import type { Meta, StoryObj } from "@storybook/react";

// SearchBox uses useParams, useRouter, and live API calls.
// We render a static visual replica for Storybook.
function SearchBoxPreview() {
    return (
        <div className="flex-1 flex justify-center w-[480px]">
            <div className="w-full relative">
                <div className="h-[28px] flex items-center px-2 rounded-md bg-white/10 cursor-text">
                    <svg className="w-4 h-4 text-white/50 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <span className="text-[13px] text-white/70">
                        Try asking "Where is the message about ___?"
                    </span>
                </div>
            </div>
        </div>
    );
}

const meta: Meta<typeof SearchBoxPreview> = {
    title: "Layout/SearchBox",
    component: SearchBoxPreview,
    parameters: {
        layout: "centered",
        backgrounds: { default: "slack-purple" },
    },
    decorators: [
        (Story) => (
            <div className="bg-[#410f41] px-4 py-2 w-[600px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SearchBoxPreview>;

export const Collapsed: Story = {};
