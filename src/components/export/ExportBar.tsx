import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ExportBarProps {
  children: ReactNode
  onCopy?: () => void
  copyLabel?: string
  onDownload: () => void
  downloadLabel?: string
  disabled?: boolean
}

export function ExportBar({
  children,
  onCopy,
  copyLabel = 'Copy',
  onDownload,
  downloadLabel = 'Download',
  disabled,
}: ExportBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 text-sm text-mute">{children}</div>
      <div className="flex flex-wrap gap-2">
        {onCopy ? (
          <Button onClick={onCopy} disabled={disabled}>
            {copyLabel}
          </Button>
        ) : null}
        <Button variant="primary" onClick={onDownload} disabled={disabled}>
          {downloadLabel}
        </Button>
      </div>
    </div>
  )
}
