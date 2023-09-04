import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai-edge";

export const initMessages = (contextText: string, systemPrompt: string): ChatCompletionRequestMessage[] => {
  const prompt = systemPrompt;

  const modifiedPrompt = prompt.replace("{{available_products}}", contextText);

  return [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: modifiedPrompt,
    },
  ];
};
