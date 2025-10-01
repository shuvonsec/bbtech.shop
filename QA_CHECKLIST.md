# QA Checklist

Run through this list before sharing a build with the team.

## Extension basics
- [ ] Manifest version is 3 and loads without warnings in `chrome://extensions`.
- [ ] Popup opens without console errors (check DevTools console).
- [ ] Options page saves and retrieves the SerpAPI key.

## Data fetching
- [ ] SerpAPI requests succeed with a valid key and return Google Shopping results.
- [ ] Search errors (invalid key, empty query) show a readable message in the popup status area.
- [ ] Experimental providers (Shopee, Lazada, TikTok) fail gracefully when endpoints change.

## Results quality
- [ ] Duplicate listings are removed (same URL/title).
- [ ] Prices display in MYR with normalized values when available.
- [ ] CSV export downloads a file containing marketplace, seller, and normalized price columns.

## Regression spot checks
- [ ] Sorting by price re-orders results without re-fetching.
- [ ] Repeated queries do not accumulate stale results.
- [ ] Offline or rate-limited providers surface partial failure notices.
