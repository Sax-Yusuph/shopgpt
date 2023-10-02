type Obj = Record<string, string>

export function sanitizeJson(data: Obj[]) {
  return data
    .map(item => {
      const obj = { ...item }
      for (const item in obj) {
        if (!item) {
          delete obj[item]
        }

        if (!obj[item]) {
          delete obj[item]
        }

        const regex = /(Option|Variant)[1-9]?/i

        if (regex.test(item)) {
          const v = obj[item]
          delete obj[item]
          obj[item.replace(regex, '').trim()] = v
        }
      }

      obj.embeddingString = generateEmbeddingString(obj as Product)
      return obj as Product
    })
    .filter(p => p.Title)
}

export type Product = {
  Handle: string
  Title: string
  Vendor: string
  Type: string
  Tags: string
  Published: string
  Status: string
  SKU: string
  Grams: string
  Price: string
  Taxable: string
  Image: string
  'Body (HTML)': string
  'Image Src': string
  'Gift Card': string
  'Inventory Policy': string
  'Fulfillment Service': string
  'Requires Shipping': string
  embeddingString: string
}

export function generateEmbeddingString(data: Product) {
  return `$${data.Price} ${data.Vendor} ${data.Title} ${data.Type}, ${data.Grams} grams`
}

export function transform(data: Product) {
  let content = ''

  for (const d in data) {
    content += `${d}: ${data[d as keyof Product]}\n`
  }

  return `---\n ${content} \n---`
}
