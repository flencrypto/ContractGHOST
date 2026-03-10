export type WidgetDisplayType = 'timeline' | 'task-list' | 'card-list' | 'news-feed' | 'ranked-table';

export type WidgetDataSource =
  | 'align-calls-today'
  | 'align-bid-deadlines'
  | 'align-opportunities-followup'
  | 'align-trigger-signals-today'
  | 'open-rfis'
  | 'compliance-items'
  | 'bid-followups'
  | 'opportunity-actions'
  | 'scope-gaps'
  | 'checklist-items'
  | 'align-accounts'
  | 'align-intel-companies'
  | 'align-news-feed'
  | 'align-signals'
  | 'align-opportunities'
  | 'align-bids'
  | 'external-events-feed';

export interface WidgetVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date';
  required?: boolean;
  default?: string | number | boolean;
  enum?: string[];
  system?: boolean;
  description?: string;
}

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  display: WidgetDisplayType;
  data_sources: WidgetDataSource[];
  variables?: WidgetVariable[];
  refresh_interval_minutes: number;
  max_rows?: number;
  assistant_hints?: string[];
  empty_message: string;
  /** Static seed data for DC intelligence */
  seed_data?: unknown[];
}
