export type Result<O, E> = Ok<O> | Err<E>
export const OK: unique symbol = Symbol('Ok')

export const ERR: unique symbol = Symbol('Err')

export type Ok<A> = Readonly<{
  kind: typeof OK
  value: A
  map<B>(fn: (_: A) => B): Ok<B>
  bind<B, E>(fn: (_: A) => Result<B, E>): Result<B, E>
  match<B>(obj: { ok: (_: A) => B; err: (_: never) => B }): B
}>

export function ok<A>(a: A): Ok<A> {
  return {
    kind: OK,

    value: a,
    map(fn) {
      return ok(fn(a))
    },

    bind(fn) {
      return fn(a)
    },

    match(obj) {
      return obj.ok(a)
    },
  }
}

export type Err<E> = Readonly<{
  kind: typeof ERR

  error: E

  map<B>(fn: (_: never) => B): Err<E>
  bind<B>(fn: (_: never) => Result<B, E>): Err<E>
  match<B>(obj: { ok: (_: never) => B; err: (_: E) => B }): B
}>

export function err<E>(e: E): Err<E> {
  const self: Err<E> = {
    kind: ERR,

    error: e,

    map() {
      return self
    },

    bind() {
      return self
    },

    match(obj) {
      return obj.err(e)
    },
  }

  return self
}

export function safe<T>(promise: Promise<T>): Promise<Result<T, string>>
export function safe<T>(func: () => T): Result<T, string>
export function safe<T>(promiseOrFunc: Promise<T> | (() => T)) {
  if (promiseOrFunc instanceof Promise) {
    return safeAsync(promiseOrFunc)
  }
  return safeSync(promiseOrFunc)
}

function safeSync<T>(func: () => T) {
  try {
    const data = func()
    return ok(data)
  } catch (e) {
    return handleError(e)
  }
}

async function safeAsync<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return ok(data)
  } catch (e) {
    return handleError(e)
  }
}

function handleError(e: unknown): Err<string> {
  if (e instanceof Error) {
    return err(e.message)
  }
  return err('Operation failed')
}
