import { createManifestBase } from '@bedframe/core'
import pkg from '../../package.json'

export default createManifestBase({
  // Required
  // - - - - - - - - -
  name: pkg.name,
  version: pkg.version,
  manifest_version: 3,

  // Recommended
  // - - - - - - - - -
  description: pkg.description,
  icons: {
    16: 'assets/icons/icon-16x16.png',
    32: 'assets/icons/icon-32x32.png',
    48: 'assets/icons/icon-48x48.png',
    128: 'assets/icons/icon-128x128.png',
  },
  action: {
    default_icon: {
      16: 'assets/icons/icon-16x16.png',
      32: 'assets/icons/icon-32x32.png',
      48: 'assets/icons/icon-48x48.png',
      128: 'assets/icons/icon-128x128.png',
    },
    default_title: pkg.name,
  },

  // Optional
  // - - - - - - - - -
  author: pkg.author.email,
  background: {
    service_worker: 'pages/background/index.ts',
    type: 'module',
  },

  options_ui: {
    page: 'pages/options/index.html',
    open_in_tab: false,
  },

  content_scripts: [
    {
      js: ['pages/content/index.tsx'],
      matches: ['<all_urls>'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/icons/*.png', 'assets/fonts/inter/*.ttf'],
      matches: ['<all_urls>'],
    },
  ],
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+1',
        mac: 'Ctrl+Shift+1',
        linux: 'Ctrl+Shift+1',
        windows: 'Ctrl+Shift+1',
        chromeos: 'Ctrl+Shift+1',
      },
    },
  },
  permissions: [
    'activeTab',
    'storage',
    'scripting',
    'activeTab',
    'management',
    'webRequest',
  ],
  host_permissions: ['https://*/*', 'http://127.0.0.1:8787/*'],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
  },
})
