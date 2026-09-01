import type { ReactNode } from 'react'
import { BackLink } from '@/components/ui/BackLink'

interface WorkspaceProps {
  nav: ReactNode
  preview: ReactNode
  inspector: ReactNode
  exportBar: ReactNode
}

export function Workspace({ nav, preview, inspector, exportBar }: WorkspaceProps) {
  return (
    <div className="grid min-h-0 flex-1 lg:h-full lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,320px)] lg:overflow-hidden">
      <aside className="min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain border-b border-line p-4 lg:border-r lg:border-b-0">
        <div className="sticky top-0 z-10 mb-4 bg-black pb-2">
          <BackLink />
        </div>
        {nav}
      </aside>
      <section className="grid min-h-[50vh] grid-rows-[minmax(0,1fr)_auto] lg:h-full lg:min-h-0">
        <div className="flex min-h-0 items-center justify-center overflow-auto p-4">
          {preview}
        </div>
        <div className="border-t border-line bg-black p-3">{exportBar}</div>
      </section>
      <aside className="min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain border-t border-line p-4 lg:border-t-0 lg:border-l">
        <h2 className="mb-4 text-sm text-mute lg:sr-only">Controls</h2>
        {inspector}
      </aside>
    </div>
  )
}
