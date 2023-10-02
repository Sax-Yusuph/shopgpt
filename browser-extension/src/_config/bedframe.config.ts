import { createBedframe } from '@bedframe/core'
import { manifests } from '../manifests'

export const bedframeConfig = createBedframe({
  browser: manifests.map((target) => target.browser),
  extension: {
    type: 'overlay',
    position: 'right',
    
    options: 'embedded',
    manifest: manifests,
    pages: {
    },    
  },
  development: {
    template: {
      config: {
        framework: 'react',
        language: 'typescript',
        packageManager: 'pnpm',
        style: {
          framework: 'styled components',
          
          fonts: [
            {
              name: 'Inter',
              local: 'Inter',
              src: './assets/fonts/inter/*.ttf',
              weights: {
                'Inter-Regular': 400,
                'Inter-SemiBold': 600,
                'Inter-Bold': 700,
                'Inter-ExtraBold': 800,
              },
            },
          ],
        },
        lintFormat: true,
        tests: {
          globals: true,
          setupFiles: ['./_config/tests.config.ts'],
          environment: 'jsdom',
          coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
          },
          watch: false,
        },        
        git: true,
        gitHooks: true,
        commitLint: true,
        changesets: true,
      },
    },
  },
})
/**
 *
 * E X P O R T
 * H E L P E R S
 *
 * you can import and destructure these in vite.config.ts
 * directly from the bedframeConfig object.
 * this feels cleaner, si o no?
 *
 */

export const { manifest, pages } = bedframeConfig.extension
export const {
  style: { fonts },
  tests,
} = bedframeConfig.development.template.config




