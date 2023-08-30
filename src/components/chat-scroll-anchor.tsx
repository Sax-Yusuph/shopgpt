"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";

import { useAtBottom } from "@/lib/hooks/use-at-bottom";

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: "0px 0px -150px 0px",
  });

  React.useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "end",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}

/**
 * import React, { useEffect, useRef } from "react";

export default function ChatComponent({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chatContainer">
      {messages.map((message, index) => 
        <div key={index}>
          <p>{message}</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
 */
