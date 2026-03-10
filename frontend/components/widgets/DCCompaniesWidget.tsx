'use client';

import { useCallback, useEffect, useState } from 'react';
import { Building2, Globe, MapPin, Sparkles } from 'lucide-react';
import WidgetCard from './WidgetCard';
import { accountsApi, type Account } from '@/lib/api';
import { WIDGET_CONFIGS, DC_COMPANIES_SEED } from '@/lib/widgetConfig';
import { isSafeUrl } from '@/lib/safeUrl';

const config = WIDGET_CONFIGS.find((w) => w.id === 'newly-formed-dc-companies')!;

const DC_TYPES = ['operator', 'hyperscaler', 'developer', 'colo', 'enterprise'];

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function isNew(firstSeen: string): boolean {
  return Date.now() - new Date(firstSeen).getTime() < THIRTY_DAYS_MS;
}

const TYPE_COLORS: Record<string, string> = {
  operator: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  hyperscaler: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  developer: 'bg-green-500/10 text-green-400 border-green-500/20',
  colo: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  enterprise: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

interface CompanyRow {
  id: string;
  name: string;
  type: string;
  location?: string;
  website?: string;
  first_seen: string;
  notes?: string;
}

export default function DCCompaniesWidget() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let rows: CompanyRow[] = [];
      try {
        const accounts: Account[] = await accountsApi.list();
        const dcAccounts = accounts.filter((a) => DC_TYPES.includes(a.type));
        rows = dcAccounts.map((a) => ({
          id: a.id.toString(),
          name: a.name,
          type: a.type,
          location: a.location ?? undefined,
          website: a.website ?? undefined,
          first_seen: a.created_at ?? new Date().toISOString(),
          notes: a.notes ?? undefined,
        }));
      } catch (err) {
        console.error('DC companies API unavailable, using seed data:', err);
      }

      if (rows.length === 0) {
        rows = (DC_COMPANIES_SEED as CompanyRow[]).map((s) => ({
          ...s,
          id: s.id,
        }));
      }

      setCompanies(rows.slice(0, config.max_rows));
      setLastUpdated(new Date());
    } catch {
      setError('Unable to load DC company data');
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
      {companies.length === 0 ? (
        <p className="p-4 text-sm text-[var(--color-text-muted)]">{config.empty_message}</p>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {companies.map((c) => (
            <div key={c.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 size={14} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[var(--color-text-main)] truncate">
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isNew(c.first_seen) && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                      <Sparkles size={9} />
                      NEW
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${TYPE_COLORS[c.type] ?? 'bg-white/5 text-[var(--color-text-muted)] border-white/10'}`}
                  >
                    {c.type}
                  </span>
                </div>
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {c.location && (
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <MapPin size={10} />
                    {c.location}
                  </span>
                )}
                {c.website && isSafeUrl(c.website) && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                  >
                    <Globe size={10} />
                    Website
                  </a>
                )}
              </div>

              {c.notes && (
                <p className="mt-1 text-xs text-[var(--color-text-faint)] line-clamp-2">{c.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
