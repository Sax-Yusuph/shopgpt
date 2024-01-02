import config from '@/config'

export function logger(...args: unknown[]) {
  if (config.enableLogs) {
    console.log(...args)
  }
}
