import { ChatScrollAnchor } from '@/components/scroll-anchor'
import { ScrollArea } from '@/components/scroll-area/scroll-area'
import { status } from '@/lib/state'
import {
  ArrowPathMini,
  CircleThreeQuartersSolid,
  ClockChangedSolidMini,
} from '@medusajs/icons'
import { Button, Text, clx } from '@medusajs/ui'
import { Message, useChat } from 'ai/react'
import { useId } from 'react'
import { useSnapshot } from 'valtio'
import { ChatMessage } from './ChatMessage'
import InputForm from './form'

const api = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8787/chat'


const Ai = ({ onSubmit }: { onSubmit(): void }) => {
  const id = useId()
  const chatHelpers = useChat({ id, api })
  const {
    messages,
    setMessages,
    reload,
    stop,
    append,
    isLoading,
    input,
    setInput,
  } = chatHelpers

  return (
    <>
      <ScrollArea className="!h-[525px] w-full">
        {messages.length ? <MessageList messages={messages} /> : <Empty />}

        <ChatScrollAnchor />
        <div className="absolute bottom-0 flex w-full justify-center items-center py-2 pointer-events-none">
          {isLoading ? (
            <Button
              variant="secondary"
              className="pointer-events-auto"
              onClick={() => stop()}
            >
              <ClockChangedSolidMini />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="secondary"
                className="pointer-events-auto"
                onClick={() => reload()}
              >
                <ArrowPathMini />
                Regenerate response
              </Button>
            )
          )}
        </div>
      </ScrollArea>

      <InputForm
        {...{
          messages,
          setInput,
          setMessages,
          append,
          id,
          input,
          onSubmit,
          isLoading,
        }}
      />
    </>
  )
}
export default Ai

const Empty = () => {
  const snap = useSnapshot(status)

  const isIndexing = snap.value === 'indexing'
  const isLoading = snap.value === 'loading'
  const isReady = snap.value === 'ready'

  return (
    <div
      className={clx(
        'm-5 flex flex-col border p-20',
        'text-justify rounded-md bg-ui-bg-subtle',
        'justify-center space-y-3 items-center',
        isReady ? '' : 'animate-pulse',
      )}
    >
      <CircleThreeQuartersSolid
        className={clx(
          isIndexing && 'text-ui-tag-orange-text',
          isReady && 'text-ui-tag-green-text',
        )}
      />

      {isLoading ? (
        <Detail
          title="Scanning store"
          description="looks like we detected a new store. please give me sometime to study the products in this store to give you
        better results."
        />
      ) : snap.value === 'indexing' ? (
        <Detail
          title="little more time,"
          description={`${
            window.shopai.noOfProducts
              ? `found ${window.shopai.noOfProducts} in the store`
              : ''
          }, i'm now embedding the products into my knowledge base.`}
        />
      ) : (
        <Detail
          title="Ready"
          description="What would you like to buy from this store?"
        />
      )}
    </div>
  )
}

const Detail = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="text-center">
      <Text className="text-ui-fg-muted" weight="plus">
        {title}
      </Text>
      <Text className="text-ui-fg-muted">{description}</Text>
    </div>
  )
}

const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
    </>
  )
}
