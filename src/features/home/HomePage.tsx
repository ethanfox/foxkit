import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from '@/components/ui/Wordmark'

export function HomePage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-8 sm:py-12">
      <header className="grid gap-4">
        <Wordmark className="h-20 sm:h-28" />
        <p className="max-w-xl text-xl text-ink sm:text-2xl">
          Small visual tools that run entirely in your browser.
        </p>
        <p className="text-mute">No account. No upload. No nonsense.</p>
      </header>

      <section aria-label="Tools" className="grid gap-4 md:grid-cols-2">
        <ToolCard
          to="/gradient"
          title="Gradient Studio"
          copy="Make, tune, and export gradients for CSS, SVG, or PNG."
        >
          <div
            className="h-40 rounded-xl"
            style={{
              background:
                'linear-gradient(in oklab 135deg, #ff4d00 0%, #2b0b3f 100%)',
            }}
            aria-hidden="true"
          />
        </ToolCard>
        <ToolCard
          to="/image"
          title="Image Lab"
          copy="Resize, crop, blur, convert, and compress files on this device."
        >
          <div className="relative h-40 overflow-hidden rounded-xl bg-raised">
            <div className="absolute inset-6 rounded-lg border-2 border-ink/80" />
            <div className="absolute inset-10 bg-[linear-gradient(135deg,#fff_0%,#888_50%,#111_100%)] opacity-80" />
          </div>
        </ToolCard>
      </section>

      <section aria-label="In development">
        <h2 className="mb-3 text-sm text-mute">In development</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {['Palette extraction', 'Typographic scale', 'SVG optimizer'].map(
            (name) => (
              <p
                key={name}
                className="rounded-[var(--radius-card)] bg-surface px-4 py-5 text-sm text-mute"
              >
                {name}
              </p>
            ),
          )}
        </div>
      </section>

      <p className="text-sm text-mute">Your files never leave your device.</p>
    </div>
  )
}

function ToolCard({
  to,
  title,
  copy,
  children,
}: {
  to: string
  title: string
  copy: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className="grid gap-5 rounded-[var(--radius-card)] bg-surface p-5 transition-[transform,background-color] duration-150 hover:bg-raised active:scale-[0.99]"
    >
      <div className="grid gap-1">
        <h2 className="text-lg text-ink">{title}</h2>
        <p className="text-sm text-mute">{copy}</p>
      </div>
      {children}
    </Link>
  )
}
