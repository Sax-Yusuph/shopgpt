import { Markdown } from '@/components/markdown'
import { MarkdownComponents } from '@/components/markdown/components'
import { Component, User } from '@medusajs/icons'
import { Copy, IconBadge, clx } from '@medusajs/ui'
import { Message } from 'ai/react'
import gfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={clx(
        'mb-2 py-3 group relative flex gap-3 px-6',
        message.role === 'user' ? 'bg-ui-bg-component' : '',
      )}
    >
      <div>
        <IconBadge>
          {message.role === 'user' ? <User /> : <Component />}
        </IconBadge>
      </div>

      <Markdown
        className="cursor-default"
        remarkPlugins={[gfm]}
        components={MarkdownComponents}
      >
        {message.content}
      </Markdown>

      <Copy
        className="absolute right-5 -top-1 opacity-0 group-hover:opacity-100 animate-in fade-in-70 border bg-ui-bg-subtle p-1 rounded-lg"
        content={message.content}
      />
    </div>
  )
}
