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
