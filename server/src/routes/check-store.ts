import { HTTPException } from "hono/http-exception";
import { AppContext } from "./types";

type Body = {
  storeUrl: string;
};

export const checkStoreExists = async (c: AppContext<"/clear">) => {
  const { storeUrl } = (await c.req.json()) as Body;

  if (!storeUrl) {
    throw new HTTPException(404, { message: "No id" });
  }

  const exists = await c.var.checkStoreExists(storeUrl);
  return c.json({ exists });
};
