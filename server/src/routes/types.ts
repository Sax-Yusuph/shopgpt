import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "hono";
import OpenAI from "openai";
import { Embedding } from "openai/resources";

export type Bindings = {
  OPENAI_KEY: string;
  ASSISTANT_ID: string;
  AI_MODEL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  checkStoreFunctionName: string;
  findSimilarItemsFunctionName: string;
  getProductsCatergoriesFunctionName: string;
  productTableName: string;
  matchThreshold: number;
  matchCount: number;
  SHOP_AI_CONTEXT_HISTORY: KVNamespace;
};

export type Variables = {
  supabase: SupabaseClient<any, "public", any>;
  openAi: OpenAI;
  /** implementations found in openai.ts middleware */
  createCompletion(input: OpenAI.ChatCompletionMessageParam[]): Promise<any>;
  createEmbedding(input: string | string[]): Promise<Array<Embedding>>;

  /** implementations found in supabase.ts middleware */
  checkStoreExists(store: string): Promise<boolean>;
  findSimilarItems(
    embedding: ArrayLike<number>,
    store: string
  ): Promise<SupabaseProduct[]>;

  saveProducts(products: EmbededProducts[]): Promise<null>;
  saveProduct(product: EmbededProducts): Promise<null>;
  saveContextHistory(key: string, value: string): Promise<void>;
  getContextHistory(key: string): Promise<string | null>;
  getProductByCategories(store: string): Promise<SupabaseProduct[]>;
};

export type AppContext<Route extends string> = Context<
  { Bindings: Bindings; Variables: Variables },
  Route
>;

export type SupabaseProduct = {
  data: string;
  similarity?: number;
  store: string;
  category?: string;
  rn?: number;
};

export type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: Variant[];
  images: Image[];
  options: Option[];
};

interface Image {
  id: number;
  created_at: string;
  position: number;
  updated_at: string;
  product_id: number;
  variant_ids: number[];
  src: string;
  width: number;
  height: number;
}

export type EmbededProducts = {
  id: string;
  data: string;
  embedding: ArrayLike<number>;
  store: string;
  category?: string;
};

interface Variant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: null;
  available: boolean;
  price: string;
  grams: number;
  compare_at_price: string;
  weight?: string;
  weight_unit?: string;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export type SanitizedResponse = {
  id: number;
  // title: string
  description: string;
  // vendor: string
  // handle: string
  // lastPublished: Date
  content: string;
  // link: string
  // image: string
  type: string;
};

interface Option {
  name: string;
  position: number;
  values: string[];
}
