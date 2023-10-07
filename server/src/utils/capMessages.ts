import { Message } from "./constants.js";

/**
 * Remove context messages until the entire request fits
 * the max total token count for that model.
 *
 * Accounts for both message and completion token counts.
 */
export function capMessages(initMessages: Message[], maxCompletionTokenCount: number, model: string) {
  // const maxTotalTokenCount = getMaxTokenCount(model);

  // let tokenCount =
  //   getChatRequestTokenCount([...initMessages, ...cappedContextMessages]) +
  //   maxCompletionTokenCount

  // // Remove earlier context messages until we fit

  // while (tokenCount >= maxTotalTokenCount) {
  //   cappedContextMessages.shift()
  //   tokenCount =
  //     getChatRequestTokenCount([...initMessages, ...cappedContextMessages]) +
  //     maxCompletionTokenCount
  // }

  const mm = [...initMessages];

  return mm;
}
