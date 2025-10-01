import { parsePrice, normalizeCurrency } from "../utils/pricing.js";

const ENDPOINT = "https://serpapi.com/search.json";

export async function fetchSerpApi(query, apiKey) {
  if (!apiKey) {
    throw new Error("Missing SerpAPI key. Set it in the options page.");
  }

  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    location: "Malaysia",
    hl: "en",
    gl: "my",
    api_key: apiKey,
  });

  const response = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`SerpAPI error: ${response.status} ${message}`);
  }
  const data = await response.json();
  const items = data.shopping_results || [];
  return items.map((item) => {
    const { amount, currency } = parsePrice(item.extracted_price ?? item.price);
    return {
      title: item.title,
      seller: item.source || item.store,
      marketplace: "Google Shopping",
      link: item.link,
      price: amount,
      currency: currency || item.currency || "MYR",
      normalizedPrice: normalizeCurrency({ amount, currency: currency || item.currency || "MYR" }),
    };
  });
}
