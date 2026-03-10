'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import WidgetCard from './WidgetCard';
import { opportunitiesApi, bidsApi, accountsApi, type Opportunity, type Bid, type Account } from '@/lib/api';
import { WIDGET_CONFIGS } from '@/lib/widgetConfig';

const config = WIDGET_CONFIGS.find((w) => w.id === 'top-n-by-category')!;

type Category = 'opportunities' | 'bids' | 'accounts';

interface RankedRow {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  value?: string;
  link: string;
  badgeColor?: string;
}

const STAGE_COLORS: Record<string, string> = {
  bid: 'text-[var(--color-warning)]',
  qualified: 'text-[var(--color-primary)]',
  won: 'text-[var(--color-success)]',
  lead: 'text-[var(--color-text-muted)]',
  target: 'text-[var(--color-text-faint)]',
};

function formatValue(v: number | null | undefined): string {
  if (!v) return 'TBC';
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `£${(v / 1_000).toFixed(0)}K`;
  return `£${v}`;
}

export default function TopNByCategoryWidget() {
  const [rows, setRows] = useState<RankedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [category, setCategory] = useState<Category>('opportunities');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let ranked: RankedRow[] = [];

      if (category === 'opportunities') {
        const data: Opportunity[] = await opportunitiesApi.list();
        ranked = data
          .filter((o) => o.estimated_value)
          .sort((a, b) => (b.estimated_value ?? 0) - (a.estimated_value ?? 0))
          .slice(0, config.max_rows)
          .map((o, i) => ({
            id: o.id.toString(),
            rank: i + 1,
            title: o.title,
            subtitle: o.stage,
            value: formatValue(o.estimated_value),
            link: `/opportunities`,
            badgeColor: STAGE_COLORS[o.stage],
          }));
      } else if (category === 'bids') {
        const data: Bid[] = await bidsApi.list();
        ranked = data
          .slice(0, config.max_rows)
          .map((b, i) => ({
            id: b.id.toString(),
            rank: i + 1,
            title: b.title,
            subtitle: b.status,
            link: `/bids`,
          }));
      } else {
        const data: Account[] = await accountsApi.list();
        ranked = data
          .slice(0, config.max_rows)
          .map((a, i) => ({
            id: a.id.toString(),
            rank: i + 1,
            title: a.name,
            subtitle: `${a.type} · ${a.location ?? 'Unknown'}`,
            link: `/accounts/${a.id}`,
          }));
      }

      setRows(ranked);
      setLastUpdated(new Date());
    } catch {
      setError('Unable to load ranked data');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
    const interval = setInterval(load, config.refresh_interval_minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  const categories: { id: Category; label: string }[] = [
    { id: 'opportunities', label: 'Pipeline' },
    { id: 'bids', label: 'Bids' },
    { id: 'accounts', label: 'Accounts' },
  ];

  return (
    <WidgetCard config={config} loading={loading} error={error} onRefresh={load} lastUpdated={lastUpdated}>
      {/* Category tabs */}
      <div className="flex border-b border-[var(--color-border-subtle)]">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              category === c.id
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] -mb-px'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="p-4 text-sm text-[var(--color-text-muted)]">{config.empty_message}</p>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {rows.map((row) => (
            <Link
              key={row.id}
              href={row.link}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/3 transition-colors group"
            >
              <span className="w-5 text-center text-xs font-bold text-[var(--color-text-faint)]">
                {row.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-main)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {row.title}
                </p>
                <p className={`text-xs capitalize ${row.badgeColor ?? 'text-[var(--color-text-muted)]'}`}>
                  {row.subtitle}
                </p>
              </div>
              {row.value && (
                <span className="text-sm font-semibold text-[var(--color-text-main)] shrink-0">
                  {row.value}
                </span>
              )}
              <ArrowUpRight size={12} className="text-[var(--color-text-faint)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
