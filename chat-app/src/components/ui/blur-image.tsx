/* eslint-disable @next/next/no-img-element */
"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import cn from "clsx";
import Image from "next/image";

import { ChatState, chatState } from "@/app/store";
import { memo, type ComponentProps } from "react";
import { useSnapshot } from "valtio";
import { Skeleton } from "./skeleton";

const BlurImage = memo((props: ComponentProps<typeof Image>) => {
  const { ...rest } = props;
  const snap = useSnapshot<ChatState>(chatState);

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted my-3">
      {snap.loading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        // @ts-ignore
        <img
          alt={props.alt}
          className={cn(props.className, "animate-in zoom-in-75 w-full h-full object-cover !m-0")}
          {...rest}
        />
      )}
    </AspectRatio>
  );
});

BlurImage.displayName = "BlurImage";

export default BlurImage;
