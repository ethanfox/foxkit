import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { uid } from '@/lib/color'
import { downloadText } from '@/lib/download'
import {
  deleteGradient,
  getGradient,
  listSavedGradients,
  saveGradient,
  type SavedGradient,
} from '@/lib/storage/db'
import { createGradient } from './defaults'
import { useGradientStore } from './store'

export function GradientNav() {
  const doc = useGradientStore((state) => state.doc)
  const setDoc = useGradientStore((state) => state.setDoc)
  const [saved, setSaved] = useState<SavedGradient[]>([])

  const refresh = async () => {
    setSaved(await listSavedGradients())
  }

  useEffect(() => {
    void refresh()
  }, [doc.updatedAt])

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 rounded-[var(--radius-card)] bg-raised p-3">
        <Button
          variant="primary"
          className="w-full"
          onClick={async () => {
            await saveGradient(doc)
            await refresh()
            toast('Saved on this device')
          }}
        >
          Save locally
        </Button>
        <p className="text-sm text-mute">
          Stores this gradient in this browser. Nothing is uploaded.
        </p>
      </div>
      <div className="grid gap-2">
        <Button
          onClick={() => {
            setDoc(createGradient({ name: 'Untitled gradient' }))
          }}
        >
          New gradient
        </Button>
        <Button
          onClick={() => {
            downloadText(
              JSON.stringify(doc, null, 2),
              `${doc.name || 'gradient'}.json`,
            )
          }}
        >
          Export JSON
        </Button>
        <label className="inline-flex min-h-10 w-full min-w-0 cursor-pointer items-center justify-center rounded-[var(--radius-control)] bg-raised px-3 text-sm">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              try {
                const parsed = JSON.parse(await file.text()) as SavedGradient
                setDoc(createGradient({ ...parsed, id: uid('grad') }))
                toast('Imported gradient')
              } catch {
                toast('That JSON is not a FoxKit gradient')
              }
              event.target.value = ''
            }}
          />
        </label>
      </div>
      <section className="grid gap-2">
        <h2 className="text-sm text-mute">Saved</h2>
        {saved.length === 0 ? (
          <p className="text-sm text-mute">Nothing saved yet.</p>
        ) : (
          <ul className="grid gap-2">
            {saved.map((item) => (
              <li key={item.id} className="grid gap-2 rounded-lg bg-raised p-3">
                <p className="truncate text-sm">{item.name}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={async () => {
                      const full = await getGradient(item.id)
                      if (full) setDoc(full)
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    onClick={async () => {
                      await saveGradient({
                        ...item,
                        id: uid('grad'),
                        name: `${item.name} copy`,
                      })
                      await refresh()
                    }}
                  >
                    Duplicate
                  </Button>
                  <Button
                    onClick={async () => {
                      await deleteGradient(item.id)
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
