import { SanitizedResponse } from "../routes/types";

export function batchProducts(products: SanitizedResponse[], batchSizeLimit = 5000) {
  let currentBatch: SanitizedResponse[] = [];
  let currentBatchLength = 0;
  const batches = [];

  for (const product of products) {
    const productLength = product.description.length;

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
