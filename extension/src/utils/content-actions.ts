import { Message } from '@/types'
import { Result } from '@/utils/error'

const name = chrome.runtime.getManifest().name ?? 'bedframe'
export const extension = {
  name,
  rootElementId: `__${name}__extension-root__`,
  rootStylesheetId: `__${name}__extension-root-stylesheet__`,
  panelId: '__panel',
} as const

// =============MESSAGE PASSING===========
export type MessageResponse = (response?: unknown) => void

export const sendContentMessage = <T>(
  message: Message,
): Promise<Result<T, Error>> => {
  return chrome.runtime.sendMessage(message)
}

export function injectStyles(doc: Document, styles: string, id: string) {
  if (doc && !doc?.getElementById(id)) {
    const stylesheet = doc.createElement('style')
    stylesheet.id = id
    stylesheet.textContent = styles

    doc.head.appendChild(stylesheet)
  }
}

export function injectShadowStyles(host: ShadowRoot, styles: string) {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(styles)

  host.adoptedStyleSheets = [sheet]
}

export function getShadowRootPanel() {
  const host = document.getElementById(extension.rootElementId)
  return host?.shadowRoot?.querySelector(`#${extension.panelId}`) as HTMLElement
}
export function getShadowRoot() {
  return document.getElementById(extension.rootElementId)?.shadowRoot
}
