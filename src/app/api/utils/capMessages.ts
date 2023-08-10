import { ChatCompletionRequestMessage } from "openai-edge";
import { getChatRequestTokenCount, getMaxTokenCount } from "./tokenizer";

/**
 * Remove context messages until the entire request fits
 * the max total token count for that model.
 *
 * Accounts for both message and completion token counts.
 */
export function capMessages(
  initMessages: ChatCompletionRequestMessage[],
  contextMessages: ChatCompletionRequestMessage[],
  maxCompletionTokenCount: number,
  model: string
) {
  const maxTotalTokenCount = getMaxTokenCount(model);
  const cappedContextMessages = [...contextMessages];
  let tokenCount =
    getChatRequestTokenCount([...initMessages, ...cappedContextMessages], model) + maxCompletionTokenCount;

  // Remove earlier context messages until we fit
  while (tokenCount >= maxTotalTokenCount) {
    cappedContextMessages.shift();
    tokenCount = getChatRequestTokenCount([...initMessages, ...cappedContextMessages], model) + maxCompletionTokenCount;
  }

  return [...initMessages, ...cappedContextMessages];
}
