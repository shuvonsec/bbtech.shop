import { normalizeCurrency } from "../utils/pricing.js";

const ENDPOINT = "https://shopee.com.my/api/v4/search/search_items";

export async function fetchShopee(query) {
  const params = new URLSearchParams({
    by: "relevancy",
    keyword: query,
    limit: "20",
    newest: "0",
    order: "desc",
    page_type: "search",
  });

  const response = await fetch(`${ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Shopee error: ${response.status}`);
  }
  const data = await response.json();
  if (!data || !Array.isArray(data.items)) {
    return [];
  }
  return data.items.map((item) => {
    const basic = item.item_basic;
    if (!basic) return null;
    const price = (basic.price ?? basic.price_min) / 100000;
    return {
      title: basic.name,
      seller: basic.shop_location,
      marketplace: "Shopee",
      link: `https://shopee.com.my/${basic.name.replace(/\s+/g, "-")}-i.${basic.shopid}.${basic.itemid}`,
      price,
      currency: "MYR",
      normalizedPrice: normalizeCurrency({ amount: price, currency: "MYR" }),
    };
  }).filter(Boolean);
}
