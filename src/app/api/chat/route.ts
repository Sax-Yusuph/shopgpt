import { NextRequest, NextResponse } from "next/server";
import { getServerSdk } from "../sdk";

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

  return NextResponse.json("WIP");
}

const handleError = (error: string, status: number = 400) => {
  return NextResponse.json({ error }, { status });
};
