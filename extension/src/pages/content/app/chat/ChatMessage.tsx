import { Copy } from '@/ui/copy'
import { Markdown } from '@/ui/markdown'
import { MarkdownComponents } from '@/ui/markdown/components'
import { Component, User } from '@medusajs/icons'
import { Button, Container, IconBadge, Text, clx } from '@medusajs/ui'
import { Message } from 'ai/react'
import { memo } from 'react'
import gfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  const content = getContent(message)

  return (
    <div
      className={clx(
        'mb-2 py-3 group relative flex gap-3 px-6 overflow-x-hidden',
        message.role === 'user' ? 'bg-ui-bg-component' : '',
      )}
    >
      <div>
        <IconBadge>
          {message.role === 'user' ? <User /> : <Component />}
        </IconBadge>
      </div>

      {typeof content === 'string' ? (
        <Markdown
          className="cursor-default"
          remarkPlugins={[gfm]}
          components={MarkdownComponents}
        >
          {message.content}
        </Markdown>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {content.products.map(({ title, product, image }) => {
            return (
              <Container key={title} className="p-3 max-w-lg">
                <div className="aspect-square bg-ui-bg-component rounded-md overflow-hidden">
                  <img
                    src={image}
                    className={
                      'animate-in fade-in-75 w-full h-full object-cover'
                    }
                  />
                </div>
                <Text weight={'plus'}>{title}</Text>

                <Button asChild className="w-full mt-2">
                  <a href={product}>Buy now</a>
                </Button>
              </Container>
            )
          })}
        </div>
      )}

      <Copy
        className={clx(
          'absolute right-5 -top-1 opacity-0 group-hover:opacity-100',
          'animate-in fade-in-70 border bg-ui-bg-subtle p-1 rounded-lg',
        )}
        content={message.content}
      />
    </div>
  )
})

type Args = {
  products: {
    title: string
    image: string
    product: string
    description: string
    recommendation: string
  }[]
}

const getContent = (message: Message) => {
  try {
    return JSON.parse(message.content) as Args
  } catch (error) {
    return message.content
  }
}
