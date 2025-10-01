import { parsePrice, normalizeCurrency } from "../utils/pricing.js";

const ENDPOINT = "https://www.tiktok.com/api/v1/product/search/";

export async function fetchTikTok(query) {
  const params = new URLSearchParams({
    keyword: query,
    region: "MY",
    count: "20",
  });

  const response = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`TikTok Shop error: ${response.status}`);
  }
  const data = await response.json();
  const items = data?.data?.products || [];
  return items.map((item) => {
    const { amount, currency } = parsePrice(item.price?.price_text);
    return {
      title: item.title,
      seller: item.seller_name,
      marketplace: "TikTok Shop",
      link: item.detail_url,
      price: amount,
      currency: currency || item.currency || "MYR",
      normalizedPrice: normalizeCurrency({ amount, currency: currency || item.currency || "MYR" }),
    };
  }).filter((item) => item.link);
}
