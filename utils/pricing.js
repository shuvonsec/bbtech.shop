const FX_TABLE = {
  MYR: 1,
  SGD: 3.45,
  USD: 4.7,
  AUD: 3.1,
  EUR: 5.1,
  GBP: 5.9,
};

const CURRENCY_SYMBOLS = {
  RM: "MYR",
  MYR: "MYR",
  SGD: "SGD",
  S$: "SGD",
  USD: "USD",
  $: "USD",
  AUD: "AUD",
  A$: "AUD",
  EUR: "EUR",
  "\u20AC": "EUR",
  GBP: "GBP",
  "\u00A3": "GBP",
};

export function parsePrice(input) {
  if (!input) return { amount: null, currency: null };
  const trimmed = input.toString().replace(/[,\s]/g, "").toUpperCase();
  const currencyMatch = trimmed.match(/(RM|MYR|SGD|S\$|USD|AUD|A\$|EUR|€|GBP|£)/i);
  const currency = currencyMatch ? CURRENCY_SYMBOLS[currencyMatch[0].toUpperCase()] : null;
  const amountMatch = trimmed.match(/([0-9]+(?:\.[0-9]+)?)/);
  const amount = amountMatch ? Number(amountMatch[0]) : null;
  return { amount, currency };
}

export function normalizeCurrency({ amount, currency }) {
  if (amount === null || amount === undefined) {
    return null;
  }
  const isoCode = currency ? currency.toUpperCase() : "MYR";
  const fxRate = FX_TABLE[isoCode];
  if (!fxRate) {
    return null;
  }
  return Number((amount * fxRate).toFixed(2));
}

export function formatPrice(amount, currency = "MYR") {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
