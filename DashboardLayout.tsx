import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A responsive CSS Grid layout for dashboards.
 * Children of this component can be placed onto the grid using Tailwind's grid classes.
 */
export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <div className={cn('grid grid-cols-12 auto-rows-min gap-4 p-4', className)}>
      {children}
    </div>
  );
};