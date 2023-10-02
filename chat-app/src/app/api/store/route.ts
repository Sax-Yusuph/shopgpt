import { ShopifyProduct } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import striptags from "striptags";
import { getServerSdk } from "../sdk";

import { oneLineCommaListsAnd } from "common-tags";
import PipelineSingleton from "../pipeline";
type Obj = Record<string, string>;

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { store } = json;
  const { supabaseClient } = getServerSdk();

  const products = await getProducts(store);

  const san = products.map(p => sanitize(p, `https://www.${check(store)}`)) as ShopifyResponse[];

  const embed = await PipelineSingleton.getInstance();

  const embedAndUpload = async (p: ShopifyResponse, pageIndex, retryTimeout = 3) => {
    if (retryTimeout === 0) {
      return;
    }

    const dataToEmbed = p.description;

    const output = await embed(dataToEmbed, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = Array.from(output.data);

    return {
      id: `${p.id}`,
      title: p.title,
      brand: p.vendor,
      description: p.description,
      data: p.content,
      embedding,
      store, 
      page: pageIndex + 1,
    };
  };

  const embeddedProducts = await Promise.all(san.map((p, i) => embedAndUpload(p, i))).catch(error => {
    throw error;
  });

  const { error } = await supabaseClient.from("product").upsert(
    embeddedProducts,
    // prevent duplication
    { onConflict: "id" }
  );

  if (error) {
    console.log(error);
    throw error;
  }

  return NextResponse.json({ status: "success", products: [] });
}

const sanitize = (s: ShopifyProduct, storeUrl) => {
  const description = s?.body_html ? striptags(s.body_html) : "";

  const title = s.title;
  const product_type = s.product_type;
  const p = new Set(s.variants?.map(v => v.price));
  const price_range = oneLineCommaListsAnd`${Array.from(p)}`;
  const vendor = s.vendor;
  const product_images = s.images.slice(0, 1).map(t => t.src);
  const product_link = `${storeUrl}/products/${s.handle}`;

  const sizes_available = s.variants?.filter(v => v.available);

  const sizes = oneLineCommaListsAnd`${sizes_available.map(s => s.title)}`;

  const prod = {
    id: s.id,
    title,
    description: cap(`${title},${product_type}, ${description}`),
    vendor,
    content: JSON.stringify({
      description,
      title,
      product_type,
      product_images,
      product_link,
      sizes,
      price_range,
      vendor,
    }),
  };

  return prod;
  // return {
  //   id: s.id,
  //   title,
  //   description: oneLine`${title}**, ${description}`,
  //   vendor,
  //   content: codeBlock`
  //      ${stripIndents`
  //      ${description}

  //      **Product name**:
  //      ${oneLine`
  //    - ${title}
  //      `}

  //      **Product type**:
  //      ${oneLine`
  //    - ${product_type}
  //      `}

  //      **Product image**:
  //      ${oneLine`
  //   -  ![product image](${product_images})

  //      `}

  //      **PRODUCT LINK**
  //      ${oneLine`
  //      - [product link](${product_link})
  //      `}

  //      **AVAILABLE SIZES**
  //      ${oneLine`
  //      - ${sizes}
  //      `}

  //      **PRICE RANGE**
  //      - ${price_range}

  //      **VENDOR**
  //      - ${vendor}

  //      `}`,
  // };
};

type ShopifyResponse = ReturnType<typeof sanitize>;

const getProducts = async (store: string) => {
  const validStoreName = check(store);
  // const url = `https://www.${validStoreName}/products.json?limit=250&page=${page}`;
  const pages = 20;
  const maxProducts = Array(pages)
    .fill("_")
    .map((_, i) => `https://www.${validStoreName}/products.json?limit=250&page=${i + 1}`);

  const products = await Promise.allSettled(maxProducts.map(fetcher));

  const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
    input.status === "fulfilled";

  const response = products
    .filter(isFulfilled)
    .map(t => t.value)
    .flat();

  return response.flat();
};

const check = (store: string) => store.replace(/(https:\/\/|www.|\/)/gi, "");

const fetcher = async url => {
  try {
    const response = await fetch(url);
    const products = (await response.json()).products as ShopifyProduct[];

    return products;
  } catch (error) {
    // console.log(url);
    // return { error: "Incorrect store address", products: null };
  }
};

const cap = (text: string) => {
  let ss = text.split(",");

  while (ss.join(",").length > 200) {
    ss.pop();
  }

  return ss.join(",");
};
