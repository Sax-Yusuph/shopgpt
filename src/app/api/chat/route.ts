import { NextRequest, NextResponse } from "next/server";
import { getServerSdk } from "../sdk";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";
import { COMPLETION_MODEL } from "../utils/constants";
import { getContextMessages } from "../utils/formatter";

export const runtime = "edge";
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { messages, model = COMPLETION_MODEL, preferredStore, id: sessionId } = json;

  if (!messages) {
    return handleError("Missing text parameter");
  }

  const contextMessages = getContextMessages(messages, preferredStore);
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

  // on the free tier, we have a size limit, so the trick is to split the code into separate functions
  const completionMessagesResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productMatches, model, contextMessages }),
  });

  const { completionMessages } = await completionMessagesResponse.json();
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
