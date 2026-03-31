import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    text1: { control: 'text' },
    text2: { control: 'text' },
    shortcut: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    text1: 'Send message',
    text2: 'Press Enter to send',
    shortcut: ['Enter'],
    children: (
      <button className="px-3 py-2 bg-blue-500 text-white rounded-md">
        Hover me
      </button>
    ),
  },
};