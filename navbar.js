import { getSelectedCurrency, setSelectedCurrency } from "./currency.js";

const experienceItems = [
  { label: "Activities", href: "/experiences.html#activities" },
  { label: "Sightseeing", href: "/experiences.html#sightseeing" },
  { label: "Cruises", href: "/experiences.html#cruise" },
  { label: "Adventure", href: "/experiences.html#adventure" },
  { label: "Family Experiences", href: "/experiences.html#family" },
  { label: "Luxury Experiences", href: "/experiences.html#honeymoon" }
];

const navItems = [
  { label: "Home", href: "/index.html", key: "home" },
  { label: "Flights", href: "/flights/", key: "flights" },
  { label: "Holidays", href: "/packages/", key: "holidays" },
  { label: "Experiences", href: "/experiences.html", key: "experiences", dropdown: experienceItems },
  { label: "Visa Services", href: "/visa-services/", key: "visa" },
  { label: "Contact", href: "#contact", key: "contact" }
];

const activeKeyForPath = () => {
  const path = location.pathname.toLowerCase();
  if (path.includes("/flights")) return "flights";
  if (path.includes("/packages")) return "holidays";
  if (path.includes("/visa-services")) return "visa";
  if (path.includes("experiences")) return "experiences";
  return "home";
};

const navLink = item => {
  const active = item.key === activeKeyForPath();
  if (item.dropdown) {
    return `
      <div class="nav-dropdown${active ? " active" : ""}">
        <button class="nav-dropdown-toggle${active ? " active" : ""}" type="button" aria-expanded="false">
          <span>${item.label}</span><b aria-hidden="true">+</b>
        </button>
        <div class="nav-dropdown-menu">
          ${item.dropdown.map(dropdownItem => `<a href="${dropdownItem.href}">${dropdownItem.label}</a>`).join("")}
        </div>
      </div>
    `;
  }
  return `<a class="${active ? "active" : ""}" href="${item.href}">${item.label}</a>`;
};

const closeDropdowns = except => {
  document.querySelectorAll(".nav-dropdown.is-open").forEach(dropdown => {
    if (dropdown !== except) {
      dropdown.classList.remove("is-open");
      dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
};

const wireDropdown = (nav, dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  if (!toggle) return;
  const close = () => {
    dropdown.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    closeDropdowns(dropdown);
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
  dropdown.querySelectorAll("a").forEach(anchor => {
    anchor.addEventListener("click", () => {
      close();
      nav.classList.remove("open");
      document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
    });
  });
};

const showPartnerModal = event => {
  event.preventDefault();
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
    modal.addEventListener("click", modalEvent => {
      if (modalEvent.target === modal || modalEvent.target.closest(".partner-login-close")) modal.classList.remove("is-open");
    });
    document.addEventListener("keydown", keyEvent => {
      if (keyEvent.key === "Escape") modal.classList.remove("is-open");
    });
  }
  modal.classList.add("is-open");
};

export const initGlobalNavbar = () => {
  document.querySelectorAll(".site-header").forEach(header => {
    if (header.dataset.globalNavbarReady === "true") return;
    header.dataset.globalNavbarReady = "true";
    header.classList.add("flyo-global-navbar");
    header.innerHTML = `
      <div class="container nav-wrap">
        <a class="brand" href="/index.html" aria-label="Flyo Tours & Travels home">
          <img src="/public/flyo-logo-white.svg" alt="Flyo Tours & Travels">
        </a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" aria-label="Main navigation">
          ${navItems.map(navLink).join("")}
          <label class="nav-currency">
            <span>Currency</span>
            <select data-flyo-currency-select aria-label="Select currency">
              <option value="AED">AED</option>
              <option value="INR">INR</option>
            </select>
          </label>
          <a class="partner-login-button" href="/partner-login">Partner Login</a>
        </nav>
      </div>
    `;
  });

  document.querySelectorAll("[data-flyo-currency-select]").forEach(select => {
    select.value = getSelectedCurrency();
    select.addEventListener("change", event => setSelectedCurrency(event.target.value));
  });

  document.querySelectorAll(".main-nav").forEach(nav => {
    nav.querySelectorAll(".nav-dropdown").forEach(dropdown => wireDropdown(nav, dropdown));
    nav.querySelector(".partner-login-button")?.addEventListener("click", showPartnerModal);
  });

  document.querySelectorAll(".menu-toggle").forEach(toggle => {
    const nav = toggle.closest(".site-header")?.querySelector(".main-nav");
    if (!nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlobalNavbar, { once: true });
} else {
  initGlobalNavbar();
}
