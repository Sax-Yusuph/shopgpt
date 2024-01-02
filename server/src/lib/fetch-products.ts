import { ShopifyProduct } from "../routes/types";
import { isFulfilled } from "../routes/utils";
import { sanitize } from "./sanitize";

export async function fetchProducts(store: string) {
  const urls = pages(store);

  const products = await Promise.allSettled(urls.map(fetcher));

  const response = products
    .filter(isFulfilled)
    .map((t) => t.value)
    .flat(2)
    .filter(Boolean) as ShopifyProduct[];

  if (!response.length) {
    return [];
  }

  return sanitize(response, store);
}

async function fetcher(url: string) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  const data = (await response.json()) as { products: ShopifyProduct[] };

  return data.products;
}

function pages(store: string) {
  return Array(20)
    .fill("_")
    .map((_, i) => `https://${store}/products.json?limit=250&page=${i + 1}`);
}
