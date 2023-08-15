import { ShopifyProduct } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import PipelineSingleton from "../pipeline";
import { getServerSdk } from "../sdk";
//@ts-ignore
import { NodeHtmlMarkdown } from "node-html-markdown";

import { codeBlock, oneLine, oneLineCommaListsAnd, stripIndents } from "common-tags";
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

  const { products, error } = await getProducts(store, page);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const san = products.map(p => sanitize(p, `https://www.${check(store)}`)) as ShopifyResponse[];

  const embed = await PipelineSingleton.getInstance();

  const embedAndUpload = async (p: ShopifyResponse) => {
    // prevent duplication
    const { data } = await supabaseClient.from("product").select("id").eq("id", `${p.id}`);

    if (!data?.length) {
      const dataToEmbed = p.description;
      try {
        const output = await embed(dataToEmbed, {
          pooling: "mean",
          normalize: true,
        });

        const embedding = Array.from(output.data);

        const { error } = await supabaseClient.from("product").insert({
          id: `${p.id}`,
          title: p.title,
          brand: p.vendor,
          description: p.description,
          data: p.content,
          embedding,
          store,
          page,
        });

        if (error) {
          console.log(error);
          throw error;
        }
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

const sanitize = (s: ShopifyProduct, storeUrl) => {
  const description = NodeHtmlMarkdown.translate(s.body_html);
  const title = s.title;
  const product_type = s.product_type;
  const p = new Set(s.variants?.map(v => v.price));
  const price_range = oneLineCommaListsAnd`${Array.from(p)}`;
  const vendor = s.vendor;
  const product_images = s.images[0].src;
  const product_link = `${storeUrl}/products/${s.handle}`;

  const sizes_available = s.variants?.filter(v => v.available);

  const sizes = oneLineCommaListsAnd`${sizes_available.map(s => s.title)}`;

  return {
    id: s.id,
    title,
    description: oneLine`${title}**, ${description}`,
    vendor,
    content: codeBlock`
       ${stripIndents`
       ${description}
        
       **Product name**:
       ${oneLine`
     - ${title}
       `}
       
       **Product type**:
       ${oneLine`
     - ${product_type}
       `}
  
       **Product image**:
       ${oneLine`
    -  ![product image](${product_images})
  
       `}
  
       **PRODUCT LINK**
       ${oneLine`
       - [product link](${product_link})
       `}
  
       **AVAILABLE SIZES**
       ${oneLine`
       - ${sizes}
       `}
  
       **PRICE RANGE**
       - ${price_range}
  
       **VENDOR**
       - ${vendor}
      
       `}`,
  };
};

type ShopifyResponse = ReturnType<typeof sanitize>;

const getProducts = async (store: string, page: number) => {
  const validStoreName = check(store);
  const url = `https://www.${validStoreName}/products.json?limit=250&page=${page}`;

  try {
    const response = await fetch(url);
    const products = (await response.json()).products as ShopifyProduct[];

    return { error: null, products };
  } catch (error) {
    console.log(url);
    return { error: "Incorrect store address", products: null };
  }
};

const check = (store: string) => store.replace(/(https:\/\/|www.|\/)/gi, "");
