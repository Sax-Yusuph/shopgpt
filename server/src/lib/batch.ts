import { SanitizedResponse } from "../routes/types";
import tokenizer from "./tokenizer";

export async function batchProducts(
  products: SanitizedResponse[],
  batchSizeLimit = 8_192 //this is the token limit for text ada 002
) {
  let currentBatch: SanitizedResponse[] = [];
  let currentBatchLength = 0;
  const batches = [];

  const encoder = await tokenizer.getEncoder();
  for (const product of products) {
    const productLength = encoder.encode(product.description).length;

    if (currentBatchLength + productLength <= batchSizeLimit) {
      // Add the product to the current batch
      currentBatch.push(product);
      currentBatchLength += productLength;
    } else {
      // Start a new batch
      batches.push(currentBatch);
      currentBatch = [product];
      currentBatchLength = productLength;
    }
  }

  // Add the last batch if it's not empty
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}
