import { useColorMode } from '@/components/color-mode/provider'
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/completions/getPrompts'
import { StorageKeys } from '@/lib/constants'
import {
  ArrowUturnLeft,
  FlyingBox,
  Heart,
  Newspaper,
  PencilSquare,
  Trash,
} from '@medusajs/icons'
import {
  Button,
  IconButton,
  Label,
  Text,
  Textarea,
  useToast,
  useToggleState,
} from '@medusajs/ui'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { nanoid } from 'ai'

import { createChromeStorageStateHookLocal } from 'use-chrome-storage'

export default function PromptSettings() {
  const [isHistoryView, open, close] = useToggleState()
  const { colorMode } = useColorMode()

  const [systemPrompt, setSystemPrompt] = useSystemPrompt()
  const [history, updatePromptHistory] = useSystemPromptHistory()
  const { toast } = useToast()

  const onDelete = (h: HistoryPrompt) => {
    updatePromptHistory((state) => {
      return state.filter((prompt) => h.id !== prompt.id)
    })
  }

  const onSelect = (h: HistoryPrompt) => {
    if (h.prompt) {
      setSystemPrompt(h.prompt)
    }
    close()
  }

  return (
    <div className="relative h-[calc(100%-75px)] px-2 ">
      {isHistoryView ? (
        <div className="w-full space-y-4  py-4 px-2">
          <div className="flex gap-2 items-center">
            <FlyingBox />
            <Text>Prompt history</Text>
          </div>

          <ScrollArea className="h-[420px] px-2">
            <PromptHistory
              onDelete={onDelete}
              onSelect={onSelect}
              history={history}
            />
          </ScrollArea>
        </div>
      ) : (
        <div className="w-full space-y-4 border-b py-4 px-2">
          <div className="flex gap-2 items-center">
            <PencilSquare />
            <Label>Edit system prompt</Label>
          </div>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={15}
            onBlur={console.log}
            className="font-mono h-auto border-none resize-none"
            style={{ colorScheme: colorMode }}
          />
        </div>
      )}

      <div className="flex justify-end pt-2 w-full px-4">
        {isHistoryView ? (
          <Button variant="secondary" onClick={close}>
            <ArrowUturnLeft />
            Back
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={open}>
              <Newspaper />
              View History
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                updatePromptHistory((state) => {
                  if (systemPrompt) {
                    const exist = history.find((h) => h.prompt === systemPrompt)
                    if (!exist) {
                      toast({
                        title: 'Sucess',
                        description: 'Your prompt has been saved',
                      })
                      return [...state, { id: nanoid(), prompt: systemPrompt }]
                    }
                    toast({
                      title: 'Error',
                      description: 'Your prompt has already been saved',
                      variant: 'error',
                    })
                  }

                  return state
                })
              }}
            >
              <Heart />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

type HistoryPrompt = { id: string; prompt: string }

interface PromptHistoryProps {
  history: HistoryPrompt[]
  onDelete(h: HistoryPrompt): void
  onSelect(h: HistoryPrompt): void
}

function PromptHistory({ history, onDelete, onSelect }: PromptHistoryProps) {
  const { colorMode } = useColorMode()

  return (
    <div className="space-y-3 p-2 ">
      {history.map((h) => {
        return (
          <div key={h.id} className="relative cursor-pointer rounded-lg">
            <Textarea
              rows={6}
              value={h.prompt}
              readOnly
              className="font-mono pb-3"
              style={{ colorScheme: colorMode }}
            />

            <IconButton
              variant="primary"
              className="group-hover:block hidden absolute text-ui-tag-red-icon top-2 right-2"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(h)
              }}
            >
              <Trash />
            </IconButton>

            <Button
              variant="secondary"
              className="w-full "
              onClick={() => onSelect(h)}
            >
              Select
            </Button>
          </div>
        )
      })}
    </div>
  )
}

const useSystemPrompt = createChromeStorageStateHookLocal<string>(
  StorageKeys.SYSTEM_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
)

const useSystemPromptHistory = createChromeStorageStateHookLocal<
  HistoryPrompt[]
>(StorageKeys.SYSTEM_PROMPT_HISTORY, [])
