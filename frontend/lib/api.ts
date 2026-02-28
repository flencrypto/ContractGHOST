// Set NEXT_PUBLIC_API_URL in .env.local to point to your backend (default: http://localhost:8000/api/v1)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface Account {
  id: number;
  name: string;
  type: string;
  location?: string;
  website?: string;
  notes?: string;
  stage?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: number;
  account_id: number;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface TriggerSignal {
  id: number;
  account_id: number;
  signal_type: string;
  description?: string;
  source?: string;
  detected_at?: string;
}

export interface Opportunity {
  id: number;
  account_id: number;
  title: string;
  stage: string;
  estimated_value?: number;
  probability?: number;
  qualification_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Qualification {
  id: number;
  opportunity_id: number;
  score: number;
  criteria: Record<string, number>;
  recommendation?: string;
  notes?: string;
  created_at?: string;
}

export interface Bid {
  id: number;
  opportunity_id: number;
  title: string;
  status: string;
  win_themes?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BidDocument {
  id: number;
  bid_id: number;
  name: string;
  document_type?: string;
  url?: string;
  uploaded_at?: string;
}

export interface ComplianceItem {
  id: number;
  bid_id: number;
  requirement: string;
  status: string;
  evidence?: string;
  owner?: string;
  section?: string;
}

export interface RFI {
  id: number;
  bid_id: number;
  question: string;
  priority: string;
  status: string;
  response?: string;
  due_date?: string;
}

export interface EstimatingProject {
  id: number;
  bid_id?: number;
  title: string;
  project_type?: string;
  tier?: string;
  budget?: number;
  scope_gap_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScopeGap {
  id: number;
  estimating_id: number;
  category: string;
  item: string;
  status: string;
  risk_level?: string;
  notes?: string;
}

export interface ChecklistItem {
  id: number;
  estimating_id: number;
  category: string;
  item: string;
  checked: boolean;
  notes?: string;
}

// ── Accounts ───────────────────────────────────────────────────────────────

export const accountsApi = {
  list: () => request<Account[]>('/accounts'),
  create: (data: Partial<Account>) => request<Account>('/accounts', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: number) => request<Account>(`/accounts/${id}`),
  update: (id: number, data: Partial<Account>) => request<Account>(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/accounts/${id}`, { method: 'DELETE' }),
  listContacts: (id: number) => request<Contact[]>(`/accounts/${id}/contacts`),
  createContact: (id: number, data: Partial<Contact>) => request<Contact>(`/accounts/${id}/contacts`, { method: 'POST', body: JSON.stringify(data) }),
  listTriggerSignals: (id: number) => request<TriggerSignal[]>(`/accounts/${id}/trigger-signals`),
  createTriggerSignal: (id: number, data: Partial<TriggerSignal>) => request<TriggerSignal>(`/accounts/${id}/trigger-signals`, { method: 'POST', body: JSON.stringify(data) }),
};

// ── Opportunities ──────────────────────────────────────────────────────────

export const opportunitiesApi = {
  list: () => request<Opportunity[]>('/opportunities'),
  create: (data: Partial<Opportunity>) => request<Opportunity>('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: number) => request<Opportunity>(`/opportunities/${id}`),
  update: (id: number, data: Partial<Opportunity>) => request<Opportunity>(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/opportunities/${id}`, { method: 'DELETE' }),
  qualify: (id: number, data: Partial<Qualification>) => request<Qualification>(`/opportunities/${id}/qualify`, { method: 'POST', body: JSON.stringify(data) }),
  getQualification: (id: number) => request<Qualification>(`/opportunities/${id}/qualification`),
};

// ── Bids ───────────────────────────────────────────────────────────────────

export const bidsApi = {
  list: () => request<Bid[]>('/bids'),
  create: (data: Partial<Bid>) => request<Bid>('/bids', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: number) => request<Bid>(`/bids/${id}`),
  update: (id: number, data: Partial<Bid>) => request<Bid>(`/bids/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/bids/${id}`, { method: 'DELETE' }),
  listDocuments: (id: number) => request<BidDocument[]>(`/bids/${id}/documents`),
  createDocument: (id: number, data: Partial<BidDocument>) => request<BidDocument>(`/bids/${id}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  listComplianceItems: (id: number) => request<ComplianceItem[]>(`/bids/${id}/compliance`),
  createComplianceItem: (id: number, data: Partial<ComplianceItem>) => request<ComplianceItem>(`/bids/${id}/compliance`, { method: 'POST', body: JSON.stringify(data) }),
  listRFIs: (id: number) => request<RFI[]>(`/bids/${id}/rfis`),
  createRFI: (id: number, data: Partial<RFI>) => request<RFI>(`/bids/${id}/rfis`, { method: 'POST', body: JSON.stringify(data) }),
  generateComplianceMatrix: (id: number) => request<ComplianceItem[]>(`/bids/${id}/generate-compliance`, { method: 'POST' }),
  generateRFIs: (id: number) => request<RFI[]>(`/bids/${id}/generate-rfis`, { method: 'POST' }),
};

// ── Estimating ─────────────────────────────────────────────────────────────

export const estimatingApi = {
  list: () => request<EstimatingProject[]>('/estimating'),
  create: (data: Partial<EstimatingProject>) => request<EstimatingProject>('/estimating', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: number) => request<EstimatingProject>(`/estimating/${id}`),
  listScopeGaps: (id: number) => request<ScopeGap[]>(`/estimating/${id}/scope-gaps`),
  createScopeGap: (id: number, data: Partial<ScopeGap>) => request<ScopeGap>(`/estimating/${id}/scope-gaps`, { method: 'POST', body: JSON.stringify(data) }),
  listChecklist: (id: number) => request<ChecklistItem[]>(`/estimating/${id}/checklist`),
  createChecklistItem: (id: number, data: Partial<ChecklistItem>) => request<ChecklistItem>(`/estimating/${id}/checklist`, { method: 'POST', body: JSON.stringify(data) }),
  getScopeGapReport: (id: number) => request<{ score: number; items: ScopeGap[] }>(`/estimating/${id}/scope-gap-report`),
};
