import { cn } from '@/lib/utils';
import { ShieldOff } from 'lucide-react'; // Or any other thematic icon

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

export const EmptyState = ({ title, description, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center h-full text-center p-4', className)}>
      <ShieldOff className="w-12 h-12 text-foreground-muted mb-4" />
      <h3 className="text-lg font-semibold text-foreground-base">{title}</h3>
      <p className="text-sm text-foreground-muted mt-1">{description}</p>
    </div>
  );
};