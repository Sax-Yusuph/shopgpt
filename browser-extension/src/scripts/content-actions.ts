import { Message } from '@/types'
import { Result } from '@/utils/error'

const name = chrome.runtime.getManifest().name ?? 'bedframe'
export enum RootPrefix {
  PANEL = 'panel__',
  BUTTON = 'button__',
}

export const extension = {
  name,
  rootElementId: `__${name}__extension-root__`,
  rootStylesheetId: `__${name}__extension-root-stylesheet__`,
  prefix: RootPrefix.BUTTON,
} as const

export function getRoot() {
  const prefix = window.showPanel ? RootPrefix.PANEL : RootPrefix.BUTTON

  return {
    name: extension.name,
    rootElementId: extension.rootElementId + prefix,
    rootStylesheetId: extension.rootStylesheetId + prefix,
    prefix,
  } as const
}

export function removeRootAndStyles(
  root: string,
  rootStylesheet: string,
): void {
  document.getElementById(root)?.remove()
  document.getElementById(rootStylesheet)?.remove()
}

export function createAndMountRootStyles(): void {
  const extension = getRoot()

  if (document.getElementById(extension.rootStylesheetId) === null) {
    const rootStyleTextContent = `
      #${extension.rootElementId} {
        display: flex;
        align-items: center;
        justify-content: end;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        z-index: 1000000120;
        box-sizing: border-box;
        ${
          extension.prefix === RootPrefix.PANEL
            ? `
        background-color: rgba(0,0,0,50%);
        align-items: center;
        justify-content: center;
        `
            : `
        pointer-events: none;
        `
        }
      }
    `
    // The Overlay div
    // We'll position the iframe w/ our content inside this guy
    const rootStyle = document.createElement('style')
    rootStyle.id = extension.rootStylesheetId
    rootStyle.textContent = rootStyleTextContent
    document.head.append(rootStyle)
  }
}

// =============MESSAGE PASSING===========
export type MessageResponse = (response?: unknown) => void

export const sendContentMessage = <T>(
  message: Message,
): Promise<Result<T, Error>> => {
  return chrome.runtime.sendMessage(message)
}

export const getPageType = (url = '') => {
  const productRegex = /\/products\/[A-Za-z]/
  const collectionRegex = /\/collection\/[A-Za-z]/
  return productRegex.test(url)
    ? 'product'
    : collectionRegex.test(url)
    ? 'collection'
    : 'general'
}
