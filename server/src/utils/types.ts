import { Message } from './constants.js'
export type Body = {
  messages: Message[]
  storeUrl: string
  id: string
  products: { data: string; similarity: number; store: string }[]
  pageType: PAGE_TYPE
  tabUrl: string
}
export type Bindings = {
  OPENAI_KEY: string
}

export enum PAGE_TYPE {
  GENERAL = 'general',
  PRODUCT = 'product',
  COLLECTION = 'collection',
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
