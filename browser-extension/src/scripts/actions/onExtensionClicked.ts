import { canActivate } from "../../lib/background-actions"

export async function onExtensionClicked(tab: chrome.tabs.Tab) {
  const storeUrl = await canActivate(tab)

  if (storeUrl) {
    chrome.tabs.sendMessage(tab.id ?? 0, {
      action: 'panel:toggle',
    })
  }
}
