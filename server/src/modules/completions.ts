import { OpenAIStream, StreamingTextResponse } from "ai";
import { Context } from "hono";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { COMPLETION_MODEL } from "../utils/constants";
import { Bindings } from "../utils/types";

type Body = {
  completions: ChatCompletionMessageParam[];
  messages: ChatCompletionMessageParam[];
};

export async function openAiChatResponse(c: Context<{ Bindings: Bindings }, "/chat">) {
  const json = (await c.req.json()) as Body;
  const { completions } = json;

  console.log({ completions });
  if (!completions) {
    return c.notFound();
    //'Missing text parameter'
  }

  const openAi = new OpenAI({ apiKey: c.env.OPENAI_KEY });
  const res = await openAi.chat.completions.create({
    model: COMPLETION_MODEL,
    messages: completions.map(c => ({ role: c.role, content: c.content })),
    stream: true,
    max_tokens: 1024,
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}
