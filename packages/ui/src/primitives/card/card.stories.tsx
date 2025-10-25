import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from '../button';
import { Badge } from '../badge';

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
      options: ['default', 'outlined', 'elevated', 'flat'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'default', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you would put the main content of your card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="default" className="w-80">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the default card style.</p>
        </CardContent>
      </Card>
      
      <Card variant="outlined" className="w-80">
        <CardHeader>
          <CardTitle>Outlined Card</CardTitle>
          <CardDescription>Card with thick border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a thicker border.</p>
        </CardContent>
      </Card>
      
      <Card variant="elevated" className="w-80">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>Card with shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a shadow for elevation.</p>
        </CardContent>
      </Card>
      
      <Card variant="flat" className="w-80">
        <CardHeader>
          <CardTitle>Flat Card</CardTitle>
          <CardDescription>Card without border or shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has no border or shadow.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Status</CardTitle>
          <Badge variant="success">Active</Badge>
        </div>
        <CardDescription>Current project status and details</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This project is currently active and in development.</p>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline">View Details</Button>
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  ),
};

export const PaddingVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Card padding="none" className="w-80">
        <CardHeader>
          <CardTitle>No Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has no padding.</p>
        </CardContent>
      </Card>
      
      <Card padding="sm" className="w-80">
        <CardHeader>
          <CardTitle>Small Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has small padding.</p>
        </CardContent>
      </Card>
      
      <Card padding="default" className="w-80">
        <CardHeader>
          <CardTitle>Default Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has default padding.</p>
        </CardContent>
      </Card>
      
      <Card padding="lg" className="w-80">
        <CardHeader>
          <CardTitle>Large Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has large padding.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
