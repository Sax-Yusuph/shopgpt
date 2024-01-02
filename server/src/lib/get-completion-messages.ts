import { ChatCompletionMessageParam } from "openai/resources/chat";
import { AppContext, SupabaseProduct } from "../routes/types";
import { getContext } from "../routes/utils";

const DEFAULT_SYSTEM_PROMPT = `
  when the user asks a question,
  1. Your task is to answer the question using the store information as reference and to cite the exact links and images of the products used to answer the question. 
  2. If an answer to the question is provided, it must display the correct product link and image of the product. 
  3. you should provide a good description of the product, and state the reasons why it's a recommended over the others.
  4. try to provide a least 2 answers, so that the user can choose from a range of options.
  5. you should also convince the buyer on why each is better
  6. Space out your answers into nice paragraphs and make it readable
  `;

type Options = {
  products: SupabaseProduct[];
  instructions: string;
  userId: string;
  store: string;
};

export async function getCompletionMessages(
  c: AppContext<"/">,
  params: Options
) {
  let {
    products,
    instructions = DEFAULT_SYSTEM_PROMPT,
    userId,
    store,
  } = params;

  const id = `${userId}-${store}`;
  const savedContext = await c.var.getContextHistory(id);

  if (!products.length && !savedContext) {
    products = await c.var.getProductByCategories(store);
  }

  let productContext = getContext(products);
  const productsSet = new Set<string>(
    savedContext ? savedContext.split(SPLITTER) : undefined
  );

  if (productContext) {
    productContext.split(SPLITTER).forEach((product) => {
      productsSet.add(product);
    });
  }

  const prodArray = Array.from(productsSet);

  // use this to control the max content length
  if (prodArray.length > c.env.matchCount) {
    const diff = prodArray.length - c.env.matchCount;
    prodArray.splice(0, diff);
  }

  // convert back to string
  productContext = prodArray.join(SPLITTER);

  await c.var.saveContextHistory(id, productContext);

  return systemPrompt(productContext, instructions);
}

const systemPrompt = (
  context: string,
  instructions: string
): ChatCompletionMessageParam[] => {
  return [
    {
      role: "system",
      content: `
          You are a shopping assistant that help people to shop better.
          here is the store information delimited by triple quotes, containing the list of relevant products on the store.
         
          """
          ${context || "No Products found"}
          """
  
          ${instructions}
          if no products are found, reply with I'm sorry, but I couldn't find any items matching your search. Can you please provide more details about the type of item you are looking for?
      `,
    },
  ];
};

const SPLITTER = "---";
