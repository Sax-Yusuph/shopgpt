/* eslint-disable @next/next/no-img-element */
"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import cn from "clsx";
import Image from "next/image";

import { ChatState, chatState } from "@/app/store";
import type { ComponentProps } from "react";
import { useSnapshot } from "valtio";
import { Skeleton } from "./skeleton";

const fallback = "/fallback.webp";

export default function BlurImage(props: ComponentProps<typeof Image> & { isLoading: boolean }) {
  const { isLoading, ...rest } = props;
  const snap = useSnapshot<ChatState>(chatState);

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted my-3">
      {snap.loading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <Image
          fill
          src={props.src}
          alt={props.alt}
          className={cn(props.className, "animate-in zoom-in-75")}
          {...rest}
        />
      )}
    </AspectRatio>
  );
}
