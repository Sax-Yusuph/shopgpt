import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { nanoid } from 'ai'
import {
    canActivate,
    isComplete
} from '../../utils/background-actions'
import { onTabChanged } from './onTabChange'

chrome.runtime.onInstalled.addListener(async (details) => {
  logger('[background.ts] > onInstalled', details)

  if (!(await storage.get('browserId'))) {
    const browserId = nanoid()
    storage.set('browserId', browserId)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  const storeUrl = await canActivate(tab)

  if (storeUrl) {
    chrome.tabs.sendMessage(tab.id ?? 0, {
      action: 'toggle',
    })
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, { status }, tab) => {
  if (isComplete(status)) {
    onTabChanged(tabId, tab)
  }
})

// chrome.runtime.onMessage.addListener(function (
//   request: Message,
//   _sender,
//   response,
// ) {
//   try {
//     assert(request.params?.tabUrl, 'invalid Tab url')
//     assert(request.params.storeUrl, 'Store url not found')
//     assert(request.value, 'Incorrect parameters, value is undefined')
//   } catch (error) {
//     return logger(error)
//   }
// })
