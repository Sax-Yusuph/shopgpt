import { OpenAIStream, StreamingTextResponse } from "ai";
import { Context } from "hono";
import OpenAI from "openai";
import { capMessages } from "../utils/capMessages";
import { COMPLETION_MODEL, Message } from "../utils/constants";
import { Prompts } from "../utils/prompts";
import { Bindings, Body, PAGE_TYPE } from "../utils/types";
import { shopifyProductToString } from "../utils/utils";

export async function openAiResponse(c: Context<{ Bindings: Bindings }, "/chat">) {
  const json = await c.req.json();
  const { messages, products, currentProductOnPage, pageType, storeUrl, tabUrl } = json as Body;

  if (!messages) {
    return c.notFound();
    //'Missing text parameter'
  }

  const model = COMPLETION_MODEL;
  const maxCompletionTokenCount = 1024;

  let prompts: Message[];
  const currentProductOrCollection = shopifyProductToString(currentProductOnPage, storeUrl);

  const storeName = storeUrl.replace("www.", "").replace(/(?:myshopify\.com|\.com)/, "");

  switch (pageType) {
    case PAGE_TYPE.PRODUCT:
      prompts = Prompts.product(products, storeName, currentProductOrCollection);
      break;
    case PAGE_TYPE.COLLECTION:
      prompts = Prompts.collection(products, storeName, currentProductOrCollection);
      break;

    default:
      prompts = Prompts.general(products, storeName);
      break;
  }

  const completionMessages = capMessages(prompts, messages, maxCompletionTokenCount, model);

  const openAi = new OpenAI({ apiKey: c.env.OPENAI_KEY });
  const res = await openAi.chat.completions.create({
    model,
    messages: completionMessages,
    stream: true,
  });
  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}
