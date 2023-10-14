export const storage = {
  get: (
    key: string,
    defaultValue?: string,
    storageArea: 'local' | 'sync' = 'local',
  ) => {
    const keyObj = defaultValue === undefined ? key : { [key]: defaultValue }
    return new Promise((resolve, reject) => {
      chrome.storage[storageArea].get(keyObj, (items) => {
        const error = chrome.runtime.lastError
        if (error) return reject(error)
        resolve(items[key])
      })
    })
  },
  set: (
    key: string,
    value: string,
    storageArea: 'local' | 'sync' = 'local',
  ) => {
    return new Promise((resolve, reject) => {
      chrome.storage[storageArea].set({ [key]: value }, () => {
        const error = chrome.runtime.lastError
        error ? reject(error) : resolve('done')
      })
    })
  },
}
