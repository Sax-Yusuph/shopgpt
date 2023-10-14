import { DotsLoading } from '@/components/Loading/Dots'
import { getCompletionMessages } from '@/lib/completions'
import { MessageRole } from '@/lib/constants'
import { sendContentMessage } from '@/lib/content-actions'
import { ERR, safe } from '@/lib/error'
import { logger } from '@/lib/logger'
import { GetMatchesResult } from '@/lib/match-embeddings'
import { Plus } from '@medusajs/icons'
import { Button, Drawer, IconButton, Input, Tooltip } from '@medusajs/ui'
import { Message } from 'ai'
import { UseChatHelpers } from 'ai/react'
import { useCallback } from 'react'

interface Props
  extends Pick<
    UseChatHelpers,
    'isLoading' | 'messages' | 'input' | 'setInput' | 'append' | 'setMessages'
  > {
  id: string
  onSubmit(): void
}

export default function InputForm(props: Props) {
  const {
    append,
    setMessages,
    setInput,
    input,
    id,
    messages,
    onSubmit,
    isLoading,
  } = props

  const submitMessage = useCallback(
    async (value: string) => {
      const result = await sendContentMessage<GetMatchesResult>({
        action: 'chat:match-embedding',
        value: input,
        params: window.shopai,
      })

      if (result.kind === ERR) {
        return logger(result.error.message)
      }

      const completions = await safe<Message[]>(
        getCompletionMessages({
          id,
          contextText: result.value.productContexts,
          currentProductOnPage: result.value.currentProductOnPage,
          storeUrl: window.shopai.storeUrl,
          pageType: window.shopai.pageType,
          messages: [
            ...messages,
            {
              id,
              role: MessageRole.User,
              content: value,
            },
          ],
        }),
      )

      if (completions.kind === ERR) {
        return logger(completions.error.message)
      }

      logger({
        contextText: result.value.productContexts,
        completions,
      })
      await append(
        { id, content: value, role: 'user' },
        { options: { body: { completions: completions.value } } },
      )
    },

    [id, input, messages, append],
  )

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        const value = input?.trim()
        if (value) {
          setInput('')
          onSubmit()
          await submitMessage(value)
        }
      }}
    >
      <Drawer.Footer className="overflow-hidden border-solid">
        <Tooltip content="New chat" className="z-50">
          <IconButton onClick={() => setMessages([])} type="button">
            <Plus />
          </IconButton>
        </Tooltip>
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </div>

        <Button
          disabled={!input || isLoading}
          type="submit"
          variant="secondary"
          size="large"
        >
          {isLoading ? <DotsLoading /> : 'Submit'}
        </Button>
      </Drawer.Footer>
    </form>
  )
}
