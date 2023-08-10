import { Product, sanitizeJson } from "@/lib/_utils/clean";
import csvToJson from "@/lib/csvToJson";
import { NextRequest, NextResponse } from "next/server";
import PipelineSingleton from "../pipeline";
import { getServerSdk } from "../sdk";
type Obj = Record<string, string>;

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { data } = json;

  const csv = csvToJson({ data }) as Obj[];
  const products = sanitizeJson(csv);

  const embed = await PipelineSingleton.getInstance();
  const results = await Promise.all(
    products.map(p =>
      embed(p.embeddingString, {
        pooling: "mean",
        normalize: true,
      }).then((output: { data: Iterable<unknown> | ArrayLike<unknown> }) => {
        const embedding = Array.from(output.data);

        return {
          embedding,
          properties: transform(p),
          description: p.embeddingString,
          brand: p.Vendor,
          name: p.Title,
        };
      })
    )
  );
  const { supabaseClient } = getServerSdk();
  const { error } = await supabaseClient.from("product").insert(results);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "success" });
}

function transform(data: Product) {
  let content = "";

  for (const d in data) {
    content += `${d}: ${data[d as keyof Product]}\n`;
  }

  return `---\n ${content} \n---`;
}
