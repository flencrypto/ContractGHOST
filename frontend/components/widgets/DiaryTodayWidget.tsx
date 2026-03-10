'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock, FileText, Zap, Users } from 'lucide-react';
import WidgetCard from './WidgetCard';
import { opportunitiesApi, bidsApi, signalsApi, type Opportunity, type Bid, type SignalEvent } from '@/lib/api';
import { WIDGET_CONFIGS } from '@/lib/widgetConfig';

const config = WIDGET_CONFIGS.find((w) => w.id === 'diary-today')!;

interface DiaryItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'bid' | 'opportunity' | 'signal' | 'call';
  urgent?: boolean;
}

function toBidItem(b: Bid): DiaryItem {
  return {
    id: b.id.toString(),
    time: 'Deadline',
    title: b.title,
    subtitle: `Bid · ${b.status}`,
    type: 'bid',
    urgent: true,
  };
}

function toOpportunityItem(o: Opportunity): DiaryItem {
  return {
    id: o.id.toString(),
    time: 'Follow-up',
    title: o.title,
    subtitle: `${o.stage} · ${o.estimated_value ? `£${(o.estimated_value / 1_000_000).toFixed(1)}M` : 'TBC'}`,
    type: 'opportunity',
    urgent: o.stage === 'bid' || o.stage === 'qualified',
  };
}

function toSignalItem(s: SignalEvent): DiaryItem {
  return {
    id: s.id.toString(),
    time: 'Signal',
    title: s.title,
    subtitle: s.event_type.replace(/_/g, ' '),
    type: 'signal',
  };
}

const ICON_MAP = {
  bid: FileText,
  opportunity: Users,
  signal: Zap,
  call: Clock,
};

const COLOR_MAP = {
  bid: 'text-[var(--color-warning)]',
  opportunity: 'text-[var(--color-primary)]',
  signal: 'text-[var(--color-success)]',
  call: 'text-[var(--color-text-muted)]',
};

export default function DiaryTodayWidget() {
  const [items, setItems] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [opps, bids, signals] = await Promise.allSettled([
        opportunitiesApi.list(),
        bidsApi.list(),
        signalsApi.list({ status: 'active' }),
      ]);

      const all: DiaryItem[] = [];

      if (bids.status === 'fulfilled') {
        bids.value.slice(0, 3).forEach((b) => all.push(toBidItem(b)));
      }
      if (opps.status === 'fulfilled') {
        opps.value
          .filter((o) => ['qualified', 'bid'].includes(o.stage))
          .slice(0, config.max_rows! - all.length)
          .forEach((o) => all.push(toOpportunityItem(o)));
      }
      if (signals.status === 'fulfilled') {
        signals.value.slice(0, 3).forEach((s) => all.push(toSignalItem(s)));
      }

      setItems(all);
      setLastUpdated(new Date());
    } catch {
      setError('Unable to load diary items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, config.refresh_interval_minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  const urgent = items.filter((i) => i.urgent);
  const normal = items.filter((i) => !i.urgent);

  return (
    <WidgetCard config={config} loading={loading} error={error} onRefresh={load} lastUpdated={lastUpdated}>
      {items.length === 0 ? (
        <p className="p-4 text-sm text-[var(--color-text-muted)]">{config.empty_message}</p>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {urgent.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-warning)] font-semibold mb-2">Urgent</p>
              <div className="space-y-2">
                {urgent.map((item) => <DiaryRow key={item.id} item={item} />)}
              </div>
            </div>
          )}
          {normal.length > 0 && (
            <div className="px-4 pt-3 pb-3">
              {urgent.length > 0 && (
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] font-semibold mb-2">Scheduled</p>
              )}
              <div className="space-y-2">
                {normal.map((item) => <DiaryRow key={item.id} item={item} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </WidgetCard>
  );
}

function DiaryRow({ item }: { item: DiaryItem }) {
  const Icon = ICON_MAP[item.type];
  return (
    <div className="flex items-start gap-3 py-1">
      <div className={`mt-0.5 shrink-0 ${COLOR_MAP[item.type]}`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{item.title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{item.subtitle}</p>
      </div>
      <span className="ml-auto text-xs text-[var(--color-text-faint)] shrink-0">{item.time}</span>
    </div>
  );
}
