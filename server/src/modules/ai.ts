import { OpenAIStream, StreamingTextResponse } from "ai";
import { Context } from "hono";
import OpenAI from "openai";
import { ERR, err, ok } from "../../error";
import { capMessages } from "../utils/capMessages";
import { COMPLETION_MODEL, Message } from "../utils/constants";
import { Prompts } from "../utils/prompts";
import { tokenizer } from "../utils/tokenizer";
import { Bindings, Body, PAGE_TYPE, ShopifyProduct } from "../utils/types";
import { shopifyProductToString } from "../utils/utils";

export async function openAiResponse(c: Context<{ Bindings: Bindings }, "/chat">) {
  const json = await c.req.json();
  const { messages, products = [], pageType, tabUrl, storeUrl } = json as Body;

  if (!messages) {
    return c.notFound();
    //'Missing text parameter'
  }

  const model = COMPLETION_MODEL;

  let tokenCount = 0;
  let contextText = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const content = product.data;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.length;

    const max = model?.includes("gpt-4") || model?.includes("16k") ? 5000 : 1500;

    if (tokenCount >= max) {
      break;
    }

    contextText += `---\n ${content.trim()}\n ---`;
  }

  const maxCompletionTokenCount = 1024;

  let prompts: Message[];
  const currentProductOrCollection = await getCurrentPageItems(pageType, tabUrl, storeUrl);

  const storeName = products[0]?.store.replace("www.", "").replace(/(?:myshopify\.com|\.com)/, "");

  switch (pageType) {
    case PAGE_TYPE.PRODUCT:
      prompts = Prompts.product(contextText, storeName, currentProductOrCollection);
      break;
    case PAGE_TYPE.COLLECTION:
      prompts = Prompts.collection(contextText, storeName, currentProductOrCollection);
      break;

    default:
      prompts = Prompts.general(contextText, storeName);
      break;
  }

  const completionMessages = capMessages(prompts, messages, maxCompletionTokenCount, model);

  const openAi = new OpenAI({ apiKey: c.env.OPENAI_KEY });
  const res = await openAi.chat.completions.create({
    model,
    messages: completionMessages,
    stream: true,
    // max_tokens:1024
  });
  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}

const fetchJson = async (url: string) => {
  const resp = await fetch(`${url}.json`);

  if (resp.ok) {
    const json = (await resp.json()) as { product: ShopifyProduct };
    return ok(json.product);
  }
  return err("Fetch failed");
};

async function getCurrentPageItems(pageType: PAGE_TYPE, tabUrl: string, storeUrl: string) {
  if (pageType === PAGE_TYPE.GENERAL) {
    return "";
  }
  const resp = await fetchJson(tabUrl);
  if (resp.kind === ERR) {
    return "";
  }

  return shopifyProductToString(resp.value, storeUrl);
}
