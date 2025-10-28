import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@vulhub/ui/primitives/Card'; // Assuming Card primitive path
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A Widget component that serves as a container for dashboard items.
 * It's a themed Card with a draggable header.
 */
export const Widget = ({ title, children, className }: WidgetProps) => {
  return (
    <Card
      className={cn(
        'card-shadow h-full w-full bg-surface-1/80 backdrop-blur-sm border-border/50', // Use theme colors and add shadow
        'flex flex-col',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
        <CardTitle className="text-foreground-primary text-base text-glow">
          {title}
        </CardTitle>
        {/* This is the handle for dragging the widget */}
        <div className="drag-handle cursor-move text-foreground-muted hover:text-foreground-primary transition-colors">
          <GripVertical size={20} />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">{children}</CardContent>
    </Card>
  );
};