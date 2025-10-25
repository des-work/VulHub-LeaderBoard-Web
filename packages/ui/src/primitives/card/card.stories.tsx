import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from '../button/button';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  render: (args) => (
    <Card {...args} variant="elevated">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>This card has elevated shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Elevated card content</p>
      </CardContent>
    </Card>
  ),
};

export const Outlined: Story = {
  render: (args) => (
    <Card {...args} variant="outlined">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>This card has a thick border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Outlined card content</p>
      </CardContent>
    </Card>
  ),
};