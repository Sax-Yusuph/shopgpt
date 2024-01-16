import '@/styles/style.css'
import { Layout } from '@/ui/Layout'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'unfonts.css'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <Layout>
        <div>
          <p>Extension Options</p>
        </div>
      </Layout>
    </StrictMode>,
  )
}
