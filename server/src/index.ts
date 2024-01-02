import { Hono } from "hono";
import { cors } from "hono/cors";
import { appMiddleware } from "./middleware";
import { openAiChat } from "./routes/chat";
import { checkStoreExists } from "./routes/check-store";
import { clearContextHistory } from "./routes/clear-context-history";
import { embedProducts } from "./routes/embed-products";
import { getRecommendations } from "./routes/get-matches";
import { Bindings, Variables } from "./routes/types";

type AppType = { Bindings: Bindings; Variables: Variables };
const app = new Hono<AppType>().basePath("/api");

app.use("*", cors());
// app.use("/embed/*", streamingMiddleware);
app.use("*", appMiddleware);

app.options("*", (c) => c.text("", 200));
app.get("/", (c) => c.text("Hello!"));
app.post("/chat", openAiChat);
app.post("/embed", embedProducts);
app.post("/check", checkStoreExists);
app.post("/clear", clearContextHistory);
app.post("/recommendations", getRecommendations);

export default app;
