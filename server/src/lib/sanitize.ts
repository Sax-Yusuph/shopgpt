import striptags from "striptags";
import { SanitizedResponse, ShopifyProduct } from "../routes/types";

export function sanitize(products: ShopifyProduct[], storeUrl: string) {
  return products.map((s) => {
    const product_description = s?.body_html ? striptags(s.body_html) : "";
    const title = s.title;
    const product_type = s.product_type;
    const vendor = s.vendor;

    // const tags = removeMatchingWords(s.tags?.join(','))

    const product_link = parseUrl(`${storeUrl}/products/${s.handle}`);

    const prices = new Set();
    const weights = new Set();
    const images = [];
    const sizes = [];

    for (const variant of s.variants) {
      if (variant.price) {
        prices.add(variant.price);
      }

      if (variant.weight) {
        weights.add(`${variant.weight} ${variant.weight_unit}`);
      }
    }

    for (const option of s.options) {
      if (option.name === "Size" && option.values?.length) {
        sizes.push(...option.values);
      }
    }

    for (const image of s.images) {
      images.push({ width: image.width, height: image.height, src: image.src });
    }

    const wt = Array.from(weights).join(",") || "";
    const p = Array.from(prices).join(",") || "";
    const sz = sizes.join(",") || "";

    let description = removeWhiteSpaces(cap(`${title}, ${product_type},`));

    description +=
      validString(` weights: ${wt}`, wt) +
      validString(` prices: ${p}`, p) +
      validString(` sizes: ${sz}`, sz);

    return {
      id: s.id,
      // title,
      description,
      // vendor,
      // handle: s.handle,
      // lastPublished: new Date(s.updated_at),
      // link: product_link,
      // image: images[0]?.src,
      type: product_type,
      content: JSON.stringify({
        title,
        type: product_type,
        description: cap(product_description, 200),
        image: images[0]?.src,
        link: product_link,
        prices: `${Array.from(prices)}`,
        ...(weights.size ? { weights: `${Array.from(weights)}` } : {}),
      }),
    } satisfies SanitizedResponse;
  });
}

function parseUrl(url: string) {
  const protocol = "https://";
  return url.startsWith(protocol) ? url : protocol + url;
}

function cap(text: string, max = 1000) {
  const ss = text.split(",");

  while (ss.join(",").length > max) {
    ss.pop();
  }

  return ss.join(",");
}

function removeWhiteSpaces(str: string) {
  return str.replace(/\s/g, " ");
}

function validString(str: string, condition: unknown) {
  if (!condition) {
    return "";
  }

  return str;
}
