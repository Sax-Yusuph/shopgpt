import { ColorModeProvider } from '@/components/color-mode/provider'
import { injectStyles } from '@/lib/content-actions'
import { updateStatus } from '@/lib/state'
import App from '@/pages/app'
import rootStyles from '@/styles/min/reset.min.css?inline'
import styles from '@/styles/min/style.min.css?inline'
import { Message } from '@/types'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Frame, { FrameContextConsumer } from 'react-frame-component'

const name = chrome.runtime.getManifest().name ?? 'bedframe'
export const extension = {
  name,
  rootElementId: `__${name}__extension-root__`,
  rootStylesheetId: `__${name}__extension-root-stylesheet__`,
} as const

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

  //inject a global css reset style in client scope
  injectStyles(document, rootStyles, extension.rootStylesheetId)
}

export function createAndMountRoot(): void {
  const rootId = extension.rootElementId

  if (document.getElementById(rootId) === null) {
    const root = document.createElement('div')
    root.id = rootId
    document.body.append(root)

    createRoot(root).render(
      <StrictMode>
        <Frame>
          <FrameContextConsumer>
            {({ document: doc }) => {
              //inject app css styles style in iframe scope
              doc && injectStyles(doc, styles, extension.rootStylesheetId)

              return (
                <ColorModeProvider>
                  <App />
                </ColorModeProvider>
              )
            }}
          </FrameContextConsumer>
        </Frame>
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
    updateStatus(message.params?.status)
    response()
  }
}

;(function init(): void {
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)

  window.shopaiActions = {
    ...window.shopaiActions,
  }
})()
