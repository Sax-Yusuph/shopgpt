export function getLocalStorage(key: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return JSON.parse(localStorage.getItem(key));
}
