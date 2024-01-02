export function convertToBlob(obj: unknown) {
  const str = JSON.stringify(obj)
  const bytes = new TextEncoder().encode(str)
  const blob = new Blob([bytes], {
    type: 'application/json;charset=utf-8',
  })
  return blob
}
