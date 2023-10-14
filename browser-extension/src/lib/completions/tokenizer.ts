import { encodingForModel } from 'js-tiktoken'

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export const tokenizer = encodingForModel('gpt-3.5-turbo-0301')

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
