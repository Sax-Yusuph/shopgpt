import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAiResponse } from "./modules/ai";
import { Bindings } from "./utils/types";

const app = new Hono<{ Bindings: Bindings }>();
app.use("*", cors());

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Error occurred", 500);
});

app.options("*", c => {
  return c.text("", 204);
});

app.get("/", c => c.text("status: ok"));
app.get("/test", c => {
  const bindings = c.env.OPENAI_KEY;
  return c.text(`working normal : ${bindings}`);
});
app.post("/chat", openAiResponse);

export default app;
