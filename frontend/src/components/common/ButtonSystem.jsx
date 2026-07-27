/**
 * ═══════════════════════════════════════════════════════════════════
 *  SENTINEL GLOBAL BUTTON DESIGN SYSTEM
 *  Use this across every page. Do NOT create custom button styles.
 * ═══════════════════════════════════════════════════════════════════
 *
 * SIZES:   lg (48px) | md (40px) | sm (32px) | icon (40×40)
 * TYPES:   primary | secondary | ghost | ai | danger
 * EXTRAS:  loading, disabled states built-in
 *
 * Usage:
 *   import { Btn, BtnIcon, FilterChip } from '../components/common/ButtonSystem';
 *
 *   <Btn variant="primary" size="lg" icon={Plus}>New FIR</Btn>
 *   <Btn variant="ai" icon={Sparkles}>AI Prioritize</Btn>
 *   <Btn variant="secondary">Export</Btn>
 *   <Btn variant="danger" size="sm">Delete</Btn>
 *   <BtnIcon icon={RefreshCw} title="Refresh" />
 *   <FilterChip active>High Risk</FilterChip>
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// ─── TOKENS ──────────────────────────────────────────────────────────────────

const SIZE = {
  lg:   'h-12 px-6 text-[14px] gap-2.5',       // 48px — primary CTA
  md:   'h-10 px-4 text-[13px] gap-2',          // 40px — default
  sm:   'h-8  px-3 text-[12px] gap-1.5',        // 32px — table/inline
  icon: 'h-10 w-10 p-0 shrink-0',               // 40×40 — icon-only
};

const ICON_SIZE = { lg: 18, md: 16, sm: 14, icon: 18 };

const VARIANT = {
  primary: [
    'bg-blue-600 text-white border-transparent',
    'hover:bg-blue-700 hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)]',
    'active:translate-y-0 active:shadow-none',
    'disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:translate-y-0',
  ].join(' '),

  secondary: [
    'bg-white text-slate-700 border-gray-200',
    'hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-700',
    'active:bg-blue-50',
    'disabled:bg-slate-100 disabled:text-slate-400 disabled:border-gray-200',
  ].join(' '),

  ghost: [
    'bg-transparent text-slate-500 border-transparent',
    'hover:bg-slate-100 hover:text-slate-700',
    'active:bg-slate-200',
    'disabled:text-slate-300',
  ].join(' '),

  ai: [
    'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-700 border-indigo-200',
    'hover:from-indigo-500/15 hover:to-blue-500/20 hover:border-indigo-400 hover:shadow-[0_0_12px_rgba(99,102,241,0.18)] hover:-translate-y-[1px]',
    'active:translate-y-0',
    'disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none',
  ].join(' '),

  danger: [
    'bg-white text-red-600 border-red-200',
    'hover:bg-red-50 hover:border-red-400 hover:text-red-700',
    'active:bg-red-100',
    'disabled:bg-slate-100 disabled:text-slate-400 disabled:border-gray-200',
  ].join(' '),
};

// ─── BASE BUTTON ─────────────────────────────────────────────────────────────

/**
 * Btn — main button component
 *
 * @param {string}  variant   primary | secondary | ghost | ai | danger
 * @param {string}  size      lg | md | sm | icon
 * @param {React.ElementType} icon — lucide icon component (optional)
 * @param {boolean} iconRight — put icon on the right side
 * @param {boolean} loading   — shows spinner and disables
 * @param {boolean} disabled
 * @param {string}  className — extra classes
 */
export const Btn = ({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight = false,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) => {
  const iconSz = ICON_SIZE[size] || 16;
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        // Base
        'inline-flex items-center justify-center font-bold rounded-[12px] border',
        'transition-all duration-150 select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
        'cursor-pointer disabled:cursor-not-allowed',
        // Size
        SIZE[size] || SIZE.md,
        // Variant
        VARIANT[variant] || VARIANT.secondary,
        // User extras
        className,
      ].join(' ')}
      {...rest}
    >
      {/* Left icon / spinner */}
      {loading ? (
        <Loader2 size={iconSz} className="animate-spin shrink-0" />
      ) : (Icon && !iconRight) ? (
        <Icon size={iconSz} className="shrink-0" />
      ) : null}

      {/* Label — not shown for icon-only buttons */}
      {size !== 'icon' && children && (
        <span className="whitespace-nowrap">{children}</span>
      )}

      {/* Right icon */}
      {!loading && Icon && iconRight && (
        <Icon size={iconSz} className="shrink-0" />
      )}
    </button>
  );
};

// ─── ICON BUTTON ─────────────────────────────────────────────────────────────

/**
 * BtnIcon — square icon-only button (40×40)
 * Always uses the "icon" size and defaults to "ghost" variant
 */
export const BtnIcon = ({
  icon: Icon,
  variant = 'ghost',
  title,
  className = '',
  ...rest
}) => (
  <button
    title={title}
    className={[
      'inline-flex items-center justify-center rounded-[12px] border',
      'h-10 w-10 shrink-0 transition-all duration-150',
      'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
      'cursor-pointer disabled:cursor-not-allowed',
      VARIANT[variant] || VARIANT.ghost,
      className,
    ].join(' ')}
    {...rest}
  >
    {Icon && <Icon size={18} className="shrink-0" />}
  </button>
);

// ─── TABLE ROW ICON ACTION ────────────────────────────────────────────────────

/**
 * RowAction — tiny 32px icon-only button for table row hover actions
 * Invisible by default, revealed on row hover via parent's group class
 */
export const RowAction = ({
  icon: Icon,
  title,
  colorClass = 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
  className = '',
  ...rest
}) => (
  <button
    title={title}
    className={[
      'inline-flex items-center justify-center',
      'h-7 w-7 rounded-[8px] transition-colors',
      colorClass,
      className,
    ].join(' ')}
    {...rest}
  >
    {Icon && <Icon size={14} />}
  </button>
);

// ─── FILTER CHIP ──────────────────────────────────────────────────────────────

/**
 * FilterChip — pill-shaped chip for smart filters
 * NOT a button visually — it's a chip
 */
export const FilterChip = ({
  active = false,
  icon: Icon,
  className = '',
  children,
  ...rest
}) => (
  <button
    className={[
      'inline-flex items-center gap-1.5 h-9 px-4',
      'rounded-full border text-[12px] font-bold transition-all duration-150 select-none',
      'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
      active
        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
        : 'bg-white border-gray-200 text-slate-600 hover:border-blue-300 hover:text-blue-700',
      className,
    ].join(' ')}
    {...rest}
  >
    {Icon && <Icon size={13} className="shrink-0" />}
    <span className="whitespace-nowrap">{children}</span>
  </button>
);

// ─── BULK TOOLBAR BUTTON ──────────────────────────────────────────────────────

/**
 * BulkBtn — white-on-blue small button for bulk action toolbars
 */
export const BulkBtn = ({ className = '', children, ...rest }) => (
  <button
    className={[
      'px-3 py-1.5 rounded-[8px] bg-white/20 hover:bg-white/30',
      'text-[12px] font-bold text-white transition-colors',
      className,
    ].join(' ')}
    {...rest}
  >
    {children}
  </button>
);

// ─── STATUS UPDATE SELECT ─────────────────────────────────────────────────────

/**
 * StatusSelect — styled dropdown for updating case status
 */
export const StatusSelect = ({ value, onChange, options, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={[
      'h-10 px-3 rounded-[12px] border border-gray-200 bg-white',
      'text-[13px] font-semibold text-slate-700 appearance-none',
      'focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20',
      'transition-colors cursor-pointer',
      className,
    ].join(' ')}
  >
    {options.map(o => (
      <option key={o.value || o} value={o.value || o}>
        {o.label || o}
      </option>
    ))}
  </select>
);
