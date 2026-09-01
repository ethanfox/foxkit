import type { ReactNode } from 'react'

interface WorkspaceProps {
  nav: ReactNode
  preview: ReactNode
  inspector: ReactNode
  exportBar: ReactNode
}

export function Workspace({ nav, preview, inspector, exportBar }: WorkspaceProps) {
  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
      <aside className="min-h-0 overflow-auto border-b border-line p-4 lg:border-r lg:border-b-0">
        {nav}
      </aside>
      <section className="grid min-h-[50vh] grid-rows-[1fr_auto] lg:min-h-0">
        <div className="min-h-0 overflow-auto p-4">{preview}</div>
        <div className="border-t border-line bg-black p-3">{exportBar}</div>
      </section>
      <aside className="min-h-0 overflow-auto border-t border-line p-4 lg:border-t-0 lg:border-l">
        <h2 className="mb-4 text-sm text-mute lg:sr-only">Controls</h2>
        {inspector}
      </aside>
    </div>
  )
}
