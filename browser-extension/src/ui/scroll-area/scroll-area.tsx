import { clx } from "@medusajs/ui";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

const Scrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollAreaPrimitive.ScrollAreaScrollbarProps
>(({ className, ...props }, forwardedRef) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={forwardedRef}
    className={clx(
      className,
      "flex select-none touch-none bg-ui-bg-subtle rounded-xl",
      "data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-1",
      "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:h-1",
      "peer peer-data-[orientation=horizontal]:me-3 peer-data-[orientation=vertical]:mb-3"
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb
      className={clx(
        "relative transition-transform rounded-xl bg-ui-bg-switch-off",
        "hover:bg-ui-bg-switch-off-hover",
        "before:absolute before:top-1/2 before:left-1/2 before:translate-x-1/2 before:w-full",
        "before:min-w-[44px] before:h-full before:min-h-[44px] before:content-none"
      )}
    />
  </ScrollAreaPrimitive.Scrollbar>
));

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaPrimitive.ScrollAreaProps
>(({ className, children, ...props }, forwardedRef) => (
  <ScrollAreaPrimitive.Root
    ref={forwardedRef}
    className={clx("overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={"w-full h-full overscroll-x-contain p-1"}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <Scrollbar orientation="vertical" />
    <Scrollbar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

export const ScrollAreaV2 = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={clx("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>

    <ScrollBarV2 />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export const ScrollBarV2 = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={clx(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={clx(
        "relative flex-1 rounded-full bg-ui ",
        "hover:bg-ui-bg-switch-off-hover",
        "bg-ui-bg-switch-off"
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBarV2.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
