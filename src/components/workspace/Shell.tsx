import { Outlet } from 'react-router-dom'
import { InstallBanner } from '@/components/workspace/InstallBanner'

export function Shell() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-black text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <InstallBanner />
      <main id="main" className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
