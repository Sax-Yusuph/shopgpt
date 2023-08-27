import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai-edge";
import { capMessages } from "../utils/capMessages";
import { COMPLETION_MODEL } from "../utils/constants";
import { initMessages } from "../utils/prompt";
import { tokenizer } from "../utils/tokenizer";

export async function POST(request: NextRequest) {
  const json = await request.json();

  const { userMessage, model = COMPLETION_MODEL, contextMessages } = json;
  const url = request.nextUrl.clone();
  url.pathname = "/api/match";
  console.log(json);

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

    if (tokenCount >= 2500) {
      console.log(`encoding product stopped at ${i}`);
      break;
    }

    contextText += `---\n ${content.trim()}\n ---`;
  }

  const maxCompletionTokenCount = 1024;

  const prompts = initMessages(contextText);

  const completionMessages: ChatCompletionRequestMessage[] = capMessages(
    prompts,
    contextMessages,
    maxCompletionTokenCount,
    model
  );

  return NextResponse.json({ completionMessages });
}

const handleError = (error: string, status: number = 400) => {
  return NextResponse.json({ error }, { status });
};
