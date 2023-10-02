import { encodingForModel } from 'js-tiktoken'
import { Message } from './constants.js'

export const tokenizer = encodingForModel('gpt-3.5-turbo-0301')
/**
 * Count the tokens for multi-message chat completion requests
 */
export function getChatRequestTokenCount(messages: Message[]): number {
  const tokensPerRequest = 3 // every reply is primed with <|im_start|>assistant<|im_sep|>
  const numTokens = messages.reduce(
    (acc, message) => acc + getMessageTokenCount(message),
    0,
  )

  return numTokens + tokensPerRequest
}

/**
 * Count the tokens for a single message within a chat completion request
 *
 * See "Counting tokens for chat API calls"
 * from https://github.com/openai/openai-cookbook/blob/834181d5739740eb8380096dac7056c925578d9a/examples/How_to_count_tokens_with_tiktoken.ipynb
 */
export function getMessageTokenCount(message: Message): number {
  const tokensPerMessage = 4
  const tokensPerName = 1

  return Object.entries(message).reduce((acc, [key, value]) => {
    acc += tokenizer.encode(value as string).length
    if (key === 'name') {
      acc += tokensPerName
    }
    return acc
  }, tokensPerMessage)
}

/**
 * Get the maximum number of tokens for a model's context.
 *
 * Includes tokens in both message and completion.
 */
export function getMaxTokenCount(model: string): number {
  switch (model) {
    case 'gpt-3.5-turbo':
      return 4097
    case 'gpt-3.5-turbo-16k':
    case 'gpt-3.5-turbo-16k-0613':
      return 16385

    case 'gpt-4':
      return 8192
    case 'gpt-4-32k':
      return 32768
    default:
      return 4097
  }
}
