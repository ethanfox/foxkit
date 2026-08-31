export function PrivacyPage() {
  return (
    <article className="mx-auto grid w-full max-w-2xl gap-6 px-4 py-10">
      <h1 className="text-3xl">Privacy</h1>
      <p className="text-lg">
        FoxKit processes your files in your browser. Your files are never
        uploaded to a server.
      </p>
      <ul className="grid list-disc gap-2 pl-5 text-mute">
        <li>No accounts or analytics.</li>
        <li>No remote fonts, image APIs, or API keys.</li>
        <li>Saved gradients and recent settings stay in this browser’s storage.</li>
        <li>Share links encode gradient settings in the URL, not a database.</li>
        <li>Clear site data and those local saves are gone.</li>
      </ul>
    </article>
  )
}
