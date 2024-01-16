export interface ShopAi {
  storeUrl: string
  isShopify?: boolean
  showPanel?: boolean
  pageType?: PAGE_TYPE
  status?: 'loading' | 'indexing' | 'ready' | 'error'
  loadProgress?: number
  noOfProducts?: number
  tabUrl?: string
  sessionId: string
}
declare global {
  interface Window {
    Shopify: Shopify
    shopai: ShopAi
    shopaiActions: {
      toggleDisplay(): void
    }
  }
}

export interface Shopify {
  trackingConsent?: Record<string, string>
  customerPrivacy?: Record<string, string>
  locale: string
  shop: string
  country: string
  currency: {
    rate: string
    active: string
  }
}

export interface SupabaseProduct {
  id: string
  title: string
  brand: string
  description: string
  data: string
  embedding: number[]
  store: string
  lastPublished: Date
  handle: string
  link: string
  image: string
}

export type Message = {
  action:
    | `install`
    | `toggle`
    | 'loading'
    | `chat:${'match-embedding'}`
    | `event:${'loading' | 'indexing-product-items'}`
  value?: string
  params?: ShopAi
}

export type Product = {
  data: string
  similarity: number
  store: string
}

interface Image {
  id: number
  created_at: string
  position: number
  updated_at: string
  product_id: number
  variant_ids: number[]
  src: string
  width: number
  height: number
}

interface Variant {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: null
  available: boolean
  price: string
  grams: number
  compare_at_price: string
  weight?: string
  weight_unit?: string
  position: number
  product_id: number
  created_at: string
  updated_at: string
}

interface Option {
  name: string
  position: number
  values: string[]
}

export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  body_html: string
  published_at: string
  created_at: string
  updated_at: string
  vendor: string
  product_type: string
  tags: string[]
  variants: Variant[]
  images: Image[]
  options: Option[]
}

export type ShopifyResponse = {
  id: number
  title: string
  description: string
  vendor: string
  handle: string
  lastPublished: Date
  content: string
  link: string
  image: string
}

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled'

export enum PAGE_TYPE {
  GENERAL = 'general',
  PRODUCT = 'products',
  COLLECTION = 'collections',
}

export type SanitizedResponse = {
  id: number
  // title: string
  description: string
  // vendor: string
  // handle: string
  // lastPublished: Date
  content: string
  // link: string
  // image: string
  type: string
}
