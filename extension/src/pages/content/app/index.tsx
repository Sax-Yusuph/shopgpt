import ColorModeToggle from '@/ui/color-mode'
import { IconOpenAI } from '@/ui/icons/openAi'
import { Drawer } from '@/ui/panel'
import { API_URL } from '@/utils/api'
import { extension, getShadowRoot } from '@/utils/content-actions'
import { panelSize, togglePanelSize } from '@/utils/state'
import { useBouncyEffect } from '@/utils/use-bounce-animation'
import { useEnableScroll } from '@/utils/use-enable-scroll'
import {
  ArrowsPointingOutMini,
  Cash,
  ChevronDoubleLeft,
  Component,
  ShoppingBag,
  Tools,
} from '@medusajs/icons'
import {
  Badge,
  IconButton,
  Tabs,
  Text,
  Toaster,
  clx,
  useToggleState,
} from '@medusajs/ui'
import { useChat } from 'ai/react'
import { useSnapshot } from 'valtio'
import AiChat from './chat'
import { Recommendation } from './chat/Recommendations'
import Settings from './settings'

export default function AiPanel() {
  const { animateBounce, bounce } = useBouncyEffect()
  const [isPanelOpened, open, close] = useToggleState(false)
  const isPanelExpanded = useSnapshot(panelSize).expand

  // scrolling is not working in shadow dom mode.. but this hook fixes it.
  useEnableScroll()

  const chatHelpers = useChat({ api: API_URL.chat })
  const submitChatMessage = async () => {
    bounce()
  }

  return (
    <div
      id={extension.panelId}
      className={clx(
        'fixed h-screen w-screen top-0',
        'right-0 z-[999999] pointer-events-none',
      )}
    >
      <div className="relative w-full h-full">
        <Drawer onOpenChange={(v) => (v ? open() : close())}>
          <Drawer.Trigger className="pointer-events-auto" asChild>
            <div
              role="button"
              className={clx(
                'group h-12 absolute rounded-s-xl top-80',
                '-end-6 hover:end-0 transition-all bg-[rgba(3,7,18,1)] cursor-pointer select-none',
                isPanelOpened ? 'hidden' : 'flex',
              )}
            >
              <div className="flex-1 flex text-white items-center justify-center p-3 ">
                <IconOpenAI className="group-hover:animate-spin-once repeat-1 w-6 h-6" />
              </div>

              <div className="w-6 h-full flex justify-center items-center bg-pinky">
                <ArrowsPointingOutMini className="text-[rgba(3,7,18,1)]" />
              </div>
            </div>
          </Drawer.Trigger>

          <Drawer.Content
            container={getShadowRoot()}
            className={clx(
              '!z-[2147483647]',
              'text-ui-fg-base',
              'transition ease-out',
              'pointer-events-auto',
              animateBounce ? 'scale-[101.5%]' : 'scale-100',
              'min-h-[55vh] max-h-[750px] top-[min(8svh,4rem)] transition-all !max-w-[100svw]',
              isPanelExpanded ? 'w-[min(100svw_,_900px)]' : 'w-[500px]',
            )}
          >
            <Drawer.Header className="border-solid">
              <Drawer.Title className="m-0">Shop ai</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body className="p-0">
              <Tabs defaultValue="ai" className="h-[calc(100%-56px)]">
                <Tabs.List className="py-2 justify-center border-b border-ui-border-base border-solid">
                  <Tabs.Trigger value="ai" className="gap-1">
                    <Component /> <Text>Ask ai</Text>
                  </Tabs.Trigger>

                  <Tabs.Trigger value="coupons" className="gap-1" disabled>
                    <Cash /> <Text>Coupons</Text>
                  </Tabs.Trigger>

                  <Tabs.Trigger value="cart" className="gap-1" disabled>
                    <ShoppingBag />
                    <Text>Cart</Text>
                  </Tabs.Trigger>

                  <Tabs.Trigger value="settings" className="gap-1">
                    <Tools />
                    <Text>Settings</Text>
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content className="h-full overflow-hidden" value="ai">
                  <div
                    className={clx(
                      'relative grid  gap-2',
                      isPanelExpanded ? 'grid-cols-2' : '',
                    )}
                  >
                    <AiChat
                      isExpanded={isPanelExpanded}
                      chatHelpers={{
                        ...chatHelpers,
                        onSubmit: submitChatMessage,
                      }}
                    />

                    {isPanelExpanded && (
                      <Recommendation
                        loading={chatHelpers.isLoading}
                        messages={chatHelpers.messages}
                      />
                    )}

                    {isPanelExpanded && (
                      <IconButton
                        className="absolute right-5 bottom-5"
                        onClick={togglePanelSize}
                      >
                        <ChevronDoubleLeft />
                      </IconButton>
                    )}
                  </div>
                </Tabs.Content>
                <Tabs.Content className="h-full" value="settings">
                  <Settings />

                  <Drawer.Footer className="overflow-hidden justify-between border-solid">
                    <div className="flex gap-2">
                      <Text className="text-ui-fg-muted">Ask question</Text>
                      <Badge color="purple">Alpha</Badge>
                    </div>
                    <ColorModeToggle />
                  </Drawer.Footer>
                </Tabs.Content>
              </Tabs>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>

      <Toaster />
    </div>
  )
}
