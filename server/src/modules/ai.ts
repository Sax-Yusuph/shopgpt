import { OpenAIStream, StreamingTextResponse } from "ai";
import { Context } from "hono";
import OpenAI from "openai";
import { COMPLETION_MODEL, MessageRole } from "../utils/constants";
import { getPrompts } from "../utils/prompts";
import { Bindings, Body } from "../utils/types";
import { shopifyProductToString } from "../utils/utils";

export async function openAiResponse(c: Context<{ Bindings: Bindings }, "/chat">) {
  const json = await c.req.json();
  const { messages, products, currentProductOnPage, pageType, storeUrl, completions } = json as Body;

  if (!messages) {
    return c.notFound();
    //'Missing text parameter'
  }

  const model = COMPLETION_MODEL;

  const currentProductOrCollection = shopifyProductToString(currentProductOnPage, storeUrl);

  const storeName = storeUrl.replace("www.", "").replace(/(?:myshopify\.com|\.com)/, "");

  const [userMessage] = messages.filter(({ role }) => role === MessageRole.User).slice(-1);

  const prompts = getPrompts({
    storeName,
    question: userMessage.content,
    currentProduct: cap(currentProductOrCollection, 500),
    contextText: currentProductOrCollection ? cap(products, 4500) : cap(products),
    pageType,
  });

  const openAi = new OpenAI({ apiKey: c.env.OPENAI_KEY });
  const res = await openAi.chat.completions.create({
    model,
    messages: prompts,
    stream: true,
    max_tokens: 1024,
    temperature: 0,
  });
  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}

function cap(text: string, max = 5000) {
  const ss = text.split(",");

  while (ss.join(",").length > max) {
    ss.pop();
  }

  return ss.join(",");
}
