import { DotsLoading } from '@/ui/Loading/Dots'
import { Tooltip } from '@/ui/copy/tooltip'
import { API } from '@/utils/api'
import { updateProducts } from '@/utils/state'
import { storage } from '@/utils/storage'
import { Plus } from '@medusajs/icons'
import { Button, Drawer, IconButton, Input } from '@medusajs/ui'
import { UseChatHelpers } from 'ai/react'
import { useCallback } from 'react'

interface Props
  extends Pick<
    UseChatHelpers,
    'isLoading' | 'input' | 'setInput' | 'append' | 'setMessages'
  > {
  onSubmit(): void
}

export default function InputForm(props: Props) {
  const { append, setMessages, setInput, input, onSubmit, isLoading } = props

  const submitMessage = useCallback(
    async (value: string) => {
      const browserId = await storage.get<string>('browserId')
      const instructions = await storage.get<string>('instructions')

      await append(
        { content: value, role: 'user' },
        {
          options: {
            body: {
              store: window.shopai.storeUrl,
              instructions,
              userId: browserId,
            },
          },
        },
      )
    },

    [append],
  )

  const onClear = async () => {
    setMessages([])
    updateProducts([])

    const browserId = await storage.get<string>('browserId')
    if (browserId) {
      await API.clearContextHistory(browserId, window.shopai.storeUrl)
    }
  }

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
      <Drawer.Footer className="overflow-hidden border-solid space-x-4">
        <Tooltip content="New chat" className="z-50">
          <IconButton onClick={onClear} type="button">
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
