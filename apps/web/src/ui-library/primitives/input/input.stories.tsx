import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
    inputSize: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    variant: 'error',
    error: 'Password is required',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    helperText: 'Choose a unique username',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    inputSize: 'sm',
    placeholder: 'Small input',
  },
};

export const Large: Story = {
  args: {
    inputSize: 'lg',
    placeholder: 'Large input',
  },
};