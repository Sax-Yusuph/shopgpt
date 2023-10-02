import { Product } from '@/types'
import { proxy } from 'valtio'

export const chatState = proxy({ loading: false })
export type ChatState = { loading: boolean }

export const updateState = (state: boolean) => {
  chatState.loading = state
}

export const productMatches = proxy<{ products: Product[] }>({ products: [] })

export const updateMatches = (p: Product[]) => {
  productMatches.products = p
}
