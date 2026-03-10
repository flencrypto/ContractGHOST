'use client';

import { LayoutGrid } from 'lucide-react';
import DiaryTodayWidget from '@/components/widgets/DiaryTodayWidget';
import TasksTodayWidget from '@/components/widgets/TasksTodayWidget';
import DCCompaniesWidget from '@/components/widgets/DCCompaniesWidget';
import DCNewsWidget from '@/components/widgets/DCNewsWidget';
import TopNByCategoryWidget from '@/components/widgets/TopNByCategoryWidget';
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget';

export default function WidgetsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)]">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
            <LayoutGrid size={16} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-main)]">
              Intelligence Widgets
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Live data centre intelligence · auto-refreshing
            </p>
          </div>
        </div>
      </div>

      {/* Widget grid */}
      <div className="p-4 md:p-6">
        {/* Row 1: Diary + Tasks (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DiaryTodayWidget />
          <TasksTodayWidget />
        </div>

        {/* Row 2: DC Companies + DC News (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DCCompaniesWidget />
          <DCNewsWidget />
        </div>

        {/* Row 3: Top N + Events (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopNByCategoryWidget />
          <UpcomingEventsWidget />
        </div>
      </div>
    </div>
  );
}
