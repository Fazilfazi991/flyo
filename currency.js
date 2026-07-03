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
    return `\u20b9${new Intl.NumberFormat("en-IN").format(Math.round(amount * AED_TO_INR))}`;
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

const showPartnerModal = () => {
  let modal = document.querySelector(".partner-login-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "partner-login-modal";
    modal.innerHTML = `
      <div class="partner-login-dialog" role="dialog" aria-modal="true" aria-labelledby="partnerLoginTitle">
        <button class="partner-login-close" type="button" aria-label="Close">x</button>
        <span>Coming Soon</span>
        <h2 id="partnerLoginTitle">Partner Login Coming Soon</h2>
        <p>This feature will be available soon for agents and partners.</p>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", event => {
      if (event.target === modal || event.target.closest(".partner-login-close")) modal.classList.remove("is-open");
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") modal.classList.remove("is-open");
    });
  }
  modal.classList.add("is-open");
};

const createCurrencyControl = () => {
  const label = document.createElement("label");
  label.className = "nav-currency";
  label.innerHTML = `
    <span>Currency</span>
    <select data-flyo-currency-select aria-label="Select currency">
      <option value="AED">AED</option>
      <option value="INR">INR</option>
    </select>
  `;
  label.querySelector("select").addEventListener("change", event => setSelectedCurrency(event.target.value));
  return label;
};

const createPartnerButton = () => {
  const button = document.createElement("button");
  button.className = "partner-login-button";
  button.type = "button";
  button.textContent = "Partner Login";
  button.addEventListener("click", showPartnerModal);
  return button;
};

export const initFlyoCurrencyNav = () => {
  document.querySelectorAll(".main-nav, .package-nav").forEach(nav => {
    if (nav.dataset.currencyEnhanced === "true") return;
    nav.dataset.currencyEnhanced = "true";
    nav.append(createCurrencyControl(), createPartnerButton());
  });
  updateCurrencyControls();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFlyoCurrencyNav, { once: true });
} else {
  initFlyoCurrencyNav();
}
