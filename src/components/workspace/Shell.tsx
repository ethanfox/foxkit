import { NavLink, Outlet } from 'react-router-dom'
import { Wordmark } from '@/components/ui/Wordmark'
import { useInstallStore, installGuidance } from '@/lib/browser/install'
import { useOfflineStore } from '@/lib/browser/offline'
import { toast } from '@/components/ui/Toast'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/gradient', label: 'Gradient Studio' },
  { to: '/image', label: 'Image Lab' },
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
]

export function Shell() {
  const offline = useOfflineStore((state) => state.offline)
  const prompt = useInstallStore((state) => state.prompt)
  const installed = useInstallStore((state) => state.installed)
  const guidance = installGuidance()

  return (
    <div className="flex min-h-dvh flex-col bg-black text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-4 py-3">
        <NavLink to="/" aria-label="FoxKit home" className="inline-flex items-center">
          <Wordmark compact className="h-7" />
        </NavLink>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex min-h-10 items-center rounded-md px-3 text-sm ${
                  isActive ? 'bg-raised text-ink' : 'text-mute hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {offline ? (
            <p className="rounded-full border border-line px-3 py-1 text-xs text-mute">
              Offline
            </p>
          ) : null}
          {prompt && !installed ? (
            <button
              type="button"
              className="min-h-10 rounded-[var(--radius-control)] bg-ink px-3 text-sm text-black"
              onClick={async () => {
                await prompt.prompt()
                useInstallStore.getState().setPrompt(null)
              }}
            >
              Install FoxKit
            </button>
          ) : (
            <button
              type="button"
              className="min-h-10 rounded-[var(--radius-control)] px-3 text-sm text-mute hover:text-ink"
              onClick={() => toast(`${guidance.title}. ${guidance.body}`)}
            >
              {guidance.title}
            </button>
          )}
        </div>
      </header>
      <main id="main" className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
