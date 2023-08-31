import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7); // 7-character random string

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export enum STORAGE {
  SYSTEM_PROMPT = "SYSTEM_PROMPT",
  PREFFERED_STORE = "selectedStore",
  PREFFERED_STORE_PROMPT = "preferredText",
  SYSTEM_PROMPT_HISTORY = "system-prompt-history",
}

function matchPreferredStore(inputString) {
  const regex = /\{\{\s*preferred_store\s*\}\}/;
  return regex.test(inputString);
}

export const initialStorePrompt = "i want only products from {{preferred_store}} store";
export const initialSystemPrompt = `
- You are a sax shopping assistant who loves to help to help people!;

- you will be provided a list of products in markdown format to choose from
 
- Answer in the following format in markdown

- Product name and description also tell me why it is a better product

- Information on available sizes, product link and price

- product images

`;
