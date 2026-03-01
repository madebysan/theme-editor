/** Functions to set/remove CSS custom properties on document.documentElement.
 *  Includes an initializer for main.tsx to restore persisted overrides on load. */

import { loadThemeOverrides, type ThemeOverrides } from './theme-storage'

export function applyThemeOverrides(overrides: ThemeOverrides): void {
  const root = document.documentElement
  for (const [cssVar, value] of Object.entries(overrides)) {
    root.style.setProperty(cssVar, value)
  }
}

export function removeThemeOverride(cssVar: string): void {
  document.documentElement.style.removeProperty(cssVar)
}

export function removeAllThemeOverrides(overrides: ThemeOverrides): void {
  const root = document.documentElement
  for (const cssVar of Object.keys(overrides)) {
    root.style.removeProperty(cssVar)
  }
}

/** Call this before createRoot() in main.tsx so persisted theme loads on every page. */
export function applyStoredThemeOverrides(): void {
  const overrides = loadThemeOverrides()
  if (Object.keys(overrides).length > 0) {
    applyThemeOverrides(overrides)
  }
}
