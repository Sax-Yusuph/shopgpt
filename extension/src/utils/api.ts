import config from '@/config'
import type OpenAI from 'openai'
import { convertToBlob } from './json-to-blob'
import { storage } from './storage'

export type Message = Pick<
  OpenAI.Beta.Threads.Messages.ThreadMessage,
  'content' | 'id' | 'role'
>

export class API {
  static async checkStoreExists(storeUrl: string) {
    const res = await fetch(API_URL.checkStoreExists, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeUrl }),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    return data.exists
  }

  static async clearContextHistory(id: string, store: string) {
    const res = await fetch(API_URL.clear, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, store }),
    })

    return await res.json()
  }

  // using the server to scrape the stores will get the ip blacklisted
  // as a workaround, so we fetch the products from client's browser.
  //then upload as a blob
  static async embedStore(storeUrl: string, products: unknown[]) {
    const blob = convertToBlob({ products, storeUrl })

    const res = await fetch(API_URL.scrape, {
      method: 'POST',
      body: blob,
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return await res.json()
  }

  static async getRecommendations(input: string, store: string) {
    const userId = await storage.get<string>('browserId')
    const res = await fetch(API_URL.getRecommendations, {
      method: 'POST',
      body: JSON.stringify({ input, store, userId }),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return await res.json()
  }
}

const BASE_URL = config.apiBaseUrl
export const API_URL = {
  chat: `${BASE_URL}/chat`,
  clear: `${BASE_URL}/clear`,
  scrape: `${BASE_URL}/embed`,
  checkStoreExists: `${BASE_URL}/check`,
  getRecommendations: `${BASE_URL}/recommendations`,
}
