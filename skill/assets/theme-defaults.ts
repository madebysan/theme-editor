/** All theme tokens with their default values and human-readable labels.
 *  Single source of truth — matches :root in the project's CSS.
 *  Token names follow shadcn/ui convention for portability.
 *
 *  TEMPLATE: During injection, replace each defaultValue with the actual
 *  value from the project's :root {} CSS block. Remove tokens that the
 *  project doesn't define. */

export interface ThemeToken {
  cssVar: string
  label: string
  defaultValue: string
  category: 'color' | 'font' | 'radius' | 'spacing' | 'shadow' | 'border'
}

export const THEME_TOKENS: ThemeToken[] = [
  // Colors — shadcn standard semantic names
  { cssVar: '--background', label: 'Background', defaultValue: '#FFFFFF', category: 'color' },
  { cssVar: '--foreground', label: 'Foreground (text)', defaultValue: '#09090B', category: 'color' },
  { cssVar: '--card', label: 'Card', defaultValue: '#FFFFFF', category: 'color' },
  { cssVar: '--card-foreground', label: 'Card foreground', defaultValue: '#09090B', category: 'color' },
  { cssVar: '--popover', label: 'Popover', defaultValue: '#FFFFFF', category: 'color' },
  { cssVar: '--popover-foreground', label: 'Popover foreground', defaultValue: '#09090B', category: 'color' },
  { cssVar: '--primary', label: 'Primary (accent)', defaultValue: '#18181B', category: 'color' },
  { cssVar: '--primary-foreground', label: 'Primary foreground', defaultValue: '#FAFAFA', category: 'color' },
  { cssVar: '--secondary', label: 'Secondary', defaultValue: '#F4F4F5', category: 'color' },
  { cssVar: '--secondary-foreground', label: 'Secondary foreground', defaultValue: '#18181B', category: 'color' },
  { cssVar: '--muted', label: 'Muted', defaultValue: '#F4F4F5', category: 'color' },
  { cssVar: '--muted-foreground', label: 'Muted foreground', defaultValue: '#71717A', category: 'color' },
  { cssVar: '--accent', label: 'Accent', defaultValue: '#F4F4F5', category: 'color' },
  { cssVar: '--accent-foreground', label: 'Accent foreground', defaultValue: '#18181B', category: 'color' },
  { cssVar: '--destructive', label: 'Destructive', defaultValue: '#EF4444', category: 'color' },
  { cssVar: '--destructive-foreground', label: 'Destructive foreground', defaultValue: '#FAFAFA', category: 'color' },
  { cssVar: '--border', label: 'Border', defaultValue: '#E4E4E7', category: 'color' },
  { cssVar: '--input', label: 'Input border', defaultValue: '#E4E4E7', category: 'color' },
  { cssVar: '--ring', label: 'Ring (focus)', defaultValue: '#18181B', category: 'color' },

  // Fonts
  { cssVar: '--font-sans', label: 'Body font (sans-serif)', defaultValue: "ui-sans-serif, system-ui, -apple-system, sans-serif", category: 'font' },
  { cssVar: '--font-mono', label: 'Code font (monospace)', defaultValue: "ui-monospace, SFMono-Regular, monospace", category: 'font' },

  // Radius — base value for cards/inputs, Tailwind derives sm/md/lg/xl via calc()
  { cssVar: '--radius', label: 'Border radius', defaultValue: '0.625rem', category: 'radius' },
  { cssVar: '--radius-button', label: 'Button radius', defaultValue: '9999px', category: 'radius' },

  // Shadow — applied to cards/containers via shadow-theme utility
  { cssVar: '--shadow', label: 'Card shadow', defaultValue: 'none', category: 'shadow' },

  // Input border width
  { cssVar: '--input-border-width', label: 'Input borders', defaultValue: '1px', category: 'border' },

  // Spacing
  { cssVar: '--spacing', label: 'Base spacing unit', defaultValue: '0.25rem', category: 'spacing' },
]

export function getTokensByCategory(category: ThemeToken['category']): ThemeToken[] {
  return THEME_TOKENS.filter(t => t.category === category)
}

export function getTokenDefault(cssVar: string): string | undefined {
  return THEME_TOKENS.find(t => t.cssVar === cssVar)?.defaultValue
}
