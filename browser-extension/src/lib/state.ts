import { ShopAi } from '@/types'
import { proxy } from 'valtio'

export const chatState = proxy({ loading: false })
export type ChatState = { loading: boolean }

export const updateState = (state: boolean) => {
  chatState.loading = state
}

export const status = proxy<{ value: ShopAi['status'] }>({ value: 'ready' })

export const updateStatus = (v: ShopAi['status']) => {
  status.value = v
}
