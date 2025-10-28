'use client';

import { DashboardLayout } from '@/components/patterns/DashboardLayout';
import { Widget } from '@/components/patterns/Widget';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Armory Stats Widget: Spans 4 columns on medium screens and up */}
      <div className="col-span-12 md:col-span-4">
        <Widget title="Your Armory Stats">
          <p className="text-foreground-base">Glory: 1,250</p>
          <p className="text-foreground-base">Banners Won: 5</p>
        </Widget>
      </div>

      {/* Siege Rankings Widget: Spans 8 columns on medium screens and up */}
      <div className="col-span-12 md:col-span-8 row-span-2">
        <Widget title="Siege Rankings">
          <p className="text-foreground-base">Top players will be listed here...</p>
        </Widget>
      </div>

      {/* Recent Assaults Widget: Spans 4 columns on medium screens and up */}
      <div className="col-span-12 md:col-span-4">
        <Widget title="Recent Assaults">
          <p className="text-foreground-base">Activity feed goes here...</p>
        </Widget>
      </div>
    </DashboardLayout>
  );
}