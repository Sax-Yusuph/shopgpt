import { createManifest } from '@bedframe/core'
import baseManifest from './base.manifest'

let { permissions } = baseManifest
const { options_ui, ...rest } = baseManifest
  

const optionsUI = {
  page: options_ui.page,
}

permissions = ['activeTab']

export const firefox = createManifest(
  {
    ...rest,
    
    browser_specific_settings: {
      gecko: {
        id: 'bedframe-shopie-extension', // <--- update as necessary
      },
    },
    options_ui: optionsUI,
    permissions,
  },
  'firefox',
)

/*
  N O T E :

  Sidebar Action:
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/sidebar_action
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars#specifying_sidebars
  Browser Specific Settings
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#examples
    - https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id
*/



