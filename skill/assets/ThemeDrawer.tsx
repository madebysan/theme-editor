import { useState, useEffect, useRef } from 'react'
import { X, RotateCcw, Paintbrush, Undo2, Redo2, Shuffle, Dices, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { getTokensByCategory } from '../../lib/theme-defaults'
import { PRESETS, COLOR_PALETTES, FONT_PAIRINGS, STYLE_COMBOS, loadGoogleFont } from '../../lib/theme-presets'
import ColorControl from './ColorControl'
import FontControl from './FontControl'
import RangeControl from './RangeControl'
import ChoiceControl from './ChoiceControl'
import type { ChoiceOption } from './ChoiceControl'
import ThemeExportImport from './ThemeExportImport'

const SHADOW_OPTIONS: ChoiceOption[] = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { label: 'Medium', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
  { label: 'Elevated', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
]

const BORDER_OPTIONS: ChoiceOption[] = [
  { label: 'None', value: '0px' },
  { label: 'Default', value: '1px' },
  { label: 'Strong', value: '2px' },
]

type Tab = 'colors' | 'type' | 'style'

const TABS: { id: Tab; label: string }[] = [
  { id: 'colors', label: 'Colors' },
  { id: 'type', label: 'Type' },
  { id: 'style', label: 'Style' },
]

export default function ThemeDrawer() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('colors')
  const [presetIndex, setPresetIndex] = useState(0)
  const theme = useTheme()
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const colorTokens = getTokensByCategory('color')
  const fontTokens = getTokensByCategory('font')
  const radiusTokens = getTokensByCategory('radius')
  const spacingTokens = getTokensByCategory('spacing')
  const shadowTokens = getTokensByCategory('shadow')
  const borderTokens = getTokensByCategory('border')

  const modifiedCount = [...colorTokens, ...fontTokens, ...radiusTokens, ...spacingTokens, ...shadowTokens, ...borderTokens]
    .filter(t => theme.isModified(t.cssVar)).length

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handleMouseDown = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  // Shuffle handlers
  const shuffleColors = () => {
    const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]
    theme.batchSetTokens(palette)
  }

  const shuffleType = () => {
    const pair = FONT_PAIRINGS[Math.floor(Math.random() * FONT_PAIRINGS.length)]
    loadGoogleFont(pair.sans)
    loadGoogleFont(pair.mono)
    theme.batchSetTokens({
      '--font-sans': `'${pair.sans}', system-ui, -apple-system, sans-serif`,
      '--font-mono': `'${pair.mono}', ui-monospace, monospace`,
    })
  }

  const shuffleStyle = () => {
    const combo = STYLE_COMBOS[Math.floor(Math.random() * STYLE_COMBOS.length)]
    theme.batchSetTokens({
      '--radius': combo.radius,
      '--radius-button': combo.button,
      '--shadow': combo.shadow,
      '--input-border-width': combo.border,
      '--spacing': combo.spacing,
    })
  }

  const shuffleAll = () => {
    const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]
    const pair = FONT_PAIRINGS[Math.floor(Math.random() * FONT_PAIRINGS.length)]
    const combo = STYLE_COMBOS[Math.floor(Math.random() * STYLE_COMBOS.length)]
    loadGoogleFont(pair.sans)
    loadGoogleFont(pair.mono)
    theme.batchSetTokens({
      ...palette,
      '--font-sans': `'${pair.sans}', system-ui, -apple-system, sans-serif`,
      '--font-mono': `'${pair.mono}', ui-monospace, monospace`,
      '--radius': combo.radius,
      '--radius-button': combo.button,
      '--shadow': combo.shadow,
      '--input-border-width': combo.border,
      '--spacing': combo.spacing,
    })
  }

  return (
    <>
      {/* Trigger button — always visible */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 left-4 z-[9998] w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-colors ${
          open
            ? 'bg-primary text-primary-foreground'
            : 'bg-foreground text-background hover:bg-foreground/80'
        }`}
        title={open ? 'Close theme editor' : 'Open theme editor'}
      >
        <Paintbrush className="w-5 h-5" />
        {modifiedCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
            {modifiedCount}
          </span>
        )}
      </button>

      {/* Popover panel */}
      <div
        ref={popoverRef}
        className={`fixed bottom-16 left-4 z-[9998] w-80 max-h-[65vh] bg-popover rounded-xl shadow-2xl border border-border flex flex-col transition-all duration-200 ease-out ${
          open
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Arrow pointing down to trigger */}
        <div className="absolute -bottom-2 left-5 w-4 h-4 bg-popover border-r border-b border-border rotate-45" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">Theme</h2>
            {modifiedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-primary/15 text-primary rounded-full">
                {modifiedCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={theme.undo}
              disabled={!theme.canUndo}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (⌘Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={theme.redo}
              disabled={!theme.canRedo}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={shuffleAll}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              title="Shuffle everything"
            >
              <Dices className="w-4 h-4" />
            </button>
            {theme.hasAnyModification && (
              <button
                onClick={theme.resetAll}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                title="Reset all tokens"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset selector — prev/next navigation */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prev = (presetIndex - 1 + PRESETS.length) % PRESETS.length
                setPresetIndex(prev)
                theme.applyPreset(PRESETS[prev].overrides)
              }}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Previous preset"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => theme.applyPreset(PRESETS[presetIndex].overrides)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:border-primary hover:text-foreground transition-colors bg-popover text-secondary-foreground"
              title={`Apply ${PRESETS[presetIndex].name} preset`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 border border-black/10"
                style={{ backgroundColor: PRESETS[presetIndex].dot }}
              />
              {PRESETS[presetIndex].name}
            </button>
            <button
              onClick={() => {
                const next = (presetIndex + 1) % PRESETS.length
                setPresetIndex(next)
                theme.applyPreset(PRESETS[next].overrides)
              }}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Next preset"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0.5 px-3 pb-2 flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
          {activeTab === 'colors' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Color tokens</span>
                <button
                  onClick={shuffleColors}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  title="Randomize colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Shuffle
                </button>
              </div>
              <div className="space-y-1 divide-y divide-border/50">
                {colorTokens.map((token) => (
                  <ColorControl
                    key={token.cssVar}
                    token={token}
                    value={theme.getToken(token.cssVar)}
                    modified={theme.isModified(token.cssVar)}
                    onChange={(v) => theme.setToken(token.cssVar, v)}
                    onReset={() => theme.resetToken(token.cssVar)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'type' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Font families</span>
                <button
                  onClick={shuffleType}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  title="Randomize fonts"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Shuffle
                </button>
              </div>
              <div className="space-y-4">
                {fontTokens.map((token) => (
                  <FontControl
                    key={token.cssVar}
                    token={token}
                    value={theme.getToken(token.cssVar)}
                    modified={theme.isModified(token.cssVar)}
                    onChange={(v) => theme.setToken(token.cssVar, v)}
                    onReset={() => theme.resetToken(token.cssVar)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Style tokens</span>
                <button
                  onClick={shuffleStyle}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  title="Randomize style"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Shuffle
                </button>
              </div>
              <div className="space-y-4">
                {radiusTokens.map((token) => (
                  <RangeControl
                    key={token.cssVar}
                    token={token}
                    value={theme.getToken(token.cssVar)}
                    modified={theme.isModified(token.cssVar)}
                    onChange={(v) => theme.setToken(token.cssVar, v)}
                    onReset={() => theme.resetToken(token.cssVar)}
                    min={0}
                    max={2}
                    step={0.125}
                    unit="rem"
                  />
                ))}
                <div className="border-t border-border/50 pt-4">
                  {shadowTokens.map((token) => (
                    <ChoiceControl
                      key={token.cssVar}
                      token={token}
                      value={theme.getToken(token.cssVar)}
                      modified={theme.isModified(token.cssVar)}
                      options={SHADOW_OPTIONS}
                      onChange={(v) => theme.setToken(token.cssVar, v)}
                      onReset={() => theme.resetToken(token.cssVar)}
                    />
                  ))}
                  {borderTokens.map((token) => (
                    <ChoiceControl
                      key={token.cssVar}
                      token={token}
                      value={theme.getToken(token.cssVar)}
                      modified={theme.isModified(token.cssVar)}
                      options={BORDER_OPTIONS}
                      onChange={(v) => theme.setToken(token.cssVar, v)}
                      onReset={() => theme.resetToken(token.cssVar)}
                    />
                  ))}
                </div>
                <div className="border-t border-border/50 pt-4">
                  {spacingTokens.map((token) => (
                    <RangeControl
                      key={token.cssVar}
                      token={token}
                      value={theme.getToken(token.cssVar)}
                      modified={theme.isModified(token.cssVar)}
                      onChange={(v) => theme.setToken(token.cssVar, v)}
                      onReset={() => theme.resetToken(token.cssVar)}
                      min={0.125}
                      max={0.5}
                      step={0.0625}
                      unit="rem"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Heads up:</strong> Spacing is a base multiplier — small changes have a big visual impact.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Export/Import at bottom */}
        <div className="flex-shrink-0 px-4 pb-4">
          <ThemeExportImport
            exportAsCSS={theme.exportAsCSS}
            exportAsJSON={theme.exportAsJSON}
            importFromJSON={theme.importFromJSON}
          />
        </div>
      </div>
    </>
  )
}
