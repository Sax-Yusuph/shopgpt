// A type representing a okful or failed operation.
// If okful, it contains the result data. If failed, it contains an error message.
export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

/**
 * A utility function to safely handle synchronous or asynchronous operations.
 * @param promiseOrFunc A promise representing an asynchronous operation or a function for a synchronous operation.
 * @returns If passed a promise, it returns another promise with the Safe type. If passed a function, it returns the Safe type directly.
 */
export function safe<T>(promise: Promise<T>): Promise<Result<T>>
export function safe<T>(func: () => T): Result<T>
export function safe<T>(
  promiseOrFunc: Promise<T> | (() => T),
): Promise<Result<T>> | Result<T> {
  if (promiseOrFunc instanceof Promise) {
    return safeAsync(promiseOrFunc)
  }
  return safeSync(promiseOrFunc)
}

/**
 * Safely handles an asynchronous operation.
 * @param promise The promise to be executed.
 * @returns A promise that resolves to the Safe type.
 */

async function safeAsync<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise
    return { data, ok: true }
  } catch (e) {
    return handleError(e)
  }
}

/**
 * Safely handles a synchronous operation.
 * @param func The function to be executed.
 * @returns A result of type Safe.
 */
function safeSync<T>(func: () => T): Result<T> {
  try {
    const data = func()
    return { data, ok: true }
  } catch (e) {
    return handleError(e)
  }
}

/**
 * Handles errors and determines the appropriate Safe error response.
 * @param e The error thrown.
 * @returns A result of type Safe with a failure state.
 */
function handleError(e: unknown): Result<never> {
  if (e instanceof Error) {
    return { ok: false, error: e.message }
  }
  return { ok: false, error: 'Something went wrong' }
}
