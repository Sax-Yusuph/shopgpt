import { HTTPException } from "hono/http-exception";
import { AppContext } from "./types";

type Body = {
  input: string;
  store: string;
  userId: string;
};

export const getRecommendations = async (c: AppContext<"/clear">) => {
  const { input, store, userId } = (await c.req.json()) as Body;

  if (!input) {
    throw new HTTPException(404, { message: "No id" });
  }

  const savedContext = await c.var.getContextHistory(`${userId}-${store}`);

  if (savedContext) {
    const products = toArray(savedContext);
    return c.json(products);
  }

  const [output] = await c.var.createEmbedding(input);
  const products = await c.var.findSimilarItems(output.embedding, store);
  const data = products.map((p) => JSON.parse(p.data));

  return c.json(data);
};

function toArray(input: string) {
  const itemsArray = [];

  // Use regex to find items in curly braces
  var regexPattern = /\{.*?\}/g;

  const matches = input.match(regexPattern);

  if (matches) {
    // Iterate through matches and push parsed JSON objects to the array
    for (const match of matches) {
      try {
        const item = JSON.parse(match);
        itemsArray.push(item);
      } catch (error) {}
    }
  }

  return itemsArray;
}
