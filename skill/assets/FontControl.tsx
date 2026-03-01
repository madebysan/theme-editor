import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import type { ThemeToken } from '../../lib/theme-defaults'
import { loadGoogleFont } from '../../lib/theme-presets'

interface FontControlProps {
  token: ThemeToken
  value: string
  modified: boolean
  onChange: (value: string) => void
  onReset: () => void
}

/** Extract the primary font name from a font-family string like "'Inter', system-ui, sans-serif" */
function extractPrimaryFont(fontFamily: string): string | null {
  const match = fontFamily.match(/^['"]?([^'",]+)['"]?/)
  return match ? match[1].trim() : null
}

export default function FontControl({ token, value, modified, onChange, onReset }: FontControlProps) {
  // Dynamically load Google Font when value changes
  useEffect(() => {
    const fontName = extractPrimaryFont(value)
    if (fontName) loadGoogleFont(fontName)
  }, [value])

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-sm font-medium text-foreground">{token.label}</div>
        {modified && (
          <button
            onClick={onReset}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            title={`Reset to default`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-popover border border-border rounded-md text-sm text-foreground font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors"
        spellCheck={false}
        placeholder="'Font Name', fallback, generic"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Type a Google Font name (e.g. Inter, Lora) — it will load automatically.
      </p>
    </div>
  )
}
