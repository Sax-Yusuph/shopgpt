"use client";

import { STORAGE, initialSystemPrompt } from "@/lib/utils";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { useLocalStorageState, useToggle } from "ahooks";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
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
  const [systemPrompt, setSystemPrompt] = useLocalStorageState(STORAGE.SYSTEM_PROMPT, {
    defaultValue: initialSystemPrompt,
  });

  const onSelect = useCallback(
    (history: HistoryPrompt) => {
      if (history.prompt) {
        setSystemPrompt(history.prompt);
      }

      toggle();
    },
    [setSystemPrompt, toggle]
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
                const exist = history.find(h => h.prompt === systemPrompt);
                if (!exist) {
                  saveHistory([...history, { id: uuidv4(), prompt: systemPrompt }]);
                  return toast.success("saved");
                }
                toast.error("prompt already saved");
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
          <div key={h.id} className="relative cursor-pointer border rounded-lg">
            <Textarea
              rows={6}
              value={h.prompt}
              readOnly
              className="hover:bg-accent/50 p-3 cursor-pointer border-b font-mono pb-3"
            />
            <div className="bg-background border-t flex items-center justify-end px-3 absolute bottom-0 w-full">
              <div className="flex-1 flex justify-end py-1 space-x-3 border-r ">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full border-destructive "
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(h);
                  }}
                >
                  <IconTrash className="text-destructive" />
                </Button>
              </div>
              <div className="flex-1 px-3">
                <Button variant="default" className="w-full" onClick={() => onSelect(h)}>
                  Select
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
