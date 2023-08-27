import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai-edge";

export const getContextMessages = (messages: ChatCompletionRequestMessage[], preferredStore: string) => {
  //  sanitization
  const contextMessages: ChatCompletionRequestMessage[] = messages.map(({ role, content }, index) => {
    //@ts-ignore
    if (![ChatCompletionRequestMessageRoleEnum.User, ChatCompletionRequestMessageRoleEnum.Assistant].includes(role)) {
      throw `Invalid message role '${role}'`;
    }

    if (role === ChatCompletionRequestMessageRoleEnum.User && index === messages.length - 1) {
      content += ", please also include the exact pictures of the product and product link";
      if (preferredStore && !preferredStore.includes("None")) {
        content += `, i want only products from ${preferredStore} store`;
      }
    }

    return {
      role,
      content: (content || "").replace(/\n/g, " ").trim(),
    };
  });

  return contextMessages;
};
