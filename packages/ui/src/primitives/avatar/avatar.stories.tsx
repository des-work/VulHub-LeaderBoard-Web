import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: { type: 'text' },
    },
    alt: {
      control: { type: 'text' },
    },
    fallback: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fallback: 'JD',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
    fallback: 'JD',
  },
};

export const WithFallback: Story = {
  args: {
    fallback: 'AB',
  },
};
