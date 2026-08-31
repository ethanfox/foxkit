import { create } from 'zustand'

interface OfflineState {
  offline: boolean
  setOffline: (value: boolean) => void
}

export const useOfflineStore = create<OfflineState>((set) => ({
  offline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  setOffline: (offline) => set({ offline }),
}))

export function bindOfflineListeners() {
  const sync = () => useOfflineStore.getState().setOffline(!navigator.onLine)
  window.addEventListener('online', sync)
  window.addEventListener('offline', sync)
  sync()
}
