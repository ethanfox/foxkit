import { useEffect, useRef, type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Dialog({ open, title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="w-[min(480px,calc(100vw-2rem))] rounded-[var(--radius-card)] border border-line bg-surface p-5 text-ink backdrop:bg-black/70"
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-md text-sm text-mute hover:text-ink"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
