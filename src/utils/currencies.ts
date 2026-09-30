const displayNames = new Intl.DisplayNames(["en-US"], { type: "currency" });
const cache = new Map<string, string>();

export function getCurrencyName(code: string, fallback?: string): string {
  const key = code.trim().toUpperCase();

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  let name: string | undefined;
  try {
    name = displayNames.of(key);
  } catch {
    name = undefined;
  }

  if (!name || name === key) {
    name = fallback?.trim() || key;
  }

  cache.set(key, name);
  return name;
}
