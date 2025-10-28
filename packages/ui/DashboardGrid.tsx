'use client';

import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  layouts: { [key: string]: Layout[] };
  onLayoutChange?: (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => void;
}

/**
 * A responsive, draggable, and resizable grid layout for dashboards.
 * This component acts as the container for all dashboard widgets.
 *
 * @example
 * <DashboardGrid layouts={savedLayouts} onLayoutChange={handleLayoutChange}>
 *   <div key="a"><Widget>...</Widget></div>
 *   <div key="b"><Widget>...</Widget></div>
 * </DashboardGrid>
 */
export const DashboardGrid = ({
  children,
  className,
  layouts,
  onLayoutChange,
}: DashboardGridProps) => {
  return (
    <ResponsiveGridLayout
      className={cn('min-h-screen', className)}
      layouts={layouts}
      onLayoutChange={onLayoutChange}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      draggableHandle=".drag-handle" // We will add this class to our widget headers
    >
      {children}
    </ResponsiveGridLayout>
  );
};

/**
 * Custom styles to override react-grid-layout defaults and match our theme.
 * Place these styles in a global CSS file (e.g., apps/web/styles/globals.css)
 *
 * .react-grid-item.react-grid-placeholder {
 *   background: rgba(51, 255, 153, 0.2) !important;
 *   border: 1px dashed #33ff99;
 *   border-radius: 0.5rem;
 *   transition: all 0.2s ease-in-out;
 * }
 *
 * .react-resizable-handle::after {
 *   content: '';
 *   position: absolute;
 *   bottom: 2px;
 *   right: 2px;
 *   width: 10px;
 *   height: 10px;
 *   border-right: 2px solid #9ca3af;
 *   border-bottom: 2px solid #9ca3af;
 * }
 */