export const DEFAULT_SERPAPI_KEY = "e4c7b575df2d22e8cb31d4a3ae6cb807a4159c869af0f3396c2b15c68a0b599c";

export function resolveSerpApiKey(storedKey) {
  if (!storedKey) {
    return DEFAULT_SERPAPI_KEY;
  }
  const trimmed = storedKey.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_SERPAPI_KEY;
}
