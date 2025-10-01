import { DEFAULT_SERPAPI_KEY, resolveSerpApiKey } from "./config/defaults.js";

const form = document.getElementById("api-form");
const keyInput = document.getElementById("serpapi-key");
const status = document.getElementById("status");

keyInput.placeholder = DEFAULT_SERPAPI_KEY;

async function loadKey() {
  const stored = await chrome.storage.sync.get(["serpApiKey"]);
  keyInput.value = resolveSerpApiKey(stored.serpApiKey);
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
