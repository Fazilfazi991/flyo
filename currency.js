const AED_TO_INR = 22.75;
const STORAGE_KEY = "flyoCurrency";
const SUPPORTED_CURRENCIES = ["AED", "INR"];
const experienceMenuItems = [
  { label: "Activities", href: "/experiences.html#activities" },
  { label: "MICE", href: "/experiences.html#mice" },
  { label: "Sightseeing", href: "/experiences.html#sightseeing" },
  { label: "Adventure", href: "/experiences.html#adventure" },
  { label: "Cruise Experiences", href: "/experiences.html#cruise" },
  { label: "Honeymoon Experiences", href: "/experiences.html#honeymoon" },
  { label: "Family Experiences", href: "/experiences.html#family" },
  { label: "Group Tours", href: "/experiences.html#group-tours" }
];

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

const closeExperienceDropdowns = except => {
  document.querySelectorAll(".nav-dropdown.is-open").forEach(dropdown => {
    if (dropdown !== except) {
      dropdown.classList.remove("is-open");
      dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
};

const enhanceExperienceDropdown = nav => {
  if (nav.dataset.experienceDropdownReady === "true") return;
  const existingDropdown = nav.querySelector(".nav-dropdown");
  if (existingDropdown) {
    nav.dataset.experienceDropdownReady = "true";
    wireExperienceDropdown(nav, existingDropdown);
    return;
  }
  const link = [...nav.querySelectorAll("a")].find(anchor => {
    const href = anchor.getAttribute("href") || "";
    return /experiences\.html/.test(href) && !anchor.classList.contains("mobile-nav-cta") && !anchor.closest(".nav-dropdown");
  });
  if (!link) return;

  nav.dataset.experienceDropdownReady = "true";
  const isActive = link.classList.contains("active") || location.pathname.toLowerCase().includes("experiences");
  const dropdown = document.createElement("div");
  dropdown.className = `nav-dropdown${isActive ? " active" : ""}`;
  dropdown.innerHTML = `
    <button class="nav-dropdown-toggle${isActive ? " active" : ""}" type="button" aria-expanded="false">
      <span>Experiences</span><b aria-hidden="true">+</b>
    </button>
    <div class="nav-dropdown-menu">
      ${experienceMenuItems.map(item => `<a href="${item.href}">${item.label}</a>`).join("")}
    </div>
  `;
  link.replaceWith(dropdown);
  wireExperienceDropdown(nav, dropdown);
};

const wireExperienceDropdown = (nav, dropdown) => {
  if (dropdown.dataset.dropdownWired === "true") return;
  dropdown.dataset.dropdownWired = "true";
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  if (!toggle) return;
  const close = () => {
    dropdown.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    closeExperienceDropdowns(dropdown);
    dropdown.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", event => {
    event.stopPropagation();
    dropdown.classList.contains("is-open") ? close() : open();
  });

  dropdown.addEventListener("mouseenter", () => {
    if (window.matchMedia("(min-width: 1121px)").matches) open();
  });
  dropdown.addEventListener("mouseleave", () => {
    if (window.matchMedia("(min-width: 1121px)").matches) close();
  });
  dropdown.querySelectorAll(".nav-dropdown-menu a").forEach(anchor => {
    anchor.addEventListener("click", () => {
      close();
      nav.classList.remove("open");
      document.querySelector(".menu-toggle, .package-menu-toggle")?.setAttribute("aria-expanded", "false");
    });
  });
};

export const initFlyoCurrencyNav = () => {
  document.querySelectorAll(".main-nav, .package-nav").forEach(nav => {
    enhanceExperienceDropdown(nav);
    if (nav.dataset.currencyEnhanced === "true") return;
    nav.dataset.currencyEnhanced = "true";
    nav.append(createCurrencyControl(), createPartnerButton());
  });
  updateCurrencyControls();
};

document.addEventListener("click", event => {
  if (!event.target.closest(".nav-dropdown")) closeExperienceDropdowns();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFlyoCurrencyNav, { once: true });
} else {
  initFlyoCurrencyNav();
}
