import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'text', 'premium', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Request Information',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Compare Properties',
    variant: 'secondary',
    size: 'md',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'View Details',
    variant: 'tertiary',
    size: 'md',
  },
};

export const Text: Story = {
  args: {
    children: 'Learn more',
    variant: 'text',
    size: 'md',
  },
};

export const Premium: Story = {
  args: {
    children: 'Schedule Private Consultation',
    variant: 'premium',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete Account',
    variant: 'danger',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: 'Save',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Begin Your Research',
    variant: 'primary',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    children: 'Submitting...',
    variant: 'primary',
    size: 'md',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Not Available',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Add to Compare',
    variant: 'secondary',
    size: 'md',
    leftIcon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'View Property',
    variant: 'primary',
    size: 'md',
    rightIcon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="text">Text</Button>
        <Button variant="premium">Premium</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};
