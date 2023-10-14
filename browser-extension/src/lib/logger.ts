export function logger(...args: unknown[]) {
  // later we would disable console.log in productsion
  if (import.meta.env.DEV) {
    console.log(...args)
  }
  
  console.log(...args)
}
