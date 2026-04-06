// MainPage depends on socket, auth, router, and Zustand stores — too many
// side-effects to render in isolation. We document this and show a placeholder.
import type { Meta, StoryObj } from "@storybook/react";

// Lightweight stand-in so Storybook doesn't crash on the real component's hooks
function MainPagePlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm gap-2">
            <span className="text-2xl">💬</span>
            <span>MainPage — requires live socket + auth context</span>
            <span className="text-xs">Run the full app to see this component</span>
        </div>
    );
}

const meta: Meta<typeof MainPagePlaceholder> = {
    title: "Pages/MainPage",
    component: MainPagePlaceholder,
    parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MainPagePlaceholder>;

export const Placeholder: Story = {};
