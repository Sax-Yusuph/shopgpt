import { clx } from "@medusajs/ui";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clx("animate-pulse rounded-md bg-ui-bg-component", className)}
      {...props}
    />
  );
}

export { Skeleton };
