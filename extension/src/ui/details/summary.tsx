import { PlusMini } from "@medusajs/icons";
import { Text, clx } from "@medusajs/ui";
import React from "react";

export type DetailsSummaryProps = {
  title: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  expandable?: boolean;
  open?: boolean;
  className?: string;
  titleClassName?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "title">;

export const DetailsSummary = ({
  title,
  subtitle,
  children,
  badge,
  expandable = true,
  open = false,
  className,
  titleClassName,
  ...rest
}: DetailsSummaryProps) => {
  return (
    <summary
      className={clx(
        "py-0.5 flex items-center justify-between",
        expandable && "cursor-pointer",
        !expandable && "border-ui-border-base border-y border-solid",
        "no-marker",
        className
      )}
      {...rest}
    >
      <Text className="gap-0.5 flex flex-col">
        <Text as="span" className={clx("text-ui-fg-base", titleClassName)}>
          {title || children}
        </Text>

        {subtitle && (
          <Text as="span" className="text-ui-fg-subtle">
            {subtitle}
          </Text>
        )}
      </Text>
      {(badge || expandable) && (
        <span className="flex gap-0.5">
          {badge}
          {expandable && <PlusMini className={clx("transition-transform", open && "rotate-45")} />}
        </span>
      )}
    </summary>
  );
};
