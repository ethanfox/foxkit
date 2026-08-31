import { canDecodeType } from '@/lib/browser/formats'
import type { ImageSource } from './types'

export async function readImageFile(file: File): Promise<{
  source: ImageSource
  previewUrl: string
}> {
  if (!canDecodeType(file.type) && !file.name.toLowerCase().endsWith('.svg')) {
    throw new Error('Use PNG, JPEG, WebP, AVIF, or SVG.')
  }
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  const previewUrl = URL.createObjectURL(file)
  const size = await measureImage(previewUrl, isSvg)
  return {
    previewUrl,
    source: {
      name: file.name,
      type: file.type || (isSvg ? 'image/svg+xml' : 'application/octet-stream'),
      size: file.size,
      width: size.width,
      height: size.height,
      isSvg,
    },
  }
}

function measureImage(
  url: string,
  isSvg: boolean,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve({
        width: image.naturalWidth || 1024,
        height: image.naturalHeight || 1024,
      })
    }
    image.onerror = () =>
      reject(new Error(isSvg ? 'Could not read that SVG.' : 'Could not read that image.'))
    image.src = url
  })
}
