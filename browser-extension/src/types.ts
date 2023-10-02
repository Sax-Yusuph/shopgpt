declare global {
  interface Window {
    Shopify: Shopify
    storeUrl?: string
    isShopify: boolean
    showPanel: boolean
    toggleDisplay(): void
    pageType: 'collection' | 'general' | 'product'
    tabUrl?: string
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

export type Message = {
  action:
    | `panel:${'hide' | 'toggle'}`
    | `chat:${'match-embedding'}`
    | `event:${'window-loaded'}`
  value?: string
  params?: Partial<{
    storeUrl: string
    isShopify: boolean
    showPanel: boolean
    pageType: 'collection' | 'general' | 'product'
    tabUrl: string
  }>
}

export type Product = { title: string; data: string }

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
export const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled'
