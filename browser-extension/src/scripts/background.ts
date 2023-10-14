import { assert } from '@/lib/assert'
import { safe } from '@/lib/error'
import { logger } from '@/lib/logger'
import { getMatches } from '@/lib/match-embeddings'
import { Message } from '@/types'
import { getPageType, isComplete } from '../lib/background-actions'
import { onExtensionClicked } from './actions/onExtensionClicked'
import { onExtensionInstalled } from './actions/onInstalled'
import { onTabChanged } from './actions/onTabChange'

chrome.runtime.onInstalled.addListener(onExtensionInstalled)

chrome.action.onClicked.addListener(onExtensionClicked)

chrome.tabs.onUpdated.addListener((tabId, { status }, tab) => {
  if (isComplete(status)) {
    onTabChanged(tabId, tab)
  }
})

chrome.runtime.onMessage.addListener(function (
  request: Message,
  _sender,
  response,
) {
  try {
    assert(request.params?.tabUrl, 'invalid Tab url')
    assert(request.params.storeUrl, 'Store url not found')
    assert(request.value, 'Incorrect parameters, value is undefined')
  } catch (error) {
    return logger(error)
  }

  if (request.action === 'chat:match-embedding') {
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

    return true
  }
})
