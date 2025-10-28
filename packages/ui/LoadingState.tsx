import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState = ({ className }: LoadingStateProps) => {
  return (
    <div className={cn('flex items-center justify-center h-full', className)}>
      <Loader2 className="w-8 h-8 text-foreground-primary animate-spin text-glow" />
    </div>
  );
};