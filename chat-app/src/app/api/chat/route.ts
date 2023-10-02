import { NextRequest, NextResponse } from "next/server";
import { getServerSdk } from "../sdk";

import cors from "@/lib/cors";
import { initialStorePrompt, initialSystemPrompt } from "@/lib/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";
import { capMessages } from "../utils/capMessages";
import { COMPLETION_MODEL } from "../utils/constants";
import { getContextMessages } from "../utils/formatter";
import { initMessages } from "../utils/prompt";
import { tokenizer } from "../utils/tokenizer";

export const runtime = "edge";
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { messages, id: sessionId } = json;
  if (!messages) {
    return cors(request, handleError("Missing text parameter"));
  }

  const preferredStore = json.preferredStore || "None";
  const systemPrompt = json.systemPrompt || initialSystemPrompt;
  const preferredStorePrompt = json.preferredStorePrompt || initialStorePrompt;
  const model = json.model || COMPLETION_MODEL;
  const contextMessages = getContextMessages(
    messages,
    preferredStore,
    preferredStorePrompt
  );
  const { openAi } = getServerSdk();

  const [userMessage] = contextMessages
    .filter(({ role }) => role === ChatCompletionRequestMessageRoleEnum.User)
    .slice(-1);

  if (!userMessage) {
    return cors(request, handleError("No message with role 'user'"));
  }

  const url = request.nextUrl.clone();

  url.pathname = "/api/match";

  // this endpoint creates an embedding and return a list of product matches
  const matchResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userMessage),
  });
  //{ input: userMessage.content }

  if (!matchResponse.ok) {
    return cors(request, handleError(await matchResponse.json(), 500));
  }

  const productMatches =
    ((await matchResponse.json()) as { title: string; data: string }[]) || [];

  let tokenCount = 0;
  let contextText = "";

  for (let i = 0; i < productMatches.length; i++) {
    const product = productMatches[i];
    const content = product.data;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.length;

    const max =
      model?.includes("gpt-4") || model?.includes("16k") ? 5000 : 1500;

    if (tokenCount >= max) {
      break;
    }

    contextText += `---\n ${content.trim()}\n ---`;
  }

  const maxCompletionTokenCount = 1024;

  const prompts = initMessages(contextText, systemPrompt);

  const completionMessages = capMessages(
    prompts,
    contextMessages,
    maxCompletionTokenCount,
    model
  );

  try {
    const res = await openAi.chat.completions.create({
      model,
      messages: completionMessages,
      stream: true,
      // max_tokens:1024
    });

    // Transform the response into a readable stream
    const stream = OpenAIStream(res);

    // Return a StreamingTextResponse, which can be consumed by the client
    return cors(request, new StreamingTextResponse(stream));
  } catch (error) {
    return cors(request, NextResponse.json(error.message, { status: 500 }));
  }
}

const handleError = (error: string, status: number = 400) => {
  return NextResponse.json({ error }, { status });
};
