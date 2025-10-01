const form = document.getElementById("api-form");
const keyInput = document.getElementById("serpapi-key");
const status = document.getElementById("status");

async function loadKey() {
  const stored = await chrome.storage.sync.get(["serpApiKey"]);
  if (stored.serpApiKey) {
    keyInput.value = stored.serpApiKey;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const key = keyInput.value.trim();
  await chrome.storage.sync.set({ serpApiKey: key });
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 2000);
});

loadKey();
