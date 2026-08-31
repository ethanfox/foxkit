import { useState, type DragEvent } from 'react'

interface DropZoneProps {
  label: string
  accept: string
  hint: string
  onFiles: (files: FileList) => void
}

export function DropZone({ label, accept, hint, onFiles }: DropZoneProps) {
  const [over, setOver] = useState(false)

  const onDrag = (event: DragEvent, active: boolean) => {
    event.preventDefault()
    event.stopPropagation()
    setOver(active)
  }

  return (
    <label
      className={`grid min-h-40 cursor-pointer place-items-center rounded-[var(--radius-card)] border border-dashed px-6 py-8 text-center transition-[background-color,border-color] duration-150 ${
        over ? 'border-ink bg-raised' : 'border-line bg-surface'
      }`}
      onDragEnter={(event) => onDrag(event, true)}
      onDragOver={(event) => onDrag(event, true)}
      onDragLeave={(event) => onDrag(event, false)}
      onDrop={(event) => {
        onDrag(event, false)
        if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files)
      }}
    >
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files?.length) onFiles(event.target.files)
        }}
      />
      <span className="grid gap-2">
        <span className="text-base text-ink">{label}</span>
        <span className="text-sm text-mute">{hint}</span>
      </span>
    </label>
  )
}
