import { NextRequest, NextResponse } from "next/server";
import { getServerSdk } from "../sdk";

import { initialStorePrompt, initialSystemPrompt } from "@/lib/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai-edge";
import { capMessages } from "../utils/capMessages";
import { COMPLETION_MODEL } from "../utils/constants";
import { getContextMessages } from "../utils/formatter";
import { initMessages } from "../utils/prompt";
import { tokenizer } from "../utils/tokenizer";

export const runtime = "edge";
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { messages, model = COMPLETION_MODEL, id: sessionId } = json;
  if (!messages) {
    return handleError("Missing text parameter");
  }

  const preferredStore = json.preferredStore || "None";
  const systemPrompt = json.systemPrompt || initialSystemPrompt;
  const preferredStorePrompt = json.preferredStorePrompt || initialStorePrompt;

  const contextMessages = getContextMessages(messages, preferredStore, preferredStorePrompt);
  const { openAi } = getServerSdk();

  const [userMessage] = contextMessages
    .filter(({ role }) => role === ChatCompletionRequestMessageRoleEnum.User)
    .slice(-1);

  if (!userMessage) {
    return handleError("No message with role 'user'");
  }

  const url = request.nextUrl.clone();
  url.pathname = "/api/match";

  // this endpoint creates an embedding and return a list of product matches for us
  const matchResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userMessage),
  });

  if (!matchResponse.ok) {
    return handleError(await matchResponse.json(), 500);
  }

  const productMatches = (await matchResponse.json()) as { title: string; data: string }[];
  let tokenCount = 0;
  let contextText = "";

  for (let i = 0; i < productMatches.length; i++) {
    const product = productMatches[i];
    const content = product.data;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.length;

    if (tokenCount >= 5000) {
      break;
    }

    contextText += `---\n ${content.trim()}\n ---`;
  }

  const maxCompletionTokenCount = 1024;

  const prompts = initMessages(contextText, systemPrompt);

  const completionMessages: ChatCompletionRequestMessage[] = capMessages(
    prompts,
    contextMessages,
    maxCompletionTokenCount,
    model
  );

  const res = await openAi.createChatCompletion({
    model,
    messages: completionMessages,
    max_tokens: 1024,
    temperature: 0,
    stream: true,
  });

  // Transform the response into a readable stream
  const stream = OpenAIStream(res);

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
}

const handleError = (error: string, status: number = 400) => {
  return NextResponse.json({ error }, { status });
};

const aa = [
  {
    role: "system",
    content: `
    - You are a sax shopping assistant who loves to help to help people!;
    \n\n- you will be provided a list of products in markdown format to choose from\n \n
    - Answer in the following format in markdown\n\n
    - Product name and description\n\n
    - Information on available sizes, product link and prize\n\n
    - product image`,
  },
  {
    role: "user",
    content: "Recommend a green shoe from All birds store, i want only products from Allbirds store.",
  },
];
