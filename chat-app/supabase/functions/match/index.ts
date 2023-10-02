// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { env, pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

env.useBrowserCache = false;
env.allowLocalModules = false;
let generateEmbedding: any;

if (!generateEmbedding) {
  generateEmbedding = await pipeline("feature-extraction", "Supabase/gte-small");
  console.log("embedding is NOT cached");
} else {
  console.log("embedding is cached");
}

serve(async req => {
  const { input } = await req.json();

  const output = await generateEmbedding(input, { pooling: "mean", normalize: true });

  const embedding = Array.from(output.data);

  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { auth: { persistSession: false } }
  );

  const { error, data } = await supabaseClient.rpc("match_products", {
    embedding,
    match_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 20, // Choose the number of matches
  });

  if (error) {
    return new Response(JSON.stringify(error), { headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
});

// To invoke:
// curl -i --location --request POST 'https://tfidwhcedleuieodvvvj.supabase.co/functions/v1/match' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaWR3aGNlZGxldWllb2R2dnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1MzA2ODEsImV4cCI6MjAxMDEwNjY4MX0.SqJ8w0EEEsQ1f0OEolGRpLozSQR5S7cfoGUcX9TWvrM' \
//   --header 'Content-Type: application/json' \
//   --data '{"input":"Functions"}'
