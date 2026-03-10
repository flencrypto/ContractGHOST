'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import AlignLogo from '@/components/layout/AlignLogo';
import type { WidgetConfig } from '@/types/widget';

interface WidgetCardProps {
  config: WidgetConfig;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  lastUpdated?: Date | null;
  className?: string;
}

export default function WidgetCard({
  config,
  children,
  loading = false,
  error = null,
  onRefresh,
  lastUpdated,
  className = '',
}: WidgetCardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  const isSpinning = loading || refreshing;

  return (
    <div
      className={`relative flex flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-panel overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-border-subtle)] bg-black/20">
        <div className="flex items-center gap-2 min-w-0">
          <AlignLogo compact />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--color-text-main)] truncate">
              {config.name}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] truncate hidden sm:block">
              {config.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {lastUpdated && (
            <span className="text-xs text-[var(--color-text-faint)] hidden md:block">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isSpinning}
              className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-white/5 transition-colors disabled:opacity-50"
              title="Refresh widget"
            >
              <RefreshCw
                size={13}
                className={isSpinning ? 'animate-spin' : ''}
              />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <AlertCircle size={20} className="text-[var(--color-danger)]" />
            <p className="text-sm text-[var(--color-text-muted)]">{error}</p>
            {onRefresh && (
              <button
                onClick={handleRefresh}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Try again
              </button>
            )}
          </div>
        ) : loading ? (
          <WidgetSkeleton />
        ) : (
          children
        )}
      </div>

      {/* Refresh interval indicator */}
      <div className="px-4 py-1.5 border-t border-[var(--color-border-subtle)] bg-black/10">
        <span className="text-[10px] text-[var(--color-text-faint)]">
          Refreshes every {config.refresh_interval_minutes < 60
            ? `${config.refresh_interval_minutes}m`
            : `${Math.round(config.refresh_interval_minutes / 60)}h`}
        </span>
      </div>
    </div>
  );
}

function WidgetSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 rounded bg-white/5 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-white/5 rounded w-3/4" />
            <div className="h-2.5 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
