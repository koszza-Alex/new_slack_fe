import type { Meta, StoryObj } from '@storybook/react';
import SlackLoader from './Loading';

const meta: Meta<typeof SlackLoader> = {
    title: 'Components/SlackLoader',
    component: SlackLoader,
};

export default meta;

type Story = StoryObj<typeof SlackLoader>;

export const Default: Story = {};