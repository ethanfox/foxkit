import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BackLink } from '@/components/ui/BackLink'

export function AboutPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash !== '#privacy') return
    document.getElementById('privacy')?.scrollIntoView()
  }, [hash])

  return (
    <div className="grid min-h-0 flex-1 lg:h-full lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="p-4 lg:border-r lg:border-line">
        <BackLink />
      </aside>
      <article className="mx-auto grid w-full max-w-2xl gap-6 px-4 py-10">
      <h1 className="text-3xl">About FoxKit</h1>
      <p className="text-lg text-mute">
        Open it, make the thing, export it, move on.
      </p>
      <p>
        FoxKit is a local-first kit of visual tools. There is no account, no
        upload flow, and no server sitting between you and the export. Files
        stay on your device. After the first visit, the app can run offline and
        install like a Dock app.
      </p>
      <p>
        v1 is Gradient Studio, Image Lab, and Palette. Extra utilities stay out
        until those are actually useful.
      </p>
      <p className="text-mute">
        The name is FoxKit. The joke stays implicit.
      </p>

      <section id="privacy" className="grid scroll-mt-8 gap-4 border-t border-line pt-8">
        <h2 className="text-2xl">Privacy</h2>
        <p className="text-lg">
          FoxKit processes your files in your browser. Your files are never
          uploaded to a server.
        </p>
        <ul className="grid list-disc gap-2 pl-5 text-mute">
          <li>No accounts or analytics.</li>
          <li>No remote fonts, image APIs, or API keys.</li>
          <li>Saved gradients, palettes, and recent settings stay in this browser’s storage.</li>
          <li>Share links encode gradient settings in the URL, not a database.</li>
          <li>Clear site data and those local saves are gone.</li>
        </ul>
      </section>
      </article>
    </div>
  )
}
