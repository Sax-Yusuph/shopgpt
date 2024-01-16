import { ArrowUturnLeft, FlyingBox } from '@medusajs/icons'
import { Button, Text, useToggleState } from '@medusajs/ui'

import { ScrollAreaV2 } from '@/ui/scroll-area/scroll-area'
import { PromptEditor } from './editor'
import { PromptHistory } from './history'

export default function PromptSettings() {
  const [isHistoryView, open, close] = useToggleState()

  return (
    <div className="relative h-[calc(100%-75px)] px-2">
      {isHistoryView ? (
        <div className="w-full space-y-4  py-4 px-2">
          <div className="flex gap-2 items-center">
            <FlyingBox />
            <Text>Prompt history</Text>
          </div>

          <ScrollAreaV2 className="h-[420px] px-2">
            <PromptHistory onSelectPrompt={close} />
          </ScrollAreaV2>

          <Button variant="secondary" onClick={close}>
            <ArrowUturnLeft />
            Back
          </Button>
        </div>
      ) : (
        <PromptEditor onViewHistory={open} />
      )}
    </div>
  )
}
