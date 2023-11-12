import { useEffect } from "react";
import { useFrame } from "react-frame-component";
import { useInView } from "react-intersection-observer";

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
  canScroll?: boolean;
}

export function ChatScrollAnchor({ canScroll }: ChatScrollAnchorProps) {
  const frame = useFrame();
  const { ref, entry, inView } = useInView({
    delay: 100,
    root: frame.document as unknown as Element,
  });

  useEffect(() => {
    if (!inView && canScroll) {
      entry?.target.scrollIntoView({
        block: "end",
      });
    }
  }, [inView, canScroll, entry?.target]);

  return <div ref={ref} className="h-5 w-full" />;
}
