import { logger } from '@/lib/logger'
import Pipeline from '@/lib/pipeline'

export async function onExtensionInstalled(
  details: chrome.runtime.InstalledDetails,
) {
  
  logger('[background.ts] > onInstalled', details)
  // load our models down for future useage
  await Pipeline.getInstance((progress) => {
    if (progress.status === 'ready') {
      logger('model is ready to be used')
    }
  })
}
