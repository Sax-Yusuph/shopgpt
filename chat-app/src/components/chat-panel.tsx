import { type UseChatHelpers } from "ai/react";

import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { PromptForm } from "@/components/prompt-form";
import { Button } from "@/components/ui/button";
import { IconRefresh, IconStop } from "@/components/ui/icons";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    "isLoading" | "reload" | "messages" | "stop" | "input" | "setInput" | "append"  
  > {
  id?: string;
}

export function ChatPanel({ id, isLoading, stop, reload, input, setInput, messages, append,  }: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 pointer-events-none">
      <ButtonScrollToBottom />
      <div className="grid w-full grow grid-cols-6 ">
        <div className="col-span-full lg:col-span-4 pointer-events-auto">
          <div className=" mx-auto sm:max-w-2xl sm:px-4">
            <div className="flex h-10 items-center justify-center">
              {isLoading ? (
                <Button variant="outline" onClick={() => stop()} className="bg-background">
                  <IconStop className="mr-2" />
                  Stop generating
                </Button>
              ) : (
                messages?.length > 0 && (
                  <Button variant="outline" onClick={() => reload()} className="bg-background">
                    <IconRefresh className="mr-2" />
                    Regenerate response
                  </Button>
                )
              )}
            </div>
            <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
              <PromptForm
                onSubmit={async value => {
                  await append({
                    id,
                    content: value,
                    role: "user",
                  });
                }}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}