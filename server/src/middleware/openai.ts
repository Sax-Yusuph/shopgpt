import OpenAI from "openai";
import { AppContext } from "../routes/types";

export const setupOpenAi = (c: AppContext<"*">) => {
  const openAi = new OpenAI({ apiKey: c.env.OPENAI_KEY });

  c.set("openAi", openAi);

  c.set("createEmbedding", async (input: string | string[]) => {
    const response = await openAi.embeddings.create({
      input,
      model: "text-embedding-ada-002",
    });

    return response.data;
  });

  c.set("createCompletion", async (messages) => {
    return openAi.chat.completions.create({
      messages,
      model: c.env.AI_MODEL,
      stream: true,
      max_tokens: 1024,
      temperature: 0,
    });
  });
};
