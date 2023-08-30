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
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const EMBEDDING_MODEL = "text-embedding-ada-002";
export const COMPLETION_MODEL = "gpt-4"; //text-davinci-003'
