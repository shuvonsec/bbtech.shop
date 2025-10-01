import { downloadCsv } from "./utils/csv.js";
import { formatPrice } from "./utils/pricing.js";

const queryInput = document.getElementById("query");
const searchButton = document.getElementById("search");
const exportButton = document.getElementById("export");
const resultsContainer = document.getElementById("results");
const statusElement = document.getElementById("status");
const sortSelect = document.getElementById("sort");

let latestResults = [];

function getSelectedProviders() {
  const checkboxes = document.querySelectorAll('.providers input[type="checkbox"]');
  const selected = [];
  for (const checkbox of checkboxes) {
    if (checkbox.value === "serpapi") continue;
    if (checkbox.checked) selected.push(checkbox.value);
  }
  return selected;
}

function renderResults(results) {
  resultsContainer.innerHTML = "";
  if (!results || results.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No offers found yet.";
    resultsContainer.appendChild(empty);
    exportButton.disabled = true;
    return;
  }

  for (const item of results) {
    const card = document.createElement("article");
    card.className = "result-card";

    const header = document.createElement("div");
    header.className = "result-header";

    const titleLink = document.createElement("a");
    titleLink.href = item.link;
    titleLink.target = "_blank";
    titleLink.rel = "noopener";
    titleLink.textContent = item.title || "Unknown item";

    const price = document.createElement("span");
    price.className = "result-price";
    let priceText = "Price unavailable";
    if (item.normalizedPrice !== null && item.normalizedPrice !== undefined) {
      priceText = formatPrice(item.normalizedPrice, "MYR");
    } else if (item.price !== null && item.price !== undefined) {
      priceText = `${item.currency || "MYR"} ${item.price}`;
    }
    price.textContent = priceText;

    header.appendChild(titleLink);
    header.appendChild(price);

    const meta = document.createElement("p");
    meta.textContent = `${item.marketplace || "Unknown marketplace"} • ${
      item.seller || "Unknown seller"
    }`;
    meta.className = "result-meta";

    card.appendChild(header);
    card.appendChild(meta);
    resultsContainer.appendChild(card);
  }
  exportButton.disabled = false;
}

function showStatus(message, tone = "info") {
  statusElement.textContent = message;
  statusElement.dataset.tone = tone;
}

function handleErrors(errors) {
  if (!errors || errors.length === 0) {
    showStatus("Ready.");
    return;
  }
  const formatted = errors
    .map((error) => `${error.providerId}: ${error.message}`)
    .join(" | ");
  showStatus(`Partial data - ${formatted}`, "warning");
}

function toCsvRows(results) {
  return results.map((item) => ({
    Title: item.title,
    Marketplace: item.marketplace,
    Seller: item.seller,
    Link: item.link,
    Price: item.price,
    Currency: item.currency,
    NormalizedMYR: item.normalizedPrice,
  }));
}

async function runSearch() {
  const query = queryInput.value.trim();
  if (query.length < 3) {
    showStatus("Enter at least 3 characters.", "error");
    return;
  }

  showStatus("Fetching competitor prices…", "info");
  resultsContainer.innerHTML = "";
  exportButton.disabled = true;

  const sortBy = sortSelect.value;
  const providers = getSelectedProviders();

  try {
    const response = await chrome.runtime.sendMessage({
      type: "FETCH_PRICES",
      payload: { query, providers, sortBy },
    });

    if (!response) {
      showStatus("No response from background script.", "error");
      return;
    }

    if (response.error) {
      showStatus(response.error, "error");
      return;
    }

    latestResults = response.results || [];
    renderResults(latestResults);
    handleErrors(response.errors);
  } catch (error) {
    showStatus(error.message, "error");
  }
}

searchButton.addEventListener("click", runSearch);
queryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runSearch();
  }
});

sortSelect.addEventListener("change", () => {
  if (!latestResults.length) return;
  const sorted = [...latestResults];
  if (sortSelect.value === "price") {
    sorted.sort((a, b) => {
      const priceA = a.normalizedPrice ?? Number.POSITIVE_INFINITY;
      const priceB = b.normalizedPrice ?? Number.POSITIVE_INFINITY;
      return priceA - priceB;
    });
  }
  renderResults(sorted);
});

exportButton.addEventListener("click", () => {
  if (!latestResults.length) return;
  const filename = `bbtech-prices-${Date.now()}.csv`;
  downloadCsv(filename, toCsvRows(latestResults));
});

showStatus("Ready.");
