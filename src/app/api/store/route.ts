import { Product } from "@/lib/_utils/clean";
import { ShopifyProduct } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import PipelineSingleton from "../pipeline";
import { getServerSdk } from "../sdk";

type Obj = Record<string, string>;

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { store, page } = json;
  const { supabaseClient } = getServerSdk();

  //check db if page and storename exist, if it exists,
  const { data } = await supabaseClient.from("product").select("id").eq("store", store).eq("page", +page);

  if (data?.length) {
    return NextResponse.json(
      { error: "This dataset has been trained, please provide a different page number" },
      { status: 400 }
    );
  }

  //thwo error and notify user to change the page number
  const validStoreName = store.replace(/(https:\/\/|www.)/gi, "");
  const url = `https://www.${validStoreName}/products.json?limit=250&page=${page}`;

  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.text();

    return NextResponse.json({ error }, { status: 500 });
  }

  const products = (await res.json()).products as ShopifyProduct[];
  const san = products.map(p => sanitize(p, `https://www.${validStoreName}`)) as ShopifyResponse[];

  const embed = await PipelineSingleton.getInstance();

  const embedAndUpload = async (p: ShopifyResponse) => {
    // prevent duplication
    const { data } = await supabaseClient.from("product").select("id").eq("id", `${p.id}`);

    if (!data?.length) {
      const dataToEmbed = transform(p);
      try {
        const output = await embed(dataToEmbed, {
          pooling: "mean",
          normalize: true,
        });

        const embedding = Array.from(output.data);
        const { id, ...rest } = p;

        const { error } = await supabaseClient.from("product").insert({
          id: `${p.id}`,
          title: p.title,
          brand: p.brand,
          description: p.description,
          data: JSON.stringify(rest),
          embedding,
          store,
          page,
        });

        if (error) {
          console.log(error);
          throw error;
        }
        console.log("product inserted -------");
      } catch (error) {
        console.log(`Error: failed to embed product ${JSON.stringify(dataToEmbed, null, 2)}\n-----`);
      }
    }
  };

  await Promise.all(san.map(embedAndUpload)).catch(error => {
    throw error;
  });

  return NextResponse.json({ status: "success" });
}

function transform(item: ShopifyResponse) {
  let content = "";

  const { embedding, tags, created_at, updated_at, published_at, id, ...data } = item;
  //remove redundant fields

  for (const d in data) {
    if (Array.isArray(d)) {
      const arr = data[d];

      content += `${d}: ${JSON.stringify(arr)} }, `;
    } else {
      content += `${d}: ${data[d as keyof Product]}, `;
    }
  }

  return `--- ${content} --- `;
}

const sanitize = (s: ShopifyProduct, storeUrl) => {
  const obj = {
    id: s.id,
    title: s.title,
    description: s.body_html,
    published_at: s.published_at,
    created_at: s.created_at,
    updated_at: s.updated_at,
    brand: s.vendor,
    product_type: s.product_type,
    imageLink: s.images[0].src,
    variants: s.variants.map(v => ({
      size: v.title,
      available: v.available,
      requires_shipping: v.requires_shipping,
      price: v.price,
      sku: v.sku,
    })),
    productLink: `${storeUrl}/products/${s.handle}`,
    tags: "",
    // tags: s.tags.map(t => t.replace(/\w+::/, "").replace("=>", ":")).join(","),
    embedding: [],
    requiresShipping: s.variants?.some(v => v.requires_shipping),
    availableSizes: "",
    price_range: "",
  };

  const prices = new Set(obj.variants?.map(v => v.price));
  obj.price_range = Array.from(prices).join(",");

  const sizes_available = obj.variants?.filter(v => v.available);
  obj.availableSizes = sizes_available.map(s => s.size).join(",") || "none";

  return obj;
};

type ShopifyResponse = ReturnType<typeof sanitize>;
