import { Layout } from '@/components/ui'
import { GlobalStyles } from '@/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'unfonts.css'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>Extension Options</p>
      </div>
    </Layout>
    <GlobalStyles />
  </StrictMode>,
)
