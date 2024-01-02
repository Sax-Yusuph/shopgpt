import { useColorMode } from '@/ui/color-mode/provider'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { Trash } from '@medusajs/icons'
import { Button, IconButton, Textarea } from '@medusajs/ui'
import { Fragment, useEffect, useState } from 'react'
import { HistoryPrompt } from './types'

export function PromptHistory({ onSelectPrompt }: { onSelectPrompt(): void }) {
  const { colorMode } = useColorMode()
  const [history, setHistory] = useState<HistoryPrompt[]>([])

  useEffect(() => {
    if (!history.length) {
      storage
        .get<HistoryPrompt[]>('prompt_history')
        .then((h) => {
          if (Array.isArray(h)) {
            return setHistory(h)
          }

          setHistory(JSON.parse(h))
        })
        .catch(logger)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDelete = (h: HistoryPrompt) => {
    const newHistory = history.filter((history) => history.id !== h.id)
    setHistory(newHistory)
    storage.set('prompt_history', newHistory).catch(logger)
  }

  const onSelect = (h: HistoryPrompt) => {
    if (h.prompt) {
      storage.set('prompt_history', h.prompt).catch(logger)
    }
    onSelectPrompt()
  }

  return (
    <div className="space-y-6">
      {history.map((h) => {
        return (
          <Fragment>
            <div
              key={h.id}
              className="relative cursor-pointer rounded-lg space-y-3"
            >
              <Textarea
                rows={6}
                value={h.prompt}
                readOnly
                className="font-mono pb-3"
                style={{ colorScheme: colorMode }}
              />

              <div className="flex items-center space-x-4">
                <IconButton
                  variant="primary"
                  className="text-ui-tag-red-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(h)
                  }}
                >
                  <Trash />
                </IconButton>

                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => onSelect(h)}
                >
                  Select
                </Button>
              </div>
            </div>

            <div className="border-b border-ui-border-base w-full" />
          </Fragment>
        )
      })}
    </div>
  )
}
