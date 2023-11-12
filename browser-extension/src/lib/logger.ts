export function logger(...args: unknown[]) {

  if (import.meta.env.DEV) {
    console.log(...args)
  }

}
