import { logger } from './logger'

type KEYS = 'browserId' | 'instructions' | 'prompt_history' | 'theme'

export const storage = {
  get: <T>(key: KEYS, storageArea: 'local' | 'sync' = 'local') => {
    return new Promise<T>((resolve, reject) => {
      chrome.storage[storageArea].get(key, (items) => {
        const error = chrome.runtime.lastError
        if (error) return reject(error)
        const value = items[key]
        const result = tryParse(value) as T

        resolve(result as T)
      })
    })
  },
  set: (key: KEYS, value: unknown, storageArea: 'local' | 'sync' = 'local') => {
    return new Promise((resolve, reject) => {
      chrome.storage[storageArea].set({ [key]: JSON.stringify(value) }, () => {
        const error = chrome.runtime.lastError
        error ? reject(error) : resolve('done')
      })
    })
  },
}

const tryParse = (value: unknown) => {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch (error) {
    logger('storage.ts', error)
  }
}
