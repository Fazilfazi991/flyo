import {
  ADMIN_PACKAGE_STORAGE_KEY,
  getAdminPackages,
  getAdminSettings,
  getSourcePackages,
  resetAdminPackages,
  saveAdminPackages,
  saveAdminSettings
} from "../data/package-store.js";
import { formatPackageAmount, parseAedPrice } from "../currency.js";

const AUTH_KEY = "flyoAdminAuthenticated";
const EXTRA_STORAGE_KEY = "flyoAdminExtras";
const MEDIA_STORAGE_KEY = "flyoAdminMedia";
const PASSWORD = "flyo-admin";

const state = {
  packages: getAdminPackages(),
  selectedPackage: null,
  selectedIndex: -1,
  dirty: false,
  section: "dashboard",
  filters: { search: "", country: "All", status: "All", category: "All" },
  extras: readJson(EXTRA_STORAGE_KEY, {
    countries: [],
    experiences: [
      { name: "Activities", status: "published", order: 1 },
      { name: "Sightseeing", status: "published", order: 2 },
      { name: "MICE", status: "published", order: 3 },
      { name: "Cruises", status: "published", order: 4 },
      { name: "Transfers", status: "published", order: 5 }
    ],
    enquiries: [
      { name: "Sample Customer", phone: "+971 50 000 0000", email: "guest@example.com", package: "Thai Wonders", travelDate: "2026-09-10", status: "New", notes: "Imported sample enquiry" }
    ],
    users: [
      { name: "Super Admin", email: "admin@flyotour.com", role: "Super Admin", status: "Active" }
    ]
  }),
  media: readJson(MEDIA_STORAGE_KEY, [])
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const clone = value => JSON.parse(JSON.stringify(value));
const slugify = value => String(value || "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

function readJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const notify = message => {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2600);
};

const escapeHtml = value => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const lines = value => Array.isArray(value) ? value.join("\n") : String(value || "");
const fromLines = value => String(value || "").split("\n").map(item => item.trim()).filter(Boolean);

const getCountry = item => item.destinationCountry || item.country || "Other";
const getDestination = item => item.destinationState || item.route || item.country || "";
const getStatus = item => item.adminStatus || "published";
const getPrice = item => item.startingPrice || item.price || item.pricingOptions?.[0]?.price || "Price on request";
const packageUrl = item => `/packages/${item.slug}/`;

const persistPackages = () => {
  saveAdminPackages(state.packages);
  renderAll();
};

const persistExtras = () => writeJson(EXTRA_STORAGE_KEY, state.extras);
const persistMedia = () => writeJson(MEDIA_STORAGE_KEY, state.media);

const setSection = name => {
  state.section = name;
  $$(".admin-nav button[data-admin-section]").forEach(button => button.classList.toggle("active", button.dataset.adminSection === name));
  $$("[data-section-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.sectionPanel === name));
  $("#adminPageTitle").textContent = name.replace(/^\w/, char => char.toUpperCase()).replace("media", "Media Library").replace("users", "Admin Users").replace("settings", "Website Settings");
  $(".admin-nav").classList.remove("open");
};

const authenticate = () => {
  const loggedIn = localStorage.getItem(AUTH_KEY) === "true";
  $("[data-auth-shell]").hidden = !loggedIn;
  $("[data-login-screen]").hidden = loggedIn;
};

const summaryData = () => {
  const countries = new Set(state.packages.map(getCountry));
  return [
    ["Total packages", state.packages.length],
    ["Published", state.packages.filter(item => getStatus(item) === "published").length],
    ["Draft", state.packages.filter(item => getStatus(item) === "draft").length],
    ["Hidden", state.packages.filter(item => getStatus(item) === "hidden").length],
    ["Featured", state.packages.filter(item => item.featured).length],
    ["Countries", countries.size],
    ["Recent enquiries", state.extras.enquiries.length]
  ];
};

const renderDashboard = () => {
  $("#summaryGrid").innerHTML = summaryData().map(([label, value]) => `
    <article class="summary-card"><span>${label}</span><strong>${value}</strong></article>
  `).join("");

  const sorted = [...state.packages].sort((a, b) => String(b.lastUpdated || "").localeCompare(String(a.lastUpdated || "")));
  $("#recentEditedList").innerHTML = sorted.slice(0, 6).map(item => miniPackage(item)).join("") || emptyMini("No edited packages yet.");
  $("#recentAddedList").innerHTML = [...state.packages].slice(-6).reverse().map(item => miniPackage(item)).join("") || emptyMini("No packages yet.");
};

const miniPackage = item => `
  <div class="mini-item">
    <div><strong>${escapeHtml(item.title)}</strong><br><small>${escapeHtml(getCountry(item))} | ${escapeHtml(getStatus(item))}</small></div>
    <button type="button" data-edit-package="${escapeHtml(item.slug)}">Edit</button>
  </div>
`;

const emptyMini = text => `<div class="mini-item"><small>${text}</small></div>`;

const packageMatches = item => {
  const query = state.filters.search.toLowerCase();
  const text = [item.title, item.slug, item.country, item.destinationState, item.route, item.category, ...(item.tags || [])].join(" ").toLowerCase();
  return (!query || text.includes(query)) &&
    (state.filters.country === "All" || getCountry(item) === state.filters.country) &&
    (state.filters.status === "All" || getStatus(item) === state.filters.status) &&
    (state.filters.category === "All" || item.category === state.filters.category);
};

const renderPackageFilters = () => {
  const countries = ["All", ...new Set(state.packages.map(getCountry).filter(Boolean).sort())];
  const categories = ["All", ...new Set(state.packages.map(item => item.category).filter(Boolean).sort())];
  $("#adminCountryFilter").innerHTML = countries.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value === "All" ? "All Countries" : value)}</option>`).join("");
  $("#adminCategoryFilter").innerHTML = categories.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value === "All" ? "All Categories" : value)}</option>`).join("");
  $("#adminCountryFilter").value = state.filters.country;
  $("#adminStatusFilter").value = state.filters.status;
  $("#adminCategoryFilter").value = state.filters.category;
};

const renderPackages = () => {
  renderPackageFilters();
  const packages = [...state.packages].filter(packageMatches).sort((a, b) => (Number(a.displayOrder) || 9999) - (Number(b.displayOrder) || 9999));
  $("#packageTableBody").innerHTML = packages.map(item => {
    const status = getStatus(item);
    return `
      <tr>
        <td><input class="order-input" type="number" min="1" value="${Number(item.displayOrder) || 1}" data-order-package="${escapeHtml(item.slug)}"></td>
        <td>
          <div class="package-cell">
            <img src="${escapeHtml(item.cardImage || item.heroImage || "")}" alt="${escapeHtml(item.title)}">
            <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.slug)}<br>${escapeHtml(getDestination(item))}</small></div>
          </div>
        </td>
        <td>${escapeHtml(getCountry(item))}</td>
        <td>${escapeHtml(item.duration || "")}</td>
        <td>${escapeHtml(getPrice(item))}</td>
        <td><span class="status-pill status-${status}">${status}</span></td>
        <td>${item.featured ? "Yes" : "No"}</td>
        <td>${escapeHtml(item.lastUpdated || "Imported")}</td>
        <td>
          <div class="row-actions">
            <button type="button" data-edit-package="${escapeHtml(item.slug)}">Edit</button>
            <a href="${packageUrl(item)}" target="_blank" rel="noreferrer">Preview</a>
            <button type="button" data-duplicate-package="${escapeHtml(item.slug)}">Duplicate</button>
            <button type="button" data-toggle-status="${escapeHtml(item.slug)}">${status === "published" ? "Hide" : "Publish"}</button>
            <button class="danger" type="button" data-delete-package="${escapeHtml(item.slug)}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="9">No packages found.</td></tr>`;
};

const renderCountries = () => {
  const packageCountries = [...new Set(state.packages.map(getCountry).filter(Boolean))];
  const saved = state.extras.countries;
  const countries = packageCountries.map((name, index) => saved.find(item => item.name === name) || {
    name,
    image: state.packages.find(item => getCountry(item) === name)?.cardImage || "",
    flag: "",
    order: index + 1,
    status: "published"
  });
  $("#countryAdminGrid").innerHTML = countries.map(country => `
    <article class="country-card">
      ${country.image ? `<img src="${escapeHtml(country.image)}" alt="${escapeHtml(country.name)}">` : ""}
      <strong>${escapeHtml(country.name)}</strong>
      <small>${state.packages.filter(item => getCountry(item) === country.name).length} packages | ${escapeHtml(country.status)}</small>
      <div class="row-actions"><button type="button" data-edit-country="${escapeHtml(country.name)}">Edit</button><button type="button" data-hide-country="${escapeHtml(country.name)}">Toggle</button></div>
    </article>
  `).join("");
};

const renderExperiences = () => {
  $("#experienceAdminGrid").innerHTML = state.extras.experiences.map(item => `
    <article class="experience-card-admin">
      <strong>${escapeHtml(item.name)}</strong>
      <small>Order ${item.order} | ${escapeHtml(item.status)}</small>
      <div class="row-actions"><button type="button" data-edit-experience="${escapeHtml(item.name)}">Edit</button></div>
    </article>
  `).join("");
};

const renderEnquiries = () => {
  $("#enquiryTableBody").innerHTML = state.extras.enquiries.map((item, index) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.phone)}</td>
      <td>${escapeHtml(item.email)}</td>
      <td>${escapeHtml(item.package)}</td>
      <td>${escapeHtml(item.travelDate)}</td>
      <td><select data-enquiry-status="${index}">${["New", "Contacted", "Follow-up", "Confirmed", "Closed"].map(status => `<option ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
      <td><input value="${escapeHtml(item.notes || "")}" data-enquiry-notes="${index}"></td>
    </tr>
  `).join("");
};

const packageImageRecords = () => {
  const records = [];
  state.packages.forEach(item => {
    [
      ["Cover image", item.heroImage],
      ["Card image", item.cardImage],
      ...(item.galleryImages || []).map(image => ["Gallery", typeof image === "string" ? image : image.src])
    ].forEach(([usage, src]) => {
      if (src) records.push({ src, usage: `${usage}: ${item.title}` });
    });
  });
  return records;
};

const renderMedia = () => {
  const query = ($("#mediaSearch")?.value || "").toLowerCase();
  const records = [...packageImageRecords(), ...state.media];
  const unique = [...new Map(records.map(item => [item.src, item])).values()];
  $("#mediaGrid").innerHTML = unique
    .filter(item => !query || `${item.src} ${item.usage}`.toLowerCase().includes(query))
    .map(item => `
      <article class="media-card">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.usage || "Media")}">
        <strong>${escapeHtml(item.usage || "Uploaded media")}</strong>
        <small>${escapeHtml(item.src).slice(0, 90)}</small>
        <div class="row-actions">
          <button type="button" data-copy-media="${escapeHtml(item.src)}">Copy URL</button>
          ${item.uploaded ? `<button class="danger" type="button" data-delete-media="${escapeHtml(item.src)}">Delete</button>` : ""}
        </div>
      </article>
    `).join("");
};

const settingsSchema = [
  ["aedToInr", "AED to INR conversion rate", "number"],
  ["aedToUsd", "AED to USD conversion rate", "number"],
  ["uaeWhatsapp", "UAE WhatsApp number", "text"],
  ["indiaWhatsapp", "India WhatsApp number", "text"],
  ["uaeOfficePhone", "UAE office phone", "text"],
  ["indiaOfficePhone", "India office phone", "text"],
  ["uaeEmail", "UAE email", "email"],
  ["indiaEmail", "India email", "email"],
  ["uaeLocation", "UAE office location", "text"],
  ["indiaLocation", "India office location", "text"],
  ["seoTitle", "Default SEO title", "text"],
  ["seoDescription", "Default SEO description", "textarea"]
];

const renderSettings = () => {
  const settings = getAdminSettings();
  $("#settingsFields").innerHTML = settingsSchema.map(([key, label, type]) => `
    <label class="${type === "textarea" ? "field-full" : ""}">
      <span>${label}</span>
      ${type === "textarea" ? `<textarea name="${key}" rows="4">${escapeHtml(settings[key])}</textarea>` : `<input name="${key}" type="${type}" value="${escapeHtml(settings[key])}">`}
    </label>
  `).join("");
};

const renderUsers = () => {
  $("#userGrid").innerHTML = state.extras.users.map(user => `
    <article class="user-card">
      <strong>${escapeHtml(user.name)}</strong>
      <small>${escapeHtml(user.email)}<br>${escapeHtml(user.role)} | ${escapeHtml(user.status)}</small>
    </article>
  `).join("");
};

const renderAll = () => {
  renderDashboard();
  renderPackages();
  renderCountries();
  renderExperiences();
  renderEnquiries();
  renderMedia();
  renderSettings();
  renderUsers();
};

const packageTemplate = () => ({
  slug: "new-package",
  title: "New Package",
  country: "UAE",
  destinationState: "",
  duration: "3 Nights / 4 Days",
  price: "AED 999",
  route: "",
  category: "International Holidays",
  tags: ["Family"],
  featured: false,
  adminStatus: "draft",
  displayOrder: state.packages.length + 1,
  cardImage: "",
  heroImage: "",
  galleryImages: [],
  imageHighlights: [],
  summary: "",
  overview: "",
  highlights: [],
  itinerary: [{ day: "Day 1", title: "Arrival", text: "" }],
  pricingOptions: [{ label: "Standard Package", badge: "Best Value", hotels: [], mealPlan: "Daily Breakfast", transferType: "Transfers arranged", price: "AED 999", priceNote: "per person", features: [], cta: "Enquire Now" }],
  inclusions: [],
  exclusions: [],
  notes: [],
  optionalTours: [],
  visaDetails: "",
  importantInfo: [],
  faqs: [],
  whatsappMessage: ""
});

const field = (name, label, value = "", type = "text", extra = "") => `
  <label class="${extra.includes("full") ? "field-full" : ""}">
    <span>${label}</span>
    ${type === "textarea" ? `<textarea name="${name}" rows="${extra.includes("short") ? 3 : 5}">${escapeHtml(value)}</textarea>` :
      type === "select" ? `<select name="${name}">${extra}</select>` :
      type === "checkbox" ? `<input name="${name}" type="checkbox" ${value ? "checked" : ""}>` :
      `<input name="${name}" type="${type}" value="${escapeHtml(value)}">`}
  </label>
`;

const openEditor = slug => {
  const source = slug ? state.packages.find(item => item.slug === slug) : packageTemplate();
  state.selectedPackage = clone(source || packageTemplate());
  state.selectedIndex = slug ? state.packages.findIndex(item => item.slug === slug) : -1;
  $("#editorTitle").textContent = slug ? `Edit ${state.selectedPackage.title}` : "Add New Package";
  renderEditor();
  $("#packageEditor").showModal();
};

const renderEditor = () => {
  const p = state.selectedPackage;
  const statusOptions = ["draft", "published", "hidden"].map(value => `<option value="${value}" ${getStatus(p) === value ? "selected" : ""}>${value}</option>`).join("");
  $("#basicFields").innerHTML = [
    field("title", "Package title", p.title),
    field("slug", "URL slug", p.slug),
    field("summary", "Short description", p.summary, "textarea", "full short"),
    field("country", "Country", p.country),
    field("destinationState", "Destination or city", p.destinationState || p.route || ""),
    field("category", "Package category", p.category),
    field("packageType", "Package type", p.packageType || ""),
    field("duration", "Duration", p.duration),
    field("nights", "Number of nights", p.nights || "", "number"),
    field("days", "Number of days", p.days || "", "number"),
    field("featured", "Featured package", p.featured, "checkbox"),
    field("adminStatus", "Package status", p.adminStatus || "draft", "select", statusOptions),
    field("displayOrder", "Display order", p.displayOrder || state.packages.length + 1, "number")
  ].join("");

  $("#imageFields").innerHTML = [
    field("heroImage", "Main cover image URL", p.heroImage || ""),
    field("cardImage", "Package card image URL", p.cardImage || ""),
    field("mobileHeroImage", "Mobile cover image URL", p.mobileHeroImage || ""),
    field("imageAlt", "Image alt text", p.imageAlt || p.title),
    field("galleryImagesText", "Gallery image URLs, one per line", lines((p.galleryImages || []).map(image => typeof image === "string" ? image : image.src)), "textarea", "full"),
    field("imageHighlightsText", "Image highlights, one per line", lines(p.imageHighlights), "textarea", "full short")
  ].join("");
  renderImagePreview();

  renderPricingEditor();
  $("#overviewFields").innerHTML = [
    field("overview", "Overview introduction", p.overview || "", "textarea", "full"),
    field("highlightsText", "Package highlights", lines(p.highlights), "textarea", "full"),
    field("inclusionsText", "Inclusions", lines(p.inclusions), "textarea", "full"),
    field("exclusionsText", "Exclusions", lines(p.exclusions), "textarea", "full"),
    field("hotelsText", "Hotel information", lines((p.hotels || []).map(item => `${item.title || ""}: ${item.price || ""} ${lines(item.features)}`)), "textarea", "full short"),
    field("transportation", "Transportation", p.transportation || "", "textarea", "full short"),
    field("meals", "Meals", p.meals || "", "textarea", "full short"),
    field("visaDetails", "Visa information", p.visaDetails || "", "textarea", "full short"),
    field("importantInfoText", "Important notes", lines(p.importantInfo || p.notes), "textarea", "full"),
    field("terms", "Terms and conditions", p.terms || "", "textarea", "full short"),
    field("cancellationPolicy", "Cancellation policy", p.cancellationPolicy || "", "textarea", "full short")
  ].join("");
  renderItineraryEditor();
  $("#extraFields").innerHTML = [
    field("departureLocation", "Departure location", p.departureLocation || ""),
    field("availableTravelDates", "Available travel dates", p.availableTravelDates || ""),
    field("minTravellers", "Minimum travellers", p.minTravellers || "", "number"),
    field("maxTravellers", "Maximum travellers", p.maxTravellers || "", "number"),
    field("bookingValidity", "Booking validity", p.bookingValidity || ""),
    field("packageValidity", "Package validity", p.packageValidity || ""),
    field("visaRequired", "Visa required", p.visaRequired || "", "select", `<option value="">Select</option><option ${p.visaRequired === "Yes" ? "selected" : ""}>Yes</option><option ${p.visaRequired === "No" ? "selected" : ""}>No</option>`),
    field("customisable", "Customisable package", p.customisable ?? true, "checkbox"),
    field("whatsappMessage", "WhatsApp enquiry text", p.whatsappMessage || "", "textarea", "full short"),
    field("seoTitle", "SEO title", p.seoTitle || "", "textarea", "full short"),
    field("seoDescription", "SEO description", p.seoDescription || "", "textarea", "full short"),
    field("seoKeywords", "SEO keywords", p.seoKeywords || "", "textarea", "full short")
  ].join("");
};

const renderImagePreview = () => {
  const p = state.selectedPackage;
  const images = [p.heroImage, p.cardImage, ...(p.galleryImages || []).map(image => typeof image === "string" ? image : image.src)].filter(Boolean);
  $("#imagePreviewGrid").innerHTML = images.map(src => `<img src="${escapeHtml(src)}" alt="Package preview">`).join("");
};

const renderPricingEditor = () => {
  const options = state.selectedPackage.pricingOptions || [];
  $("#pricingOptionsEditor").innerHTML = options.map((option, index) => `
    <article class="pricing-option-card" data-pricing-index="${index}">
      <div class="admin-form-grid">
        ${field(`priceLabel-${index}`, "Option label", option.label || "")}
        ${field(`priceBadge-${index}`, "Badge", option.badge || "")}
        ${field(`priceValue-${index}`, "AED price", option.price || "")}
        ${field(`priceNote-${index}`, "Per-person label", option.priceNote || "per person")}
        ${field(`priceHotels-${index}`, "Hotels", lines(option.hotels), "textarea", "full short")}
        ${field(`priceFeatures-${index}`, "Features", lines(option.features), "textarea", "full short")}
      </div>
      <button class="danger" type="button" data-remove-pricing="${index}">Remove Option</button>
    </article>
  `).join("");
};

const renderItineraryEditor = () => {
  const itinerary = state.selectedPackage.itinerary || [];
  $("#itineraryBuilder").innerHTML = itinerary.map((day, index) => `
    <article class="itinerary-day-card" data-day-index="${index}">
      <div class="card-head"><h3>Day ${index + 1}</h3><div class="row-actions"><button type="button" data-duplicate-day="${index}">Duplicate</button><button class="danger" type="button" data-remove-day="${index}">Delete</button></div></div>
      <div class="admin-form-grid">
        ${field(`dayNumber-${index}`, "Day number", day.day || `Day ${index + 1}`)}
        ${field(`dayTitle-${index}`, "Day title", day.title || "")}
        ${field(`dayText-${index}`, "Day description", day.text || "", "textarea", "full")}
        ${field(`dayMeals-${index}`, "Meals included", day.meals || "")}
        ${field(`dayHotel-${index}`, "Hotel/accommodation", day.hotel || "")}
        ${field(`dayActivities-${index}`, "Activities", lines(day.activities), "textarea", "full short")}
        ${field(`dayTransport-${index}`, "Transportation notes", day.transportation || "")}
        ${field(`dayImages-${index}`, "Day image URLs", lines(day.images), "textarea", "full short")}
      </div>
    </article>
  `).join("");
};

const collectEditor = statusOverride => {
  const data = new FormData($("#packageForm"));
  const p = state.selectedPackage;
  const originalSlug = p.slug;
  p.title = data.get("title")?.trim() || "Untitled Package";
  p.slug = slugify(data.get("slug") || p.title);
  p.summary = data.get("summary") || "";
  p.country = data.get("country") || "";
  p.destinationState = data.get("destinationState") || "";
  p.route = p.destinationState;
  p.category = data.get("category") || "";
  p.packageType = data.get("packageType") || p.category;
  p.duration = data.get("duration") || "";
  p.nights = data.get("nights") || "";
  p.days = data.get("days") || "";
  p.featured = data.get("featured") === "on";
  p.adminStatus = statusOverride || data.get("adminStatus") || "draft";
  p.displayOrder = Number(data.get("displayOrder")) || state.packages.length + 1;
  p.price = data.get("priceValue-0") || p.price || "AED 0";
  p.heroImage = data.get("heroImage") || "";
  p.cardImage = data.get("cardImage") || p.heroImage;
  p.mobileHeroImage = data.get("mobileHeroImage") || "";
  p.imageAlt = data.get("imageAlt") || p.title;
  p.galleryImages = fromLines(data.get("galleryImagesText")).map(src => ({ src, label: p.title }));
  p.imageHighlights = fromLines(data.get("imageHighlightsText"));
  p.overview = data.get("overview") || "";
  p.highlights = fromLines(data.get("highlightsText"));
  p.inclusions = fromLines(data.get("inclusionsText"));
  p.exclusions = fromLines(data.get("exclusionsText"));
  p.transportation = data.get("transportation") || "";
  p.meals = data.get("meals") || "";
  p.visaDetails = data.get("visaDetails") || "";
  p.importantInfo = fromLines(data.get("importantInfoText"));
  p.notes = p.importantInfo;
  p.terms = data.get("terms") || "";
  p.cancellationPolicy = data.get("cancellationPolicy") || "";
  p.departureLocation = data.get("departureLocation") || "";
  p.availableTravelDates = data.get("availableTravelDates") || "";
  p.minTravellers = data.get("minTravellers") || "";
  p.maxTravellers = data.get("maxTravellers") || "";
  p.bookingValidity = data.get("bookingValidity") || "";
  p.packageValidity = data.get("packageValidity") || "";
  p.visaRequired = data.get("visaRequired") || "";
  p.customisable = data.get("customisable") === "on";
  p.whatsappMessage = data.get("whatsappMessage") || `Hi, I'm interested in ${p.title}. Please share more details.`;
  p.seoTitle = data.get("seoTitle") || "";
  p.seoDescription = data.get("seoDescription") || "";
  p.seoKeywords = data.get("seoKeywords") || "";
  p.pricingOptions = (p.pricingOptions || []).map((option, index) => ({
    ...option,
    label: data.get(`priceLabel-${index}`) || option.label || "Package Option",
    badge: data.get(`priceBadge-${index}`) || "",
    price: data.get(`priceValue-${index}`) || "",
    priceNote: data.get(`priceNote-${index}`) || "per person",
    hotels: fromLines(data.get(`priceHotels-${index}`)),
    features: fromLines(data.get(`priceFeatures-${index}`)),
    mealPlan: option.mealPlan || "Based on selected package",
    transferType: option.transferType || "Transfers arranged as per itinerary",
    cta: option.cta || "Enquire Now"
  }));
  p.itinerary = (p.itinerary || []).map((day, index) => ({
    day: data.get(`dayNumber-${index}`) || `Day ${index + 1}`,
    title: data.get(`dayTitle-${index}`) || "",
    text: data.get(`dayText-${index}`) || "",
    meals: data.get(`dayMeals-${index}`) || "",
    hotel: data.get(`dayHotel-${index}`) || "",
    activities: fromLines(data.get(`dayActivities-${index}`)),
    transportation: data.get(`dayTransport-${index}`) || "",
    images: fromLines(data.get(`dayImages-${index}`))
  }));
  p.lastUpdated = new Date().toLocaleString();
  if (originalSlug !== p.slug && state.selectedIndex >= 0 && !confirm("Changing a live package slug can affect existing links. Continue?")) return null;
  return p;
};

const saveCurrentPackage = status => {
  const pkg = collectEditor(status);
  if (!pkg) return;
  const duplicate = state.packages.find((item, index) => item.slug === pkg.slug && index !== state.selectedIndex);
  if (duplicate) {
    notify("Slug already exists. Choose a unique slug.");
    return;
  }
  if (state.selectedIndex >= 0) state.packages[state.selectedIndex] = pkg;
  else state.packages.push(pkg);
  state.selectedPackage = pkg;
  state.selectedIndex = state.packages.findIndex(item => item.slug === pkg.slug);
  persistPackages();
  notify(status === "published" ? "Package published." : "Package saved.");
};

const duplicatePackage = slug => {
  const source = state.packages.find(item => item.slug === slug);
  if (!source) return;
  const copy = clone(source);
  copy.title = `${copy.title} Copy`;
  copy.slug = `${copy.slug}-copy-${Date.now().toString().slice(-4)}`;
  copy.adminStatus = "draft";
  copy.displayOrder = state.packages.length + 1;
  copy.lastUpdated = new Date().toLocaleString();
  state.packages.push(copy);
  persistPackages();
  notify("Package duplicated as draft.");
};

const deletePackage = slug => {
  const item = state.packages.find(pkg => pkg.slug === slug);
  if (!item || !confirm(`Delete ${item.title}? This removes it from this admin store.`)) return;
  state.packages = state.packages.filter(pkg => pkg.slug !== slug);
  persistPackages();
  notify("Package deleted.");
};

const addCountry = () => {
  const name = prompt("Country name");
  if (!name) return;
  state.extras.countries.push({ name, image: "", flag: "", order: state.extras.countries.length + 1, status: "published" });
  persistExtras();
  renderCountries();
};

const addExperience = () => {
  const name = prompt("Experience category name");
  if (!name) return;
  state.extras.experiences.push({ name, order: state.extras.experiences.length + 1, status: "published" });
  persistExtras();
  renderExperiences();
};

const addEnquiry = () => {
  state.extras.enquiries.unshift({ name: "New Lead", phone: "", email: "", package: "", travelDate: "", status: "New", notes: "Manual test enquiry" });
  persistExtras();
  renderEnquiries();
};

const addUser = () => {
  const email = prompt("Admin user email");
  if (!email) return;
  state.extras.users.push({ name: email.split("@")[0], email, role: "Content Editor", status: "Invited" });
  persistExtras();
  renderUsers();
};

document.addEventListener("click", event => {
  const button = event.target.closest("button, a");
  if (!button) return;
  const section = button.dataset.adminSection || button.dataset.adminSectionShortcut;
  if (section) setSection(section);
  if (button.matches("[data-sidebar-toggle]")) $(".admin-nav").classList.toggle("open");
  if (button.matches("[data-add-package]")) openEditor();
  if (button.dataset.editPackage) openEditor(button.dataset.editPackage);
  if (button.dataset.duplicatePackage) duplicatePackage(button.dataset.duplicatePackage);
  if (button.dataset.deletePackage) deletePackage(button.dataset.deletePackage);
  if (button.dataset.toggleStatus) {
    const item = state.packages.find(pkg => pkg.slug === button.dataset.toggleStatus);
    item.adminStatus = getStatus(item) === "published" ? "hidden" : "published";
    item.lastUpdated = new Date().toLocaleString();
    persistPackages();
  }
  if (button.matches("[data-logout]")) {
    localStorage.removeItem(AUTH_KEY);
    authenticate();
  }
  if (button.matches("[data-close-editor]")) $("#packageEditor").close();
  if (button.dataset.editorTab) {
    $$(".editor-tabs button").forEach(tab => tab.classList.toggle("active", tab === button));
    $$("[data-editor-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.editorPanel === button.dataset.editorTab));
  }
  if (button.matches("[data-save-draft]")) saveCurrentPackage("draft");
  if (button.matches("[data-preview-current]")) {
    saveCurrentPackage(state.selectedPackage.adminStatus || "draft");
    window.open(`/packages/detail.html?adminPreview=${encodeURIComponent(state.selectedPackage.slug)}`, "_blank");
  }
  if (button.matches("[data-delete-current]") && state.selectedPackage?.slug) {
    deletePackage(state.selectedPackage.slug);
    $("#packageEditor").close();
  }
  if (button.matches("[data-add-pricing]")) {
    state.selectedPackage.pricingOptions = state.selectedPackage.pricingOptions || [];
    state.selectedPackage.pricingOptions.push({ label: "New Option", price: "AED 0", priceNote: "per person", hotels: [], features: [] });
    renderPricingEditor();
  }
  if (button.dataset.removePricing) {
    state.selectedPackage.pricingOptions.splice(Number(button.dataset.removePricing), 1);
    renderPricingEditor();
  }
  if (button.matches("[data-add-day]")) {
    state.selectedPackage.itinerary = state.selectedPackage.itinerary || [];
    state.selectedPackage.itinerary.push({ day: `Day ${state.selectedPackage.itinerary.length + 1}`, title: "", text: "" });
    renderItineraryEditor();
  }
  if (button.dataset.duplicateDay) {
    const index = Number(button.dataset.duplicateDay);
    state.selectedPackage.itinerary.splice(index + 1, 0, clone(state.selectedPackage.itinerary[index]));
    renderItineraryEditor();
  }
  if (button.dataset.removeDay) {
    state.selectedPackage.itinerary.splice(Number(button.dataset.removeDay), 1);
    renderItineraryEditor();
  }
  if (button.matches("[data-add-country]")) addCountry();
  if (button.matches("[data-add-experience]")) addExperience();
  if (button.matches("[data-add-enquiry]")) addEnquiry();
  if (button.matches("[data-add-user]")) addUser();
  if (button.dataset.copyMedia) {
    navigator.clipboard?.writeText(button.dataset.copyMedia);
    notify("Image URL copied.");
  }
  if (button.dataset.deleteMedia) {
    const inUse = packageImageRecords().some(item => item.src === button.dataset.deleteMedia);
    if (inUse && !confirm("This image is actively used by a package. Delete the uploaded media record anyway?")) return;
    state.media = state.media.filter(item => item.src !== button.dataset.deleteMedia);
    persistMedia();
    renderMedia();
  }
});

document.addEventListener("input", event => {
  const target = event.target;
  if (target.id === "adminPackageSearch") {
    state.filters.search = target.value;
    renderPackages();
  }
  if (target.dataset.orderPackage) {
    const item = state.packages.find(pkg => pkg.slug === target.dataset.orderPackage);
    if (item) {
      item.displayOrder = Number(target.value) || item.displayOrder;
      item.lastUpdated = new Date().toLocaleString();
      saveAdminPackages(state.packages);
    }
  }
  if (target.dataset.enquiryNotes) {
    state.extras.enquiries[Number(target.dataset.enquiryNotes)].notes = target.value;
    persistExtras();
  }
  if (target.id === "mediaSearch") renderMedia();
});

document.addEventListener("change", event => {
  const target = event.target;
  if (target.id === "adminCountryFilter") state.filters.country = target.value;
  if (target.id === "adminStatusFilter") state.filters.status = target.value;
  if (target.id === "adminCategoryFilter") state.filters.category = target.value;
  if (["adminCountryFilter", "adminStatusFilter", "adminCategoryFilter"].includes(target.id)) renderPackages();
  if (target.dataset.enquiryStatus) {
    state.extras.enquiries[Number(target.dataset.enquiryStatus)].status = target.value;
    persistExtras();
  }
});

$("#packageForm").addEventListener("submit", event => {
  event.preventDefault();
  saveCurrentPackage("published");
  $("#packageEditor").close();
});

$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();
  if ($("#adminPassword").value !== PASSWORD) {
    notify("Incorrect admin password.");
    return;
  }
  localStorage.setItem(AUTH_KEY, "true");
  authenticate();
});

$("#settingsForm").addEventListener("submit", event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target));
  saveAdminSettings(values);
  notify("Website settings saved.");
});

$("#mediaUpload").addEventListener("change", event => {
  [...event.target.files].forEach(file => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.media.unshift({
        src: reader.result,
        usage: file.name,
        uploaded: true,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type
      });
      persistMedia();
      renderMedia();
    };
    reader.readAsDataURL(file);
  });
  notify("Images added to local media library.");
});

window.addEventListener("beforeunload", event => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

window.flyoAdmin = {
  exportPackages: () => JSON.stringify(state.packages, null, 2),
  resetPackages: () => {
    resetAdminPackages();
    state.packages = getAdminPackages();
    renderAll();
  },
  sourcePackages: getSourcePackages,
  storageKey: ADMIN_PACKAGE_STORAGE_KEY
};

authenticate();
renderAll();
