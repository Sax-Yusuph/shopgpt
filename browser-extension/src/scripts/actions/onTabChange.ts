import { parseUrl } from '@/lib/formatters'
import { indexStore } from '@/lib/indexStore'
import { Message } from '@/types'
import {
  canActivate,
  getPageType,
  sendMessage,
} from '../../lib/background-actions'

export async function onTabChanged(tabId: number, Tab: chrome.tabs.Tab) {
  const isShopifyStore = await canActivate(Tab)

  if (!isShopifyStore) {
    return
  }

  if (!Tab.url) {
    return
  }

  const storeUrl = parseUrl(Tab.url)

  //auto save products to db
  indexStore(storeUrl, tabId)

  sendMessage(tabId, {
    action: 'install',
    params: {
      isShopify: true,
      showPanel: false,
      storeUrl,
      pageType: getPageType(Tab.url),
      tabUrl: Tab.url,
    },
  } as Message)
}
