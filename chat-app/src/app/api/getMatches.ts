import Supabase from "./supabase";
import Pipeline from "./transformer";

export const getMatches = async (userMessage: string) => {
  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.
  const embedding = await Pipeline.transform(userMessage);

  const client = Supabase.getClient();

  const { error: matchError, data: products } = await client.rpc(
    "match_products",
    {
      embedding,
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 20, // Choose the number of matches
    }
  );

  if (matchError) {
    throw matchError;
  }

  return products as Product[];
};

export type Product = { title: string; data: string };
