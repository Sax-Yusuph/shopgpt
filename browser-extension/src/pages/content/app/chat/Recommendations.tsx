import { BottomScroll } from '@/ui/scroll-anchor'
import { ScrollAreaV2 } from '@/ui/scroll-area/scroll-area'
import { Skeleton } from '@/ui/skeleton'
import { API, API_URL } from '@/utils/api'
import { formatPrice } from '@/utils/formatters'
import { ProductRecomendation, togglePanelSize } from '@/utils/state'
import { Button, Container, Text, clx } from '@medusajs/ui'
import { Message } from 'ai'
import { Fragment, useMemo } from 'react'
import useSWR from 'swr'

interface Props {
  loading: boolean
  messages: Message[]
}

export const Recommendation = ({ loading, messages }: Props) => {
  const input = getLastUserMessage(messages)
  const fetcher = () => API.getRecommendations(input, window.shopai.storeUrl)

  const { data, isLoading } = useSWR<ProductRecomendation[]>(
    API_URL.getRecommendations,
    fetcher,
  )

  //pick the last message. filter the message similar title as the product title
  const lastMessage = messages[messages.length - 1]
  const messageContent = lastMessage?.content

  const filteredProducts = useMemo(
    () =>
      data?.filter((product) => {
        if (messageContent?.includes(product.title)) {
          return false
        }

        return true
      }) ?? [],
    [data, messageContent],
  )

  return (
    <div>
      {messages.length ? (
        <SeeMore onClick={togglePanelSize} orientation="down" />
      ) : null}

      <ScrollAreaV2 className="!h-[580px]">
        <div className="relative grid grid-cols-2 gap-4 p-2">
          {loading || isLoading ? (
            <LoaderComponent />
          ) : (
            filteredProducts.map(({ title, link, image, prices }) => {
              return (
                <Container key={title} className="p-3 max-w-lg space-y-3">
                  <div className="aspect-square bg-ui-bg-component rounded-md overflow-hidden">
                    <img
                      src={image}
                      className={
                        'animate-in fade-in-75 w-full h-full object-cover'
                      }
                    />
                  </div>
                  <Text weight={'plus'} className="text-xs">
                    {title}
                  </Text>

                  <div className="flex items-center mt-2 justify-between">
                    <Text className="font-bold text-ui-tag-green-icon">
                      ${formatPrice(prices)}
                    </Text>

                    <Button asChild variant="secondary">
                      <a href={link} target="_blank">
                        Buy
                      </a>
                    </Button>
                  </div>
                </Container>
              )
            })
          )}
        </div>

        <BottomScroll messages={filteredProducts} />
      </ScrollAreaV2>
    </div>
  )
}

const LoaderComponent = () => {
  return (
    <Fragment>
      {Array(5)
        .fill('')
        .map((_, index) => (
          <Container key={index} className="p-3 max-w-lg space-y-3">
            <Skeleton className="aspect-square rounded-md" />

            <Skeleton className="h-4 w-16" />

            <Skeleton className="h-7 w-full" />
          </Container>
        ))}
    </Fragment>
  )
}

interface SeeMoreProps {
  orientation?: 'up' | 'down'
  onClick(): void
  className?: string
}

export const SeeMore = ({
  onClick,
  className,
  orientation = 'up',
}: SeeMoreProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      className={clx(
        'w-full text-center text-sm py-1 bg-green-500 cursor-pointer transition-colors text-green-900',
        'active:bg-green-400 hover:bg-green-600',
        'animate-in slide-in-from-bottom-20 duration-300',
        orientation === 'up'
          ? 'rounded-t-xl absolute bottom-0 left-0'
          : 'rounded-b-2xl',
        className,
      )}
    >
      <Text size="small">See more recommendations</Text>
    </div>
  )
}

const getLastUserMessage = (messages: Message[]) => {
  const [userMessage] = messages.filter(({ role }) => role === 'user').slice(-1)

  return userMessage?.content as string
}
