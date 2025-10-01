const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function dedupeResults(results) {
  const seenLinks = new Set();
  const seenTitles = new Set();
  const deduped = [];

  for (const item of results) {
    if (!item) continue;
    const linkKey = item.link ? item.link.split("?")[0] : "";
    const titleKey = item.title ? normalize(item.title) : "";

    const alreadySeen =
      (linkKey && seenLinks.has(linkKey)) ||
      (titleKey && seenTitles.has(titleKey));

    if (alreadySeen) {
      continue;
    }

    if (linkKey) seenLinks.add(linkKey);
    if (titleKey) seenTitles.add(titleKey);
    deduped.push(item);
  }

  return deduped;
}
