import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AppIcon, Wordmark } from '@/components/ui/Wordmark'

export function HomePage() {
  return (
    <div className="grid w-full gap-10 px-4 py-8 sm:py-12">
      <header className="grid gap-4">
        <Wordmark className="h-20 sm:h-28" />
        <p className="max-w-xl text-xl text-ink sm:text-2xl">
          Small visual tools that run entirely in your browser.
        </p>
      </header>

      <section aria-label="Tools" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard
          to="/gradient"
          title="Gradient Studio"
          copy="Make, tune, and export gradients for CSS, SVG, or PNG."
        >
          <ToolIcon src="apps/gradient-maker-icon.svg" />
        </ToolCard>
        <ToolCard
          to="/image"
          title="Image Lab"
          copy="Resize, crop, blur, convert, and compress files on this device."
        >
          <ToolIcon src="apps/image-lab-icon.svg" invert />
        </ToolCard>
        <ToolCard
          to="/palette"
          title="Palette"
          copy="Pull the main colors from an image, then drag, save, or copy them."
        >
          <ToolIcon src="apps/palette-extractor.svg" invert />
        </ToolCard>
        <ToolCard
          to="/about"
          title="About"
          copy="What FoxKit is, and how files stay on this device."
        >
          <div className={toolWellClass}>
            <AppIcon className="size-20 rounded-[1.4rem] outline outline-1 outline-white/10" />
          </div>
        </ToolCard>
      </section>

      <section aria-label="In development">
        <h2 className="mb-3 text-sm text-mute">In development</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {['Typographic scale', 'SVG optimizer'].map(
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

      <p className="text-sm text-mute">
        <Link to="/about#privacy" className="underline-offset-4 hover:text-ink hover:underline">
          Your files never leave your device.
        </Link>
      </p>
    </div>
  )
}

const hoverEase = 'duration-300 ease-[cubic-bezier(0.2,0,0,1)]'
const toolWellClass = `flex h-40 items-center justify-center rounded-xl bg-raised transition-colors ${hoverEase} group-hover:bg-transparent`

function ToolIcon({ src, invert = false }: { src: string; invert?: boolean }) {
  return (
    <div className={toolWellClass} aria-hidden="true">
      <img
        src={`${import.meta.env.BASE_URL}${src}`}
        alt=""
        className={`size-20 select-none ${invert ? 'brand-invert' : ''}`}
      />
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
      className={`group grid gap-5 rounded-[var(--radius-card)] bg-surface p-5 transition-[background-color,transform] ${hoverEase} hover:bg-raised active:scale-[0.99]`}
    >
      <div className="grid gap-1">
        <h2 className="text-lg text-ink">{title}</h2>
        <p className="text-sm text-mute">{copy}</p>
      </div>
      {children}
    </Link>
  )
}
