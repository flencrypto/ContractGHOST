'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import {
  Copy,
  Check,
  Palette,
  Type,
  Layout,
  Zap,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Star,
  Shield,
  Loader,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type TabId = 'colors' | 'typography' | 'components' | 'animations' | 'effects';

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const COLOR_TOKENS = [
  { name: '--color-background',    label: 'Background',      twClass: 'bg-color-background' },
  { name: '--color-surface',       label: 'Surface',         twClass: 'bg-color-surface' },
  { name: '--color-border-subtle', label: 'Border Subtle',   twClass: 'bg-color-border-subtle' },
  { name: '--color-primary',       label: 'Primary (Cyan)',  twClass: 'bg-color-primary' },
  { name: '--color-primary-dark',  label: 'Primary Dark',    twClass: 'bg-color-primary-dark' },
  { name: '--color-secondary',     label: 'Secondary',       twClass: 'bg-color-secondary' },
  { name: '--color-text-main',     label: 'Text Main',       twClass: 'bg-color-text-main' },
  { name: '--color-text-muted',    label: 'Text Muted',      twClass: 'bg-color-text-muted' },
  { name: '--color-text-faint',    label: 'Text Faint',      twClass: 'bg-color-text-faint' },
  { name: '--color-success',       label: 'Success',         twClass: 'bg-color-success' },
  { name: '--color-warning',       label: 'Warning',         twClass: 'bg-color-warning' },
  { name: '--color-danger',        label: 'Danger',          twClass: 'bg-color-danger' },
];

const SHADOW_TOKENS = [
  { name: 'shadow-panel',    label: 'Panel',     cls: 'shadow-panel' },
  { name: 'shadow-glow',     label: 'Glow',      cls: 'shadow-glow' },
  { name: 'shadow-glow-lg',  label: 'Glow LG',   cls: 'shadow-glow-lg' },
  { name: 'shadow-glow-xl',  label: 'Glow XL',   cls: 'shadow-glow-xl' },
  { name: 'shadow-neon',     label: 'Neon',       cls: 'shadow-neon' },
];

const TABS: { id: TabId; label: string; Icon: typeof Palette }[] = [
  { id: 'colors',      label: 'Colors & Tokens', Icon: Palette },
  { id: 'typography',  label: 'Typography',       Icon: Type },
  { id: 'components',  label: 'Components',       Icon: Layout },
  { id: 'animations',  label: 'Animations',       Icon: Zap },
  { id: 'effects',     label: 'Effects',          Icon: Sparkles },
];

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  function handleCopy() {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1800);
      },
      () => { /* permission denied or non-secure context — ignore silently */ }
    );
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : `Copy ${value}`}
      aria-label={copied ? 'Copied!' : `Copy ${value}`}
      className="ml-auto p-1 rounded-md text-color-text-faint hover:text-color-primary hover:bg-color-primary/10 transition-all duration-150"
    >
      {copied ? <Check size={12} className="text-color-success" /> : <Copy size={12} />}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Copied!' : ''}
      </span>
    </button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="section-header mb-4">
      {children}
    </h2>
  );
}

function TokenRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-color-primary/5 transition-colors group">
      <span className="text-xs font-mono text-color-text-muted w-52 shrink-0 truncate">{label}</span>
      <span className="text-xs font-mono text-color-text-faint flex-1 truncate">{value}</span>
      <CopyButton value={label} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Tab panels
───────────────────────────────────────────────────────────── */
function ColorsPanel() {
  const [fontTokens, setFontTokens] = useState({ sans: '…', mono: '…' });
  const [resolvedColors, setResolvedColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    setFontTokens({
      sans: computed.getPropertyValue('--font-sans').trim() || 'Inter, ui-sans-serif, system-ui',
      mono: computed.getPropertyValue('--font-mono').trim() || 'JetBrains Mono, ui-monospace',
    });
    const colors: Record<string, string> = {};
    COLOR_TOKENS.forEach((t) => {
      colors[t.name] = computed.getPropertyValue(t.name).trim();
    });
    setResolvedColors(colors);
  }, []);
  return (
    <div className="space-y-8">
      {/* Color Grid */}
      <div>
        <SectionHeading>Color Tokens</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {COLOR_TOKENS.map((token) => (
            <div key={token.name} className="glass-card rounded-xl overflow-hidden group">
              {/* Swatch uses Tailwind class so it always matches the live theme */}
              <div className={`h-16 w-full ${token.twClass}`} />
              <div className="p-3">
                <p className="text-xs font-semibold text-color-text-main truncate">{token.label}</p>
                <p className="text-[10px] font-mono text-color-text-faint mt-0.5">
                  {resolvedColors[token.name] || '…'}
                </p>
                <div className="flex items-center mt-1.5">
                  <p className="text-[9px] font-mono text-color-text-faint/70 truncate flex-1">{token.name}</p>
                  <CopyButton value={token.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow Tokens */}
      <div>
        <SectionHeading>Shadow Tokens</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SHADOW_TOKENS.map((s) => (
            <div key={s.name} className="glass-card rounded-xl p-4 flex flex-col items-center gap-3">
              <div
                className={`w-16 h-10 rounded-xl bg-color-surface ${s.cls}`}
              />
              <div className="text-center">
                <p className="text-xs font-semibold text-color-text-main">{s.label}</p>
                <div className="flex items-center gap-1 mt-0.5 justify-center">
                  <p className="text-[9px] font-mono text-color-text-faint">{s.name}</p>
                  <CopyButton value={s.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Variable Reference */}
      <div>
        <SectionHeading>CSS Variable Reference</SectionHeading>
        <div className="glass-card rounded-xl divide-y divide-color-border-subtle/30">
          {COLOR_TOKENS.map((t) => (
            <TokenRow key={t.name} label={t.name} value={resolvedColors[t.name] || '…'} />
          ))}
          <TokenRow label="--radius-card"   value="8px" />
          <TokenRow label="--radius-button" value="6px" />
          <TokenRow label="--font-sans"     value={fontTokens.sans} />
          <TokenRow label="--font-mono"     value={fontTokens.mono} />
        </div>
      </div>
    </div>
  );
}

function TypographyPanel() {
  return (
    <div className="space-y-8">
      {/* Scale */}
      <div>
        <SectionHeading>Type Scale</SectionHeading>
        <div className="glass-card rounded-xl p-6 space-y-6">
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-4xl · font-bold</p>
            <p className="text-4xl font-bold text-color-text-main tracking-tight">Heading Level 1</p>
          </div>
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-3xl · font-semibold</p>
            <p className="text-3xl font-semibold text-color-text-main tracking-tight">Heading Level 2</p>
          </div>
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-2xl · font-semibold</p>
            <p className="text-2xl font-semibold text-color-text-main">Heading Level 3</p>
          </div>
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-lg · font-medium</p>
            <p className="text-lg font-medium text-color-text-main">Heading Level 4</p>
          </div>
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-base · font-normal</p>
            <p className="text-base text-color-text-main">
              Body text. The quick brown fox jumps over the lazy dog. This is standard paragraph copy used throughout the application.
            </p>
          </div>
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-sm · text-color-text-muted</p>
            <p className="text-sm text-color-text-muted">
              Secondary body text, used for descriptions and supporting copy. Slightly muted for visual hierarchy.
            </p>
          </div>
          <div className="border-b border-color-border-subtle/30 pb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">text-xs · text-color-text-faint</p>
            <p className="text-xs text-color-text-faint">
              Caption and label text. Used for timestamps, metadata, and fine print throughout the interface.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">font-mono · text-sm</p>
            <p className="text-sm font-mono text-color-primary">
              const align = &apos;xALiGN&apos;; // monospace font for code and data
            </p>
          </div>
        </div>
      </div>

      {/* Special styles */}
      <div>
        <SectionHeading>Special Text Effects</SectionHeading>
        <div className="glass-card rounded-xl p-6 space-y-5">
          <div>
            <p className="text-[10px] font-mono text-color-text-faint mb-2">neon-text · text-color-primary</p>
            <p className="text-2xl font-bold text-color-primary neon-text">Neon Glow Text Effect</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-color-text-faint mb-2">gradient text · bg-clip-text</p>
            <p
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #00E5FF 0%, #6366F1 50%, #22C55E 100%)' }}
            >
              Multi-color Gradient Text
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-color-text-faint mb-2">section-header class</p>
            <div className="section-header">Section Header Pattern</div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-color-text-faint mb-2">uppercase tracking-widest · font-mono</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-color-text-faint">
              Micro Label / Category Tag
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentsPanel() {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div>
        <SectionHeading>Buttons</SectionHeading>
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <button className="px-4 py-2 text-sm font-medium bg-color-primary text-color-background rounded-button hover:bg-color-primary/90 transition-all duration-200 shadow-sm shadow-color-primary/20 font-mono">
              Primary
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-color-secondary text-white rounded-button hover:bg-color-secondary/90 transition-all duration-200 shadow-sm shadow-color-secondary/20 font-mono">
              Secondary
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-color-surface border border-color-border-subtle text-color-text-main rounded-button hover:border-color-primary/40 hover:text-color-primary transition-all duration-200 font-mono">
              Ghost
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-color-danger/10 border border-color-danger/30 text-color-danger rounded-button hover:bg-color-danger/20 transition-all duration-200 font-mono">
              Destructive
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-color-success/10 border border-color-success/30 text-color-success rounded-button hover:bg-color-success/20 transition-all duration-200 font-mono">
              Success
            </button>
            <button disabled className="px-4 py-2 text-sm font-medium bg-color-surface/40 text-color-text-faint rounded-button cursor-not-allowed font-mono opacity-50">
              Disabled
            </button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-color-primary text-color-background rounded-button hover:bg-color-primary/90 transition-all duration-200 font-mono">
              <Zap size={14} /> With Icon
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-color-surface border border-color-border-subtle text-color-text-main rounded-button hover:border-color-primary/40 transition-all duration-200 font-mono">
              Small Button
            </button>
            <button className="flex items-center gap-2 px-6 py-3 text-base font-semibold bg-color-primary text-color-background rounded-card hover:bg-color-primary/90 transition-all duration-200 neon-glow font-mono">
              Large + Glow
            </button>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <SectionHeading>Badges</SectionHeading>
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-wrap gap-3 items-center">
            {[
              { label: 'Primary',   cls: 'bg-color-primary/10 text-color-primary border-color-primary/20' },
              { label: 'Secondary', cls: 'bg-color-secondary/10 text-color-secondary border-color-secondary/20' },
              { label: 'Success',   cls: 'bg-color-success/10 text-color-success border-color-success/20' },
              { label: 'Warning',   cls: 'bg-color-warning/10 text-color-warning border-color-warning/20' },
              { label: 'Danger',    cls: 'bg-color-danger/10 text-color-danger border-color-danger/20' },
              { label: 'Muted',     cls: 'bg-color-surface text-color-text-muted border-color-border-subtle/50' },
            ].map((b) => (
              <span
                key={b.label}
                className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full border ${b.cls}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div>
        <SectionHeading>Form Inputs</SectionHeading>
        <div className="glass-card rounded-xl p-6 space-y-4 max-w-lg">
          <div>
            <label htmlFor="debug-text-input" className="block text-xs font-mono uppercase tracking-wider text-color-text-faint mb-1.5">
              Text Input
            </label>
            <input
              id="debug-text-input"
              type="text"
              placeholder="Enter value…"
              className="w-full px-3 py-2.5 text-sm bg-color-surface/60 border border-color-border-subtle rounded-card text-color-text-main placeholder-color-text-faint focus:outline-none focus:ring-1 focus:ring-color-primary/50 focus:border-color-primary/40 transition-all duration-200 font-mono"
            />
          </div>
          <div>
            <label htmlFor="debug-select" className="block text-xs font-mono uppercase tracking-wider text-color-text-faint mb-1.5">
              Select
            </label>
            <select id="debug-select" className="w-full px-3 py-2.5 text-sm bg-color-surface/60 border border-color-border-subtle rounded-card text-color-text-main focus:outline-none focus:ring-1 focus:ring-color-primary/50 transition-all duration-200 font-mono">
              <option>Option Alpha</option>
              <option>Option Beta</option>
              <option>Option Gamma</option>
            </select>
          </div>
          <div>
            <label htmlFor="debug-textarea" className="block text-xs font-mono uppercase tracking-wider text-color-text-faint mb-1.5">
              Textarea
            </label>
            <textarea
              id="debug-textarea"
              rows={3}
              placeholder="Enter description…"
              className="w-full px-3 py-2.5 text-sm bg-color-surface/60 border border-color-border-subtle rounded-card text-color-text-main placeholder-color-text-faint focus:outline-none focus:ring-1 focus:ring-color-primary/50 focus:border-color-primary/40 transition-all duration-200 resize-none font-mono"
            />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="chk1" className="accent-color-primary w-4 h-4 rounded" />
            <label htmlFor="chk1" className="text-sm text-color-text-main cursor-pointer">Checkbox option</label>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div>
        <SectionHeading>Card Variants</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* glass-card */}
          <div className="glass-card rounded-xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">glass-card</p>
            <p className="text-sm font-semibold text-color-text-main mb-1">Frosted Glass Card</p>
            <p className="text-xs text-color-text-muted">
              Backdrop blur with gradient border. Lifts on hover.
            </p>
          </div>

          {/* stat-card */}
          <div className="stat-card p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">stat-card</p>
            <p className="text-2xl font-bold font-mono text-color-primary neon-text">£1.2M</p>
            <p className="text-xs text-color-text-muted mt-1">Animated gradient border on hover</p>
          </div>

          {/* action-card */}
          <div className="action-card p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">action-card</p>
            <p className="text-sm font-semibold text-color-text-main mb-1">Quick Action Card</p>
            <p className="text-xs text-color-text-muted">
              Subtle shimmer on hover, used in Mission Control.
            </p>
          </div>

          {/* glass-panel */}
          <div className="glass-panel rounded-xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">glass-panel</p>
            <p className="text-sm font-semibold text-color-text-main mb-1">Glass Panel</p>
            <p className="text-xs text-color-text-muted">
              80% opacity surface with primary-tinted border.
            </p>
          </div>

          {/* metric-card */}
          <div className="metric-card p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">metric-card</p>
            <p className="text-2xl font-bold font-mono text-color-success">42</p>
            <p className="text-xs text-color-text-muted mt-1">Metric / KPI display card</p>
          </div>

          {/* plain surface */}
          <div className="bg-color-surface border border-color-border-subtle rounded-xl p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-color-text-faint mb-2">surface + border</p>
            <p className="text-sm font-semibold text-color-text-main mb-1">Plain Surface Card</p>
            <p className="text-xs text-color-text-muted">
              bg-color-surface with border-color-border-subtle.
            </p>
          </div>
        </div>
      </div>

      {/* Alert / Status */}
      <div>
        <SectionHeading>Alerts &amp; Status</SectionHeading>
        <div className="space-y-3">
          {[
            { Icon: Info,          label: 'Info',    cls: 'bg-color-primary/8 border-color-primary/25 text-color-primary' },
            { Icon: CheckCircle,   label: 'Success', cls: 'bg-color-success/8 border-color-success/25 text-color-success' },
            { Icon: AlertTriangle, label: 'Warning', cls: 'bg-color-warning/8 border-color-warning/25 text-color-warning' },
            { Icon: XCircle,       label: 'Error',   cls: 'bg-color-danger/8 border-color-danger/25 text-color-danger' },
          ].map(({ Icon, label, cls }) => (
            <div key={label} className={`flex items-start gap-3 p-4 rounded-xl border ${cls}`}>
              <Icon size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{label} Alert</p>
                <p className="text-xs opacity-80 mt-0.5">
                  This is an example {label.toLowerCase()} message used for system feedback.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimationsPanel() {
  const [trigger, setTrigger] = useState(0);

  function replay() {
    setTrigger((n) => n + 1);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs text-color-text-faint font-mono">Click &quot;Replay&quot; to re-trigger CSS animations</p>
        <button
          onClick={replay}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-color-primary/10 text-color-primary border border-color-primary/20 rounded-button hover:bg-color-primary/20 transition-all duration-200"
        >
          <Loader size={12} />
          Replay
        </button>
      </div>

      {/* Tailwind keyframe animations */}
      <div>
        <SectionHeading>Keyframe Animations</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'animate-fade-in',       label: 'Fade In',        cls: 'animate-fade-in' },
            { name: 'animate-fade-in-up',    label: 'Fade In Up',     cls: 'animate-fade-in-up' },
            { name: 'animate-slide-in-right',label: 'Slide In Right', cls: 'animate-slide-in-right' },
            { name: 'animate-pulse-slow',    label: 'Pulse Slow',     cls: 'animate-pulse-slow' },
          ].map((anim) => (
            <div key={anim.name} className="glass-card rounded-xl p-4 flex flex-col items-center gap-3 text-center">
              <div
                key={`${anim.name}-${trigger}`}
                className={`w-12 h-12 rounded-xl bg-color-primary/20 border border-color-primary/30 flex items-center justify-center ${anim.cls}`}
              >
                <Star size={20} className="text-color-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-color-text-main">{anim.label}</p>
                <p className="text-[9px] font-mono text-color-text-faint mt-0.5">{anim.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS class animations */}
      <div>
        <SectionHeading>CSS Utility Animations</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { name: 'pulse-cyan',   label: 'Pulse Cyan',   desc: 'cyan box-shadow pulse',     el: <div className="w-10 h-10 rounded-xl bg-color-primary/20 pulse-cyan" /> },
            { name: 'animate-ping', label: 'Ping',         desc: 'scale + fade out',           el: <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-color-success opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-color-success" /></span> },
            { name: 'animate-pulse',label: 'Pulse',        desc: 'opacity cycle',              el: <div className="w-10 h-2 rounded-full bg-color-primary/50 animate-pulse" /> },
            { name: 'animate-spin', label: 'Spin',         desc: 'continuous rotation',        el: <Loader size={20} className="animate-spin text-color-primary" /> },
            { name: 'animate-bounce',label: 'Bounce',      desc: 'vertical bounce',            el: <div className="w-3 h-3 rounded-full bg-color-primary animate-bounce" /> },
            { name: 'card-hover',   label: 'Card Hover',   desc: 'translateY + shadow on hover', el: <div className="card-hover w-12 h-8 bg-color-surface border border-color-border-subtle rounded-lg cursor-pointer" /> },
          ].map((item) => (
            <div key={item.name} className="glass-card rounded-xl p-4 flex flex-col gap-3">
              <div className="h-12 flex items-center justify-center">
                {item.el}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-color-text-main">{item.label}</p>
                <p className="text-[9px] font-mono text-color-text-faint mt-0.5">{item.name}</p>
                <p className="text-[9px] text-color-text-faint/70 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading states */}
      <div>
        <SectionHeading>Loading States</SectionHeading>
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div>
            <p className="text-[10px] font-mono text-color-text-faint mb-3">shimmer skeleton</p>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded-lg shimmer" />
              <div className="h-4 w-1/2 rounded-lg shimmer" />
              <div className="h-4 w-2/3 rounded-lg shimmer" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-color-text-faint mb-3">shimmer card blocks</p>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EffectsPanel() {
  return (
    <div className="space-y-8">
      {/* Glow effects */}
      <div>
        <SectionHeading>Glow Effects</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'glow-primary',       label: 'Glow Primary',     cls: 'glow-primary',       desc: 'Static glow on element' },
            { name: 'glow-primary-hover', label: 'Glow on Hover',    cls: 'glow-primary-hover', desc: 'Intensified on hover' },
            { name: 'neon-glow',          label: 'Neon Glow',        cls: 'neon-glow',          desc: 'Multi-layer neon effect' },
          ].map((e) => (
            <div key={e.name} className="glass-card rounded-xl p-5 flex flex-col gap-4">
              <div
                className={`w-full h-14 bg-color-surface border border-color-primary/20 rounded-xl flex items-center justify-center ${e.cls}`}
              >
                <Shield size={20} className="text-color-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-color-text-main">{e.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-[9px] font-mono text-color-text-faint">.{e.name}</p>
                  <CopyButton value={e.name} />
                </div>
                <p className="text-[10px] text-color-text-faint/70 mt-1">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient effects */}
      <div>
        <SectionHeading>Gradient &amp; Background Effects</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="h-24 bg-blueprint" />
            <div className="p-4">
              <p className="text-xs font-semibold text-color-text-main">bg-blueprint</p>
              <p className="text-[10px] text-color-text-faint mt-0.5">Subtle grid overlay used on main backgrounds</p>
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <div
              className="h-24"
              style={{ backgroundImage: 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(99,102,241,0.10) 50%, rgba(34,197,94,0.08) 100%)' }}
            />
            <div className="p-4">
              <p className="text-xs font-semibold text-color-text-main">Brand Gradient</p>
              <p className="text-[10px] text-color-text-faint mt-0.5">Cyan → Indigo → Green diagonal gradient</p>
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="h-24 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.15)_0%,transparent_70%)]" />
            <div className="p-4">
              <p className="text-xs font-semibold text-color-text-main">Radial Glow</p>
              <p className="text-[10px] text-color-text-faint mt-0.5">bg-[radial-gradient(…)] spotlight effect</p>
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="h-24 bg-grid-palantir bg-[length:40px_40px]" />
            <div className="p-4">
              <p className="text-xs font-semibold text-color-text-main">Palantir Grid</p>
              <p className="text-[10px] text-color-text-faint mt-0.5">bg-grid-palantir technical grid pattern</p>
            </div>
          </div>
        </div>
      </div>

      {/* Glass effects */}
      <div>
        <SectionHeading>Glass &amp; Backdrop Effects</SectionHeading>
        <div className="relative rounded-xl overflow-hidden">
          {/* Rich background to show glass effect */}
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #0A0F1C 0%, #161F33 40%, #1F2A44 100%)' }}
          />
          <div className="relative p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-color-text-main">glass-card</p>
              <p className="text-[9px] font-mono text-color-text-faint mt-1">blur(20px) + gradient border</p>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-color-text-main">glass-panel</p>
              <p className="text-[9px] font-mono text-color-text-faint mt-1">blur(12px) + surface 80%</p>
            </div>
            <div className="stat-card p-4 text-center">
              <p className="text-xs font-semibold text-color-text-main">stat-card</p>
              <p className="text-[9px] font-mono text-color-text-faint mt-1">blur(16px) + gradient pseudo-border</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signal / status indicators */}
      <div>
        <SectionHeading>Status Indicators</SectionHeading>
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-wrap gap-6 items-center">
            {/* Ping dots */}
            {[
              { label: 'Online',    cls: 'bg-color-success' },
              { label: 'Busy',      cls: 'bg-color-warning' },
              { label: 'Offline',   cls: 'bg-color-danger' },
              { label: 'Idle',      cls: 'bg-color-text-faint' },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cls}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cls}`} />
                </span>
                <span className="text-xs text-color-text-muted font-mono">{label}</span>
              </div>
            ))}

            {/* Signal bars */}
            <div className="flex items-end gap-0.5 h-5">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  className={`signal-bar ${i < 3 ? 'active' : ''}`}
                  style={{ height: `${h * 2}px` }}
                />
              ))}
              <span className="ml-2 text-xs text-color-text-muted font-mono">Signal</span>
            </div>

            {/* Loader spinner */}
            <div className="flex items-center gap-2">
              <Loader size={14} className="animate-spin text-color-primary" />
              <span className="text-xs text-color-text-muted font-mono">Processing…</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing tokens */}
      <div>
        <SectionHeading>Border Radius Tokens</SectionHeading>
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-wrap gap-4 items-end">
            {[
              { name: 'rounded-sm',     px: '2px',  cls: 'rounded-sm' },
              { name: 'rounded',        px: '4px',  cls: 'rounded' },
              { name: 'rounded-md',     px: '6px',  cls: 'rounded-md' },
              { name: 'rounded-lg',     px: '8px',  cls: 'rounded-lg' },
              { name: 'rounded-xl',     px: '12px', cls: 'rounded-xl' },
              { name: 'rounded-2xl',    px: '16px', cls: 'rounded-2xl' },
              { name: 'rounded-card',   px: 'var',  cls: 'rounded-card' },
              { name: 'rounded-button', px: 'var',  cls: 'rounded-button' },
              { name: 'rounded-full',   px: '50%',  cls: 'rounded-full' },
            ].map(({ name, cls }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 bg-color-primary/20 border border-color-primary/30 ${cls}`} />
                <div className="text-center">
                  <p className="text-[9px] font-mono text-color-text-faint">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────── */
export default function DebugPage() {
  const [activeTab, setActiveTab] = useState<TabId>('colors');

  return (
    <>
      <Header title="Theme Debug" />
      <div className="p-6 space-y-6">
        {/* Page intro */}
        <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in-up">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-color-warning/10 text-color-warning border border-color-warning/20 rounded-full">
                Dev Only
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-color-primary/10 text-color-primary border border-color-primary/20 rounded-full">
                Design System
              </span>
            </div>
            <h2 className="text-lg font-semibold text-color-text-main mt-1">Design System Inspector</h2>
            <p className="text-sm text-color-text-muted mt-0.5">
              Live preview of all design tokens, components, animations and effects used across xALiGN.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-color-text-faint">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-color-primary" />
              {COLOR_TOKENS.length} color tokens
            </span>
            <ChevronRight size={10} />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-color-secondary" />
              card variants
            </span>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 p-1 bg-color-surface/50 border border-color-border-subtle/30 rounded-xl w-fit overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200
                ${activeTab === id
                  ? 'bg-color-primary/15 text-color-primary shadow-sm'
                  : 'text-color-text-muted hover:text-color-text-main hover:bg-color-primary/5'
                }
              `}
            >
              <Icon size={13} strokeWidth={activeTab === id ? 2.2 : 1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="animate-fade-in">
          {activeTab === 'colors'     && <ColorsPanel />}
          {activeTab === 'typography' && <TypographyPanel />}
          {activeTab === 'components' && <ComponentsPanel />}
          {activeTab === 'animations' && <AnimationsPanel />}
          {activeTab === 'effects'    && <EffectsPanel />}
        </div>
      </div>
    </>
  );
}
