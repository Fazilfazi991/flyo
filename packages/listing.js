import { contact, packages } from "../data/packages.js";
import { formatPackageAmount, onCurrencyChange, parseAedPrice } from "../currency.js";
import { whatsappMessages } from "../whatsapp-chooser.js";
import "../navbar.js";

const packageList = packages;
const resultCount = document.querySelector(".package-results-row > span");
const packageGrid = document.querySelector("#packageGrid");
const countryFilterBar = document.querySelector("#countryFilterBar");
const preferredCountries = ["Thailand", "Malaysia", "Singapore", "Sri Lanka", "Kenya", "UAE", "India"];
let activeCountry = "All";

const countryFor = item => item.destinationCountry || item.country || "Other";
const packageCountries = [...new Set(packageList.map(countryFor).filter(Boolean))];
const countryOptions = [
  "All",
  ...preferredCountries,
  ...packageCountries.filter(country => !preferredCountries.includes(country)).sort()
];

const cardDetails = {
  "kuala-lumpur-getaway": {
    location: "Kuala Lumpur, Malaysia",
    duration: "3 Nights / 4 Days",
    tag: "City Break",
    priceAed: 899,
    image: "/packages/Kuala_Lumpur_WebP_Images/KL_Day.webp",
    highlights: ["KL Tower", "Genting Highlands", "Batu Caves", "City Break"]
  },
  "thai-wonders": {
    location: "Bangkok & Pattaya, Thailand",
    duration: "4 Nights / 5 Days",
    tag: "Beach",
    priceAed: 999,
    image: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp",
    highlights: ["Coral Island", "Tiger Park", "Alcazar Show", "Bangkok Tour"]
  },
  "sri-lanka-highlights": {
    location: "Kandy, Nuwara Eliya, Colombo",
    duration: "3 Nights / 4 Days",
    tag: "Cultural",
    priceAed: 1899,
    highlights: ["Pinnawala", "Kandy Temple", "Colombo Tour", "Nature"],
    image: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_Sigiriya.webp"
  },
  "singapore-family-escape": {
    location: "Singapore",
    duration: "4 Nights / 5 Days",
    tag: "Family",
    priceAed: 2999,
    highlights: ["Universal Studios", "Sentosa", "Gardens by the Bay", "Family Trip"]
  },
  "beaches-of-thailand": {
    location: "Krabi, Phi Phi, Phuket",
    duration: "6 Nights / 7 Days",
    tag: "Beach",
    priceAed: 1875,
    highlights: ["Island Hopping", "James Bond Island", "Phuket City Tour", "Beach"]
  },
  "kenya-inspiring-safari": {
    location: "Lake Nakuru, Masai Mara",
    duration: "3 Nights / 4 Days",
    tag: "Safari",
    priceAed: 9385,
    highlights: ["Private Safari", "Game Drives", "Full Board", "Wildlife"]
  },
  "royal-rajasthan-heritage-tour": {
    location: "Jaipur, Bikaner, Jaisalmer & Jodhpur",
    duration: "8 Nights / 9 Days",
    tag: "Heritage",
    priceAed: 1845,
    image: "/packages/rajasthan_package_images_webp/rajasthan-jaipur-amber-fort.webp",
    highlights: ["Amber Fort", "Desert Camp", "Mehrangarh Fort", "Blue City"]
  },
  "kerala-economy-tour": {
    location: "Cochin, Munnar, Thekkady & Alleppey",
    duration: "5 Nights / 6 Days",
    tag: "Nature",
    priceAed: 1199,
    image: "/packages/kerala_package_images_webp/kerala-alleppey-houseboat-backwaters.webp",
    highlights: ["Munnar Tea", "Periyar Lake", "Spice Plantation", "Houseboat"]
  }
};

const icon = type => {
  const icons = {
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z"/></svg>',
    route: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>',
    duration: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7V6a3 3 0 0 1 6 0v1"/><rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 11v1M15 11v1"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a7.5 7.5 0 0 1-10.9 6.7L4 20l1.8-5.6A7.5 7.5 0 1 1 21 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>'
  };
  return icons[type] || "";
};

const revealDelay = index => `reveal-delay-${(index % 6) + 1}`;

const packageCard = (item, index) => {
  const details = cardDetails[item.slug] || {
    location: item.route || item.country,
    duration: item.duration,
    tag: item.category || item.tags[0] || "Holiday",
    priceAed: parseAedPrice(item.startingPrice || item.price),
    highlights: item.highlights.slice(0, 3)
  };
  const priceAed = details.priceAed || parseAedPrice(details.price || item.startingPrice || item.price);

  return `
  <article class="package-card reveal ${revealDelay(index)}">
    <a class="package-card-image reveal-image" href="/packages/${item.slug}/" aria-label="View ${item.title}">
      <img src="${details.image || item.cardImage}" alt="${item.title}">
      <span class="package-badge">${icon("star")}Best Seller</span>
    </a>
    <div class="package-card-body">
      <h3>${item.title}</h3>
      <div class="package-card-meta">
        <span>${icon("route")}<b>Route:</b> ${details.location}</span>
        <span>${icon("duration")}<b>Duration:</b> ${details.duration}</span>
      </div>
      <div class="package-highlight-row">
        ${details.highlights.slice(0, 3).map(highlight => `<span>${highlight}</span>`).join("")}
      </div>
      <div class="package-card-footer">
        <div class="package-price">
          <small>From</small>
          <strong data-price-aed="${priceAed || ""}">${formatPackageAmount(priceAed)}</strong>
          <span>/person</span>
        </div>
      </div>
      <div class="package-action-row">
        <a class="package-view-link" href="/packages/${item.slug}/">${icon("bag")}View Package</a>
        <a class="package-enquire-link" href="#" data-whatsapp-package="${item.title}">${icon("chat")}Enquire Now</a>
      </div>
    </div>
  </article>
`;};

const updatePackageCardPrices = () => {
  document.querySelectorAll("[data-price-aed]").forEach(element => {
    element.textContent = formatPackageAmount(element.dataset.priceAed);
  });
};

const renderPackageCards = () => {
  if (!packageGrid) return;
  const filteredPackages = activeCountry === "All"
    ? packageList
    : packageList.filter(item => countryFor(item) === activeCountry);

  if (resultCount) {
    const packageWord = filteredPackages.length === 1 ? "package" : "packages";
    resultCount.textContent = `Showing ${filteredPackages.length} curated ${packageWord}`;
  }

  packageGrid.innerHTML = filteredPackages.length
    ? filteredPackages.map(packageCard).join("")
    : `
      <div class="package-empty-state">
        <h3>No packages found</h3>
        <p>Try another destination country or choose All to view every Flyo package.</p>
      </div>
    `;

  updatePackageCardPrices();
};

const renderCountryFilters = () => {
  if (!countryFilterBar) return;
  countryFilterBar.innerHTML = countryOptions.map(country => `
    <button class="country-filter-chip${country === activeCountry ? " active" : ""}" type="button" data-country-filter="${country}">
      ${country}
    </button>
  `).join("");
  countryFilterBar.querySelectorAll("[data-country-filter]").forEach(button => {
    button.addEventListener("click", () => {
      activeCountry = button.dataset.countryFilter;
      renderCountryFilters();
      renderPackageCards();
    });
  });
};

renderCountryFilters();
renderPackageCards();
onCurrencyChange(updatePackageCardPrices);

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.setAttribute("href", "#");
  if (!link.dataset.whatsappMessage) link.dataset.whatsappMessage = whatsappMessages.general;
});

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  window.openWhatsAppChooser?.(whatsappMessages.general);
}));

function initScrollReveal() {
  const revealSelectors = [
    ".section-heading",
    ".package-filter-panel",
    ".package-results-row",
    ".packages-custom-cta",
    ".cta-visual",
    ".footer-grid"
  ];
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      if (!element.className.match(/reveal-delay-/)) element.classList.add(revealDelay(index));
    });
  });
  const revealElements = document.querySelectorAll(".reveal, .reveal-image");
  if (!revealElements.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach(element => element.classList.add("is-visible"));
    return;
  }
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealElements.forEach(element => revealObserver.observe(element));
}

initScrollReveal();

const filterToggle = document.querySelector(".filter-toggle");
const filterControls = document.querySelector(".filter-controls");
if (filterToggle && filterControls) {
  filterToggle.addEventListener("click", () => {
    const open = filterControls.classList.toggle("is-open");
    filterToggle.setAttribute("aria-expanded", String(open));
    filterToggle.textContent = open ? "Hide Filters" : "Show Filters";
  });
}
