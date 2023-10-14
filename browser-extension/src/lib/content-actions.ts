import { Result } from '@/lib/error'
import { Message } from '@/types'

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
