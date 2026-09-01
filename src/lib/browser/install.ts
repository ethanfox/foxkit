import { create } from 'zustand'

const DISMISS_KEY = 'foxkit.installBannerDismissed'
const INSTALLED_KEY = 'foxkit.installed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallState {
  prompt: BeforeInstallPromptEvent | null
  installed: boolean
  dismissed: boolean
  setPrompt: (prompt: BeforeInstallPromptEvent | null) => void
  setInstalled: (value: boolean) => void
  dismissBanner: () => void
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    if (value) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const modes = ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay']
  const display = modes.some((mode) => window.matchMedia?.(`(display-mode: ${mode})`).matches)
  const ios = 'standalone' in navigator && Boolean((navigator as { standalone?: boolean }).standalone)
  return Boolean(display || ios)
}

async function hasRelatedInstall(): Promise<boolean> {
  const getter = (
    navigator as Navigator & {
      getInstalledRelatedApps?: () => Promise<Array<{ platform: string }>>
    }
  ).getInstalledRelatedApps
  if (!getter) return false
  try {
    const apps = await getter.call(navigator)
    return apps.length > 0
  } catch {
    return false
  }
}

function markInstalled() {
  writeFlag(INSTALLED_KEY, true)
  useInstallStore.getState().setInstalled(true)
  useInstallStore.getState().setPrompt(null)
}

export const useInstallStore = create<InstallState>((set) => ({
  prompt: null,
  installed:
    typeof window !== 'undefined' ? isStandalone() || readFlag(INSTALLED_KEY) : false,
  dismissed: typeof window !== 'undefined' ? readFlag(DISMISS_KEY) : false,
  setPrompt: (prompt) => set({ prompt }),
  setInstalled: (installed) => set({ installed }),
  dismissBanner: () => {
    writeFlag(DISMISS_KEY, true)
    set({ dismissed: true })
  },
}))

let bound = false

export function bindInstallListeners() {
  if (bound) return
  bound = true

  if (isStandalone()) markInstalled()

  void hasRelatedInstall().then((related) => {
    if (related) markInstalled()
  })

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    if (useInstallStore.getState().installed) return
    useInstallStore.getState().setPrompt(event as BeforeInstallPromptEvent)
  })
  window.addEventListener('appinstalled', () => {
    markInstalled()
    useInstallStore.getState().dismissBanner()
  })
}

export function installGuidance(): { title: string; body: string } {
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua)
  const isMac = /Macintosh/.test(ua)
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)
  if (isIOS) {
    return {
      title: 'Add FoxKit to Home Screen',
      body: 'In Safari, tap Share, then Add to Home Screen.',
    }
  }
  if (isMac && isSafari) {
    return {
      title: 'Add FoxKit to Dock',
      body: 'In Safari, choose File → Add to Dock.',
    }
  }
  return {
    title: 'Install FoxKit',
    body: 'Keep the tools on your device. Files still never leave this browser.',
  }
}
