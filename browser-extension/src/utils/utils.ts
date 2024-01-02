/**
 * Throw an `Error` and trace `message`.
 */
export function panic(message: string = 'This should not happen'): never {
  console.trace(message)
  throw new Error(message)
}

/**
 * Assert that `fact` is `true`.  If the assertion fails, [[panic]]
 * with `message`.
 */
export function assert(
  fact: boolean,
  message: string = 'Assertion failed',
): asserts fact {
  if (fact) return
  return panic(message)
}

/**
 * A promise that resolves after `ms` milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}
