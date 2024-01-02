import { ChatCompletionMessageParam } from "openai/resources/chat";
import { SupabaseProduct } from "./types";

export const getLastUserMessage = (messages: ChatCompletionMessageParam[]) => {
  const [userMessage] = messages
    .filter(({ role }) => role === "user")
    .slice(-1);

  return userMessage.content as string;
};

export function getContext(products: SupabaseProduct[] = []) {
  let contextText = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const content = product.data;

    contextText += `---\n ${content.replace("\\", "").trim()}\n ---`;
  }

  return cap(contextText);
}

const cap = (text: string) => text.split(" ").slice(0, 2800).join(" ");

/**
 * A promise that resolves after `ms` milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

export const isRejected = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === "rejected";
