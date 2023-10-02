"use client";

import { ChatState, chatState, updateState } from "@/app/store";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { EmptyScreen } from "@/components/empty-screen";
import { getLocalStorage } from "@/hooks/use-localstorage";
import { STORAGE, cn } from "@/lib/utils";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSnapshot } from "valtio";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, className }: ChatProps) {
  const preferredStore = getLocalStorage(STORAGE.PREFFERED_STORE);
  const llmModel = getLocalStorage(STORAGE.LLM_MODEL);
  const systemPrompt = getLocalStorage(STORAGE.SYSTEM_PROMPT);
  const preferredStorePrompt = getLocalStorage(STORAGE.PREFFERED_STORE_PROMPT);
  const snap = useSnapshot<ChatState>(chatState);

  const params = { id, preferredStore, systemPrompt, preferredStorePrompt, model: llmModel };
  const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
    id,
    body: params,
    onResponse,
    onError,
  });

  useEffect(() => {
    if (isLoading !== snap.loading) {
      updateState(isLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>

      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  );
}

function onResponse(response) {
  if (response.status === 401) {
    toast.error(response.statusText);
  }
}

function onError(e) {
  toast.error(e.message, {
    className: "!max-w-lg",
    duration: 5000,
  });
}
