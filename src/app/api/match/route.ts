import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai-edge";
import PipelineSingleton from "../pipeline.js";
import { getServerSdk } from "../sdk";

export async function POST(request) {
  const json = (await request.json()) as ChatCompletionRequestMessage;

  const userMessage = json?.content;
  if (!userMessage) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }
  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.
  const getEmbedding = await PipelineSingleton.getInstance();

  // Actually perform the classification
  const result = await getEmbedding(userMessage, { pooling: "mean", normalize: true });

  const embedding = Array.from(result.data);
  const { supabaseClient } = getServerSdk();

  const { error: matchError, data: products } = await supabaseClient.rpc("match_products", {
    embedding,
    match_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 20, // Choose the number of matches
  });

  if (matchError) {
    return NextResponse.json({ error: "Error matching products" }, { status: 500 });
  }

  return NextResponse.json(products);
}
