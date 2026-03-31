// components/MainPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MainPage } from './MainPage';

const meta: Meta<typeof MainPage> = {
    title: 'Components/MainPage',
    component: MainPage,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className='w-full'>
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof MainPage>;

export const Default: Story = {};