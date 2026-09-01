import { Link } from 'react-router-dom'
import { AppIcon } from '@/components/ui/Wordmark'
import { Button } from '@/components/ui/Button'
import { installGuidance, useInstallStore } from '@/lib/browser/install'
import { useOfflineStore } from '@/lib/browser/offline'

export function InstallBanner() {
  const prompt = useInstallStore((state) => state.prompt)
  const installed = useInstallStore((state) => state.installed)
  const dismissed = useInstallStore((state) => state.dismissed)
  const offline = useOfflineStore((state) => state.offline)
  const guidance = installGuidance()

  if (installed || dismissed || !prompt) return null

  return (
    <div
      role="region"
      aria-label="Install FoxKit"
      className="border-b border-line bg-surface px-4 py-3"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Link to="/" aria-label="FoxKit home" className="shrink-0">
          <AppIcon className="size-10" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink">{guidance.title}</p>
          <p className="text-sm text-mute">{guidance.body}</p>
        </div>
        {offline ? (
          <p className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-mute">
            Offline
          </p>
        ) : null}
        {prompt ? (
          <Button
            variant="primary"
            className="shrink-0"
            onClick={async () => {
              await prompt.prompt()
              useInstallStore.getState().setPrompt(null)
            }}
          >
            Install
          </Button>
        ) : null}
        <button
          type="button"
          aria-label="Dismiss install banner"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-mute transition-[background-color,color,transform] duration-150 hover:bg-raised hover:text-ink active:scale-[0.96]"
          onClick={() => useInstallStore.getState().dismissBanner()}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
