import { TiktokenModel } from 'js-tiktoken'

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export interface Message {
  role: MessageRole
  content: string
}

export interface RequestData {
  messages: Message[]
}

export const EMBEDDING_MODEL = 'text-embedding-ada-002'
export const COMPLETION_MODEL: TiktokenModel = 'gpt-3.5-turbo-16k' 
export const MAX_COMPLETION_TOKEN_COUNT = 1024
export const LARGE_MODELS = ['gpt-4-32k', 'gpt-4-32k-0613', 'gpt-3.5-turbo-16k']
