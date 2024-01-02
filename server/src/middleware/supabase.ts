import { createClient } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";
import { AppContext, EmbededProducts } from "../routes/types";

export const setUpSupabase = (c: AppContext<"*">) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  c.set("supabase", supabase);
  c.set("saveProduct", async (product: EmbededProducts) => {
    const { error, data } = await supabase.from(c.env.productTableName).upsert(
      product,
      // prevent duplication
      { onConflict: "id" }
    );

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }

    return data;
  });

  c.set("saveProducts", async (products: EmbededProducts[]) => {
    const { error, data } = await supabase.from(c.env.productTableName).upsert(
      products,
      // prevent duplication
      { onConflict: "id" }
    );

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }

    return data;
  });

  c.set("checkStoreExists", async (store_name: string) => {
    const { error, data } = await supabase.rpc(c.env.checkStoreFunctionName, {
      store_name,
    });

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }

    return data;
  });

  c.set(
    "findSimilarItems",
    async (query_embedding: ArrayLike<number>, store: string) => {
      const { data, error } = await c.var.supabase
        .rpc(c.env.findSimilarItemsFunctionName, {
          query_embedding,
          store_url: store,
          match_threshold: c.env.matchThreshold, // Choose an appropriate threshold for your data
        })
        .limit(c.env.matchCount);

      if (error) {
        console.log(error.message);
        throw new HTTPException(500, { message: error.message });
      }

      return data;
    }
  );

  c.set("getProductByCategories", async (store_param: string) => {
    const { data, error } = await c.var.supabase
      .rpc(c.env.getProductsCatergoriesFunctionName, { store_param })
      .limit(c.env.matchCount);

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }

    return data;
  });
};
