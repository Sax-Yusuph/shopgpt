import { sendContentMessage } from '@/scripts/content-actions'
import { ERR, safe } from '@/utils/error'
import { GetMatchesResult } from '@/utils/getMatches'
import { logger } from '@/utils/logger'
import { MessageRole } from '@/utils/matches/constants'
import { getCompletionMessages } from '@/utils/matches/getCompletions'
import { Message, useChat } from 'ai/react'
import { useCallback, useId } from 'react'
import { useSnapshot } from 'valtio'
import { Icons } from '../ui/icons'
import { PromptForm } from './Form'
import { ChatList } from './Messages'
import { ChatScrollAnchor } from './chatScrollAnchor'
import { status } from './store'
import {
  Box,
  Flex,
  Header,
  IconBtn,
  MainWindow,
  PanelChat,
  PanelContainer,
  PanelFooter,
  PanelHeader,
  PanelInner,
  Title,
  Top,
} from './styles'

const api =  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8787/chat'

export function Panel() {
  const id = useId()
  const { messages, append, isLoading, input, setInput } = useChat({ id, api })

  return (
    <PanelContainer>
      <PanelInner>
        <Top>
          <PanelHeader>
            <Header>
              <Title>Ask ai</Title>
            </Header>
            <Toolbars />
          </PanelHeader>
          <MainWindow>
            {messages.length ? (
              <>
                <ChatList messages={messages} />
                <ChatScrollAnchor trackVisibility={isLoading} />
              </>
            ) : (
              <Empty />
            )}
          </MainWindow>
        </Top>

        <PanelFooter>
          <PanelChat>
            <PromptForm
              setInput={setInput}
              input={input}
              isLoading={isLoading}
              onSubmit={useCallback(
                async (value) => {
                  const result = await sendContentMessage<GetMatchesResult>({
                    action: 'chat:match-embedding',
                    value: input,
                    params: window.shopai,
                  })

                  if (result.kind === ERR) {
                    return logger(result.error.message)
                  }

                  const completions = safe<Message[]>(() =>
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
              )}
            />
          </PanelChat>
        </PanelFooter>
      </PanelInner>
    </PanelContainer>
  )
}

const Toolbars = () => {
  return (
    <Flex>
      <IconBtn>
        <Icons.System />
      </IconBtn>
      <IconBtn>
        <Icons.Slider />
      </IconBtn>
      <IconBtn onClick={window.shopaiActions.toggleDisplay}>
        <Icons.Close />
      </IconBtn>
    </Flex>
  )
}

const Empty = () => {
  const snap = useSnapshot(status)

  return (
    <Box>
      {snap.value === 'loading' ? (
        <b>
          looks like we detected a new store. please give me sometime to study
          the products in this store to give you better results.
        </b>
      ) : snap.value === 'indexing' ? (
        <b>
          little more time,
          {window.shopai.noOfProducts
            ? `found ${window.shopai.noOfProducts} in the store`
            : ''}
          i'm now embedding the products into my knowledge base.
        </b>
      ) : (
        <b>Ready</b>
      )}
    </Box>
  )
}
