import { RotateCcw } from 'lucide-react'
import type { ThemeToken } from '../../lib/theme-defaults'

export interface ChoiceOption {
  label: string
  value: string
}

interface ChoiceControlProps {
  token: ThemeToken
  value: string
  modified: boolean
  options: ChoiceOption[]
  onChange: (value: string) => void
  onReset: () => void
}

export default function ChoiceControl({ token, value, modified, options, onChange, onReset }: ChoiceControlProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{token.label}</span>
          {modified && (
            <button
              onClick={onReset}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title={`Reset to ${token.defaultValue}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex rounded-md border border-border overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? 'bg-foreground text-background'
                : 'bg-popover text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
