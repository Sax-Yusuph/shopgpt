import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import styled from 'styled-components'
import { MemoizedReactMarkdown } from './Markdown'
import BlurImage from './image'
export interface ChatList {
  messages: Message[]
}

const Separator = styled.div``
const Wrapper = styled.div`
  /* pb-[200px] pt-4 md:pt-10 */
`

export const ChatList = ({ messages }: ChatList) => {
  if (!messages.length) {
    return null
  }
  return (
    <Wrapper>
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </Wrapper>
  )
}

export interface ChatMessageProps {
  message: Message
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <MemoizedReactMarkdown
      className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children, node }) {
          const element = node.children[0] as typeof node

          if (element && element.tagName === 'img') {
            const image = element
            const metastring = (image?.properties?.alt as string) || ''
            const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
            const src = image.properties?.src as string

            return (
              <BlurImage
                id={message.id}
                src={src ?? '/placeholder.img'}
                alt={alt}
              />
            )
          }

          return <p className="mb-2 last:mb-0">{children}</p>
        },
        a({ children, node }) {
          if (node.tagName === 'a') {
            const href = (node.properties?.href as string) || ''
            if (href.includes('cdn.shopify') || href.endsWith('.png')) {
              return (
                <BlurImage
                  id={message.id}
                  src={href ?? '/placeholder.img'}
                  alt="product"
                />
              )
            }

            return (
              <a target="_blank" href={href}>
                Buy it here
              </a>
            )
          }

          return <div className="mb-2 last:mb-0">{children}</div>
        },

        img({ node }) {
          if (node.tagName === 'img') {
            const metastring = (node.properties?.alt as string) || ''
            const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
            const src = node.properties?.src as string
            // const caption = node.properties?.alt as string

            return (
              <BlurImage
                id={message.id}
                src={src ?? '/placeholder.img'}
                alt={alt}
              />
            )
          }
        },
      }}
    >
      {message.content}
    </MemoizedReactMarkdown>
  )
}
