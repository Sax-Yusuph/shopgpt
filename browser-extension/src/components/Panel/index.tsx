import { sendContentMessage } from '@/scripts/content-actions'
import { Product } from '@/types'
import { ERR } from '@/utils/error'
import { useChat } from 'ai/react'
import { useId } from 'react'
import { Icons } from '../ui/icons'
import { PromptForm } from './Form'
import { ChatList } from './Messages'
import { ChatScrollAnchor } from './chatScrollAnchor'
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
const api = 'http://127.0.0.1:8787/chat'

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
              <Box /*setInput={setInput}*/ />
            )}
          </MainWindow>
        </Top>

        <PanelFooter>
          <PanelChat>
            <PromptForm
              setInput={setInput}
              input={input}
              isLoading={isLoading}
              onSubmit={async (value) => {
                const products = await sendContentMessage<Product[]>({
                  action: 'chat:match-embedding',
                  value: input,
                  params: { storeUrl: window.storeUrl },
                })

                if (products.kind === ERR) {
                  return console.log(products.error.message)
                }

                await append(
                  {
                    id,
                    content: value,
                    role: 'user',
                  },
                  {
                    options: {
                      body: {
                        products: products.value,
                        storeUrl: window.storeUrl,
                        pageType: window.pageType,
                        tabUrl: window.tabUrl,
                      },
                    },
                  },
                )
              }}
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
      <IconBtn onClick={window.toggleDisplay}>
        <Icons.Close />
      </IconBtn>
    </Flex>
  )
}
