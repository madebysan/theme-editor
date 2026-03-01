import { RotateCcw } from 'lucide-react'
import type { ThemeToken } from '../../lib/theme-defaults'

interface RangeControlProps {
  token: ThemeToken
  value: string
  modified: boolean
  onChange: (value: string) => void
  onReset: () => void
  min: number
  max: number
  step: number
  unit: string
}

function parseNumericValue(value: string): number {
  return parseFloat(value) || 0
}

export default function RangeControl({ token, value, modified, onChange, onReset, min, max, step, unit }: RangeControlProps) {
  const numericValue = parseNumericValue(value)

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
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
        <span className="text-xs font-mono text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={(e) => onChange(`${e.target.value}${unit}`)}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
