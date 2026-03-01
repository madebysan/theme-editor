/** localStorage CRUD for theme overrides.
 *  TEMPLATE: Replace STORAGE_KEY with a project-specific key during injection. */

const STORAGE_KEY = 'theme-editor-overrides'

export type ThemeOverrides = Record<string, string>

export function saveThemeOverrides(overrides: ThemeOverrides): void {
  try {
    if (Object.keys(overrides).length === 0) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
    }
  } catch {
    // localStorage might be full or disabled — silently fail
  }
}

export function loadThemeOverrides(): ThemeOverrides {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data) as ThemeOverrides
    }
  } catch {
    // Corrupted data — silently fail
  }
  return {}
}

export function clearThemeOverrides(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasThemeOverrides(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}
