'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import WidgetCard from './WidgetCard';
import { WIDGET_CONFIGS, DC_NEWS_SEED } from '@/lib/widgetConfig';
import { isSafeUrl } from '@/lib/safeUrl';

const config = WIDGET_CONFIGS.find((w) => w.id === 'dc-company-news')!;

interface NewsItem {
  id: string;
  company: string;
  category: string;
  headline: string;
  summary: string;
  source: string;
  url?: string;
  published_at: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  expansion: 'bg-green-500/10 text-green-400 border-green-500/20',
  funding: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  technology: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  competitor: 'bg-red-500/10 text-red-400 border-red-500/20',
  hiring: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  earnings: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  general: 'bg-white/5 text-[var(--color-text-muted)] border-white/10',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function DCNewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use seed data as primary source for DC intelligence
      const items = DC_NEWS_SEED as NewsItem[];
      setNews(items.slice(0, config.max_rows));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load DC news feed:', err);
      setError('Unable to load DC news feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, config.refresh_interval_minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <WidgetCard config={config} loading={loading} error={error} onRefresh={load} lastUpdated={lastUpdated}>
      {news.length === 0 ? (
        <p className="p-4 text-sm text-[var(--color-text-muted)]">{config.empty_message}</p>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {news.map((item) => (
            <div key={item.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.general}`}
                >
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--color-text-faint)] shrink-0">
                  <Clock size={9} />
                  {timeAgo(item.published_at)}
                </span>
              </div>

              <p className="text-sm font-semibold text-[var(--color-text-main)] leading-snug mb-1">
                {item.headline}
              </p>

              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-1.5">
                {item.summary}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-faint)]">{item.company}</span>
                {item.url && isSafeUrl(item.url) && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                  >
                    {item.source}
                    <ExternalLink size={9} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
