/**
 * Filters out all elements in `arr` that are `undefined`.
 */
export function filterUndefined<T>(arr: Iterable<T | undefined>): T[] {
  const result: T[] = [];
  for (const x of arr) {
    if (x !== undefined) {
      result.push(x);
    }
  }
  return result;
}
