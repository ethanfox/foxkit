export function AboutPage() {
  return (
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
        v1 is two tools done properly: Gradient Studio and Image Lab. Extra
        utilities stay out until those two are actually useful.
      </p>
      <p className="text-mute">
        The name is FoxKit. The joke stays implicit.
      </p>
    </article>
  )
}
