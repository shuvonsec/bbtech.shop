# bbtech Competitor Price Scout

Chrome Extension (Manifest V3) used by bbtech to scout competitor pricing for refurbished laptops in Malaysia.

## What it does

1. Accepts a laptop model or listing title from the popup UI.
2. Queries Google Shopping through SerpAPI (stable) and optional experimental scrapers for Shopee, Lazada, and TikTok Shop.
3. Normalizes prices into MYR, deduplicates identical listings, and shows the seller/marketplace breakdown.
4. Allows CSV export for quick sharing.

> **Note:** SerpAPI is the only supported provider for production use. Shopee, Lazada, and TikTok Shop scrapers are experimental and may break without notice.

## File structure

```
manifest.json
background.js                 # Background service worker (ES module)
popup.html / popup.css / popup.js
options.html / options.css / options.js
utils/
  csv.js                       # CSV helpers
  dedupe.js                    # Deduplicate results
  pricing.js                   # Parse + normalize price data
providers/
  serpapi.js                   # Stable SerpAPI integration
  shopee.js                    # Experimental Shopee scraper
  lazada.js                    # Experimental Lazada scraper
  tiktok.js                    # Experimental TikTok Shop scraper
README.md                      # Ops notes and onboarding guide
QA_CHECKLIST.md                # Manual validation steps before release
```

All scripts are ES modules to remain MV3 compatible.

## Setup

1. Use the shared SerpAPI key `e4c7b575df2d22e8cb31d4a3ae6cb807a4159c869af0f3396c2b15c68a0b599c` (preloaded in the options page) or generate your own key with Google Shopping enabled.
2. Load the extension:
   - `chrome://extensions`
   - Enable **Developer mode**
   - **Load unpacked** → select this repository folder
3. Open the extension options page and confirm the SerpAPI key (leave blank to keep the shared key or override with your own).
4. Pin the extension for quick access.

## Usage

1. Enter the laptop model/title in the popup.
2. Tick experimental marketplaces if you need more coverage (beware of rate limits and scraper drift).
3. Choose sorting by relevance or by normalized MYR price.
4. Click **Search** to fetch offers.
5. Export to CSV if you need to share the snapshot.

### Tips

- Results show normalized MYR prices when available. Listings with missing price data are flagged as "Price unavailable".
- Partial failures (e.g., Shopee blocked) are surfaced in the status area. Retry later or toggle the provider off.
- For deeper analysis, import the CSV into Google Sheets and layer additional filters (e.g., seller reliability, stock levels).

## Legal & Ethical Notes

- Respect marketplace terms of service. Experimental scrapers can break or be blocked; use sparingly.
- Store SerpAPI keys in Chrome Sync (already handled) and rotate keys if a leak is suspected.
- This tool is for internal competitive intelligence only. Do not share screenshots or exports outside bbtech.

## Roadmap

- Swap crude FX table for a daily FX API refresh.
- Add brand filters + saved search presets for common Latitude/ThinkPad models.
- Push CSV exports straight to Google Sheets for team-wide dashboards.

