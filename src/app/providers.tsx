import { useEffect, type ReactNode } from 'react'
import { ToastViewport } from '@/components/ui/Toast'
import { bindInstallListeners } from '@/lib/browser/install'
import { bindOfflineListeners } from '@/lib/browser/offline'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    bindOfflineListeners()
    bindInstallListeners()
  }, [])

  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}
