import { NextRequest, NextResponse } from "next/server";
import { getServerSdk } from "../sdk";

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
  const { messages, model = COMPLETION_MODEL } = json;
  if (!messages) {
    return handleError("Missing text parameter");
  }

  const contextMessages = getContextMessages(messages);
  const { openAi } = getServerSdk();

  const [userMessage] = contextMessages
    .filter(({ role }) => role === ChatCompletionRequestMessageRoleEnum.User)
    .slice(-1);

  if (!userMessage) {
    return handleError("No message with role 'user'");
  }

  // // Moderate the content to comply with OpenAI T&C
  // const moderationResponses = await Promise.all(
  //   contextMessages.map(message => openAi.createModeration({ input: message.content ?? "" }))
  // );

  // for await (const moderationResponse of moderationResponses) {
  //   const res = await moderationResponse.json();
  //   const [results] = res.results;
  //   console.log(results);

  //   if (results.flagged) {
  //     return handleError(
  //       JSON.stringify({
  //         error: "Flagged content",
  //         categories: results.categories,
  //       })
  //     );
  //   }
  // }

  // const text = encodeURIComponent(userMessage.content);
  const url = request.nextUrl.clone();
  url.pathname = "/api/match";

  // this endpoint creates an embedding and return a list of product matches for us
  const matchResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userMessage),
  });

  if (!matchResponse.ok) {
    return handleError(await matchResponse.json(), 500);
  }

  const productMatches = await matchResponse.json();

  let tokenCount = 0;
  let contextText = "";

  for (let i = 0; i < productMatches.length; i++) {
    const product = productMatches[i];
    const content = product.properties;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.length;

    if (tokenCount >= 1500) {
      break;
    }

    contextText += `${content.trim()}\n`;
  }

  const maxCompletionTokenCount = 1024;

  const prompts = initMessages(contextText);

  const completionMessages: ChatCompletionRequestMessage[] = capMessages(
    prompts,
    contextMessages,
    maxCompletionTokenCount,
    model
  );

  console.log(contextText);
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
