import { packages } from "../data/packages.js";
import { formatPackageAmount, onCurrencyChange, parseAedPrice } from "../currency.js";
import { whatsappMessages } from "../whatsapp-chooser.js";
import "../navbar.js";

const packageList = packages;
const resultCount = document.querySelector(".package-results-row > span");
const packageGrid = document.querySelector("#packageGrid");
const countryFilterBar = document.querySelector("#countryFilterBar");
const searchInput = document.querySelector("#packageSearchInput");
const searchClear = document.querySelector(".package-search-clear");
const clearFiltersButton = document.querySelector(".clear-filters");
const categoryButtons = [...document.querySelectorAll("[data-category-filter]")];
const dropdowns = [...document.querySelectorAll("[data-filter-dropdown]")];
const preferredCountries = ["Thailand", "Malaysia", "Singapore", "Sri Lanka", "Kenya", "UAE", "India"];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const state = {
  search: "",
  destination: "All",
  tripType: "All",
  duration: "All",
  budget: "All",
  month: "All",
  category: "All"
};

let initialSearchDetails = null;

const durationOptions = [
  { value: "All", label: "Duration", matches: () => true },
  { value: "1-3", label: "1-3 Days", matches: days => days >= 1 && days <= 3 },
  { value: "4-6", label: "4-6 Days", matches: days => days >= 4 && days <= 6 },
  { value: "7-9", label: "7-9 Days", matches: days => days >= 7 && days <= 9 },
  { value: "10+", label: "10+ Days", matches: days => days >= 10 }
];

const budgetOptions = [
  { value: "All", label: "Budget", min: 0, max: Infinity },
  { value: "budget", label: "Budget", min: 0, max: 999 },
  { value: "standard", label: "Standard", min: 1000, max: 2499 },
  { value: "premium", label: "Premium", min: 2500, max: 4999 },
  { value: "luxury", label: "Luxury", min: 5000, max: Infinity }
];

const cardDetails = {
  "kuala-lumpur-getaway": {
    location: "Kuala Lumpur, Malaysia",
    duration: "3 Nights / 4 Days",
    tag: "City Break",
    priceAed: 899,
    image: "/packages/Kuala_Lumpur_WebP_Images/KL_Day.webp",
    highlights: ["KL Tower", "Genting Highlands", "Batu Caves", "City Break"],
    recommendedMonths: ["January", "February", "March", "June", "July", "August", "November", "December"]
  },
  "thai-wonders": {
    location: "Bangkok & Pattaya, Thailand",
    duration: "4 Nights / 5 Days",
    tag: "Beach",
    priceAed: 999,
    image: "/packages/Thai_Wonder_WebP_Images/Thai_Wonder_Night.webp",
    highlights: ["Coral Island", "Tiger Park", "Alcazar Show", "Bangkok Tour"],
    recommendedMonths: ["January", "February", "March", "November", "December"]
  },
  "sri-lanka-highlights": {
    location: "Kandy, Nuwara Eliya, Colombo",
    duration: "3 Nights / 4 Days",
    tag: "Cultural",
    priceAed: 1899,
    highlights: ["Pinnawala", "Kandy Temple", "Colombo Tour", "Nature"],
    image: "/packages/Sri_Lanka_Highlights_WebP/SriLanka_Sigiriya.webp",
    recommendedMonths: ["January", "February", "March", "April", "July", "August", "December"]
  },
  "singapore-family-escape": {
    location: "Singapore",
    duration: "4 Nights / 5 Days",
    tag: "Family",
    priceAed: 2999,
    highlights: ["Universal Studios", "Sentosa", "Gardens by the Bay", "Family Trip"],
    recommendedMonths: ["January", "February", "March", "June", "July", "August", "December"]
  },
  "beaches-of-thailand": {
    location: "Krabi, Phi Phi, Phuket",
    duration: "6 Nights / 7 Days",
    tag: "Beach",
    priceAed: 1875,
    highlights: ["Island Hopping", "James Bond Island", "Phuket City Tour", "Beach"],
    recommendedMonths: ["January", "February", "March", "November", "December"]
  },
  "kenya-inspiring-safari": {
    location: "Lake Nakuru, Masai Mara",
    duration: "3 Nights / 4 Days",
    tag: "Safari",
    priceAed: 9385,
    highlights: ["Private Safari", "Game Drives", "Full Board", "Wildlife"],
    recommendedMonths: ["January", "February", "June", "July", "August", "September", "October"]
  },
  "royal-rajasthan-heritage-tour": {
    location: "Jaipur, Bikaner, Jaisalmer & Jodhpur",
    duration: "8 Nights / 9 Days",
    tag: "Heritage",
    priceAed: 1845,
    image: "/packages/rajasthan_package_images_webp/rajasthan-jaipur-amber-fort.webp",
    highlights: ["Amber Fort", "Desert Camp", "Mehrangarh Fort", "Blue City"],
    recommendedMonths: ["January", "February", "March", "October", "November", "December"]
  },
  "kerala-economy-tour": {
    location: "Cochin, Munnar, Thekkady & Alleppey",
    duration: "5 Nights / 6 Days",
    tag: "Nature",
    priceAed: 1199,
    image: "/packages/kerala_package_images_webp/kerala-alleppey-houseboat-backwaters.webp",
    highlights: ["Munnar Tea", "Periyar Lake", "Spice Plantation", "Houseboat"],
    recommendedMonths: ["January", "February", "March", "September", "October", "November", "December"]
  },
  "dubai-desert-safari": {
    location: "Dubai, UAE",
    duration: "1 Day",
    tag: "Safari",
    priceAed: 149,
    highlights: ["Dune Bashing", "BBQ Dinner", "Live Shows", "Adventure"],
    recommendedMonths: ["January", "February", "March", "April", "October", "November", "December"]
  }
};

const countryFor = item => item.destinationCountry || item.country || "Other";

const getDetails = item => cardDetails[item.slug] || {
  location: item.route || item.destinationState || item.country,
  duration: item.duration,
  tag: item.category || item.tags?.[0] || "Holiday",
  priceAed: parseAedPrice(item.startingPrice || item.price),
  highlights: item.highlights?.slice(0, 4) || [],
  recommendedMonths: monthsForPackage(item)
};

function monthsForPackage(item) {
  if (item.recommendedMonths?.length) return item.recommendedMonths;
  if (/cruise|aroya/i.test(`${item.category} ${item.tags?.join(" ") || ""}`)) return ["January", "February", "March", "April", "November", "December"];
  if (/uae|dubai|desert/i.test(`${item.country} ${item.route} ${item.title}`)) return ["January", "February", "March", "April", "October", "November", "December"];
  if (/thailand|beach/i.test(`${item.country} ${item.route} ${item.category}`)) return ["January", "February", "March", "November", "December"];
  if (/kenya|safari/i.test(`${item.country} ${item.route} ${item.category}`)) return ["January", "February", "June", "July", "August", "September", "October"];
  return monthNames;
}

const normalise = value => String(value || "").toLowerCase().trim();

const parseDurationDays = value => {
  const text = String(value || "");
  const dayMatch = text.match(/(\d+)\s*days?/i);
  if (dayMatch) return Number(dayMatch[1]);
  const nightMatch = text.match(/(\d+)\s*nights?/i);
  if (nightMatch) return Number(nightMatch[1]) + 1;
  if (/evening|half day|experience/i.test(text)) return 1;
  const firstNumber = text.match(/\d+/);
  return firstNumber ? Number(firstNumber[0]) : 1;
};

const itemKeywords = item => {
  const details = getDetails(item);
  return [
    item.title,
    item.country,
    item.destinationCountry,
    item.destinationState,
    item.route,
    item.category,
    ...(item.tags || []),
    ...(item.highlights || []),
    ...(item.imageHighlights || []),
    ...(details.highlights || []),
    details.location,
    details.tag,
    item.summary,
    item.overview,
    ...(item.itinerary || []).flatMap(day => [day.title, day.text])
  ].filter(Boolean).join(" ").toLowerCase();
};

const packageMeta = packageList.map(item => {
  const details = getDetails(item);
  const priceAed = details.priceAed || parseAedPrice(item.startingPrice || item.price);
  return {
    item,
    details,
    country: countryFor(item),
    days: parseDurationDays(details.duration || item.duration),
    priceAed,
    months: details.recommendedMonths || monthsForPackage(item),
    keywords: itemKeywords(item)
  };
});

const allCountries = [...new Set(packageMeta.map(meta => meta.country).filter(Boolean))];
const countryOptions = [
  "All",
  ...preferredCountries.filter(country => allCountries.includes(country)),
  ...allCountries.filter(country => !preferredCountries.includes(country)).sort()
];

const tripTypeOptions = [
  "All",
  ...new Set(packageMeta.flatMap(({ item, details }) => [
    details.tag,
    item.category,
    ...(item.tags || [])
  ]).filter(Boolean))
].sort((a, b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));

const dropdownOptions = {
  destination: countryOptions.map(value => ({ value, label: value === "All" ? "Destination" : value })),
  tripType: tripTypeOptions.map(value => ({ value, label: value === "All" ? "Trip Type" : value })),
  duration: durationOptions.map(({ value, label }) => ({ value, label })),
  budget: budgetOptions.map(option => ({ value: option.value, label: budgetLabel(option) })),
  month: ["All", ...monthNames].map(value => ({ value, label: value === "All" ? "Travel Month" : value }))
};

function budgetLabel(option) {
  if (option.value === "All") return option.label;
  const min = option.min ? formatPackageAmount(option.min) : "Up to";
  const max = Number.isFinite(option.max) ? formatPackageAmount(option.max) : "+";
  if (!option.min) return `${option.label} (${min} ${max})`;
  if (!Number.isFinite(option.max)) return `${option.label} (${min}+)`;
  return `${option.label} (${min} - ${max})`;
}

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

const packageCard = ({ item, details, priceAed }, index) => `
  <article class="package-card reveal is-visible ${revealDelay(index)}">
    <a class="package-card-image reveal-image is-visible" href="/packages/${item.slug}/" aria-label="View ${item.title}">
      <img src="${details.image || item.cardImage}" alt="${item.title}" loading="${index < 3 ? "eager" : "lazy"}">
      <span class="package-badge">${icon("star")}Best Seller</span>
    </a>
    <div class="package-card-body">
      <h3>${item.title}</h3>
      <div class="package-card-meta">
        <span>${icon("route")}<b>Route:</b> ${details.location}</span>
        <span>${icon("duration")}<b>Duration:</b> ${details.duration}</span>
      </div>
      <div class="package-highlight-row">
        ${(details.highlights || item.highlights || []).slice(0, 3).map(highlight => `<span>${highlight}</span>`).join("")}
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
`;

const selectedLabel = key => {
  const selected = state[key];
  return dropdownOptions[key]?.find(option => option.value === selected)?.label || selected;
};

const findOption = (options, value) => {
  if (!value) return "";
  const wanted = normalise(value);
  return options.find(option => normalise(option) === wanted || normalise(option).includes(wanted) || wanted.includes(normalise(option)));
};

const buildNoResultsMessage = () => {
  if (!initialSearchDetails) return whatsappMessages.general;
  const parts = [];
  if (initialSearchDetails.destination) parts.push(`destination: ${initialSearchDetails.destination}`);
  if (initialSearchDetails.tripType && initialSearchDetails.tripType !== "All Types") parts.push(`trip type: ${initialSearchDetails.tripType}`);
  if (initialSearchDetails.travelDate) parts.push(`travel date: ${initialSearchDetails.travelDate}`);
  if (initialSearchDetails.returnDate) parts.push(`return date: ${initialSearchDetails.returnDate}`);
  if (initialSearchDetails.days) parts.push(`duration: ${initialSearchDetails.days} days`);
  const guests = [
    initialSearchDetails.adults ? `${initialSearchDetails.adults} adult${initialSearchDetails.adults === "1" ? "" : "s"}` : "",
    initialSearchDetails.children && initialSearchDetails.children !== "0" ? `${initialSearchDetails.children} child${initialSearchDetails.children === "1" ? "" : "ren"}` : ""
  ].filter(Boolean).join(", ");
  if (guests) parts.push(`guests: ${guests}`);
  return `Hello Flyo, I searched for holiday packages with ${parts.join(", ")}. Please suggest suitable options.`;
};

const closeDropdowns = except => {
  dropdowns.forEach(dropdown => {
    if (dropdown === except) return;
    dropdown.classList.remove("is-open");
    dropdown.querySelector(".filter-select")?.setAttribute("aria-expanded", "false");
  });
};

const renderDropdowns = () => {
  dropdownOptions.budget = budgetOptions.map(option => ({ value: option.value, label: budgetLabel(option) }));
  dropdowns.forEach(dropdown => {
    const key = dropdown.dataset.filterDropdown;
    const menu = dropdown.querySelector(".filter-menu");
    const label = dropdown.querySelector(".filter-select-label");
    if (!menu || !label) return;
    label.textContent = selectedLabel(key);
    menu.innerHTML = dropdownOptions[key].map(option => `
      <button class="filter-option${state[key] === option.value ? " is-selected" : ""}" type="button" role="option" aria-selected="${state[key] === option.value}" data-filter-value="${option.value}">
        ${option.label}
      </button>
    `).join("");
  });
};

const matchesCategory = meta => {
  if (state.category === "All") return true;
  return meta.keywords.includes(normalise(state.category));
};

const matchesFilters = meta => {
  const budget = budgetOptions.find(option => option.value === state.budget) || budgetOptions[0];
  const duration = durationOptions.find(option => option.value === state.duration) || durationOptions[0];
  const searchTerms = normalise(state.search).split(/\s+/).filter(Boolean);
  return (
    (state.destination === "All" || meta.country === state.destination) &&
    (state.tripType === "All" || meta.keywords.includes(normalise(state.tripType))) &&
    duration.matches(meta.days) &&
    (state.budget === "All" || (meta.priceAed >= budget.min && meta.priceAed <= budget.max)) &&
    (state.month === "All" || meta.months.includes(state.month)) &&
    matchesCategory(meta) &&
    searchTerms.every(term => meta.keywords.includes(term))
  );
};

const filteredPackageMeta = () => packageMeta.filter(matchesFilters);

const updatePackageCardPrices = () => {
  document.querySelectorAll("[data-price-aed]").forEach(element => {
    element.textContent = formatPackageAmount(element.dataset.priceAed);
  });
};

const renderCategoryButtons = () => {
  categoryButtons.forEach(button => {
    const active = button.dataset.categoryFilter === state.category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

const renderCountryFilters = () => {
  if (!countryFilterBar) return;
  countryFilterBar.innerHTML = countryOptions.map(country => `
    <button class="country-filter-chip${country === state.destination ? " active" : ""}" type="button" data-country-filter="${country}">
      ${country}
    </button>
  `).join("");
};

const renderPackageCards = () => {
  if (!packageGrid) return;
  const filtered = filteredPackageMeta();
  if (resultCount) {
    const packageWord = filtered.length === 1 ? "package" : "packages";
    resultCount.textContent = `Showing ${filtered.length} curated ${packageWord}`;
  }

  packageGrid.innerHTML = filtered.length
    ? filtered.map(packageCard).join("")
    : `
      <div class="package-empty-state">
        <h3>No packages found</h3>
        <p>Try changing your destination, dates, or budget.</p>
        <div class="package-empty-actions">
          <button class="button button-primary" type="button" data-clear-filters-empty>Clear Filters</button>
          ${initialSearchDetails ? '<button class="button button-white" type="button" data-empty-whatsapp>WhatsApp Enquiry</button>' : ""}
        </div>
      </div>
    `;
  updatePackageCardPrices();
};

const renderAll = () => {
  renderDropdowns();
  renderCategoryButtons();
  renderCountryFilters();
  renderPackageCards();
  if (searchClear) searchClear.hidden = !state.search;
};

const clearFilters = () => {
  state.search = "";
  state.destination = "All";
  state.tripType = "All";
  state.duration = "All";
  state.budget = "All";
  state.month = "All";
  state.category = "All";
  initialSearchDetails = null;
  if (searchInput) searchInput.value = "";
  closeDropdowns();
  renderAll();
};

searchInput?.addEventListener("input", event => {
  state.search = event.target.value;
  renderAll();
});

searchClear?.addEventListener("click", () => {
  state.search = "";
  searchInput.value = "";
  searchInput.focus();
  renderAll();
});

clearFiltersButton?.addEventListener("click", clearFilters);

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    state.category = button.dataset.categoryFilter || "All";
    renderAll();
  });
});

dropdowns.forEach(dropdown => {
  const key = dropdown.dataset.filterDropdown;
  const trigger = dropdown.querySelector(".filter-select");
  trigger?.addEventListener("click", event => {
    event.stopPropagation();
    const open = !dropdown.classList.contains("is-open");
    closeDropdowns(dropdown);
    dropdown.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
  });

  dropdown.addEventListener("click", event => {
    const option = event.target.closest("[data-filter-value]");
    if (!option) return;
    state[key] = option.dataset.filterValue;
    closeDropdowns();
    renderAll();
    trigger?.focus({ preventScroll: true });
  });

  dropdown.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeDropdowns();
      trigger?.focus({ preventScroll: true });
    }
  });
});

document.addEventListener("click", event => {
  if (!event.target.closest(".filter-dropdown")) closeDropdowns();
  if (event.target.closest("[data-clear-filters-empty]")) clearFilters();
  if (event.target.closest("[data-empty-whatsapp]")) window.openWhatsAppChooser?.(buildNoResultsMessage());
});

countryFilterBar?.addEventListener("click", event => {
  const button = event.target.closest("[data-country-filter]");
  if (!button) return;
  state.destination = button.dataset.countryFilter;
  renderAll();
});

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.setAttribute("href", "#");
  if (!link.dataset.whatsappMessage) link.dataset.whatsappMessage = whatsappMessages.general;
});

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  window.openWhatsAppChooser?.(whatsappMessages.general);
}));

const applyInitialQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const country = params.get("country");
  const destination = params.get("destination") || "";
  const search = params.get("search") || "";
  const tripType = params.get("tripType") || "";
  const category = params.get("category") || "";
  const duration = params.get("duration") || "";
  const month = params.get("month") || "";
  const travelDate = params.get("travelDate") || "";
  const returnDate = params.get("returnDate") || "";
  const days = params.get("days") || "";
  const adults = params.get("adults") || "";
  const children = params.get("children") || "";

  const matchedCountry = findOption(countryOptions, country || destination);
  if (matchedCountry && matchedCountry !== "All") state.destination = matchedCountry;

  const matchedTripType = findOption(tripTypeOptions, tripType);
  if (matchedTripType && matchedTripType !== "All") state.tripType = matchedTripType;

  const matchedCategory = findOption(categoryButtons.map(button => button.dataset.categoryFilter), category || tripType);
  if (matchedCategory) state.category = matchedCategory;

  if (durationOptions.some(option => option.value === duration)) state.duration = duration;
  const matchedMonth = findOption(monthNames, month);
  if (matchedMonth) state.month = matchedMonth;

  const destinationShouldSearch = destination && (!matchedCountry || normalise(destination) !== normalise(matchedCountry));
  state.search = search || (destinationShouldSearch ? destination : "");
  if (searchInput) searchInput.value = state.search;

  if (destination || travelDate || returnDate || tripType || days || adults || children) {
    initialSearchDetails = { destination, travelDate, returnDate, tripType, days, adults, children };
  }
};

const filterToggle = document.querySelector(".filter-toggle");
const filterControls = document.querySelector(".filter-controls");
if (filterToggle && filterControls) {
  filterToggle.addEventListener("click", () => {
    const open = filterControls.classList.toggle("is-open");
    filterToggle.setAttribute("aria-expanded", String(open));
    filterToggle.textContent = open ? "Hide Filters" : "Show Filters";
  });
}

applyInitialQuery();
renderAll();
onCurrencyChange(() => {
  renderDropdowns();
  updatePackageCardPrices();
});
