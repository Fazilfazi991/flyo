const CURRENCY_RATES = {
  AED: 1,
  INR: 26,
  USD: 1 / 3.67
};
const STORAGE_KEY = "flyoCurrency";
const SUPPORTED_CURRENCIES = ["AED", "INR", "USD"];

const safeStorage = {
  get() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // localStorage can be unavailable in private or restricted contexts.
    }
  }
};

export const getSelectedCurrency = () => {
  const saved = safeStorage.get();
  return SUPPORTED_CURRENCIES.includes(saved) ? saved : "AED";
};

export const parseAedPrice = value => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = String(value || "").replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
};

export const convertPrice = (aedPrice, currency = getSelectedCurrency()) => {
  const amount = parseAedPrice(aedPrice);
  if (!amount) return null;
  return amount * (CURRENCY_RATES[currency] || CURRENCY_RATES.AED);
};

export const formatCurrency = (amount, currency = getSelectedCurrency()) => {
  if (!Number.isFinite(amount)) return "Price on request";
  const rounded = Math.round(amount);
  if (currency === "INR") {
    return `₹${new Intl.NumberFormat("en-IN").format(rounded)}`;
  }
  if (currency === "USD") {
    return `$${new Intl.NumberFormat("en-US").format(rounded)}`;
  }
  return `AED ${new Intl.NumberFormat("en-AE").format(rounded)}`;
};

export const formatPackageAmount = (aedPrice, currency = getSelectedCurrency()) => {
  const amount = convertPrice(aedPrice, currency);
  return amount ? formatCurrency(amount, currency) : "Price on request";
};

export const formatPackagePrice = (aedPrice, currency = getSelectedCurrency(), note = "/ person") => {
  const amount = formatPackageAmount(aedPrice, currency);
  return /request/i.test(amount) ? amount : `${amount} ${note}`;
};

const updateCurrencyControls = () => {
  const currency = getSelectedCurrency();
  document.querySelectorAll("[data-flyo-currency-select]").forEach(select => {
    select.value = currency;
  });
};

export const setSelectedCurrency = currency => {
  const nextCurrency = SUPPORTED_CURRENCIES.includes(currency) ? currency : "AED";
  safeStorage.set(nextCurrency);
  updateCurrencyControls();
  document.dispatchEvent(new CustomEvent("flyo:currency-change", { detail: { currency: nextCurrency } }));
};

export const onCurrencyChange = callback => {
  document.addEventListener("flyo:currency-change", event => callback(event.detail.currency));
};
