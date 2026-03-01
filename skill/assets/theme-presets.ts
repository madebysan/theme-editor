/** Theme presets, font pairings, style combos, and shared font loading utility.
 *  Token names follow shadcn/ui convention for portability. */

import type { ThemeOverrides } from './theme-storage'

// --- Preset system ---

export interface ThemePreset {
  name: string
  overrides: ThemeOverrides
  dot: string // preview color for the chip (uses the preset's accent)
}

// Each preset uses a neutral white/black base with color only on the accent
// (primary) tokens. Warm presets use stone-based neutrals, cool presets use
// gray-based neutrals. --accent gets a very light tint of the accent color.

export const PRESETS: ThemePreset[] = [
  {
    name: 'Default',
    overrides: {},
    dot: '#18181B',
  },
  {
    name: 'Indigo',
    dot: '#6366F1',
    overrides: {
      '--background': '#F9FAFB',
      '--foreground': '#111827',
      '--card': '#F3F4F6',
      '--card-foreground': '#111827',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#111827',
      '--primary': '#6366F1',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F9FAFB',
      '--secondary-foreground': '#374151',
      '--muted': '#E5E7EB',
      '--muted-foreground': '#6B7280',
      '--accent': '#EEF2FF',
      '--accent-foreground': '#4338CA',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D1D5DB',
      '--input': '#D1D5DB',
      '--ring': '#818CF8',
    },
  },
  {
    name: 'Ocean',
    dot: '#0EA5E9',
    overrides: {
      '--background': '#F9FAFB',
      '--foreground': '#111827',
      '--card': '#F3F4F6',
      '--card-foreground': '#111827',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#111827',
      '--primary': '#0EA5E9',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F9FAFB',
      '--secondary-foreground': '#374151',
      '--muted': '#E5E7EB',
      '--muted-foreground': '#6B7280',
      '--accent': '#F0F9FF',
      '--accent-foreground': '#0369A1',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D1D5DB',
      '--input': '#D1D5DB',
      '--ring': '#38BDF8',
    },
  },
  {
    name: 'Sunset',
    dot: '#EA580C',
    overrides: {
      '--background': '#FAFAF9',
      '--foreground': '#1C1917',
      '--card': '#F5F5F4',
      '--card-foreground': '#1C1917',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#1C1917',
      '--primary': '#EA580C',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#FAFAF9',
      '--secondary-foreground': '#44403C',
      '--muted': '#E7E5E4',
      '--muted-foreground': '#78716C',
      '--accent': '#FFF7ED',
      '--accent-foreground': '#C2410C',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D6D3D1',
      '--input': '#D6D3D1',
      '--ring': '#F97316',
    },
  },
  {
    name: 'Forest',
    dot: '#16A34A',
    overrides: {
      '--background': '#F9FAFB',
      '--foreground': '#111827',
      '--card': '#F3F4F6',
      '--card-foreground': '#111827',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#111827',
      '--primary': '#16A34A',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F9FAFB',
      '--secondary-foreground': '#374151',
      '--muted': '#E5E7EB',
      '--muted-foreground': '#6B7280',
      '--accent': '#F0FDF4',
      '--accent-foreground': '#15803D',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D1D5DB',
      '--input': '#D1D5DB',
      '--ring': '#22C55E',
    },
  },
  {
    name: 'Rose',
    dot: '#E11D48',
    overrides: {
      '--background': '#F9FAFB',
      '--foreground': '#111827',
      '--card': '#F3F4F6',
      '--card-foreground': '#111827',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#111827',
      '--primary': '#E11D48',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F9FAFB',
      '--secondary-foreground': '#374151',
      '--muted': '#E5E7EB',
      '--muted-foreground': '#6B7280',
      '--accent': '#FFF1F2',
      '--accent-foreground': '#BE123C',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D1D5DB',
      '--input': '#D1D5DB',
      '--ring': '#FB7185',
    },
  },
  {
    name: 'Mono',
    dot: '#525252',
    overrides: {
      '--background': '#FAFAFA',
      '--foreground': '#18181B',
      '--card': '#F4F4F5',
      '--card-foreground': '#18181B',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#18181B',
      '--primary': '#525252',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#FAFAFA',
      '--secondary-foreground': '#3F3F46',
      '--muted': '#E4E4E7',
      '--muted-foreground': '#71717A',
      '--accent': '#F4F4F5',
      '--accent-foreground': '#404040',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D4D4D8',
      '--input': '#D4D4D8',
      '--ring': '#737373',
    },
  },
  {
    name: 'Lavender',
    dot: '#8B5CF6',
    overrides: {
      '--background': '#F9FAFB',
      '--foreground': '#111827',
      '--card': '#F3F4F6',
      '--card-foreground': '#111827',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#111827',
      '--primary': '#8B5CF6',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F9FAFB',
      '--secondary-foreground': '#374151',
      '--muted': '#E5E7EB',
      '--muted-foreground': '#6B7280',
      '--accent': '#F5F3FF',
      '--accent-foreground': '#6D28D9',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D1D5DB',
      '--input': '#D1D5DB',
      '--ring': '#A78BFA',
    },
  },
  {
    name: 'Coffee',
    dot: '#B45309',
    overrides: {
      '--background': '#FAFAF9',
      '--foreground': '#1C1917',
      '--card': '#F5F5F4',
      '--card-foreground': '#1C1917',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#1C1917',
      '--primary': '#B45309',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#FAFAF9',
      '--secondary-foreground': '#44403C',
      '--muted': '#E7E5E4',
      '--muted-foreground': '#78716C',
      '--accent': '#FFFBEB',
      '--accent-foreground': '#92400E',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D6D3D1',
      '--input': '#D6D3D1',
      '--ring': '#D97706',
    },
  },
  {
    name: 'Arctic',
    dot: '#0891B2',
    overrides: {
      '--background': '#F9FAFB',
      '--foreground': '#111827',
      '--card': '#F3F4F6',
      '--card-foreground': '#111827',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#111827',
      '--primary': '#0891B2',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F9FAFB',
      '--secondary-foreground': '#374151',
      '--muted': '#E5E7EB',
      '--muted-foreground': '#6B7280',
      '--accent': '#ECFEFF',
      '--accent-foreground': '#0E7490',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D1D5DB',
      '--input': '#D1D5DB',
      '--ring': '#06B6D4',
    },
  },
  {
    name: 'Terracotta',
    dot: '#C2703A',
    overrides: {
      '--background': '#FAFAF9',
      '--foreground': '#1C1917',
      '--card': '#F5F5F4',
      '--card-foreground': '#1C1917',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#1C1917',
      '--primary': '#C2703A',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#FAFAF9',
      '--secondary-foreground': '#44403C',
      '--muted': '#E7E5E4',
      '--muted-foreground': '#78716C',
      '--accent': '#FEF5EE',
      '--accent-foreground': '#9A5A30',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#D6D3D1',
      '--input': '#D6D3D1',
      '--ring': '#D4956A',
    },
  },
  {
    name: 'Slate',
    dot: '#3B82F6',
    overrides: {
      '--background': '#F8FAFC',
      '--foreground': '#0F172A',
      '--card': '#F1F5F9',
      '--card-foreground': '#0F172A',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#0F172A',
      '--primary': '#3B82F6',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#F8FAFC',
      '--secondary-foreground': '#334155',
      '--muted': '#E2E8F0',
      '--muted-foreground': '#64748B',
      '--accent': '#EFF6FF',
      '--accent-foreground': '#2563EB',
      '--destructive': '#DC2626',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#CBD5E1',
      '--input': '#CBD5E1',
      '--ring': '#60A5FA',
    },
  },
  {
    name: 'Coral',
    dot: '#FF7E5F',
    overrides: {
      '--background': '#FFF9F5',
      '--foreground': '#3D3436',
      '--card': '#FFFFFF',
      '--card-foreground': '#3D3436',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#3D3436',
      '--primary': '#FF7E5F',
      '--primary-foreground': '#FFFFFF',
      '--secondary': '#FFEDEA',
      '--secondary-foreground': '#B35340',
      '--muted': '#FFF0EB',
      '--muted-foreground': '#78716C',
      '--accent': '#FEB47B',
      '--accent-foreground': '#3D3436',
      '--destructive': '#E63946',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#FFE0D6',
      '--input': '#FFE0D6',
      '--ring': '#FF7E5F',
    },
  },
  {
    name: 'Mint',
    dot: '#25E6A8',
    overrides: {
      '--background': '#EBEDF4',
      '--foreground': '#030017',
      '--card': '#FFFFFF',
      '--card-foreground': '#030017',
      '--popover': '#FFFFFF',
      '--popover-foreground': '#030017',
      '--primary': '#25E6A8',
      '--primary-foreground': '#030017',
      '--secondary': '#DEE1ED',
      '--secondary-foreground': '#030017',
      '--muted': '#DEE1ED',
      '--muted-foreground': '#646D90',
      '--accent': '#F5F6FA',
      '--accent-foreground': '#030017',
      '--destructive': '#DC1857',
      '--destructive-foreground': '#FFFFFF',
      '--border': '#C9CEDE',
      '--input': '#C9CEDE',
      '--ring': '#25E6A8',
    },
  },
]

// --- Color palettes pool (from non-default presets) ---

export const COLOR_PALETTES: ThemeOverrides[] = PRESETS
  .filter(p => p.name !== 'Default')
  .map(p => p.overrides)

// --- Font pairings pool ---

export interface FontPairing {
  name: string
  sans: string
  mono: string
}

export const FONT_PAIRINGS: FontPairing[] = [
  { name: 'Jakarta + Plex', sans: 'Plus Jakarta Sans', mono: 'IBM Plex Mono' },
  { name: 'Inter + Fira', sans: 'Inter', mono: 'Fira Code' },
  { name: 'Poppins + JetBrains', sans: 'Poppins', mono: 'JetBrains Mono' },
  { name: 'DM Sans + Space', sans: 'DM Sans', mono: 'Space Mono' },
  { name: 'Lora + Source', sans: 'Lora', mono: 'Source Code Pro' },
  { name: 'Playfair + JetBrains', sans: 'Playfair Display', mono: 'JetBrains Mono' },
  { name: 'Space Grotesk + Space', sans: 'Space Grotesk', mono: 'Space Mono' },
  { name: 'Manrope + Fira', sans: 'Manrope', mono: 'Fira Code' },
  { name: 'Outfit + Plex', sans: 'Outfit', mono: 'IBM Plex Mono' },
  { name: 'Sora + JetBrains', sans: 'Sora', mono: 'JetBrains Mono' },
]

// --- Style combos pool ---

export interface StyleCombo {
  name: string
  radius: string
  button: string
  shadow: string
  border: string
  spacing: string
}

export const STYLE_COMBOS: StyleCombo[] = [
  { name: 'Sharp', radius: '0rem', button: '0rem', shadow: 'none', border: '2px', spacing: '0.25rem' },
  { name: 'Rounded', radius: '0.5rem', button: '0.5rem', shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', border: '1px', spacing: '0.25rem' },
  { name: 'Default', radius: '0.625rem', button: '2rem', shadow: 'none', border: '1px', spacing: '0.25rem' },
  { name: 'Soft', radius: '0.875rem', button: '2rem', shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', border: '1px', spacing: '0.25rem' },
  { name: 'Bold', radius: '1.25rem', button: '2rem', shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', border: '0px', spacing: '0.25rem' },
  { name: 'Minimal', radius: '0.25rem', button: '0.25rem', shadow: 'none', border: '1px', spacing: '0.1875rem' },
]

// --- Shared font loading utility ---

const SYSTEM_FONTS = ['system-ui', '-apple-system', 'sans-serif', 'monospace', 'ui-monospace', 'serif']

/** Load a Google Font by injecting a <link> into <head>. Deduplicates automatically. */
export function loadGoogleFont(fontName: string): void {
  if (SYSTEM_FONTS.includes(fontName.toLowerCase())) return

  const encodedFamily = encodeURIComponent(fontName)
  const href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@400;500;600;700&display=swap`

  if (document.querySelector(`link[href="${href}"]`)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}
