import { clx } from "@medusajs/ui";

export type DotsLoadingProps = {
  className?: string;
};

export const DotsLoading = ({ className }: DotsLoadingProps) => {
  return (
    <span className={clx("text-medium text-medusa-fg-subtle", className)}>
      <span className="animate-pulsingDots">.</span>
      <span className="animate-pulsingDots animation-delay-[500ms]">.</span>
      <span className="animate-pulsingDots animation-delay-[1000ms]">.</span>
    </span>
  );
};
