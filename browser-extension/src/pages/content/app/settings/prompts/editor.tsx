import { useColorMode } from '@/ui/color-mode/provider'

import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { Heart, Newspaper, PencilSquare } from '@medusajs/icons'
import { Button, Label, Textarea } from '@medusajs/ui'
import { nanoid } from 'ai'
import { useEffect, useState } from 'react'
import { HistoryPrompt } from './types'

export function PromptEditor({ onViewHistory }: { onViewHistory(): void }) {
  const { colorMode } = useColorMode()
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    if (!prompt) {
      storage
        .get<string>('instructions')
        .then((prompt) => {
          setPrompt(prompt || DEFAULT_SYSTEM_PROMPT)
        })
        .catch(logger)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full space-y-4 border-b py-4 px-2">
      <div className="flex gap-2 items-center">
        <PencilSquare />
        <Label>Edit system prompt</Label>
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={15}
        className="font-mono h-auto border-none resize-none"
        style={{ colorScheme: colorMode }}
        onBlur={() => {
          storage.set('instructions', prompt).catch(logger)
        }}
      />

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onViewHistory}>
          <Newspaper />
          View History
        </Button>

        <Button
          variant="primary"
          onClick={async () => {
            try {
              let prev = await storage.get<HistoryPrompt[]>('prompt_history')

              if (typeof prev === 'string') {
                prev = JSON.parse(prev)
              }

              if (prompt) {
                const exist = prev.findIndex((h) => h.prompt === prompt)
                if (exist === -1) {
                  const newHistory = JSON.stringify([
                    ...prev,
                    { id: nanoid(), prompt },
                  ])
                  storage.set('prompt_history', newHistory)
                }
              }
            } catch (error) {
              logger(error)
            }
          }}
        >
          <Heart />
          Save
        </Button>
      </div>
    </div>
  )
}

const DEFAULT_SYSTEM_PROMPT = `
when the user asks a question,
1. Your task is to answer the question using the store information as reference.
2. If an answer to the question is provided, it MUST display the correct product link and image of the product. 
3. Provide a good description of each product, and state the reasons why it's a recommended over the others.
4. Provide a least 2 options, so that the user can choose from a range of options.
5. Space out your answers into nice paragraphs and make it readable
`
