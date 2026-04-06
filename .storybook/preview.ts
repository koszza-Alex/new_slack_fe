import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'slack-purple', value: '#3F0E40' },
        { name: 'gray', value: '#f8f8f8' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;