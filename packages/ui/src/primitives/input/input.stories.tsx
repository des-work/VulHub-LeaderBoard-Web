import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Mail, Lock, Search, Eye, EyeOff } from 'lucide-react';

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
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
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

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input
        label="Email"
        placeholder="Enter your email"
        leftIcon={<Mail className="h-4 w-4" />}
      />
      <Input
        label="Search"
        placeholder="Search..."
        leftIcon={<Search className="h-4 w-4" />}
      />
      <Input
        label="Password"
        type="password"
        rightIcon={<Eye className="h-4 w-4" />}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" placeholder="Small input" />
      <Input size="default" placeholder="Default input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Default state" />
      <Input placeholder="Success state" variant="success" />
      <Input placeholder="Error state" variant="error" />
      <Input placeholder="Disabled state" disabled />
    </div>
  ),
};
