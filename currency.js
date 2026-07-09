const AED_TO_INR = 22.75;
const STORAGE_KEY = "flyoCurrency";
const SUPPORTED_CURRENCIES = ["AED", "INR"];

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

export const formatPackageAmount = (aedPrice, currency = getSelectedCurrency()) => {
  const amount = parseAedPrice(aedPrice);
  if (!amount) return "Price on request";
  if (currency === "INR") {
    return `INR ${new Intl.NumberFormat("en-IN").format(Math.round(amount * AED_TO_INR))}`;
  }
  return `AED ${new Intl.NumberFormat("en-AE").format(Math.round(amount))}`;
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
