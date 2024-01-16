import appStyles from '@/styles/style.css?inline'
import { Message } from '@/types'
import { ColorModeProvider } from '@/ui/color-mode/provider'
import { extension, injectShadowStyles } from '@/utils/content-actions'
import { updateInitProgress, updateStatus } from '@/utils/state'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AiPanel from './app'

export function toggle(): void {
  document.getElementById(extension.rootElementId) === null
    ? setTimeout(function () {
        createAndMount()
      })
    : setTimeout(function () {
        //remove root and rootSTyles
        document.getElementById(extension.rootElementId)?.remove()
        document.getElementById(extension.rootStylesheetId)?.remove()
      })
}

// =================APP===================
export function createAndMount(): void {
  setTimeout(function () {
    createAndMountRoot()
  })
}

export function createAndMountRoot(): void {
  const rootId = extension.rootElementId

  if (document.getElementById(rootId) === null) {
    const root = document.createElement('div')
    root.id = rootId
    root.dir = 'ltr'
    // create a dummy element to overid some styles
    const span = document.createElement('span')
    root.appendChild(span)

    // attach shadow DOM to container
    const shadowRoot = root.attachShadow({ mode: 'open' })
    injectShadowStyles(
      shadowRoot,
      appStyles.replace(/:root|html|body/g, ':host'),
    )

    document.body.append(root)

    createRoot(shadowRoot).render(
      <StrictMode>
        <ColorModeProvider>
          <AiPanel />
        </ColorModeProvider>
      </StrictMode>,
    )
  }
}

// =============MESSAGE PASSING===========
export type MessageResponse = (response?: unknown) => void

const messagesFromReactAppListener = (
  message: Message,
  _sender: chrome.runtime.MessageSender, // currently unused. rename to `sender` to use
  response: MessageResponse,
): boolean | void => {
  window.shopai = { ...window.shopai, ...message.params }

  // toggle panels
  if (message.action === 'toggle') {
    toggle()
    response()
  }

  // toggle panels
  if (message.action === 'install') {
    createAndMount()
    response()
  }

  // notify when loading store products
  if (message.action === 'event:indexing-product-items') {
    // if (message.params?.status === 'error') {
    //   toggle()
    // }

    updateStatus(message.params?.status)
    updateInitProgress(message.params?.loadProgress)
    response()
  }
}

;(function init(): void {
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)

  window.shopaiActions = {
    ...window.shopaiActions,
  }
})()
