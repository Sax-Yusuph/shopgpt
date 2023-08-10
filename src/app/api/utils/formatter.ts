import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai-edge";

export const getContextMessages = (messages: ChatCompletionRequestMessage[]) => {
  //  sanitization
  const contextMessages: ChatCompletionRequestMessage[] = messages.map(({ role, content }) => {
    //@ts-ignore
    if (![ChatCompletionRequestMessageRoleEnum.User, ChatCompletionRequestMessageRoleEnum.Assistant].includes(role)) {
      throw `Invalid message role '${role}'`;
    }

    return {
      role,
      content: (content || "").replace(/\n/g, " ").trim(),
    };
  });

  return contextMessages;
};
