import { contact } from "./data/packages.js";
import { getPublicPackagesAsync } from "./data/package-store.js";
import { formatPackageAmount, onCurrencyChange } from "./currency.js";
import { openWhatsAppChooser, whatsappMessages } from "./whatsapp-chooser.js";
import "./navbar.js";

const heroSlideData = [
  {
    image: "/public/slider%20lap.png",
    mobileImage: "/public/slider%20mob.png",
    alt: "Flyo international holiday planning with skyline and resort travel inspiration",
    label: "Curated. Personalized. Memorable.",
    title: "Your Next Holiday, Planned Beautifully",
    subtitle: "Explore curated international holidays, family trips, honeymoons, beach escapes, and custom travel plans designed with care from start to finish.",
    // The travel scene is on the right; keep the copy in the clear sky and sea on the left.
    align: "left",
    primaryText: "Explore Packages",
    primaryLink: "/packages/",
    secondaryText: "Enquire on WhatsApp",
    enquiryMessage: "Hello Flyo, I would like to know more about your travel packages."
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=90",
    alt: "Curated worldwide holiday destination with mountains and blue water",
    label: "Worldwide Holidays",
    title: "Travel Ideas for Every Kind of Escape",
    subtitle: "From mountain views to beach days and city breaks, Flyo helps shape comfortable holidays around your dates and travel style.",
    // Keep this copy clear of the central landscape subject.
    align: "right",
    primaryText: "View Holidays",
    primaryLink: "/packages/",
    secondaryText: "Talk to Us",
    enquiryMessage: "Hello Flyo Tours, I would like to enquire about worldwide holiday packages. Please assist me."
  },
  {
    image: "/public/home_slider_images_webp/home-slider-thailand-beach.webp",
    alt: "Thailand tropical beach holiday",
    label: "Thailand Escapes",
    title: "Tropical Holidays Made Effortless",
    subtitle: "Explore crystal-clear beaches, island views, and relaxing Thailand getaways curated for every kind of traveler.",
    // The boat, cliffs and palms are on the right of this image.
    align: "left",
    primaryText: "Explore Packages",
    primaryLink: "/packages?country=Thailand",
    secondaryText: "Enquire Now",
    enquiryMessage: "Hello Flyo Tours, I would like to enquire about Thailand holiday packages. Please assist me."
  },
  {
    image: "/public/home_slider_images_webp/home-slider-malaysia-cityscape.webp",
    alt: "Malaysia city skyline holiday",
    label: "Malaysia Getaways",
    title: "City Lights, Culture & Comfort",
    subtitle: "Plan your Malaysia holiday with smooth flights, hotel stays, sightseeing, and guided travel support.",
    // The skyline and traveller fill the left side; the sunset is intentionally open on the right.
    align: "right",
    primaryText: "View Malaysia Packages",
    primaryLink: "/packages?country=Malaysia",
    secondaryText: "Talk to Us",
    enquiryMessage: "Hello Flyo Tours, I would like to enquire about Malaysia holiday packages. Please assist me."
  },
  {
    image: "/public/home_slider_images_webp/home-slider-europe-lakeside-village.webp",
    alt: "Europe lakeside mountain holiday",
    label: "Europe Holidays",
    title: "Scenic Europe, Planned Beautifully",
    subtitle: "From lakeside villages to alpine views, discover Europe packages designed for memorable family and honeymoon trips.",
    // The village occupies the right side of the frame.
    align: "left",
    primaryText: "Explore Europe",
    primaryLink: "/packages?country=Europe",
    secondaryText: "Custom Trip Enquiry",
    enquiryMessage: "Hello Flyo Tours, I would like to enquire about Europe holiday packages. Please assist me."
  },
  {
    image: "/public/home_slider_images_webp/home-slider-cappadocia-balloons.webp",
    alt: "Cappadocia hot air balloon experience",
    label: "Turkey Experiences",
    title: "Wake Up to Magical Views",
    subtitle: "Experience Cappadocia balloons, cultural tours, scenic stays, and unforgettable holiday moments.",
    // The balloons are on the left; the warm sky is open on the right.
    align: "right",
    primaryText: "View Experiences",
    primaryLink: "/experiences.html",
    secondaryText: "Plan My Trip",
    enquiryMessage: "Hello Flyo Tours, I would like to enquire about Turkey and Cappadocia experiences. Please assist me."
  },
  {
    image: "/public/home_slider_images_webp/home-slider-mediterranean-coast.webp",
    alt: "Mediterranean coastal holiday",
    label: "Mediterranean Dreams",
    title: "Coastal Holidays with a Luxury Feel",
    subtitle: "Discover beautiful coastlines, charming towns, romantic views, and premium travel planning support.",
    // The coast and houses are on the right; keep copy over the open water.
    align: "left",
    primaryText: "Explore Packages",
    primaryLink: "/packages/",
    secondaryText: "Get Quote",
    enquiryMessage: "Hello Flyo Tours, I would like to enquire about Mediterranean coastal holidays. Please assist me."
  }
];

const destinations = [
  { name: "Thailand", region: "Asia", layout: "dubai", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=88" },
  { name: "Malaysia", region: "Asia", layout: "abu-dhabi", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=88" },
  { name: "Singapore", region: "Asia", layout: "rak", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=88" },
  { name: "Sri Lanka", region: "Asia", layout: "munnar", image: "https://images.unsplash.com/photo-1588253099008-6f755b24dc52?auto=format&fit=crop&w=900&q=88" },
  { name: "Kenya", region: "Africa", layout: "alleppey", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=88" },
  { name: "UAE", region: "Middle East", layout: "wayanad", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=88" }
];

const features = [
  { image: "/public/flyo_why_choose_images_webp/custom_itineraries.webp", title: "Custom Itineraries", text: "Tailor-made holidays planned around your dates, pace, budget, and travel style." },
  { image: "/public/flyo_why_choose_images_webp/visa_assistance.webp", title: "Visa Assistance", text: "Clear support for documentation, appointment guidance, and destination visa needs." },
  { image: "/public/flyo_why_choose_images_webp/handpicked_hotels.webp", title: "Handpicked Hotels", text: "Hotels and resorts selected for comfort, location, value, and guest experience." },
  { image: "/public/flyo_why_choose_images_webp/private_shared_transfers.webp", title: "Private & Shared Transfers", text: "Airport, intercity, private, and shared tour transfers arranged with dependable partners." },
  { image: "/public/flyo_why_choose_images_webp/local_experiences.webp", title: "Local Experiences", text: "Tours, attractions, safaris, theme parks, cruises, and cultural experiences." },
  { image: "/public/flyo_why_choose_images_webp/travel_support_24_7.webp", title: "24/7 Travel Support", text: "Support before departure and while you travel, from small changes to urgent help." }
];

const aroyaCruisePackages = [
  {
    title: "Aroya Dubai Arabian Escape",
    url: "/packages/aroya-dubai-arabian-escape.html",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=86",
    durationBadge: "7N / 8D",
    priceAed: 2590
  },
  {
    title: "Aroya Dubai Arabian Signature Voyage",
    url: "/packages/aroya-dubai-arabian-signature-voyage.html",
    image: "/public/generated/arabian-gulf-cruise-card.png",
    durationBadge: "7N / 8D",
    priceAed: 2590
  },
  {
    title: "Aroya Dubai Short Escape",
    url: "/packages/aroya-dubai-short-escape.html",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=86",
    durationBadge: "2N / 3D",
    priceAed: 791
  },
  {
    title: "Aroya Arabian Gulf Signature Voyage",
    url: "/packages/aroya-arabian-gulf-signature-voyage.html",
    image: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=1200&q=86",
    durationBadge: "7N / 8D",
    priceAed: 2474
  }
].map(item => ({
  ...item,
  whatsappMessage: `Hi, I'm interested in ${item.title}. Please share more details.`
}));

const revealDelay = index => `reveal-delay-${(index % 6) + 1}`;

const popularExperiences = [
  { name: "Thailand Island Hopping", text: "Krabi, Phi Phi, Phuket, and tropical water days.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85" },
  { name: "Singapore Sentosa", text: "Theme parks, cable cars, oceanarium visits, and family fun.", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85" },
  { name: "Kenya Safari", text: "Masai Mara, Lake Nakuru, game drives, and lodge stays.", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85" },
  { name: "Sri Lanka Cultural Tour", text: "Kandy, tea country, temples, waterfalls, and Colombo.", image: "https://images.unsplash.com/photo-1588253099008-6f755b24dc52?auto=format&fit=crop&w=900&q=85" },
  { name: "Kuala Lumpur City Break", text: "Skyline views, Batu Caves, Genting, and city touring.", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=85" },
  { name: "Dubai Desert Safari", text: "Dune bashing, sunset photos, camp activities, and dinner.", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85" }
];

const testimonials = [
  { name: "Nadia & Omar", location: "Dubai, UAE", initials: "NO", review: "Flyo planned our Thailand holiday end to end. The routing, transfers, and hotel choices were exactly what we needed." },
  { name: "Aisha Khan", location: "Sharjah, UAE", initials: "AK", review: "The Singapore family trip was smooth, organized, and fun for the kids. The team was responsive throughout." },
  { name: "Rohit Menon", location: "Abu Dhabi, UAE", initials: "RM", review: "Great support with visas, hotels, and a custom Sri Lanka itinerary. It felt personal, not like a generic package." }
];

const destinationGrid = document.querySelector("#destinationGrid");
if (destinationGrid) destinationGrid.innerHTML = `
  ${destinations.map((item, index) => `
    <article class="destination-card destination-card-${item.layout} reveal ${revealDelay(index)}" style="--destination-image:url('${item.image}')">
      <div class="destination-image" aria-hidden="true"></div>
      ${item.layout === "dubai" ? '<span class="destination-featured">Featured</span>' : ""}
      <div class="destination-copy">
        <strong>${item.name}</strong>
        <small><span class="location-pin">PIN</span>${item.region}</small>
      </div>
      <a class="destination-arrow" href="/packages/" aria-label="Explore ${item.name}"></a>
    </article>`).join("")}`;

const travelStyleGrid = document.querySelector("#travelStyleGrid");
if (travelStyleGrid) travelStyleGrid.innerHTML = aroyaCruisePackages.map((item, index) => {
  return `
  <article class="cruise-package-card reveal ${revealDelay(index)}">
    <a class="cruise-image-link" href="${item.url}" aria-label="View ${item.title}">
      <img src="${item.image}" alt="${item.title} cruise ship" loading="lazy" width="640" height="400">
      <span class="cruise-duration-pill">${item.durationBadge}</span>
    </a>
    <div class="cruise-card-body">
      <a class="cruise-card-title" href="${item.url}"><h3>${item.title}</h3></a>
      <div class="cruise-card-bottom">
        <div class="cruise-price"><small>Starting price</small><strong data-cruise-price-aed="${item.priceAed}">from ${formatPackageAmount(item.priceAed)}</strong></div>
      </div>
      <a class="cruise-view-button" href="${item.url}">View Package</a>
    </div>
  </article>
`;}).join("");

const updateCruisePrices = () => {
  document.querySelectorAll("[data-cruise-price-aed]").forEach(element => {
    element.textContent = `from ${formatPackageAmount(element.dataset.cruisePriceAed)}`;
  });
};

onCurrencyChange(updateCruisePrices);

const featureGrid = document.querySelector("#featureGrid");
if (featureGrid) featureGrid.innerHTML = features.map((item, index) => `
  <article class="feature-card reveal ${revealDelay(index)}">
    <div class="feature-card-image reveal-image" style="background-image:url('${item.image}')" aria-hidden="true"></div>
    <div class="feature-card-body"><h3>${item.title}</h3><p>${item.text}</p></div>
  </article>`).join("");

const experienceGrid = document.querySelector("#experienceGrid");
if (experienceGrid) {
  experienceGrid.innerHTML = popularExperiences.map((item, index) => `
    <article class="image-card experience-card reveal ${revealDelay(index)}" style="background-image:url('${item.image}')">
      <div class="card-copy"><strong>${item.name}</strong><small>${item.text}</small></div>
    </article>`).join("");
}

const testimonialGrid = document.querySelector("#testimonialGrid");
if (testimonialGrid) testimonialGrid.innerHTML = testimonials.map((item, index) => `
  <article class="testimonial-card reveal ${revealDelay(index)}">
    <div class="stars">★★★★★</div>
    <p>"${item.review}"</p>
    <div class="person"><span>${item.initials}</span><div><strong>${item.name}</strong><small>${item.location}</small></div></div>
  </article>
`).join("");

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.setAttribute("href", "#");
  if (!link.dataset.whatsappMessage && !link.dataset.whatsappType) {
    link.dataset.whatsappMessage = location.pathname.toLowerCase().includes("/flights")
      ? whatsappMessages.flight
      : whatsappMessages.general;
  }
});

let activeSearchType = "holidays";
const searchForm = document.querySelector("[data-search-form]");
const searchTabs = document.querySelectorAll("[data-search-tab]");
const searchPanels = document.querySelectorAll("[data-search-panel]");
const packages = await getPublicPackagesAsync();
const quickSearchState = {
  holidays: {
    destination: "",
    destinationCountry: "",
    travelDate: "",
    returnDate: "",
    adults: 2,
    children: 0,
    tripType: "All Types"
  },
  flights: {
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    tripType: "round-trip"
  }
};

const holidayTripTypes = ["All Types", "Family", "Honeymoon", "Beach", "City Break", "Safari"];
const flightLocations = [
  "Dubai, UAE (DXB)", "Abu Dhabi, UAE (AUH)", "Sharjah, UAE (SHJ)",
  "Kochi, India (COK)", "Bengaluru, India (BLR)", "Mumbai, India (BOM)",
  "Delhi, India (DEL)", "Chennai, India (MAA)", "Hyderabad, India (HYD)",
  "Thiruvananthapuram, India (TRV)", "Kozhikode, India (CCJ)",
  "Bangkok, Thailand (BKK)", "Phuket, Thailand (HKT)", "Kuala Lumpur, Malaysia (KUL)",
  "Singapore (SIN)", "Colombo, Sri Lanka (CMB)", "Nairobi, Kenya (NBO)"
].map(label => ({ label, value: label }));

const normaliseQuick = value => String(value || "").toLowerCase().trim();
const uniqueByLabel = options => [...new Map(options.filter(option => option.label).map(option => [option.label.toLowerCase(), option])).values()];

const holidayDestinationOptions = uniqueByLabel(packages.flatMap(item => {
  const routePlaces = String(item.route || "").split(/,|&|\band\b/i).map(part => part.trim()).filter(Boolean);
  const destinations = [
    item.country,
    item.destinationCountry,
    item.destinationState,
    item.title,
    ...routePlaces
  ].filter(Boolean);
  return destinations.map(destination => ({
    label: destination,
    value: destination,
    country: item.destinationCountry || item.country || "",
    keywords: [
      destination,
      item.title,
      item.country,
      item.destinationCountry,
      item.destinationState,
      item.route,
      item.category,
      ...(item.tags || []),
      ...(item.highlights || [])
    ].filter(Boolean).join(" ")
  }));
})).sort((a, b) => a.label.localeCompare(b.label));

const todayIso = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const formatDisplayDate = value => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
};

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

const guestStateKey = group => group === "holiday" ? "holidays" : group === "flight" ? "flights" : group;

const guestSummary = group => {
  const data = quickSearchState[guestStateKey(group)];
  return `${plural(data.adults, "Adult")}, ${plural(data.children, "Child")}`;
};

const setQuickError = (id, message = "") => {
  const error = document.querySelector(`[data-error-for="${id}"]`);
  const input = document.getElementById(id);
  if (error) error.textContent = message;
  input?.closest(".quick-field")?.classList.toggle("has-error", Boolean(message));
};

const clearQuickErrors = ids => ids.forEach(id => setQuickError(id));

const durationBucket = days => {
  if (!days) return "";
  if (days <= 3) return "1-3";
  if (days <= 6) return "4-6";
  if (days <= 9) return "7-9";
  return "10+";
};

const calculateTripDays = (start, end) => {
  if (!start || !end) return "";
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) return "";
  return Math.max(1, Math.round((endDate - startDate) / 86400000) + 1);
};

const closeQuickPopups = except => {
  document.querySelectorAll(".quick-field.is-open").forEach(field => {
    if (field === except) return;
    field.classList.remove("is-open");
    field.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
  });
};

const openQuickField = field => {
  if (!field) return;
  closeQuickPopups(field);
  field.classList.add("is-open");
  field.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "true");
};

const optionButton = option => `
  <button class="quick-option" type="button" role="option" data-quick-value="${option.value}" data-quick-label="${option.label}" data-quick-country="${option.country || ""}">
    <strong>${option.label}</strong>
    ${option.country && option.country !== option.label ? `<small>${option.country}</small>` : ""}
  </button>
`;

const renderComboboxOptions = (field, options, query = "") => {
  const menu = field.querySelector(".quick-menu");
  if (!menu) return;
  const terms = normaliseQuick(query).split(/\s+/).filter(Boolean);
  const matches = options
    .filter(option => terms.every(term => normaliseQuick(`${option.label} ${option.keywords || ""}`).includes(term)))
    .slice(0, 9);
  menu.innerHTML = matches.length
    ? matches.map(optionButton).join("")
    : `<div class="quick-option-empty">No matches found</div>`;
};

const setupCombobox = (selector, options, onSelect) => {
  const field = document.querySelector(selector);
  if (!field) return;
  const input = field.querySelector("input");
  renderComboboxOptions(field, options);
  input?.addEventListener("focus", () => {
    renderComboboxOptions(field, options, input.value);
    openQuickField(field);
  });
  input?.addEventListener("input", () => {
    onSelect({ label: input.value, value: input.value, country: "" }, true);
    renderComboboxOptions(field, options, input.value);
    openQuickField(field);
  });
  field.addEventListener("click", event => {
    const option = event.target.closest("[data-quick-value]");
    if (!option) return;
    event.preventDefault();
    const selected = {
      label: option.dataset.quickLabel,
      value: option.dataset.quickValue,
      country: option.dataset.quickCountry
    };
    input.value = selected.label;
    onSelect(selected, false);
    closeQuickPopups();
    input.focus({ preventScroll: true });
  });
  field.addEventListener("keydown", event => {
    if (event.key === "Escape") closeQuickPopups();
  });
};

const setupTripTypeSelect = () => {
  const field = document.querySelector('[data-quick-select="holiday-trip-type"]');
  if (!field) return;
  const menu = field.querySelector(".quick-menu");
  const trigger = field.querySelector(".quick-select-trigger");
  const label = field.querySelector("[data-selected-label]");
  menu.innerHTML = holidayTripTypes.map(type => `
    <button class="quick-option${type === quickSearchState.holidays.tripType ? " is-selected" : ""}" type="button" role="option" data-trip-type="${type}">
      <strong>${type}</strong>
    </button>
  `).join("");
  trigger.addEventListener("click", event => {
    event.preventDefault();
    field.classList.contains("is-open") ? closeQuickPopups() : openQuickField(field);
  });
  field.addEventListener("click", event => {
    const option = event.target.closest("[data-trip-type]");
    if (!option) return;
    quickSearchState.holidays.tripType = option.dataset.tripType;
    label.textContent = option.dataset.tripType;
    menu.querySelectorAll("[data-trip-type]").forEach(button => {
      button.classList.toggle("is-selected", button === option);
    });
    closeQuickPopups();
  });
};

const updateGuestPicker = group => {
  const field = document.querySelector(`[data-guest-picker="${group}"]`);
  if (!field) return;
  field.querySelector("[data-guest-summary]")?.replaceChildren(document.createTextNode(guestSummary(group)));
  field.querySelectorAll("[data-guest-count]").forEach(element => {
    element.textContent = quickSearchState[guestStateKey(group)][element.dataset.guestCount];
  });
};

const setupGuestPickers = () => {
  document.querySelectorAll("[data-guest-picker]").forEach(field => {
    const groupKey = field.dataset.guestPicker === "holiday" ? "holidays" : "flights";
    const summaryGroup = field.dataset.guestPicker;
    field.querySelector(".quick-guest-trigger")?.addEventListener("click", event => {
      event.preventDefault();
      field.classList.contains("is-open") ? closeQuickPopups() : openQuickField(field);
    });
    field.addEventListener("click", event => {
      const button = event.target.closest("[data-guest-action]");
      if (!button) return;
      event.preventDefault();
      const data = quickSearchState[groupKey];
      const type = button.dataset.guestType;
      const direction = button.dataset.guestAction === "plus" ? 1 : -1;
      const min = type === "adults" ? 1 : 0;
      data[type] = Math.max(min, Math.min(12, data[type] + direction));
      updateGuestPicker(summaryGroup);
    });
    updateGuestPicker(summaryGroup);
  });
};

const setupDates = () => {
  const min = todayIso();
  const holidayTravelDate = document.getElementById("holidayTravelDate");
  const holidayReturnDate = document.getElementById("holidayReturnDate");
  const flightDepart = document.getElementById("flightDepart");
  const flightReturn = document.getElementById("flightReturn");
  [holidayTravelDate, holidayReturnDate, flightDepart, flightReturn].forEach(input => {
    if (input) input.min = min;
  });
  holidayTravelDate?.addEventListener("change", () => {
    quickSearchState.holidays.travelDate = holidayTravelDate.value;
    holidayReturnDate.min = holidayTravelDate.value || min;
    if (holidayReturnDate.value && holidayReturnDate.value < holidayTravelDate.value) holidayReturnDate.value = "";
  });
  holidayReturnDate?.addEventListener("change", () => {
    quickSearchState.holidays.returnDate = holidayReturnDate.value;
  });
  flightDepart?.addEventListener("change", () => {
    quickSearchState.flights.departureDate = flightDepart.value;
    flightReturn.min = flightDepart.value || min;
    if (flightReturn.value && flightReturn.value < flightDepart.value) flightReturn.value = "";
  });
  flightReturn?.addEventListener("change", () => {
    quickSearchState.flights.returnDate = flightReturn.value;
  });
};

const setupFlightTripMode = () => {
  const buttons = document.querySelectorAll("[data-flight-trip]");
  const returnField = document.querySelector("[data-round-trip-only]");
  const sync = () => {
    buttons.forEach(button => {
      const active = button.dataset.flightTrip === quickSearchState.flights.tripType;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", String(active));
    });
    const oneWay = quickSearchState.flights.tripType === "one-way";
    returnField?.classList.toggle("is-hidden", oneWay);
    if (oneWay) {
      quickSearchState.flights.returnDate = "";
      const flightReturn = document.getElementById("flightReturn");
      if (flightReturn) flightReturn.value = "";
      setQuickError("flightReturn");
    }
  };
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      quickSearchState.flights.tripType = button.dataset.flightTrip;
      sync();
    });
  });
  sync();
};

const setSearchType = type => {
  activeSearchType = type;
  searchTabs.forEach(tab => {
    const active = tab.dataset.searchTab === type;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  searchPanels.forEach(panel => {
    panel.classList.toggle("active", panel.dataset.searchPanel === type);
  });
};

searchTabs.forEach(tab => {
  tab.addEventListener("click", () => setSearchType(tab.dataset.searchTab));
});

setupCombobox('[data-quick-combobox="holiday-destination"]', holidayDestinationOptions, (selected, typed) => {
  quickSearchState.holidays.destination = selected.label || "";
  quickSearchState.holidays.destinationCountry = typed ? "" : selected.country || "";
  setQuickError("holidayDestination");
});
setupCombobox('[data-quick-combobox="flight-from"]', flightLocations, selected => {
  quickSearchState.flights.from = selected.label || "";
  setQuickError("flightFrom");
});
setupCombobox('[data-quick-combobox="flight-to"]', flightLocations, selected => {
  quickSearchState.flights.to = selected.label || "";
  setQuickError("flightTo");
});
setupTripTypeSelect();
setupGuestPickers();
setupDates();
setupFlightTripMode();

document.addEventListener("click", event => {
  if (!event.target.closest(".quick-field")) closeQuickPopups();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeQuickPopups();
});

const submitHolidaySearch = () => {
  const destinationInput = document.getElementById("holidayDestination");
  const travelInput = document.getElementById("holidayTravelDate");
  const returnInput = document.getElementById("holidayReturnDate");
  quickSearchState.holidays.destination = destinationInput?.value.trim() || quickSearchState.holidays.destination;
  quickSearchState.holidays.travelDate = travelInput?.value || "";
  quickSearchState.holidays.returnDate = returnInput?.value || "";
  clearQuickErrors(["holidayDestination", "holidayTravelDate", "holidayReturnDate"]);

  let valid = true;
  if (!quickSearchState.holidays.destination) {
    setQuickError("holidayDestination", "Choose a destination to explore packages.");
    valid = false;
  }
  if (quickSearchState.holidays.returnDate && quickSearchState.holidays.travelDate && quickSearchState.holidays.returnDate < quickSearchState.holidays.travelDate) {
    setQuickError("holidayReturnDate", "Return date cannot be earlier than travel date.");
    valid = false;
  }
  if (!valid) return;

  const days = calculateTripDays(quickSearchState.holidays.travelDate, quickSearchState.holidays.returnDate);
  const params = new URLSearchParams();
  params.set("destination", quickSearchState.holidays.destination);
  if (quickSearchState.holidays.destinationCountry) params.set("country", quickSearchState.holidays.destinationCountry);
  if (quickSearchState.holidays.travelDate) params.set("travelDate", quickSearchState.holidays.travelDate);
  if (quickSearchState.holidays.returnDate) params.set("returnDate", quickSearchState.holidays.returnDate);
  if (days) {
    params.set("days", String(days));
    params.set("duration", durationBucket(days));
  }
  params.set("adults", String(quickSearchState.holidays.adults));
  params.set("children", String(quickSearchState.holidays.children));
  if (quickSearchState.holidays.tripType !== "All Types") {
    params.set("tripType", quickSearchState.holidays.tripType);
    params.set("category", quickSearchState.holidays.tripType);
  }
  location.href = `/packages/?${params.toString()}`;
};

const submitFlightSearch = () => {
  const fromInput = document.getElementById("flightFrom");
  const toInput = document.getElementById("flightTo");
  const departInput = document.getElementById("flightDepart");
  const returnInput = document.getElementById("flightReturn");
  quickSearchState.flights.from = fromInput?.value.trim() || quickSearchState.flights.from;
  quickSearchState.flights.to = toInput?.value.trim() || quickSearchState.flights.to;
  quickSearchState.flights.departureDate = departInput?.value || "";
  quickSearchState.flights.returnDate = returnInput?.value || "";
  clearQuickErrors(["flightFrom", "flightTo", "flightDepart", "flightReturn"]);

  let valid = true;
  if (!quickSearchState.flights.from) {
    setQuickError("flightFrom", "Enter your origin.");
    valid = false;
  }
  if (!quickSearchState.flights.to) {
    setQuickError("flightTo", "Enter your destination.");
    valid = false;
  }
  if (!quickSearchState.flights.departureDate) {
    setQuickError("flightDepart", "Choose a departure date.");
    valid = false;
  }
  if (quickSearchState.flights.tripType === "round-trip" && !quickSearchState.flights.returnDate) {
    setQuickError("flightReturn", "Choose a return date for round-trip flights.");
    valid = false;
  }
  if (quickSearchState.flights.returnDate && quickSearchState.flights.returnDate < quickSearchState.flights.departureDate) {
    setQuickError("flightReturn", "Return date cannot be earlier than departure.");
    valid = false;
  }
  if (!valid) return;

  const tripText = quickSearchState.flights.tripType === "one-way" ? "one-way" : "round-trip";
  const returnText = quickSearchState.flights.tripType === "round-trip"
    ? ` and returning ${formatDisplayDate(quickSearchState.flights.returnDate)}`
    : "";
  const childText = quickSearchState.flights.children ? ` and ${plural(quickSearchState.flights.children, "child")}` : "";
  const message = `Hello Flyo, I need a ${tripText} flight from ${quickSearchState.flights.from} to ${quickSearchState.flights.to}, departing ${formatDisplayDate(quickSearchState.flights.departureDate)}${returnText}, for ${plural(quickSearchState.flights.adults, "adult")}${childText}.`;
  window.open(`https://wa.me/971505357300?text=${encodeURIComponent(message)}`, "_blank");
};

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  if (form.matches("[data-visa-enquiry-form]")) return;
  event.preventDefault();
  if (form === searchForm) {
    if (activeSearchType === "flights") submitFlightSearch();
    else submitHolidaySearch();
    return;
  }
  if (form.classList.contains("flight-form")) {
    openWhatsAppChooser(whatsappMessages.flight);
    return;
  }
  location.href = "/packages/";
}));

function initScrollReveal() {
  const revealSelectors = [
    ".section-heading",
    ".visa-copy",
    ".visa-card-grid article",
    ".why-intro",
    ".cta",
    ".stats-luxury-box",
    ".flight-form",
    ".flights-copy"
  ];
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      if (!element.className.match(/reveal-delay-/)) element.classList.add(revealDelay(index));
    });
  });
  document.querySelectorAll(".hero-slide img, .visa-card-image img, .cta-visual").forEach(element => element.classList.add("reveal-image"));
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

const hero = document.querySelector(".hero");
const heroSlider = document.querySelector("#heroSlider");
const heroDotsWrap = document.querySelector("#heroDots");
const heroContent = document.querySelector("#heroContent");
const heroSlideLabel = document.querySelector("#heroSlideLabel");
const heroSlideTitle = document.querySelector("#heroSlideTitle");
const heroSlideSubtitle = document.querySelector("#heroSlideSubtitle");
const heroPrimaryAction = document.querySelector("#heroPrimaryAction");
const heroSecondaryAction = document.querySelector("#heroSecondaryAction");
const heroPrev = document.querySelector(".hero-prev");
const heroNext = document.querySelector(".hero-next");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroIndex = 0;
let heroTimer;
let touchStartX = 0;

const renderHeroSlider = () => {
  if (!heroSlider || !heroDotsWrap) return;
  heroSlider.innerHTML = heroSlideData.map((slide, index) => `
    <figure class="hero-slide hero-slide-${slide.align}${index === 0 ? " active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
      ${slide.mobileImage ? `
        <picture>
          <source media="(max-width: 560px)" srcset="${slide.mobileImage}">
          <img src="${slide.image}" alt="${slide.alt}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
        </picture>
      ` : `
        <img src="${slide.image}" alt="${slide.alt}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
      `}
    </figure>
  `).join("");
  heroDotsWrap.innerHTML = heroSlideData.map((slide, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button" aria-label="Show hero image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>
  `).join("");
};

const updateHeroContent = slide => {
  if (!heroContent || !slide) return;
  hero.dataset.align = slide.align;
  heroContent.dataset.align = slide.align;
  heroContent.classList.toggle("hero-content--right", slide.align === "right");
  heroSlideLabel.textContent = slide.label;
  heroSlideTitle.textContent = slide.title;
  heroSlideSubtitle.textContent = slide.subtitle;
  heroPrimaryAction.textContent = slide.primaryText;
  heroPrimaryAction.href = slide.primaryLink;
  heroSecondaryAction.textContent = slide.secondaryText;
  heroSecondaryAction.href = "#";
  heroSecondaryAction.dataset.whatsappMessage = slide.enquiryMessage;
};

renderHeroSlider();
let heroSlides = [...document.querySelectorAll(".hero-slide")];
let heroDots = [...document.querySelectorAll(".hero-dots button")];

function showHeroSlide(index, restart = true) {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === heroIndex;
    slide.classList.toggle("active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  heroDots.forEach((dot, dotIndex) => {
    const active = dotIndex === heroIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", String(active));
  });
  updateHeroContent(heroSlideData[heroIndex]);
  if (restart) startHeroAutoplay();
}

function startHeroAutoplay() {
  clearInterval(heroTimer);
  if (!reduceMotion.matches && heroSlides.length > 1) {
    heroTimer = setInterval(() => showHeroSlide(heroIndex + 1, false), 6500);
  }
}

if (hero && heroSlides.length) {
  updateHeroContent(heroSlideData[0]);
  heroPrev?.addEventListener("click", () => showHeroSlide(heroIndex - 1));
  heroNext?.addEventListener("click", () => showHeroSlide(heroIndex + 1));
  heroDots.forEach((dot, index) => dot.addEventListener("click", () => showHeroSlide(index)));
  hero.addEventListener("mouseenter", () => clearInterval(heroTimer));
  hero.addEventListener("mouseleave", startHeroAutoplay);
  hero.addEventListener("focusin", () => clearInterval(heroTimer));
  hero.addEventListener("focusout", startHeroAutoplay);
  hero.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  hero.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showHeroSlide(heroIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
  hero.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") showHeroSlide(heroIndex - 1);
    if (event.key === "ArrowRight") showHeroSlide(heroIndex + 1);
  });
  reduceMotion.addEventListener("change", startHeroAutoplay);
  startHeroAutoplay();
}
