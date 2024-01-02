import { Next } from "hono";
import { AppContext } from "../routes/types";
import { setupOpenAi } from "./openai";
import { setUpSupabase } from "./supabase";

export const appMiddleware = async (c: AppContext<"*">, next: Next) => {
  setupOpenAi(c);
  setUpSupabase(c);

  c.set("getContextHistory", (key: string) =>
    c.env.SHOP_AI_CONTEXT_HISTORY.get(key)
  );

  c.set("saveContextHistory", async (key: string, value: string) => {
    c.env.SHOP_AI_CONTEXT_HISTORY.put(key, value);
  });

  const start = Date.now();

  await next();

  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
};

export const streamingMiddleware = async (c: AppContext<"/">, next: Next) => {
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  await next();
};
