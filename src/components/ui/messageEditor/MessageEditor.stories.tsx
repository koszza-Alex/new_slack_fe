// components/MessageEditor.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import MessageEditor from './MessageEditor';

const meta: Meta<typeof MessageEditor> = {
    title: 'Components/MessageEditor',
    component: MessageEditor,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className='w-full bg-yellow-200 py-50'>
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof MessageEditor>;

export const Default: Story = {};