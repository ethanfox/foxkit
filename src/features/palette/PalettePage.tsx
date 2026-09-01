import { useEffect, useState } from 'react'
import { ExportBar } from '@/components/export/ExportBar'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toast'
import { Workspace } from '@/components/workspace/Workspace'
import { copyText, downloadText, sanitizeFilename } from '@/lib/download'
import { paletteCss, paletteHexList, paletteJson } from './extract'
import { PaletteInspector } from './PaletteInspector'
import { PaletteNav } from './PaletteNav'
import { PalettePreview } from './PalettePreview'
import { usePaletteStore } from './store'

export function PalettePage() {
  const name = usePaletteStore((state) => state.name)
  const colors = usePaletteStore((state) => state.colors)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    return () => {
      usePaletteStore.getState().clear()
    }
  }, [])

  const copyHex = async () => {
    if (colors.length === 0) return
    try {
      await copyText(paletteHexList(colors))
      toast('HEX copied')
    } catch {
      toast('Could not copy')
    }
  }

  const copyCss = async () => {
    if (colors.length === 0) return
    try {
      await copyText(paletteCss(colors))
      toast('CSS copied')
    } catch {
      toast('Could not copy')
    }
  }

  const download = () => {
    if (colors.length === 0) return
    downloadText(
      paletteJson(name, colors),
      `${sanitizeFilename(name, 'foxkit-palette')}.json`,
    )
    toast('JSON downloaded')
  }

  return (
    <>
      <Workspace
        nav={<PaletteNav />}
        preview={<PalettePreview />}
        inspector={<PaletteInspector />}
        exportBar={
          <ExportBar
            onCopy={() => setMenu(true)}
            copyLabel="Copy / export"
            onDownload={download}
            downloadLabel="Download JSON"
            disabled={colors.length === 0}
          >
            {colors.length === 0
              ? 'No palette yet'
              : `${colors.length} colors · local`}
          </ExportBar>
        }
      />
      <Dialog open={menu} title="Export" onClose={() => setMenu(false)}>
        <div className="grid gap-3">
          <button
            type="button"
            className="min-h-10 rounded-[var(--radius-control)] bg-raised text-sm"
            onClick={() => void copyHex()}
          >
            Copy HEX
          </button>
          <button
            type="button"
            className="min-h-10 rounded-[var(--radius-control)] bg-raised text-sm"
            onClick={() => void copyCss()}
          >
            Copy CSS variables
          </button>
          <button
            type="button"
            className="min-h-10 rounded-[var(--radius-control)] bg-ink text-sm text-black"
            onClick={download}
          >
            Download JSON
          </button>
        </div>
      </Dialog>
    </>
  )
}
