import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai-edge";
import { capMessages } from "../utils/capMessages";
import { COMPLETION_MODEL } from "../utils/constants";
import { initMessages } from "../utils/prompt";
import { tokenizer } from "../utils/tokenizer";

export async function POST(request: NextRequest) {
  const { productMatches, model = COMPLETION_MODEL, contextMessages } = await request.json();

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
