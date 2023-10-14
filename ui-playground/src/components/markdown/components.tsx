import { Kbd, Text, clx } from "@medusajs/ui";
import { Components } from "react-markdown";
import { Details } from "../Details";

export const MarkdownComponents: Components = {
  span: ({ children, className }) => (
    <Text as="span" className={className}>
      {children}
    </Text>
  ),

  img: ({ src, alt, className }) => (
    <div className={clx("aspect-video bg-ui-bg-component rounded-md my-3 overflow-hidden", className)}>
      <img src={src} alt={alt} className={"animate-in fade-in-75 w-full h-full object-cover"} />
    </div>
  ),

  pre: ({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={clx("p-0 bg-transparent", className)} {...props}>
      {children}
    </pre>
  ),

  kbd: ({ children, className }) => <Kbd className={clx(className)}>{children}</Kbd>,
  details: Details,

  a: ({ href, className, children, ...rest }) => (
    <a
      href={href || ""}
      {...rest}
      className={clx("text-ui-fg-interactive hover:text-ui-fg-interactive-hover", className)}
    >
      {children}
    </a>
  ),
  ul: ({ className, children, ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    return (
      <ul {...props} className={clx("list-disc px-1", className)}>
        {children}
      </ul>
    );
  },
  ol: ({ className, children, ...props }: React.HTMLAttributes<HTMLOListElement>) => {
    return (
      <ol {...props} className={clx("list-decimal px-1 my-3 space-y-5", className)}>
        {children}
      </ol>
    );
  },
  li: ({ className, children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <Text asChild>
      <li className={clx("text-ui-fg-subtle", className)} {...props}>
        {children}
      </li>
    </Text>
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Text className={clx("text-ui-fg-subtle", className)} {...props} />
  ),
};

// const Skeleton = <div className="bg-ui-bg-component rounded-md  w-full h-full animate-pulse" />;
