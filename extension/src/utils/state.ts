import { ShopAi } from '@/types'
import { proxy } from 'valtio'

export const chatState = proxy({ loading: false })
export type ChatState = { loading: boolean }

export const updateState = (state: boolean) => {
  chatState.loading = state
}

export const status = proxy<Pick<ShopAi, 'status' | 'loadProgress'>>({
  status: 'ready',
  loadProgress: undefined,
})

export const updateStatus = (v: ShopAi['status']) => {
  status.status = v
}

export const updateInitProgress = (v: ShopAi['loadProgress']) => {
  status.loadProgress = v
}

export type ProductRecomendation = {
  title: string
  description: string
  link: string
  prices: string
  type: string
  image: string
}

export const productsRecommendation = proxy<{
  products: ProductRecomendation[]
}>({
  products: [],
})

export const updateProducts = (products: ProductRecomendation[]) => {
  productsRecommendation.products = products
}

export const panelSize = proxy<{ expand: boolean }>({
  expand: false,
})

export const togglePanelSize = () => {
  panelSize.expand = !panelSize.expand
}
