import { ArrowUturnLeft, FlyingBox, Heart, Newspaper, PencilSquare, Trash } from "@medusajs/icons";
import { Button, IconButton, Label, Text, Textarea, useToggleState } from "@medusajs/ui";
import { useState } from "react";
import { useColorMode } from "../color-mode/provider";
import { ScrollArea } from "../scroll-area";

const input = `
the buyer is currently browsing on the {{storeName}} store webpage, it's a shopify store.  
You are a shopping assistant that help people to shop better.
here is the store information delimited by triple quotes.
"""
Products list:
{{contextText}}
"""

when the user asks a question,
1. Your task is to answer the question using the store information as reference
and to cite the exact links and images of the products used to answer the question. 
2. If an answer to the question is provided, it must display the correct product link and image of the product. 
3. you should provide a good description of the product, and state the reasons why it's a recommended over the others.
4. try to provide a least 2 answers, so that the user can choose from a range of options.
5. you should also convince the buyer on why each is better 
6. Space out your answers into nice paragraphs and make it readable.

`;
export default function PromptSettings() {
  const [isHistoryView, open, close] = useToggleState();
  const { colorMode } = useColorMode();

  return (
    <div className="relative px-2 h-[calc(100%-75px)]">
      {isHistoryView ? (
        <div className="w-full space-y-4  py-4 px-2">
          <div className="flex space-x-2 items-center">
            <FlyingBox />
            <Text>Prompt history</Text>
          </div>

          <ScrollArea className="h-[420px] px-2">
            <PromptHistory close={close} />
          </ScrollArea>
        </div>
      ) : (
        <div className="w-full space-y-4 border-b py-4 px-2">
          <div className="flex space-x-2 items-center">
            <PencilSquare />
            <Label>Edit system prompt</Label>
          </div>

          <Textarea style={{ colorScheme: colorMode }} value={input} rows={15} />
        </div>
      )}

      <div className="flex justify-end pt-2 w-full px-4">
        {isHistoryView ? (
          <Button variant="secondary" onClick={close}>
            <ArrowUturnLeft />
            Back
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={open}>
              <Newspaper />
              View History
            </Button>
            <Button variant="primary" onClick={open}>
              <Heart />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

type HistoryPrompt = { id: string; prompt: string };

const DUMMY = [
  { id: "asdasds", prompt: "testing other prompts" },
  { id: "asdas", prompt: "testing other prompts" },
  { id: "assasdas", prompt: "testing other prompts" },
  { id: "assdddas", prompt: "testing other prompts" },
  { id: "asdsawwas", prompt: "testing other prompts" },
];

function PromptHistory({ close }: { close(): void }) {
  const [history] = useState<HistoryPrompt[]>(DUMMY);

  const onDelete = (h: HistoryPrompt) => {
    console.log(h);
  };

  const onSelect = (h: HistoryPrompt) => {
    console.log(h);
    close();
  };

  return (
    <div className="space-y-3 p-2">
      {history.map(h => {
        return (
          <div key={h.id} className="group relative cursor-pointer rounded-lg">
            <Textarea rows={6} value={h.prompt} readOnly className="font-mono pb-3" />

            <IconButton
              variant="primary"
              className="group-hover:block hidden absolute text-ui-tag-red-icon top-2 right-2"
              onClick={e => {
                e.stopPropagation();
                onDelete(h);
              }}
            >
              <Trash />
            </IconButton>

            <Button variant="secondary" className="w-full " onClick={() => onSelect(h)}>
              Select
            </Button>
          </div>
        );
      })}
    </div>
  );
}
