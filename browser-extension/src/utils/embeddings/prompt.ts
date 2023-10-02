import { Message, MessageRole } from "./constants.js";

export const initMessages = (
  contextText: string,
  systemPrompt: string
): Message[] => {
  const prompt = systemPrompt;

  const modifiedPrompt = prompt.replace("{{available_products}}", contextText);

  return [
    {
      role: MessageRole.System,
      content: modifiedPrompt,
    },
  ];
};
