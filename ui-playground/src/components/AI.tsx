import { ArrowPathMini, CircleThreeQuartersSolid, ClockChangedSolidMini, Component, Plus, User } from "@medusajs/icons";
import { Button, Drawer, IconBadge, IconButton, Input, Text, clx } from "@medusajs/ui";
import { Message } from "ai";
import { useState } from "react";
import gfm from "remark-gfm";
import { Copy } from "./copy";
import { Tooltip } from "./copy/tooltip";
import { Markdown } from "./markdown";
import { MarkdownComponents } from "./markdown/components";
import { ScrollArea } from "./scroll-area";

const Ai = ({ onSubmit }: { onSubmit(): void }) => {
  const [messages] = useState(() => DUMMY);
  const isLoading = false;
  const reload = () => undefined;

  return (
    <>
      <ScrollArea className="!h-[525px] !w-full">
        {messages.length ? <MessageList messages={messages} /> : <Empty />}

        <div className="absolute bottom-0 flex w-full justify-center items-center py-2 pointer-events-none">
          {isLoading ? (
            <Button variant="secondary" className="pointer-events-auto" onClick={() => stop()}>
              <ClockChangedSolidMini />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button variant="secondary" className="pointer-events-auto" onClick={() => reload()}>
                <ArrowPathMini />
                Regenerate response
              </Button>
            )
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Drawer.Footer className="overflow-hidden">
          <Tooltip content="New chat">
            <IconButton type="button">
              <Plus />
            </IconButton>
          </Tooltip>

          <div className="flex-1">
            <Input autoFocus />
          </div>

          <Button type="submit" variant="secondary" size="large">
            Submit
          </Button>
        </Drawer.Footer>
      </form>
    </>
  );
};
export default Ai;

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={clx(
        "mb-2 py-3 group relative flex space-x-3  px-6",
        message.role === "user" ? "bg-ui-bg-component" : ""
      )}
    >
      <div>
        <IconBadge>{message.role === "user" ? <User /> : <Component />}</IconBadge>
      </div>
      <Markdown className={"cursor-default"} remarkPlugins={[gfm]} components={MarkdownComponents}>
        {message.content}
      </Markdown>

      <Copy
        className="absolute right-5 -top-1 opacity-0 group-hover:opacity-100 animate-in fade-in-70 border bg-ui-bg-subtle p-1 rounded-lg"
        content={message.content}
      />
    </div>
  );
};

const DUMMY: Message[] = [
  {
    id: ":r8:",
    content: "i need green shoes",
    role: "user",
  },
  {
    id: "x6DVmYQ",
    content: `Sure! I can help you find green shoes. Here are two options for green shoes available on the Allbirds store:\n\n1. Women's Tree Runners - Thunder Green (Blizzard Sole)\n   
    - Product Link: [Women's Tree Runners - Thunder Green](https://www.allbirds.com/products/womens-tree-runners-thunder-green)\n  
    - Product Image: ![Women's Tree Runners - Thunder Green](https://cdn.shopify.com/s/files/1/1104/4168/products/A10236M100-Tree_Runner-45-Global-Mens-Tree-Thunder_Green-Blizzard-CF1_4335f856-14e6-45eb-a8a9-ebb35a024a73.png?v=1696278640)\n  
    - Price: $98.00\n\n   
    The Women's Tree Runners in Thunder Green are made with responsibly sourced eucalyptus tree fiber, which feels silky smooth and cool on your skin. 
    These shoes are breathable, lightweight, and perfect for everyday casual wear, walking, and warmer weather. The Thunder Green color adds a pop of green to your outfit, and the Blizzard Sole provides excellent traction. \n\n2. Men's Tree Runners - Thunder Green (Blizzard Sole)\n   - Product Link: [Men's Tree Runners - Thunder Green](https://www.allbirds.com/products/mens-tree-runners-thunder-green)\n   - Product Image: ![Men's Tree Runners - Thunder Green](https://cdn.shopify.com/s/files/1/1104/4168/products/A10236M100-Tree_Runner-45-Global-Mens-Tree-Thunder_Green-Blizzard-CF1_ba0ad8e0-d0db-4ea2-a9c5-284c547ccff0.png?v=1695935684)\n   - Price: $98.00\n\n   The Men's Tree Runners in Thunder Green offer the same benefits as the Women's Tree Runners. They are breathable, lightweight, and made with responsibly sourced eucalyptus tree fiber. The Thunder Green color adds a touch of green to your outfit, and the Blizzard Sole provides excellent traction. \n\nBoth options are great choices for green shoes, and they offer comfort, style, and sustainability. 
    The Tree Runners are versatile and suitable for various activities, making them a recommended choice.`,
    role: "assistant",
  },
];

const Empty = () => {
  const snap = { value: "loading" };

  const isIndexing = snap.value === "indexing";
  const isLoading = snap.value === "loading";
  const isReady = snap.value === "ready";

  return (
    <div
      className={clx(
        "m-5 flex flex-col border p-20",
        "text-justify rounded-md bg-ui-bg-subtle",
        "justify-center space-y-3 items-center",
        isReady ? "" : "animate-pulse"
      )}
    >
      <CircleThreeQuartersSolid
        className={clx(isIndexing && "text-ui-tag-orange-text", isReady && "text-ui-tag-green-text")}
      />

      {isLoading ? (
        <Detail
          title="Scanning store"
          description="looks like we detected a new store. please give me sometime to study the products in this store to give you
        better results."
        />
      ) : snap.value === "indexing" ? (
        <Detail
          title="little more time,"
          description="found 13 products in the store, i'm now embedding the products into my knowledge graph."
        />
      ) : (
        <Detail title="Ready" description="What would you like to buy from this store?" />
      )}
    </div>
  );
};

const Detail = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="text-center">
      <Text className="text-ui-fg-muted" weight="plus">
        {title}
      </Text>
      <Text className="text-ui-fg-muted">{description}</Text>
    </div>
  );
};

const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      {messages.map(m => (
        <ChatMessage key={m.id} message={m} />
      ))}
    </>
  );
};
