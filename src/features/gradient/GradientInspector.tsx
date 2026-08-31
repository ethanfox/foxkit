import { Button } from '@/components/ui/Button'
import { ColorInput } from '@/components/ui/ColorInput'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { SelectField } from '@/components/ui/SelectField'
import { Slider } from '@/components/ui/Slider'
import { TextField } from '@/components/ui/TextField'
import { ASPECT_PRESETS, MAX_MESH_POINTS, MIN_MESH_POINTS } from './types'
import type { AspectId, GradientType, Interpolation } from './types'
import { useGradientStore } from './store'

export function GradientInspector() {
  const doc = useGradientStore((state) => state.doc)
  const patch = useGradientStore((state) => state.patch)
  const setType = useGradientStore((state) => state.setType)
  const updateStop = useGradientStore((state) => state.updateStop)
  const addStop = useGradientStore((state) => state.addStop)
  const duplicateStop = useGradientStore((state) => state.duplicateStop)
  const removeStop = useGradientStore((state) => state.removeStop)
  const updatePoint = useGradientStore((state) => state.updatePoint)
  const addPoint = useGradientStore((state) => state.addPoint)
  const removePoint = useGradientStore((state) => state.removePoint)

  const setAspect = (aspect: AspectId) => {
    const preset = ASPECT_PRESETS.find((item) => item.id === aspect)
    if (!preset?.ratio) {
      patch({ aspect })
      return
    }
    const width = doc.width
    patch({
      aspect,
      height: Math.max(1, Math.round(width / preset.ratio)),
    })
  }

  return (
    <div className="grid gap-6">
      <TextField
        id="gradient-name"
        label="Name"
        value={doc.name}
        onChange={(event) => patch({ name: event.target.value })}
      />
      <SegmentedControl
        label="Type"
        value={doc.type}
        onChange={(value) => setType(value as GradientType)}
        options={[
          { value: 'linear', label: 'Linear' },
          { value: 'radial', label: 'Radial' },
          { value: 'conic', label: 'Conic' },
          { value: 'freeform', label: 'Freeform' },
        ]}
      />
      {doc.type === 'linear' ? (
        <Slider
          label="Angle"
          min={0}
          max={360}
          value={doc.angle}
          onChange={(angle) => patch({ angle })}
          display={`${doc.angle}°`}
        />
      ) : null}
      {doc.type === 'radial' ? (
        <>
          <Slider
            label="Center X"
            min={0}
            max={100}
            value={doc.radialPosition.x}
            onChange={(x) => patch({ radialPosition: { ...doc.radialPosition, x } })}
            display={`${doc.radialPosition.x}%`}
          />
          <Slider
            label="Center Y"
            min={0}
            max={100}
            value={doc.radialPosition.y}
            onChange={(y) => patch({ radialPosition: { ...doc.radialPosition, y } })}
            display={`${doc.radialPosition.y}%`}
          />
        </>
      ) : null}
      {doc.type === 'conic' ? (
        <Slider
          label="Start angle"
          min={0}
          max={360}
          value={doc.conicAngle}
          onChange={(conicAngle) => patch({ conicAngle })}
          display={`${doc.conicAngle}°`}
        />
      ) : null}
      {doc.type !== 'freeform' ? (
        <SegmentedControl
          label="Interpolation"
          value={doc.interpolation}
          onChange={(interpolation) =>
            patch({ interpolation: interpolation as Interpolation })
          }
          options={[
            { value: 'oklab', label: 'OKLab' },
            { value: 'srgb', label: 'sRGB' },
          ]}
        />
      ) : (
        <p className="text-sm text-mute">
          Freeform has no clean CSS export. Use SVG or PNG.
        </p>
      )}

      {doc.type === 'freeform' ? (
        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-ink">Color points</h2>
            <Button onClick={addPoint} disabled={doc.points.length >= MAX_MESH_POINTS}>
              Add point
            </Button>
          </div>
          {doc.points.map((point, index) => (
            <div key={point.id} className="grid gap-3 border-t border-line pt-3">
              <ColorInput
                label={`Point ${index + 1}`}
                hex={point.hex}
                alpha={point.alpha}
                onChange={(hex, alpha) => updatePoint(point.id, { hex, alpha })}
              />
              <Slider
                label="X"
                min={0}
                max={1}
                step={0.01}
                value={point.x}
                onChange={(x) => updatePoint(point.id, { x })}
                display={`${Math.round(point.x * 100)}%`}
              />
              <Slider
                label="Y"
                min={0}
                max={1}
                step={0.01}
                value={point.y}
                onChange={(y) => updatePoint(point.id, { y })}
                display={`${Math.round(point.y * 100)}%`}
              />
              <Slider
                label="Influence"
                min={0.1}
                max={1}
                step={0.01}
                value={point.radius}
                onChange={(radius) => updatePoint(point.id, { radius })}
              />
              <Button
                onClick={() => removePoint(point.id)}
                disabled={doc.points.length <= MIN_MESH_POINTS}
              >
                Remove point
              </Button>
            </div>
          ))}
        </section>
      ) : (
        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-ink">Color stops</h2>
            <Button onClick={addStop}>Add stop</Button>
          </div>
          {doc.stops.map((stop, index) => (
            <div key={stop.id} className="grid gap-3 border-t border-line pt-3">
              <ColorInput
                label={`Stop ${index + 1}`}
                hex={stop.hex}
                alpha={stop.alpha}
                onChange={(hex, alpha) => updateStop(stop.id, { hex, alpha })}
              />
              <Slider
                label="Position"
                min={0}
                max={100}
                value={stop.position}
                onChange={(position) => updateStop(stop.id, { position })}
                display={`${Math.round(stop.position)}%`}
              />
              <div className="flex gap-2">
                <Button onClick={() => duplicateStop(stop.id)}>Duplicate</Button>
                <Button
                  onClick={() => removeStop(stop.id)}
                  disabled={doc.stops.length <= 2}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}

      <SelectField
        id="aspect"
        label="Aspect ratio"
        value={doc.aspect}
        onChange={(event) => setAspect(event.target.value as AspectId)}
      >
        {ASPECT_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </SelectField>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="width"
          label="Width"
          inputMode="numeric"
          value={doc.width}
          onChange={(event) => patch({ width: Number(event.target.value) || 1, aspect: 'custom' })}
        />
        <TextField
          id="height"
          label="Height"
          inputMode="numeric"
          value={doc.height}
          onChange={(event) => patch({ height: Number(event.target.value) || 1, aspect: 'custom' })}
        />
      </div>
      <SegmentedControl
        label="Scale"
        value={String(doc.scale)}
        onChange={(value) => patch({ scale: Number(value) as 1 | 2 | 3 })}
        options={[
          { value: '1', label: '1x' },
          { value: '2', label: '2x' },
          { value: '3', label: '3x' },
        ]}
      />
      <SegmentedControl
        label="Canvas background"
        value={doc.canvasBackground}
        onChange={(canvasBackground) =>
          patch({ canvasBackground: canvasBackground as 'transparent' | 'solid' })
        }
        options={[
          { value: 'transparent', label: 'Transparent' },
          { value: 'solid', label: 'Solid' },
        ]}
      />
      {doc.canvasBackground === 'solid' ? (
        <TextField
          id="solid-color"
          label="Background color"
          value={doc.solidColor}
          onChange={(event) => patch({ solidColor: event.target.value })}
        />
      ) : null}
      <label className="flex min-h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={doc.showGrid}
          onChange={(event) => patch({ showGrid: event.target.checked })}
        />
        Show checkerboard
      </label>
    </div>
  )
}
