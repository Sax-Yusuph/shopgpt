import { App } from '@/pages/content/App'
import { ShopButton } from '@/pages/content/ShopButton'
import { Message } from '@/types'

import { updateStatus } from '@/components/Panel/store'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  MessageResponse,
  RootPrefix,
  createAndMountRootStyles,
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

  window.shopai.showPanel ? hide() : show()
}

function hide() {
  window.shopai.showPanel = false
  createAndMount(RootPrefix.BUTTON)
}

function show() {
  window.shopai.showPanel = true
  createAndMount(RootPrefix.PANEL)
}

const messagesFromReactAppListener = (
  message: Message,
  _sender: chrome.runtime.MessageSender, // currently unused. rename to `sender` to use
  response: MessageResponse,
): void => {
  window.shopai = { ...window.shopai, ...message.params }

  if (message.action === 'event:indexing-product-items') {
    console.log('extension status ', message.params?.status)
    updateStatus(message.params?.status)
  }
  if (message.action === 'event:window-loaded') {
    setTimeout(function () {
      createAndMount(RootPrefix.BUTTON)
    })
  }

  if (message.action === 'panel:toggle') {
    toggle()
  }

  response()
}

;(function init(): void {
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
  window.shopaiActions = {
    ...window.shopaiActions,
    toggleDisplay: toggle,
  }
})()
