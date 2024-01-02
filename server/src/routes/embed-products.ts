import { HTTPException } from "hono/http-exception";
import { batchProducts } from "../lib/batch";
import { filterUndefined } from "../lib/filter";
import { AppContext, SanitizedResponse } from "./types";

type Body = {
  storeUrl: string;
  products: SanitizedResponse[];
};

export async function embedProducts(c: AppContext<"/scrape">) {
  const blob = await c.req.blob();

  let { storeUrl, products } = JSON.parse(await blob.text()) as Body;

  if (!storeUrl || !products.length) {
    throw new HTTPException(400, { message: "no store found" });
  }

  const productsChunk = batchProducts(products);
  console.log("batch size", productsChunk.length);

  for (const chunk of productsChunk) {
    const embeddings = await c.var.createEmbedding(
      chunk.map((p) => p.description)
    );

    const itemsToEmbed = chunk.map((p, productIndex) => {
      const embedding = embeddings[productIndex]?.embedding;

      if (!embedding) {
        console.log("embedding not found for product", p.description);
        return undefined;
      }

      return {
        id: `${p.id}`,
        data: p.content,
        store: storeUrl,
        category: p.type,
        embedding,
      };
    });

    console.log("SAVING PRODUCTS...");
    await c.var.saveProducts(filterUndefined(itemsToEmbed));
  }

  return c.json({ message: "SHOPIFY STORE INDEXED COMPLETE" });
}
