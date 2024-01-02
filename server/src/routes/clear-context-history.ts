import { HTTPException } from "hono/http-exception";
import { AppContext } from "./types";

type Body = {
  id: string;
  store: string;
};

export const clearContextHistory = async (c: AppContext<"/clear">) => {
  const { id, store } = (await c.req.json()) as Body;

  if (!id) {
    throw new HTTPException(404, { message: "No id" });
  }

  await c.env.SHOP_AI_CONTEXT_HISTORY.delete(`${id}-${store}`);
  return c.json({ message: "success" });
};
