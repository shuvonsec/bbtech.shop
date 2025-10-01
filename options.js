import { DEFAULT_SERPAPI_KEY, resolveSerpApiKey } from "./config/defaults.js";

const MASKED_SHARED_KEY = `${DEFAULT_SERPAPI_KEY.slice(0, 6)}…${DEFAULT_SERPAPI_KEY.slice(-4)}`;

const form = document.getElementById("api-form");
const keyInput = document.getElementById("serpapi-key");
const status = document.getElementById("status");

keyInput.placeholder = MASKED_SHARED_KEY;

async function loadKey() {
  const stored = await chrome.storage.sync.get(["serpApiKey"]);
  const resolved = resolveSerpApiKey(stored.serpApiKey);

  if (!stored.serpApiKey || stored.serpApiKey.trim().length === 0) {
    keyInput.value = "";
    return;
  }

  keyInput.value = resolved;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const key = keyInput.value.trim();
  if (key.length === 0) {
    await chrome.storage.sync.remove("serpApiKey");
  } else {
    await chrome.storage.sync.set({ serpApiKey: key });
  }
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 2000);
});

loadKey();
