// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { ChatMessageActions } from "@/components/chat-message-actions";
import { MemoizedReactMarkdown } from "@/components/markdown";
import { CodeBlock } from "@/components/ui/codeblock";
import { IconOpenAI, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import BlurImage from "./ui/blur-image";

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div className={cn("group relative mb-4 flex flex-col md:space-y-5 md:flex-row items-start md:-ml-12")} {...props}>
      <div
        className={cn(
          "h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow flex",
          message.role === "user" ? "bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {message.role === "user" ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="md:ml-4 flex-1 space-y-2 overflow-hidden px-1 w-full">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children, node }) {
              const element = node.children[0] as typeof node;

              if (element && element.tagName === "img") {
                const image = element;
                const metastring = (image.properties.alt as string) || "";
                const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
                const src = image.properties.src as string;

                return <BlurImage id={message.id} src={src ?? "/placeholder.img"} fill alt={alt} />;
              }

              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return <span className="mt-1 animate-pulse cursor-default">▍</span>;
                }

                children[0] = (children[0] as string).replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
            a({ children, node }) {
              if (node.tagName === "a") {
                const href = (node.properties.href as string) || "";
                if (href.includes("cdn.shopify") || href.endsWith(".png")) {
                  return <BlurImage id={message.id} src={href ?? "/placeholder.img"} fill alt="product" />;
                }

                return (
                  <Link target="_blank" href={href}>
                    Buy it here
                  </Link>
                );
              }

              return <div className="mb-2 last:mb-0">{children}</div>;
            },

            img({ node }) {
              if (node.tagName === "img") {
                const metastring = (node.properties.alt as string) || "";
                const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
                const src = node.properties.src as string;
                const caption = node.properties.alt as string;

                return <BlurImage id={message.id} src={src ?? "/placeholder.img"} fill alt={alt} />;
              }
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}