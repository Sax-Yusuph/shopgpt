import { Message, Shopify } from '@/types'

export const sendMessage = (tabId: number, message: Message) => {
  return setTimeout(function () {
    chrome.tabs.sendMessage(tabId, message)
  }, 200)
}

function isShopify() {
  return window.Shopify
}

export async function detectShopifyStore(tabId: number, url: string) {
  if (!url || WHITELISTS.some((w_url) => url.includes(w_url))) {
    return false
  }

  const [data] = await chrome.scripting.executeScript<Shopify[], Shopify>({
    target: { tabId },
    func: isShopify,
    world: 'MAIN',
  })

  return data.result?.shop
}

const WHITELISTS = ['chrome://']

export function isComplete(status = '') {
  return status === 'complete'
}

const isErrorConnection = (tab: chrome.tabs.Tab) => {
  const regex = new RegExp(
    /"Could not establish connection. Receiving end does not exist" only on Firefox for Android - Add-ons \/ Development - Mozilla Discourse/,
  )
  return regex.test(tab.title ?? '')
}

export async function canActivate(Tab: chrome.tabs.Tab) {
  if (isErrorConnection(Tab)) {
    console.warn('error activate tabe, ')
    return undefined
  }

  return await detectShopifyStore(Tab.id ?? 0, Tab.url ?? '')
}

export async function canUpdate() {
  const contentScripts = chrome.runtime.getManifest().content_scripts
  // this hack prevents the Error: Could not establish connection. Receiving end does not exist.
  if (contentScripts) {
    for (const cs of contentScripts) {
      for (const tab of await chrome.tabs.query({ url: cs.matches })) {
        const isShopify = await detectShopifyStore(tab.id ?? 0, tab.url ?? '')

        if (isShopify) {
          console.log('update scripts for shopify store ', tab.url)
          chrome.scripting.executeScript({
            target: { tabId: tab.id ?? 0 },
            files: cs.js || [],
          })
        }
      }
    }
  }
}
