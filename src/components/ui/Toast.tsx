import { create } from 'zustand'

interface ToastItem {
  id: string
  message: string
}

interface ToastState {
  items: ToastItem[]
  push: (message: string) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    set((state) => ({ items: [...state.items, { id, message }] }))
    window.setTimeout(() => {
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
    }, 4000)
  },
  dismiss: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}))

export function toast(message: string) {
  useToastStore.getState().push(message)
}

export function ToastViewport() {
  const items = useToastStore((state) => state.items)
  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-50 grid gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => (
        <p
          key={item.id}
          className="pointer-events-auto rounded-[var(--radius-control)] bg-ink px-3 py-2 text-sm text-black"
        >
          {item.message}
        </p>
      ))}
    </div>
  )
}
