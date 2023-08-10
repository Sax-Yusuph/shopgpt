"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import cn from "clsx";
import Image from "next/image";
import { useState } from "react";

import type { ComponentProps } from "react";

export default function BlurImage(props: ComponentProps<typeof Image>) {
  const [isLoading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   setError(null);
  // }, [props.src]);

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Image
        {...props}
        // src={error ? "/fallback.webp" : props.src}
        alt={props.alt}
        className={cn(
          props.className,
          "duration-700 ease-in-out",
          isLoading ? "scale-105 blur-lg" : "scale-100 blur-0"
        )}
        onLoadingComplete={() => setLoading(false)}
        // onError={setError}
      />
    </AspectRatio>
  );
}
