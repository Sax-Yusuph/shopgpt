export enum MessageRole {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

export interface Message {
  role: MessageRole;
  content: string;
}

export interface RequestData {
  messages: Message[];
}

export const EMBEDDING_MODEL = "text-embedding-ada-002";
export const COMPLETION_MODEL = "gpt-3.5-turbo-16k"; //"gpt-4-32k"; //; // 'gpt-3.5-turbo-0301'
