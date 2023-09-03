"use client";

import { STORAGE } from "@/lib/utils";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { useLocalStorageState, useToggle } from "ahooks";
import { useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { MemoizedReactMarkdown } from "./markdown";
import { Button, buttonVariants } from "./ui/button";
import { IconTrash } from "./ui/icons";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scrollArea";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type HistoryPrompt = { id: string; prompt: string };
export const SystemPromptHistory = () => {
  const [showHistory, { toggle }] = useToggle();
  const [history, saveHistory] = useLocalStorageState<HistoryPrompt[]>(STORAGE.SYSTEM_PROMPT_HISTORY, {
    defaultValue: [],
  });
  const [systemPrompt, setSystemPrompt] = useLocalStorageState(STORAGE.SYSTEM_PROMPT, { defaultValue: initialPrompt });

  const ref = useRef<MDXEditorMethods>(null);

  const onSelect = useCallback(
    (history: HistoryPrompt) => {
      if (history.prompt) {
        ref.current?.setMarkdown(history.prompt);
      }

      toggle();
    },
    [toggle]
  );

  const onDelete = useCallback(
    (prompt: HistoryPrompt) => {
      const hist = history.filter(h => h.id !== prompt.id);
      saveHistory(hist);
      toast.success("deleted success");
    },
    [history, saveHistory]
  );
  return (
    <div className="space-y-4 px-5">
      <div className="flex items-center justify-between w-full">
        <Label className="font-sans">System prompt {showHistory ? "(History)" : null}</Label>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={toggle} className={buttonVariants({ size: "icon", variant: "outline" })}>
              {showHistory ? <BookmarkFilledIcon /> : <BookmarkIcon />}
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Toggle history</TooltipContent>
        </Tooltip>
      </div>

      {showHistory ? (
        <ScrollArea className="h-[300px] lg:h-[500px]">
          <PromptHistory onDelete={onDelete} onSelect={onSelect} history={history} />
        </ScrollArea>
      ) : (
        <Textarea
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          // rows={20}
          placeholder="You are a helpful assistant"
          className={`font-mono min-h-[28vh]`}
        />
      )}

      {showHistory ? null : (
        <div className="flex w-full justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              if (systemPrompt) {
                saveHistory([...history, { id: uuidv4(), prompt: systemPrompt }]);
                toast.success("saved");
              }
            }}
            className="font-sans"
          >
            Save history
          </Button>
        </div>
      )}
    </div>
  );
};

const PromptHistory = ({
  history,
  onSelect,
  onDelete,
}: {
  history: HistoryPrompt[];
  onDelete(h: HistoryPrompt): void;
  onSelect(h: HistoryPrompt): void;
}) => {
  return (
    <div className="space-y-3 p-2">
      {history.map(h => {
        return (
          <div key={h.id} className="relative cursor-pointer border rounded-lg" onClick={() => onSelect(h)}>
            <div className="hover:bg-accent/50 p-3  border-b">
              <MemoizedReactMarkdown className="text-sm">{h.prompt.slice(0, 200) + " ..."}</MemoizedReactMarkdown>
            </div>
            <div
              className="bg-muted flex justify-end px-3"
              onClick={e => {
                e.stopPropagation();
                onDelete(h);
              }}
            >
              <div className="flex-1 "></div>
              <div className="flex-1 flex justify-end py-1">
                <Button variant="destructive">
                  <IconTrash />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const initialPrompt = `
- You are a sax shopping assistant who loves to help to help people!;

- you will be provided a list of products in markdown format to choose from
 
- Answer in the following format in markdown

- Product name and description also tell me why it is a better product

- Information on available sizes, product link and price

- product images

`;
