import { App } from '@/pages/content/App'
import { ShopButton } from '@/pages/content/ShopButton'
import { Message } from '@/types'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  MessageResponse,
  RootPrefix,
  createAndMountRootStyles,
  getPageType,
  getRoot,
  removeRootAndStyles,
} from './content-actions'

export function createAndMountRoot(app: RootPrefix): void {
  const extension = getRoot()
  if (document.getElementById(extension.rootElementId) === null) {
    const root = document.createElement('div')
    root.id = extension.rootElementId
    document.body.append(root)

    createRoot(root).render(
      <StrictMode>
        {app === RootPrefix.BUTTON ? <ShopButton /> : <App />}
      </StrictMode>,
    )
  }
}

// =================APP===================
export function createAndMount(app: RootPrefix): void {
  setTimeout(function () {
    createAndMountRoot(app)
  })
  createAndMountRootStyles()
}

export function toggle(): void {
  // remove the current mount and current stylesheet,
  const oldRoot = getRoot()
  removeRootAndStyles(oldRoot.rootElementId, oldRoot.rootStylesheetId)

  window.showPanel ? hide() : show()
}

function hide() {
  window.showPanel = false
  createAndMount(RootPrefix.BUTTON)
}

function show() {
  window.showPanel = true
  createAndMount(RootPrefix.PANEL)
}

const messagesFromReactAppListener = (
  message: Message,
  _sender: chrome.runtime.MessageSender, // currently unused. rename to `sender` to use
  response: MessageResponse,
): void => {
  if (message.action === 'event:window-loaded') {
    window.pageType = getPageType(window.storeUrl)
    window.tabUrl = message.value
  }

  if (message.action === 'panel:toggle') {
    window.storeUrl = message.value
    toggle()
  }

  if (message.action === 'panel:hide') {
    window.showPanel = false
    window.storeUrl = message.value

    setTimeout(function () {
      createAndMount(RootPrefix.BUTTON)
    })
  }

  response()
}

;(function init(): void {
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
  window.toggleDisplay = toggle
})()
