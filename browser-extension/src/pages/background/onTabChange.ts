import { Message, ShopAi } from '@/types'
import { API } from '@/utils/api'
import { parseUrl } from '@/utils/formatters'
import { logger } from '@/utils/logger'
import { canActivate, sendMessage } from '../../utils/background-actions'
import { fetchProducts } from './fetchProducts'

export async function onTabChanged(tabId: number, tab: chrome.tabs.Tab) {
  const isShopifyStore = await canActivate(tab)

  if (!isShopifyStore) return
  if (!tab.url) return

  const storeUrl = parseUrl(tab.url)
  sendMessage(tabId, {
    action: 'install',
    params: {
      isShopify: true,
      showPanel: false,
      storeUrl,
      tabUrl: tab.url,
    },
  } as Message)

  try {
    if (await API.checkStoreExists(storeUrl)) {
      return logger('store cached already!')
    }

    notify(tabId, { status: 'loading' })

    const products = await fetchProducts(storeUrl)

    notify(tabId, { status: 'indexing', noOfProducts: products.length })

    await API.embedStore(storeUrl, products)
    logger('done scrapping')
    notify(tabId, { status: 'ready' })
  } catch (error) {
    logger('ontabChange.ts', error)
    notify(tabId, { status: 'error' })
  }
}

function notify(tabId: number, params?: Partial<ShopAi>) {
  sendMessage(tabId, {
    action: 'event:indexing-product-items',
    params,
  } as Message)
}
