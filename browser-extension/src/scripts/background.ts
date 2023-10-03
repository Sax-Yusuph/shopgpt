import { Message } from '@/types'
import Pipeline from '@/utils/embeddings/pipeline'
import { safe } from '@/utils/error'
import { getMatches } from '@/utils/getMatches'
import { indexStore } from '@/utils/indexStore'
import { logger } from '@/utils/logger'
import { parseUrl } from '@/utils/parse'
import {
  canActivate,
  getPageType,
  isComplete,
  sendMessage,
} from './background-actions'

chrome.runtime.onInstalled.addListener(async function (details): Promise<void> {
  logger('[background.ts] > onInstalled', details)

  // load our models down for future useage
  await Pipeline.getInstance((progress) => {
    if (progress.status === 'ready') {
      logger('model is ready to be used')
    }
  })
})

chrome.action.onClicked.addListener(async function (tab: chrome.tabs.Tab) {
  const storeUrl = await canActivate(tab)

  if (storeUrl) {
    chrome.tabs.sendMessage(tab.id ?? 0, {
      action: 'panel:toggle',
    })
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, info, Tab) => {
  if (!isComplete(info.status)) {
    return undefined
  }

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
    action: 'event:window-loaded',
    params: {
      isShopify: true,
      showPanel: false,
      storeUrl,
      pageType: getPageType(Tab.url),
      tabUrl: Tab.url,
    },
  } as Message)
})

chrome.runtime.onMessage.addListener(function (
  request: Message,
  _sender,
  response,
) {
  if (request.action === 'chat:match-embedding' && request.value) {
    if (request.params?.tabUrl && request.params.storeUrl) {
      const { tabUrl, storeUrl } = request.params
      const pageType = getPageType(tabUrl)
      safe(
        getMatches({
          userMessage: request.value,
          pageType,
          tabUrl,
          store: storeUrl,
        }),
      ).then(response)
    }

    return true
  }
})
