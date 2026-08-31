import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { App } from '@/app/App'
import { Providers } from '@/app/providers'
import '@/styles/index.css'

registerSW({ immediate: true })

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </Providers>
  </StrictMode>,
)
