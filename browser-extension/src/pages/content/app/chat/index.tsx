import { BottomScroll } from '@/ui/scroll-anchor'
import { ScrollAreaV2 } from '@/ui/scroll-area/scroll-area'
import { status, togglePanelSize } from '@/utils/state'
import {
  CircleThreeQuartersSolid,
  ClockChangedSolidMini,
} from '@medusajs/icons'
import { Button, StatusBadge, Text, clx } from '@medusajs/ui'
import { UseChatHelpers } from 'ai/react'
import { useSnapshot } from 'valtio'
import { ChatMessage } from './ChatMessage'
import { SeeMore } from './Recommendations'
import InputForm from './form'

interface Props {
  isExpanded: boolean

  chatHelpers: UseChatHelpers & {
    onSubmit(): void
  }
}
const AiChat = ({ chatHelpers, isExpanded }: Props) => {
  const {
    messages,
    setMessages,
    stop,
    append,
    isLoading,
    input,
    setInput,
    onSubmit,
  } = chatHelpers

  return (
    <div className="flex-1 border-e border-ui-border-base">
      <ScrollAreaV2 className={'h-[530px]'}>
        {messages.length ? (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        ) : (
          <Empty />
        )}

        <BottomScroll messages={messages} />
        <div className="absolute bottom-0 flex w-full justify-center items-center py-2 pointer-events-none">
          {isLoading ? (
            <Button
              variant="secondary"
              className="pointer-events-auto"
              onClick={stop}
            >
              <ClockChangedSolidMini />
              Stop generating
            </Button>
          ) : null}
        </div>

        {messages.length && !isLoading ? (
          <SeeMore
            onClick={togglePanelSize}
            className={clx(isExpanded ? 'hidden' : 'block')}
          />
        ) : null}
      </ScrollAreaV2>

      <InputForm
        setInput={setInput}
        setMessages={setMessages}
        append={append}
        input={input}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
export default AiChat

const Empty = () => {
  const snap = useSnapshot(status)

  const isIndexing = snap.status === 'indexing'
  const isLoading = snap.status === 'loading' || Boolean(snap.loadProgress)
  const isReady = snap.status === 'ready'
  const isError = snap.status === 'error'

  return (
    <div
      className={clx(
        'm-5 flex flex-col border p-20',
        'text-justify rounded-md bg-ui-bg-subtle',
        'justify-center space-y-3 items-center',
        isReady ? '' : 'animate-pulse',
      )}
    >
      {snap.loadProgress ? (
        <StatusBadge>{snap.loadProgress.toFixed(2)}%</StatusBadge>
      ) : (
        <CircleThreeQuartersSolid
          className={clx(
            isIndexing && 'text-ui-tag-orange-text',
            isReady && 'text-ui-tag-green-text',
            isError && 'text-ui-tag-red-text',
          )}
        />
      )}

      {isLoading ? (
        <Detail
          title={snap.loadProgress === undefined ? 'Scanning store' : ''}
          description={
            snap.loadProgress === undefined
              ? 'looks like we detected a new store. please give me sometime to study the products in this store to give you better results.'
              : 'Initializing...'
          }
        />
      ) : isIndexing ? (
        <Detail
          title="little more time,"
          description={`${
            window.shopai.noOfProducts
              ? `found ${window.shopai.noOfProducts} items in the store`
              : ''
          }, i'm now embedding the products into my knowledge base.`}
        />
      ) : isError ? (
        <Detail title="Error" description="Opps an error occured!" />
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
      {title ? (
        <Text className="text-ui-fg-muted" weight="plus">
          {title}
        </Text>
      ) : null}
      <Text className="text-ui-fg-muted">{description}</Text>
    </div>
  )
}
