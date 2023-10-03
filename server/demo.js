import fs from 'fs'
const getProducts = async (store) => {
  const pages = 20
  const maxProducts = Array(pages)
    .fill('_')
    .map((_, i) => `https://${store}/products.json?limit=250&page=${i + 1}`)

  const products = await Promise.allSettled(maxProducts.map(fetcher))

  const response = products
    .filter(isFulfilled)
    .map((t) => t.value)
    .flat()

  return response
    .flat()
    .filter((p) => p?.variants.some((variant) => variant.available))
}

const isFulfilled = (input) => input.status === 'fulfilled'
const fetcher = async (url) => {
  try {
    const response = await fetch(url)
    const products = (await response.json()).products

    return products
  } catch (error) {
    // console.log(url);
    // return { error: "Incorrect store address", products: null };
  }
}

getProducts('silkandwillow.myshopify.com').then((p) => {
  fs.writeFileSync('demo.json', JSON.stringify(p))
})
