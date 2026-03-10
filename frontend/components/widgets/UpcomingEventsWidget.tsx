'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, MapPin, ExternalLink, Clock } from 'lucide-react';
import WidgetCard from './WidgetCard';
import { WIDGET_CONFIGS, DC_EVENTS_SEED } from '@/lib/widgetConfig';
import { isSafeUrl } from '@/lib/safeUrl';

const config = WIDGET_CONFIGS.find((w) => w.id === 'upcoming-sector-events')!;

interface SectorEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
  sector: string;
  url?: string;
  description: string;
  days_until: number;
}

const EVENT_TYPE_STYLES: Record<string, string> = {
  conference: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  summit: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  exhibition: 'bg-green-500/10 text-green-400 border-green-500/20',
  webinar: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function groupByMonth(events: SectorEvent[]): Map<string, SectorEvent[]> {
  const map = new Map<string, SectorEvent[]>();
  for (const e of events) {
    const key = new Date(e.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return map;
}

export default function UpcomingEventsWidget() {
  const [events, setEvents] = useState<SectorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = Date.now();
      const upcoming = (DC_EVENTS_SEED as SectorEvent[])
        .map((e) => ({
          ...e,
          days_until: Math.ceil((new Date(e.date).getTime() - now) / 86400000),
        }))
        .filter((e) => e.days_until >= 0)
        .sort((a, b) => a.days_until - b.days_until)
        .slice(0, config.max_rows);

      setEvents(upcoming);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load sector events:', err);
      setError('Unable to load sector events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, config.refresh_interval_minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  const grouped = groupByMonth(events);

  return (
    <WidgetCard config={config} loading={loading} error={error} onRefresh={load} lastUpdated={lastUpdated}>
      {events.length === 0 ? (
        <p className="p-4 text-sm text-[var(--color-text-muted)]">{config.empty_message}</p>
      ) : (
        <div className="p-3 space-y-4">
          {Array.from(grouped.entries()).map(([month, monthEvents]) => (
            <div key={month}>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] font-semibold mb-2">
                {month}
              </p>
              <div className="space-y-2">
                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`rounded-lg border p-3 ${
                      event.days_until <= 30
                        ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border-subtle)] bg-white/2'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-[var(--color-text-main)] leading-snug">
                        {event.name}
                      </p>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${EVENT_TYPE_STYLES[event.type] ?? 'bg-white/5 text-[var(--color-text-muted)] border-white/10'}`}
                      >
                        {event.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        <CalendarDays size={10} />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        <MapPin size={10} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-faint)]">
                        <Clock size={10} />
                        {event.days_until === 0 ? 'Today' : `${event.days_until}d away`}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-text-faint)] line-clamp-2">
                      {event.description}
                    </p>

                    {event.url && isSafeUrl(event.url) && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                      >
                        Register <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
