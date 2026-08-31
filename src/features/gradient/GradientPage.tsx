import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ExportBar } from '@/components/export/ExportBar'
import { Dialog } from '@/components/ui/Dialog'
import { SelectField } from '@/components/ui/SelectField'
import { toast } from '@/components/ui/Toast'
import { Workspace } from '@/components/workspace/Workspace'
import { copyText, downloadBlob, downloadText, sanitizeFilename } from '@/lib/download'
import { saveGradient } from '@/lib/storage/db'
import { cssBackgroundDeclaration, cssCustomProperties } from './css'
import { GradientCanvas } from './GradientCanvas'
import { GradientInspector } from './GradientInspector'
import { GradientNav } from './GradientNav'
import { exportGradientPng, gradientSvgMarkup } from './render'
import { readShareFromLocation, shareSearchParam } from './share'
import { useGradientStore } from './store'

export function GradientPage() {
  const doc = useGradientStore((state) => state.doc)
  const setDoc = useGradientStore((state) => state.setDoc)
  const location = useLocation()
  const [menu, setMenu] = useState(false)
  const [format, setFormat] = useState<'png' | 'svg' | 'jpeg'>('png')

  useEffect(() => {
    const shared = readShareFromLocation(location.search, location.hash)
    if (shared) setDoc(shared)
  }, [location.hash, location.search, setDoc])

  useEffect(() => {
    const param = shareSearchParam(doc)
    const url = `${window.location.pathname}?${param}`
    window.history.replaceState(null, '', url)
  }, [doc])

  const width = doc.width * doc.scale
  const height = doc.height * doc.scale
  const css = cssBackgroundDeclaration(doc)
  const filename = sanitizeFilename(doc.name, 'foxkit-gradient')

  const copyCss = async () => {
    if (!css) {
      toast('Freeform has no CSS export. Download SVG or PNG.')
      return
    }
    await copyText(`${css}\n${cssCustomProperties(doc)}`)
    toast('CSS copied')
  }

  const download = async () => {
    if (format === 'svg') {
      downloadText(
        gradientSvgMarkup(doc, width, height),
        `${filename}.svg`,
        'image/svg+xml',
      )
      toast('SVG downloaded')
      return
    }
    const blob = await exportGradientPng(
      doc,
      width,
      height,
      format === 'jpeg' ? 'image/jpeg' : 'image/png',
    )
    downloadBlob(blob, `${filename}.${format === 'jpeg' ? 'jpg' : 'png'}`)
    toast(`${format.toUpperCase()} downloaded`)
  }

  const copyShare = async () => {
    await copyText(window.location.href)
    toast('Share link copied')
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      if (event.key === 'c' && (event.metaKey || event.ctrlKey)) return
      if (event.key === 'c') void copyCss()
      if (event.key === 's') {
        event.preventDefault()
        void saveGradient(useGradientStore.getState().doc).then(() =>
          toast('Saved on this device'),
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doc])

  return (
    <>
      <Workspace
        nav={<GradientNav />}
        preview={<GradientCanvas />}
        inspector={<GradientInspector />}
        exportBar={
          <ExportBar
            onCopy={() => setMenu(true)}
            copyLabel="Copy / share"
            onDownload={() => void download()}
            downloadLabel="Download"
          >
            {width}×{height}
            {css ? '' : ' · SVG/PNG only'}
          </ExportBar>
        }
      />
      <Dialog open={menu} title="Export" onClose={() => setMenu(false)}>
        <div className="grid gap-4">
          <SelectField
            id="download-format"
            label="Download format"
            value={format}
            onChange={(event) => setFormat(event.target.value as typeof format)}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
            <option value="jpeg">JPEG</option>
          </SelectField>
          <button
            type="button"
            className="min-h-10 rounded-[var(--radius-control)] bg-raised text-sm"
            onClick={() => void copyCss()}
            disabled={!css}
          >
            Copy CSS
          </button>
          <button
            type="button"
            className="min-h-10 rounded-[var(--radius-control)] bg-raised text-sm"
            onClick={async () => {
              if (!css) return
              await copyText(gradientSvgMarkup(doc, width, height))
              toast('SVG copied')
            }}
          >
            Copy SVG markup
          </button>
          <button
            type="button"
            className="min-h-10 rounded-[var(--radius-control)] bg-ink text-sm text-black"
            onClick={() => void copyShare()}
          >
            Copy share URL
          </button>
        </div>
      </Dialog>
    </>
  )
}
