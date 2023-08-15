/* eslint-disable @next/next/no-img-element */
"use client";

import { useFetchWithAbort } from "@/hooks/use-fetch";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import cn from "clsx";
import Image from "next/image";

import type { ComponentProps } from "react";
import { Skeleton } from "./skeleton";

const fallback = "/fallback.webp";

export default function BlurImage(props: ComponentProps<typeof Image>) {
  const { error, imageUrl, isLoading } = useFetchWithAbort(props.src as string, props.id, {});

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted my-3">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : error ? (
        <Image fill src={fallback} alt="product" />
      ) : imageUrl ? (
        <Image fill src={imageUrl} alt={props.alt} className={cn(props.className, "animate-in zoom-in-75")} />
      ) : null}
    </AspectRatio>
  );
}
