import { useReducer, useEffect, useRef, useCallback } from 'react'
import { THEME_TOKENS, getTokenDefault } from '../lib/theme-defaults'
import { saveThemeOverrides, loadThemeOverrides, type ThemeOverrides } from '../lib/theme-storage'
import { applyThemeOverrides, removeThemeOverride } from '../lib/theme-apply'

const MAX_HISTORY = 50

type ThemeState = {
  overrides: ThemeOverrides
  past: ThemeOverrides[]
  future: ThemeOverrides[]
}

type ThemeAction =
  | { type: 'SET_TOKEN'; cssVar: string; value: string }
  | { type: 'RESET_TOKEN'; cssVar: string }
  | { type: 'RESET_ALL' }
  | { type: 'IMPORT'; overrides: ThemeOverrides }
  | { type: 'BATCH_SET'; tokens: Record<string, string> }
  | { type: 'UNDO' }
  | { type: 'REDO' }

function pushHistory(past: ThemeOverrides[], current: ThemeOverrides): ThemeOverrides[] {
  return [...past.slice(-(MAX_HISTORY - 1)), current]
}

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_TOKEN': {
      const defaultVal = getTokenDefault(action.cssVar)
      const newOverrides = { ...state.overrides }
      if (action.value === defaultVal) {
        delete newOverrides[action.cssVar]
      } else {
        newOverrides[action.cssVar] = action.value
      }
      return {
        overrides: newOverrides,
        past: pushHistory(state.past, state.overrides),
        future: [],
      }
    }

    case 'RESET_TOKEN': {
      const newOverrides = { ...state.overrides }
      delete newOverrides[action.cssVar]
      return {
        overrides: newOverrides,
        past: pushHistory(state.past, state.overrides),
        future: [],
      }
    }

    case 'RESET_ALL':
      return {
        overrides: {},
        past: pushHistory(state.past, state.overrides),
        future: [],
      }

    case 'IMPORT':
      return {
        overrides: action.overrides,
        past: pushHistory(state.past, state.overrides),
        future: [],
      }

    case 'BATCH_SET': {
      const newOverrides = { ...state.overrides }
      for (const [cssVar, value] of Object.entries(action.tokens)) {
        const defaultVal = getTokenDefault(cssVar)
        if (value === defaultVal) {
          delete newOverrides[cssVar]
        } else {
          newOverrides[cssVar] = value
        }
      }
      return {
        overrides: newOverrides,
        past: pushHistory(state.past, state.overrides),
        future: [],
      }
    }

    case 'UNDO': {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        overrides: previous,
        past: state.past.slice(0, -1),
        future: [state.overrides, ...state.future],
      }
    }

    case 'REDO': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        overrides: next,
        past: [...state.past, state.overrides],
        future: state.future.slice(1),
      }
    }

    default:
      return state
  }
}

export function useTheme() {
  const [state, dispatch] = useReducer(themeReducer, null, () => ({
    overrides: loadThemeOverrides(),
    past: [] as ThemeOverrides[],
    future: [] as ThemeOverrides[],
  }))

  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prevOverridesRef = useRef<ThemeOverrides>(state.overrides)

  // Apply overrides to DOM whenever they change — also remove stale properties
  useEffect(() => {
    const prevKeys = Object.keys(prevOverridesRef.current)
    const curKeys = new Set(Object.keys(state.overrides))
    for (const key of prevKeys) {
      if (!curKeys.has(key)) {
        removeThemeOverride(key)
      }
    }
    applyThemeOverrides(state.overrides)
    prevOverridesRef.current = state.overrides
  }, [state.overrides])

  // Debounce-save to localStorage
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      saveThemeOverrides(state.overrides)
    }, 300)
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [state.overrides])

  // Keyboard shortcuts: Cmd+Z = undo, Cmd+Shift+Z = redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault()
          dispatch({ type: 'REDO' })
        } else {
          e.preventDefault()
          dispatch({ type: 'UNDO' })
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getToken = useCallback((cssVar: string): string => {
    return state.overrides[cssVar] ?? getTokenDefault(cssVar) ?? ''
  }, [state.overrides])

  const setToken = useCallback((cssVar: string, value: string) => {
    dispatch({ type: 'SET_TOKEN', cssVar, value })
  }, [])

  const resetToken = useCallback((cssVar: string) => {
    dispatch({ type: 'RESET_TOKEN', cssVar })
  }, [])

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' })
  }, [])

  const isModified = useCallback((cssVar: string): boolean => {
    return cssVar in state.overrides
  }, [state.overrides])

  const hasAnyModification = Object.keys(state.overrides).length > 0

  const batchSetTokens = useCallback((tokens: Record<string, string>) => {
    dispatch({ type: 'BATCH_SET', tokens })
  }, [])

  const applyPreset = useCallback((presetOverrides: ThemeOverrides) => {
    if (Object.keys(presetOverrides).length === 0) {
      dispatch({ type: 'RESET_ALL' })
    } else {
      dispatch({ type: 'IMPORT', overrides: presetOverrides })
    }
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  const exportAsCSS = useCallback((): string => {
    const lines = ['@theme {']
    for (const token of THEME_TOKENS) {
      const value = state.overrides[token.cssVar] ?? token.defaultValue
      lines.push(`  ${token.cssVar}: ${value};`)
    }
    lines.push('}')
    return lines.join('\n')
  }, [state.overrides])

  const exportAsJSON = useCallback((): string => {
    const obj: Record<string, string> = {}
    for (const token of THEME_TOKENS) {
      obj[token.cssVar] = state.overrides[token.cssVar] ?? token.defaultValue
    }
    return JSON.stringify(obj, null, 2)
  }, [state.overrides])

  const importFromJSON = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as Record<string, string>
      const validOverrides: ThemeOverrides = {}
      for (const token of THEME_TOKENS) {
        if (token.cssVar in parsed && parsed[token.cssVar] !== token.defaultValue) {
          validOverrides[token.cssVar] = parsed[token.cssVar]
        }
      }
      dispatch({ type: 'IMPORT', overrides: validOverrides })
      return true
    } catch {
      return false
    }
  }, [])

  return {
    getToken,
    setToken,
    resetToken,
    resetAll,
    isModified,
    hasAnyModification,
    exportAsCSS,
    exportAsJSON,
    importFromJSON,
    undo,
    redo,
    canUndo,
    canRedo,
    batchSetTokens,
    applyPreset,
  }
}
