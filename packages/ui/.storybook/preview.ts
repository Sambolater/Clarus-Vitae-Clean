import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'clarus-white',
      values: [
        { name: 'clarus-white', value: '#FAFBFC' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'clarus-navy', value: '#1A2B4A' },
        { name: 'stone', value: '#E8E6E3' },
        { name: 'warm-gray', value: '#F5F5F4' },
      ],
    },
    layout: 'centered',
  },
};

export default preview;
