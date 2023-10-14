import { ArrowsPointingOutMini, Cash, Component, ShoppingBag, Tools } from "@medusajs/icons";
import { Badge, Tabs, Text, clx, useToggleState } from "@medusajs/ui";
import { useFrame } from "react-frame-component";
import Ai from "./components/AI";
import ColorModeToggle from "./components/color-mode";
import { Drawer } from "./components/panel";
import Settings from "./components/settings";
import { useBouncyEffect } from "./hooks/use-bounce-animation";
import { useInjectStyles } from "./hooks/use-inject-styles";
import { IconOpenAI } from "./icons/openAi";

export default function App() {
  const { animateBounce, bounce } = useBouncyEffect();
  const [isPanelOpened, open, close] = useToggleState(false);

  const { document: doc } = useFrame();
  useInjectStyles();

  return (
    <div
      className={`fixed h-screen w-screen top-0 right-0 z-40 box-border pointer-events-none
        `}
    >
      <div className="relative w-full h-full pointer-events-auto">
        <Drawer
          onOpenChange={v => {
            if (v) {
              return open();
            }
            close();
          }}
        >
          <Drawer.Trigger asChild>
            <div
              role="button"
              className={clx(
                "group  h-12 absolute rounded-s-xl top-96",
                "-right-6 hover:right-0 transition-all bg-[rgba(3,7,18,1)]  cursor-pointer select-none",
                isPanelOpened ? "hidden" : "flex"
              )}
            >
              <div className="flex-1 flex text-white items-center justify-center p-3 ">
                <IconOpenAI className="group-hover:animate-spin-once repeat-1 h-6 w-6" />
              </div>

              <div className="w-6 h-full flex  justify-center items-center bg-pinky">
                <ArrowsPointingOutMini className="text-[rgba(3,7,18,1)]" />
              </div>
            </div>
          </Drawer.Trigger>

          <Drawer.Content
            id={"panel"}
            container={doc?.body}
            className={clx(
              "z-50 min-h-[55vh] max-h-[750px] top-16",
              "text-ui-fg-base",
              "transition ease-out",
              animateBounce ? "scale-[101.5%]" : "scale-100",
              // isWidthExpanded ? "w-[580px]" : "w-[500px]"
              "w-[500px]",
              "overflow-hidden"
            )}
          >
            <Drawer.Header>
              <Drawer.Title className="">Shop ai</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body className="p-0">
              <Tabs defaultValue="ai" className="h-[calc(100%-56px)]">
                <Tabs.List className="py-2 justify-center border-b border-ui-border-base">
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

                <Tabs.Content className="px-6" value="cart">
                  <Text size="small">
                    At ACME, we&apos;re dedicated to providing you with an exceptional shopping experience. Our wide
                    selection of products caters to your every need, from fashion to electronics and beyond. We take
                    pride in our commitment to quality, customer satisfaction, and timely delivery. Our friendly
                    customer support team is here to assist you with any inquiries or concerns you may have. Thank you
                    for choosing ACME as your trusted online shopping destination.
                  </Text>
                </Tabs.Content>

                <Tabs.Content className="h-full" value="settings">
                  <Settings />
                  <Drawer.Footer className="overflow-hidden justify-between">
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
    </div>
  );
}
