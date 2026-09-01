import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { TextField } from '@/components/ui/TextField'
import { toast } from '@/components/ui/Toast'
import { copyText } from '@/lib/download'
import { MAX_COLORS, MIN_COLORS } from './types'
import { usePaletteStore } from './store'

export function PaletteInspector() {
  const name = usePaletteStore((state) => state.name)
  const count = usePaletteStore((state) => state.count)
  const colors = usePaletteStore((state) => state.colors)
  const imageUrl = usePaletteStore((state) => state.imageUrl)
  const setName = usePaletteStore((state) => state.setName)
  const setCount = usePaletteStore((state) => state.setCount)

  return (
    <div className="grid gap-6">
      <TextField
        id="palette-name"
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Slider
        label="Colors"
        min={MIN_COLORS}
        max={MAX_COLORS}
        value={count}
        onChange={setCount}
        display={String(count)}
      />
      {!imageUrl ? (
        <p className="text-sm text-mute">Drop an image to pull colors from it.</p>
      ) : (
        <p className="text-sm text-mute">
          Drag the dots on the image to change where a color is sampled.
        </p>
      )}
      <ul className="grid gap-2">
        {colors.map((color, index) => (
          <li key={color.id}>
            <button
              type="button"
              className="grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-[var(--radius-control)] bg-raised px-3 py-2 text-left"
              onClick={async () => {
                try {
                  await copyText(color.hex)
                  toast(`${color.hex} copied`)
                } catch {
                  toast('Could not copy')
                }
              }}
            >
              <span
                className="size-8 rounded-md outline outline-1 outline-white/10"
                style={{ background: color.hex }}
              />
              <span className="font-mono text-sm">{color.hex}</span>
              <span className="text-xs text-mute">{index + 1}</span>
            </button>
          </li>
        ))}
      </ul>
      {colors.length > 0 ? (
        <Button
          className="w-full"
          onClick={async () => {
            try {
              await copyText(colors.map((color) => color.hex).join('\n'))
              toast('HEX copied')
            } catch {
              toast('Could not copy')
            }
          }}
        >
          Copy HEX
        </Button>
      ) : null}
    </div>
  )
}
