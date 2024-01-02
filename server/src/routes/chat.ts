import { OpenAIStream, StreamingTextResponse } from "ai";
import { HTTPException } from "hono/http-exception";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { getCompletionMessages } from "../lib/get-completion-messages";
import tokenizer from "../lib/tokenizer";
import { AppContext } from "./types";
import { getLastUserMessage } from "./utils";

type Body = {
  messages: ChatCompletionMessageParam[];
  store: string;
  instructions: string;
  userId: string;
};

export async function openAiChat(c: AppContext<"/chat">) {
  const json = (await c.req.json()) as Body;
  const { messages, store, instructions, userId } = json;

  if (!messages?.length) {
    throw new HTTPException(404, { message: "completion params required" });
  }

  const userMessage = getLastUserMessage(messages);
  const [output] = await c.var.createEmbedding(userMessage);
  const products = await c.var.findSimilarItems(output.embedding, store);

  const prompts = await getCompletionMessages(c, {
    products,
    instructions,
    userId,
    store,
  });

  const completionMessages = await tokenizer.fetch(prompts, messages, 1024);

  const res = await c.var.createCompletion(completionMessages);

  const stream = OpenAIStream(res);

  return new StreamingTextResponse(stream);
}
