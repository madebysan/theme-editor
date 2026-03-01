import { RotateCcw } from 'lucide-react'
import type { ThemeToken } from '../../lib/theme-defaults'

interface ColorControlProps {
  token: ThemeToken
  value: string
  modified: boolean
  onChange: (value: string) => void
  onReset: () => void
}

export default function ColorControl({ token, value, modified, onChange, onReset }: ColorControlProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-md border border-border cursor-pointer flex-shrink-0 p-0.5"
        title={token.label}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{token.label}</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 text-xs font-mono text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-0.5 uppercase"
          spellCheck={false}
        />
      </div>
      {modified && (
        <button
          onClick={onReset}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title={`Reset to ${token.defaultValue}`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
