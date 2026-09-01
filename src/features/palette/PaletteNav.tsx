import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import {
  deletePalette,
  listSavedPalettes,
  savePalette,
} from '@/lib/storage/db'
import type { SavedPalette } from './types'
import { usePaletteStore } from './store'

export function PaletteNav() {
  const name = usePaletteStore((state) => state.name)
  const colors = usePaletteStore((state) => state.colors)
  const setColors = usePaletteStore((state) => state.setColors)
  const clear = usePaletteStore((state) => state.clear)
  const [saved, setSaved] = useState<SavedPalette[]>([])

  const refresh = async () => {
    setSaved(await listSavedPalettes())
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 rounded-[var(--radius-card)] bg-raised p-3">
        <Button
          variant="primary"
          className="w-full"
          disabled={colors.length === 0}
          onClick={async () => {
            await savePalette({ name, colors })
            await refresh()
            toast('Saved on this device')
          }}
        >
          Save locally
        </Button>
        <p className="text-sm text-mute">
          Stores this palette in this browser. The image is not saved.
        </p>
      </div>
      <Button className="w-full" onClick={() => clear()}>
        New palette
      </Button>
      <section className="grid gap-2">
        <h2 className="text-sm text-mute">Saved</h2>
        {saved.length === 0 ? (
          <p className="text-sm text-mute">Nothing saved yet.</p>
        ) : (
          <ul className="grid gap-2">
            {saved.map((item) => (
              <li key={item.id} className="grid gap-2 rounded-lg bg-raised p-3">
                <p className="truncate text-sm">{item.name}</p>
                <div className="flex h-6 overflow-hidden rounded-md">
                  {item.colors.map((color) => (
                    <span
                      key={color.id}
                      className="min-w-0 flex-1"
                      style={{ background: color.hex }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setColors(item.colors, item.name)}>
                    Open
                  </Button>
                  <Button
                    onClick={async () => {
                      await deletePalette(item.id)
                      await refresh()
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
