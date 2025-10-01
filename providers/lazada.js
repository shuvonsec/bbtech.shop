import { parsePrice, normalizeCurrency } from "../utils/pricing.js";

const ENDPOINT = "https://www.lazada.com.my/catalog/";

export async function fetchLazada(query) {
  const params = new URLSearchParams({
    ajax: "true",
    q: query,
    from: "input",
  });

  const response = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lazada error: ${response.status}`);
  }
  const data = await response.json();
  const items = data?.mods?.listItems;
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((item) => {
    const { amount, currency } = parsePrice(item.price || item.discountPrice);
    return {
      title: item.name,
      seller: item.sellerName,
      marketplace: "Lazada",
      link: item.productUrl ? `https:${item.productUrl}` : null,
      price: amount,
      currency: currency || item.currency || "MYR",
      normalizedPrice: normalizeCurrency({ amount, currency: currency || item.currency || "MYR" }),
    };
  }).filter((item) => item.link);
}
