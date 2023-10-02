import { Message } from '@/types'
import Pipeline from '@/utils/embeddings/pipeline'
import { safe } from '@/utils/error'
import { getMatches } from '@/utils/getMatches'
import { indexStore } from '@/utils/indexStore'
import { canActivate, isComplete, sendMessage } from './background-actions'

chrome.runtime.onInstalled.addListener(async function (details): Promise<void> {
  console.log('[background.ts] > onInstalled', details)

  // load our models down for future useage
  await Pipeline.getInstance((progress) => {
    if (progress.status === 'ready') {
      console.log('model is ready to be used')
    }
  })
})

chrome.action.onClicked.addListener(async function (tab: chrome.tabs.Tab) {
  const storeUrl = await canActivate(tab)

  if (storeUrl) {
    chrome.tabs.sendMessage(tab.id ?? 0, {
      action: 'panel:toggle',
    } as Message)
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, info, Tab) => {
  if (!isComplete(info.status)) {
    return undefined
  }

  const storeUrl = await canActivate(Tab)

  if (!storeUrl) {
    return
  }

  console.log('FOUND SHOPIFY STORE ', storeUrl)

  //auto save porducts to db
  indexStore(storeUrl)

  sendMessage(tabId, {
    action: 'panel:hide',
    value: storeUrl,
  })

  sendMessage(tabId, {
    action: 'event:window-loaded',
    value: Tab.url,
  })
})

chrome.runtime.onMessage.addListener(function (
  request: Message,
  _sender,
  response,
) {
  if (request.action === 'chat:match-embedding' && request.value) {
    safe(getMatches(request.value, request.params?.storeUrl)).then(response)

    return true
  }
})
