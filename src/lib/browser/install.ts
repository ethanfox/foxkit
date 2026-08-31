import { create } from 'zustand'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallState {
  prompt: BeforeInstallPromptEvent | null
  installed: boolean
  setPrompt: (prompt: BeforeInstallPromptEvent | null) => void
  setInstalled: (value: boolean) => void
}

export const useInstallStore = create<InstallState>((set) => ({
  prompt: null,
  installed: false,
  setPrompt: (prompt) => set({ prompt }),
  setInstalled: (installed) => set({ installed }),
}))

export function bindInstallListeners() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    useInstallStore.getState().setPrompt(event as BeforeInstallPromptEvent)
  })
  window.addEventListener('appinstalled', () => {
    useInstallStore.getState().setInstalled(true)
    useInstallStore.getState().setPrompt(null)
  })
}

export function installGuidance(): { title: string; body: string } {
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua)
  const isMac = /Macintosh/.test(ua)
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)
  if (isIOS) {
    return {
      title: 'Add to Home Screen',
      body: 'In Safari, tap Share, then Add to Home Screen.',
    }
  }
  if (isMac && isSafari) {
    return {
      title: 'Add to Dock',
      body: 'In Safari, choose File → Add to Dock.',
    }
  }
  return {
    title: 'Install FoxKit',
    body: 'Use your browser’s install control, or the Install FoxKit button when it appears.',
  }
}
