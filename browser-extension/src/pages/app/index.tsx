import ColorModeToggle from '@/components/color-mode'
import { IconOpenAI } from '@/components/icons/openAi'
import { Drawer } from '@/components/panel'
import { useBouncyEffect } from '@/lib/hooks/use-bounce-animation'
import {
  ArrowsPointingOutMini,
  Cash,
  Component,
  ShoppingBag,
  Tools,
} from '@medusajs/icons'
import { Badge, Tabs, Text, Toaster, clx, useToggleState } from '@medusajs/ui'
import Ai from './ai'
import Settings from './settings'

export default function App({ doc }: { doc?: Document }) {
  const { animateBounce, bounce } = useBouncyEffect()
  const [isPanelOpened, open, close] = useToggleState(false)

  return (
    <div
      className={`
      fixed h-screen w-screen top-0 right-0 z-[999999] pointer-events-none 
        `}
    >
      <div className="relative w-full h-full">
        <Drawer onOpenChange={(v) => (v ? open() : close())}>
          <Drawer.Trigger className="pointer-events-auto" asChild>
            <div
              role="button"
              className={clx(
                'group h-12 absolute rounded-s-xl top-96',
                '-right-6 hover:right-0 transition-all bg-[rgba(3,7,18,1)] cursor-pointer select-none',
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
            container={doc?.body}
            className={clx(
              'z-[2147483647] min-h-[55vh] max-h-[750px] top-20',
              'text-ui-fg-base',
              'transition ease-out',
              'pointer-events-auto',
              animateBounce ? 'scale-[101.5%]' : 'scale-100',
              'w-[500px]',
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

                <Tabs.Content className="h-full" value="ai">
                  <Ai onSubmit={bounce} />
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
