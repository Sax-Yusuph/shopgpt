import { clx } from "@medusajs/ui";

export type LoadingProps = {
  className?: string;
  barClassName?: string;
  count?: number;
};

export const Loading = ({ className, count = 6, barClassName }: LoadingProps) => {
  const getLoadingBars = () => {
    const bars = [];
    for (let i = 0; i < count; i++) {
      bars.push(
        <span className={clx("bg-ui-bg-subtle-pressed h-1 w-full rounded-full", barClassName)} key={i}></span>
      );
    }

    return bars;
  };
  return (
    <span role="status" className={clx("my-1 flex w-full animate-pulse flex-col gap-1", className)}>
      {getLoadingBars()}
      <span className="sr-only">Loading...</span>
    </span>
  );
};
