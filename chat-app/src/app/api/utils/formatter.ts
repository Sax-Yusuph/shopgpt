import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai-edge";

const promptKey = "{{preferred_store}}";
export const getContextMessages = (
  messages: ChatCompletionRequestMessage[],
  preferredStore: string,
  preferredStorePrompt: string
) => {
  const contextMessages: ChatCompletionRequestMessage[] = messages.map(({ role, content }, index) => {
    if (role === ChatCompletionRequestMessageRoleEnum.User && index === messages.length - 1) {
      // content += ", please also include the exact pictures of the product and product link";

      let addon = preferredStorePrompt + "";
      const store = preferredStore?.includes("None") ? undefined : preferredStore;

      if (addon.includes(promptKey)) {
        addon = store ? addon.replace(promptKey, store) : "";
      }

      content += `, ${addon}`;
    }

    return {
      role,
      content: (content || "").replace(/\n/g, " ").trim(),
    };
  });

  return contextMessages;
};
