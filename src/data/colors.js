// ── PlacePrep AI — Color Design Tokens ──────────────────────────────────────
// Single source of truth for every color in the application.
// Components import { COLORS } and reference values by key.

export const COLORS = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg: '#0A0E1A',
  surface: '#111827',
  card: '#161E2E',
  cardHover: '#1C2640',

  // ── Borders ────────────────────────────────────────────────────────────────
  border: '#1F2D45',
  borderLight: '#2A3D5E',

  // ── Accent (Teal) ─────────────────────────────────────────────────────────
  accent: '#00D4AA',
  accentDim: '#00D4AA22',
  accentSoft: '#00D4AA44',
  accentHover: '#00E8BB',

  // ── Semantic ──────────────────────────────────────────────────────────────
  blue: '#3B82F6',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#10B981',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
  cyan: '#06B6D4',

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
  textDisabled: '#334155',

  // ── Code Editor ───────────────────────────────────────────────────────────
  codeBackground: '#0D1117',
  codeText: '#E6EDF3',

  // ── Status Banners ────────────────────────────────────────────────────────
  successBg: 'rgba(16, 185, 129, 0.12)',
  successBorder: 'rgba(16, 185, 129, 0.35)',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  warningBorder: 'rgba(245, 158, 11, 0.35)',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  errorBorder: 'rgba(239, 68, 68, 0.35)',
};
