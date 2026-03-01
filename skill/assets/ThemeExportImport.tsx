import { useState, useRef } from 'react'
import { Check, Upload, FileCode, FileJson } from 'lucide-react'

interface ThemeExportImportProps {
  exportAsCSS: () => string
  exportAsJSON: () => string
  importFromJSON: (json: string) => boolean
}

export default function ThemeExportImport({ exportAsCSS, exportAsJSON, importFromJSON }: ThemeExportImportProps) {
  const [copiedCSS, setCopiedCSS] = useState(false)
  const [copiedJSON, setCopiedJSON] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(exportAsCSS())
    setCopiedCSS(true)
    setTimeout(() => setCopiedCSS(false), 2000)
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportAsJSON())
    setCopiedJSON(true)
    setTimeout(() => setCopiedJSON(false), 2000)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const success = importFromJSON(text)
      if (!success) {
        setImportError('Invalid JSON file. Make sure it contains theme token values.')
        setTimeout(() => setImportError(null), 3000)
      }
    }
    reader.readAsText(file)

    // Reset so the same file can be imported again
    e.target.value = ''
  }

  return (
    <div className="border-t border-border pt-4 mt-4 space-y-2">
      <button
        onClick={handleCopyCSS}
        className="flex items-center gap-2 w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
      >
        {copiedCSS ? <Check className="w-4 h-4 text-primary" /> : <FileCode className="w-4 h-4" />}
        {copiedCSS ? 'Copied!' : 'Export as CSS'}
      </button>

      <button
        onClick={handleCopyJSON}
        className="flex items-center gap-2 w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
      >
        {copiedJSON ? <Check className="w-4 h-4 text-primary" /> : <FileJson className="w-4 h-4" />}
        {copiedJSON ? 'Copied!' : 'Export as JSON'}
      </button>

      <button
        onClick={handleImport}
        className="flex items-center gap-2 w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
      >
        <Upload className="w-4 h-4" />
        Import JSON
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {importError && (
        <p className="text-xs text-destructive">{importError}</p>
      )}
    </div>
  )
}
