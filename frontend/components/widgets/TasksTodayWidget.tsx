'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import WidgetCard from './WidgetCard';
import { bidsApi, opportunitiesApi, type Bid, type Opportunity } from '@/lib/api';
import { WIDGET_CONFIGS } from '@/lib/widgetConfig';

const config = WIDGET_CONFIGS.find((w) => w.id === 'tasks-today')!;

interface Task {
  id: string;
  label: string;
  group: 'urgent' | 'pipeline' | 'bid' | 'estimating';
  done: boolean;
}

export default function TasksTodayWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [opps, bids] = await Promise.allSettled([
        opportunitiesApi.list(),
        bidsApi.list(),
      ]);

      const newTasks: Task[] = [];

      if (bids.status === 'fulfilled') {
        bids.value
          .filter((b) => b.status === 'draft' || b.status === 'in_review')
          .slice(0, 5)
          .forEach((b: Bid) => {
            newTasks.push({
              id: `bid-${b.id}`,
              label: `Review bid pack: ${b.title}`,
              group: 'bid',
              done: false,
            });
          });
      }

      if (opps.status === 'fulfilled') {
        opps.value
          .filter((o: Opportunity) => o.stage === 'lead' || o.stage === 'qualified')
          .slice(0, 5)
          .forEach((o: Opportunity) => {
            newTasks.push({
              id: `opp-${o.id}`,
              label: `Advance opportunity: ${o.title}`,
              group: 'pipeline',
              done: false,
            });
          });
      }

      setTasks(newTasks);
      setLastUpdated(new Date());
    } catch {
      setError('Unable to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, config.refresh_interval_minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const groups = ['urgent', 'pipeline', 'bid', 'estimating'] as const;
  const groupLabels: Record<Task['group'], string> = {
    urgent: 'Urgent',
    pipeline: 'Pipeline Actions',
    bid: 'Bid & Compliance',
    estimating: 'Estimating & Scope',
  };

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <WidgetCard config={config} loading={loading} error={error} onRefresh={load} lastUpdated={lastUpdated}>
      {tasks.length === 0 ? (
        <p className="p-4 text-sm text-[var(--color-text-muted)]">{config.empty_message}</p>
      ) : (
        <div className="p-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">
              {pending.length} pending · {done.length} done
            </span>
            {done.length > 0 && (
              <span className="text-xs text-[var(--color-success)]">
                {Math.round((done.length / tasks.length) * 100)}% complete
              </span>
            )}
          </div>

          {groups.map((group) => {
            const groupTasks = tasks.filter((t) => t.group === group);
            if (groupTasks.length === 0) return null;
            return (
              <div key={group}>
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] font-semibold mb-1.5">
                  {groupLabels[group]}
                </p>
                <div className="space-y-1">
                  {groupTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors text-left"
                    >
                      {task.done ? (
                        <CheckCircle2 size={14} className="text-[var(--color-success)] shrink-0" />
                      ) : (
                        <Circle size={14} className="text-[var(--color-text-faint)] shrink-0" />
                      )}
                      <span
                        className={`text-sm flex-1 truncate ${task.done ? 'line-through text-[var(--color-text-faint)]' : 'text-[var(--color-text-main)]'}`}
                      >
                        {task.label}
                      </span>
                      {!task.done && (
                        <ChevronRight size={12} className="text-[var(--color-text-faint)] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}
