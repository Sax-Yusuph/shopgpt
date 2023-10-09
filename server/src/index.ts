import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAiChatResponse } from "./modules/completions";
import { Bindings } from "./utils/types";

const app = new Hono<{ Bindings: Bindings }>();
app.use("*", cors());

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Error occurred", 500);
});

app.options("/chat", c => c.text("", 200));
app.get("/", c => c.text("status: ok"));
app.post("/chat", openAiChatResponse);

export default app;
