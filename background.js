import { dedupeResults } from "./utils/dedupe.js";
import { normalizeCurrency } from "./utils/pricing.js";
import { fetchSerpApi } from "./providers/serpapi.js";
import { fetchShopee } from "./providers/shopee.js";
import { fetchLazada } from "./providers/lazada.js";
import { fetchTikTok } from "./providers/tiktok.js";
import { resolveSerpApiKey } from "./config/defaults.js";

const PROVIDERS = {
  serpapi: async ({ query, apiKey }) => fetchSerpApi(query, apiKey),
  shopee: async ({ query }) => fetchShopee(query),
  lazada: async ({ query }) => fetchLazada(query),
  tiktok: async ({ query }) => fetchTikTok(query),
};

async function getSerpApiKey() {
  const result = await chrome.storage.sync.get(["serpApiKey"]);
  return resolveSerpApiKey(result.serpApiKey);
}

async function fetchFromProviders({ query, selectedProviders }) {
  const apiKey = await getSerpApiKey();
  const providerCalls = [];
  const errors = [];

  const providersToCall = new Set(["serpapi", ...selectedProviders.filter((p) => p !== "serpapi")]);

  for (const providerId of providersToCall) {
    const providerFn = PROVIDERS[providerId];
    if (!providerFn) continue;

    providerCalls.push(
      providerFn({ query, apiKey })
        .then((items) => ({ providerId, items }))
        .catch((error) => {
          errors.push({ providerId, message: error.message });
          return { providerId, items: [] };
        })
    );
  }

  const settled = await Promise.all(providerCalls);
  const combined = settled.flatMap(({ items }) => items || []);
  const deduped = dedupeResults(combined).map((item) => ({
    ...item,
    normalizedPrice:
      item.normalizedPrice ??
      normalizeCurrency({ amount: item.price, currency: item.currency || "MYR" }),
  }));

  return { results: deduped, errors };
}

function sortResults(results, sortBy) {
  if (sortBy === "price") {
    return [...results].sort((a, b) => {
      const priceA = a.normalizedPrice ?? Number.POSITIVE_INFINITY;
      const priceB = b.normalizedPrice ?? Number.POSITIVE_INFINITY;
      return priceA - priceB;
    });
  }
  return results;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "FETCH_PRICES") {
    return undefined;
  }

  const { query, providers = [], sortBy = "relevance" } = message.payload || {};

  if (!query || query.trim().length < 3) {
    sendResponse({ error: "Enter at least 3 characters." });
    return true;
  }

  fetchFromProviders({ query: query.trim(), selectedProviders: providers })
    .then(({ results, errors }) => {
      sendResponse({
        results: sortResults(results, sortBy),
        errors,
      });
    })
    .catch((error) => {
      sendResponse({ error: error.message });
    });

  return true;
});
