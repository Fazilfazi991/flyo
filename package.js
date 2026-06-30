import { contact, footerColumns, navLinks, packages } from "./data/packages.js";

const pathParts = location.pathname.split("/").filter(Boolean);
const rawSlug = decodeURIComponent(pathParts.pop() || "kuala-lumpur-getaway");
const slug = rawSlug.replace(/\.html$/i, "") === "detail" ? "kuala-lumpur-getaway" : rawSlug.replace(/\.html$/i, "");
const packageData = packages.find(item => item.slug === slug);

if (!packageData) {
  document.body.innerHTML = `
    <main class="not-found">
      <h1>Package not found</h1>
      <p>We could not find a package for <strong>${slug}</strong>.</p>
      <a href="/index.html#packages">Back to Flyo packages</a>
    </main>
  `;
  throw new Error(`Package not found: ${slug}`);
}

const byId = id => document.getElementById(id);
const textToLines = text => String(text).split("\n").join("<br>");
const stars = count => "★★★★★".slice(0, count);
const relatedPackages = packages.filter(item => item.slug !== packageData.slug).slice(0, 5);
const startingPrice = packageData.startingPrice || packageData.price || "Price on request";
const startingPriceText = /request/i.test(startingPrice) ? startingPrice : `${startingPrice} / person`;
const baseWhatsappMessage = packageData.whatsappMessage || `Hi Flyo, I want to enquire about the ${packageData.title} package.`;
const callHref = `tel:${contact.phone.replace(/\D/g, "")}`;
const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(packageData.title)}&body=${encodeURIComponent(baseWhatsappMessage)}`;

const whatsappFor = label => {
  const suffix = label && label !== "hero enquiry" ? `\n\nEnquiry: ${label}` : "";
  const text = encodeURIComponent(`${baseWhatsappMessage}${suffix}`);
  return `${contact.whatsapp}?text=${text}`;
};

const iconPaths = {
  destination: "/public/flyo-icons/package-meta/destination.svg",
  duration: "/public/flyo-icons/package-meta/duration.svg",
  route: "/public/flyo-icons/package-meta/route.svg",
  startingPrice: "/public/flyo-icons/package-meta/starting-price.svg",
  whatsapp: "/public/flyo-icons/package-meta/whatsapp.svg",
  visaAssistance: "/public/flyo-icons/trust-strip/visa-assistance.svg",
  handpickedHotels: "/public/flyo-icons/trust-strip/handpicked-hotels.svg",
  transfersArranged: "/public/flyo-icons/trust-strip/transfers-arranged.svg",
  customItinerary: "/public/flyo-icons/trust-strip/custom-itinerary.svg",
  support247: "/public/flyo-icons/trust-strip/support-24-7.svg"
};

const iconAsset = name => `<span class="ui-icon" style="--icon-url: url('${iconPaths[name]}')" aria-hidden="true"></span>`;
const checkIcon = () => `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.8"/></svg>`;
const xIcon = () => `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>`;
const detailIcon = name => {
  const icons = {
    hotel: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"/><path d="M17 9h1a2 2 0 0 1 2 2v10M3 21h18M8 7h1M12 7h1M8 11h1M12 11h1M8 15h1M12 15h1"/></svg>`,
    meal: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v18M10 3v6a4 4 0 0 1-8 0V3M17 3v18M17 3c3 2 4 5 4 8v2h-4"/></svg>`,
    transfer: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4.5 21 12l-10.5 7.5 1.5-6-9-1.5 9-1.5-1.5-6Z"/></svg>`,
    tour: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></svg>`,
    support: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"/><path d="M15 20h-3"/></svg>`,
    visa: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M8 12h8M8 16h6"/></svg>`,
    included: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.8"/></svg>`
  };
  return icons[name] || icons.included;
};
const siteHrefMap = {
  Home: "/index.html",
  Flights: "/flights/",
  Holidays: "/packages/",
  Experiences: "/experiences.html",
  "Visa Services": "/index.html#visa-services",
  Contact: "#contact",
  "Flight Booking Assistance": "/flights/",
  "Holiday Packages": "/packages/",
  "International Packages": "/packages/",
  "Visa Assistance": "/index.html#visa-services",
  "Custom Holidays": "/packages/",
  "Honeymoon Packages": "/packages/",
  "Family Holidays": "/packages/",
  "Group Tours": "/packages/",
  "Privacy Policy": "#",
  "Terms & Conditions": "#"
};

const pricingOptions = (packageData.pricingOptions && packageData.pricingOptions.length
  ? packageData.pricingOptions
  : (packageData.hotels || []).map(item => ({
    label: item.title,
    hotels: ["Hotels selected based on availability"],
    mealPlan: "Based on selected package",
    transferType: "Transfers arranged as per itinerary",
    price: item.price ? item.price.replace(/\s*per person$/i, "") : null,
    priceNote: item.price && /per person/i.test(item.price) ? "per person" : "based on travel dates",
    features: item.features || [],
    cta: item.price ? "Enquire Now" : "Get Best Price"
  })));

if (!pricingOptions.length) {
  pricingOptions.push({
    label: "Custom Quote",
    badge: "Flexible Pricing",
    hotels: ["Hotels selected based on availability"],
    mealPlan: "Based on selected package",
    transferType: "Private or shared transfers available",
    price: null,
    priceDisplay: "Price on request",
    priceNote: "based on travel dates",
    features: ["Custom hotels", "Flexible dates", "Tailored itinerary", "Best available rate"],
    cta: "Get Best Price"
  });
}

const priceDisplayFor = option => option.priceDisplay || option.price || "Price on request";
const ctaFor = option => option.price ? (option.cta || "Enquire Now") : "Get Best Price";
const hasSeasonalPricing = pricingOptions.some(option => option.seasonalNote || /seasonal/i.test(option.badge || ""));
const hasComplexPricing = Boolean(packageData.complexHotelData || packageData.usePricingTable || pricingOptions.some(option => option.complexHotelData || option.seasonalRates));

const renderPricingCard = (option, index, extraClass = "") => {
  const priceDisplay = priceDisplayFor(option);
  const isRequestPrice = !option.price && /request/i.test(priceDisplay);
  return `
    <article class="price-card ${index === 1 && pricingOptions.length > 2 ? "featured" : ""} ${extraClass}">
      ${option.badge ? `<span class="popular-badge">${option.badge}</span>` : ""}
      <div class="price-icon">${String(index + 1).padStart(2, "0")}</div>
      <h3>${option.label || "Custom Quote"}</h3>
      <p class="hotel-list">${(option.hotels || ["Hotels selected based on availability"]).join("<br>")}</p>
      <div class="stay-meta">
        <span><b>Meal Plan</b>${option.mealPlan || "Based on selected package"}</span>
        <span><b>Transfers</b>${option.transferType || "Transfers arranged as per itinerary"}</span>
      </div>
      <ul class="price-features">
        ${(option.features || []).map(feature => `<li>${feature}</li>`).join("")}
      </ul>
      <div class="price ${isRequestPrice ? "price-request" : ""}">
        ${option.price ? `<span>${option.price.split(" ")[0]}</span> ${option.price.split(" ").slice(1).join(" ")}` : priceDisplay}
        ${option.priceNote ? `<small>${option.priceNote}</small>` : ""}
      </div>
      ${option.seasonalNote ? `<p class="seasonal-note">${option.seasonalNote}</p>` : ""}
      <a href="${whatsappFor(option.label || "custom pricing")}">${ctaFor(option)}</a>
    </article>
  `;
};

const renderCustomOptionCard = () => `
  <article class="custom-option-card">
    <span>Custom Stay</span>
    <h3>Want a different stay?</h3>
    <p>Our team can customize hotels, room types, and transfers based on your budget and travel dates.</p>
    <a href="${whatsappFor("custom stay option")}">Request Custom Option</a>
  </article>
`;

const renderPricingTable = options => `
  <div class="pricing-table-wrap" role="region" aria-label="Stay options comparison">
    <table class="pricing-table">
      <thead>
        <tr>
          <th>Stay option</th>
          <th>Hotels</th>
          <th>Meal plan</th>
          <th>Transfers</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${options.map(option => `
          <tr>
            <td data-label="Stay option"><strong>${option.label || "Custom Quote"}</strong>${option.badge ? `<span>${option.badge}</span>` : ""}</td>
            <td data-label="Hotels">${(option.hotels || ["Hotels selected based on availability"]).join("<br>")}</td>
            <td data-label="Meal plan">${option.mealPlan || "Based on selected package"}</td>
            <td data-label="Transfers">${option.transferType || "Transfers arranged as per itinerary"}</td>
            <td data-label="Price"><b>${priceDisplayFor(option)}</b>${option.priceNote ? `<small>${option.priceNote}</small>` : ""}</td>
            <td data-label="Action"><a href="${whatsappFor(option.label || "pricing option")}">${ctaFor(option)}</a></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
`;

const shouldRenderPricingTable = pricingOptions.length > 3 || hasComplexPricing;

document.title = `${packageData.title} | Flyo Tours & Travels`;
document.documentElement.style.setProperty("--package-hero-image", `url("${packageData.heroImage}")`);
byId("packageMainImage").style.backgroundImage = `url("${packageData.heroImage}")`;
const imageHighlights = packageData.imageHighlights || (
  packageData.category === "Cruise Package"
    ? ["Scenic coastal views", "Relax on board", "Memorable escapes"]
    : ["Curated itinerary", "Comfortable stays", "Guided support"]
);
byId("imageHighlightStrip").innerHTML = imageHighlights.slice(0, 3).map(highlight => `<span>${highlight}</span>`).join("");

byId("packageNav").innerHTML = navLinks.map(link => {
  const hrefMap = {
    Home: "/index.html",
    Flights: "/flights/",
    Holidays: "/packages/",
    Experiences: "/experiences.html",
    "Visa Services": "/index.html#visa-services",
    Contact: "#contact"
  };
  return `<a class="${link === "Holidays" ? "active" : ""}" href="${hrefMap[link] || "#"}">${link}</a>`;
}).join("") + `<a class="mobile-nav-cta" href="/packages/">Explore Packages</a>`;
byId("heroBadge").textContent = packageData.category || packageData.country;
byId("heroTitle").innerHTML = packageData.title;
byId("heroSubtitle").textContent = packageData.summary;
byId("heroFeatures").innerHTML = [
  { icon: "duration", label: "Duration", value: packageData.duration },
  { icon: "startingPrice", label: "Starting Price", value: startingPriceText },
  { icon: "route", label: "Availability", value: packageData.availability || "Flexible Dates" },
  { icon: "destination", label: "Package Type", value: packageData.packageType || packageData.category || "Holiday" }
].map(item => `
  <div class="hero-feature">
    <span class="meta-icon">${iconAsset(item.icon)}</span>
    <small>${item.label}</small>
    <strong>${item.value}</strong>
  </div>
`).join("");
byId("heroActions").innerHTML = [
  { className: "primary", label: "WhatsApp Enquiry", href: whatsappFor("hero enquiry") },
  { className: "secondary", label: "Call Now", href: callHref },
  { className: "secondary", label: "Email Enquiry", href: emailHref }
].map(action => `<a class="${action.className}" href="${action.href}">${action.label}</a>`).join("");
byId("heroTrust").innerHTML = [
  packageData.category === "Cruise Package" ? "Cruise planning" : "Custom planning",
  "Visa support",
  packageData.category === "Cruise Package" ? "Availability guidance" : "Hotels and transfers",
  "24/7 support"
].join(" <span>|</span> ");

byId("bookingTitle").textContent = "Quick Trip Enquiry";
byId("bookingDate").placeholder = "Preferred travel date";
byId("bookingPackage").innerHTML = `<option>${packageData.title}</option>` + pricingOptions.map(item => `<option>${item.label || "Custom Quote"}</option>`).join("");
byId("bookingButton").textContent = "Send Enquiry";
byId("bookingNote").textContent = "Flyo will confirm availability, final rates, and customization options.";

document.querySelector("#overviewPanel .section-title span").textContent = "Overview";
document.querySelector("#overviewPanel .section-title h2").textContent = "Package Overview";
document.querySelector("#overviewPanel .section-title p").textContent = packageData.overview;
byId("highlightGrid").innerHTML = packageData.highlights.slice(0, 3).map((highlight, index) => `
  <article class="highlight-card">
    <div class="highlight-image" style="background-image:url('${packageData.cardImage}')"></div>
    <div class="highlight-body">
      <div class="number-title"><span>${String(index + 1).padStart(2, "0")}</span><h3>${highlight}</h3></div>
      <p>${index === 0 ? "A polished start to the trip with key sights and smooth routing." : "Planned with clear timing, comfortable transfers, and easy pacing."}</p>
    </div>
  </article>
`).join("");

const inclusionIcon = detail => {
  const value = detail.toLowerCase();
  if (value.includes("hotel") || value.includes("accommodation") || value.includes("stay")) return detailIcon("hotel");
  if (value.includes("transfer") || value.includes("pickup") || value.includes("drop")) return detailIcon("transfer");
  if (value.includes("meal") || value.includes("breakfast") || value.includes("dinner")) return detailIcon("meal");
  if (value.includes("visa")) return detailIcon("visa");
  if (value.includes("guide") || value.includes("tour") || value.includes("experience") || value.includes("itinerary")) return detailIcon("tour");
  if (value.includes("support") || value.includes("coordination")) return detailIcon("support");
  return detailIcon("included");
};

const inclusions = packageData.inclusions || [];
const exclusions = packageData.exclusions || [];

if (!inclusions.length && !exclusions.length) {
  byId("packageIncludesSection").hidden = true;
} else {
  byId("includedColumn").hidden = !inclusions.length;
  byId("excludedColumn").hidden = !exclusions.length;
  byId("packageIncludesDivider").hidden = !inclusions.length || !exclusions.length;
  byId("packageIncludesCard").classList.toggle("single-column", !inclusions.length || !exclusions.length);
  byId("inclusionGrid").innerHTML = inclusions.map(item => `
    <li><span class="package-list-icon">${checkIcon()}</span><strong>${item}</strong></li>
  `).join("");
  byId("exclusionGrid").innerHTML = exclusions.map(item => `
    <li><span class="package-list-icon">${xIcon()}</span><strong>${item}</strong></li>
  `).join("");
}

const scheduleItems = (packageData.timings || packageData.schedule || []).map(item => {
  if (typeof item === "string") return { label: item };
  return item;
});

if (scheduleItems.length) {
  byId("scheduleSection").hidden = false;
  byId("scheduleGrid").innerHTML = scheduleItems.map(item => `
    <article class="package-timing-card">
      <strong>${item.label || item.day || "Timing"}</strong>
      ${item.place ? `<span>${item.place}</span>` : ""}
      ${item.arrival ? `<small>Arrival: ${item.arrival}</small>` : ""}
      ${item.departure ? `<small>Departure: ${item.departure}</small>` : ""}
    </article>
  `).join("");
}

const tourPlanTitles = [
  "SATURDAY, 15 AUGUST 2026 - DEPARTURE FROM DUBAI",
  "SUNDAY, 16 AUGUST 2026 - ARRIVAL IN SALALAH & WEST SALALAH SIGHTSEEING",
  "MONDAY, 17 AUGUST 2026 - FULL-DAY EAST SALALAH TOUR",
  "TUESDAY, 18 AUGUST 2026 - JABAL SAMHAN VISIT & RETURN JOURNEY TO UAE",
  "WEDNESDAY, 19 AUGUST 2026 - RETURN TO UAE"
];

const tourPlan = tourPlanTitles.map((title, index) => {
  const source = packageData.itinerary[index] || packageData.itinerary[packageData.itinerary.length - 1] || {};
  return {
    day: `Day ${String(index + 1).padStart(2, "0")}`,
    title,
    text: source.text || packageData.summary,
    sourceTitle: source.title || packageData.title
  };
});

byId("itineraryAccordion").innerHTML = tourPlan.map((item, index) => `
  <article class="itinerary-day ${index === 0 ? "open" : ""}">
    <button class="itinerary-day-toggle" type="button" aria-expanded="${index === 0}" aria-controls="itineraryDay${index + 1}">
      <span class="itinerary-day-badge">${item.day}</span>
      <span class="itinerary-day-title">${item.title}</span>
      <span class="itinerary-chevron" aria-hidden="true">⌄</span>
    </button>
    <div class="itinerary-day-panel" id="itineraryDay${index + 1}">
      <div class="itinerary-day-content">
        <strong>${item.sourceTitle}</strong>
        <p>${item.text}</p>
      </div>
    </div>
  </article>
`).join("");

const itineraryDetailsBySlug = {
  "kuala-lumpur-getaway": [
    { title: "Arrival in Kuala Lumpur", summary: "Arrive in Kuala Lumpur, transfer to your hotel, and enjoy a relaxed first evening in the city.", chips: ["Arrival", "Transfer", "Hotel Stay", "Leisure"], details: ["Meet your driver at Kuala Lumpur International Airport and continue to your selected hotel.", "Check in, settle into your room, and take time to refresh after the flight.", "The evening is kept free so you can explore nearby cafes, shopping streets, or KLCC at your own pace.", "Flyo can suggest dinner areas or optional evening experiences based on your hotel location."] },
    { title: "Kuala Lumpur City Tour & KL Tower", summary: "Explore Kuala Lumpur's city highlights before visiting KL Tower for skyline views.", chips: ["Breakfast", "Sightseeing", "City Tour", "Hotel Stay"], details: ["Start with breakfast at the hotel before meeting your driver for the city tour.", "Visit key landmarks, photo stops, cultural corners, and modern city districts.", "Continue to KL Tower Observatory and Sky Deck for panoramic city views.", "Return to the hotel with the evening free for shopping, dining, or optional local experiences."] },
    { title: "Genting Highlands & Batu Caves", summary: "Travel to the cool highlands with a Batu Caves photo stop and leisure time at Genting.", chips: ["Breakfast", "Transfer", "Sightseeing", "Leisure"], details: ["After breakfast, depart for a full-day excursion outside Kuala Lumpur.", "Stop at Batu Caves for photos and time to experience one of Malaysia's most iconic sites.", "Continue to Genting Highlands for cooler weather, entertainment, shopping, and leisure time.", "Return to Kuala Lumpur by evening and relax at your hotel."] },
    { title: "Departure from Kuala Lumpur", summary: "Check out after breakfast and transfer to the airport for your return flight.", chips: ["Breakfast", "Departure", "Transfer"], details: ["Enjoy breakfast at the hotel and prepare for checkout.", "Your transfer will be arranged according to your confirmed flight timing.", "If time permits, Flyo can suggest a final shopping stop or nearby cafe before departure.", "Continue to the airport with smooth assistance and trip coordination."] }
  ],
  "thai-wonders": [
    { title: "Arrival in Bangkok & Transfer to Pattaya", summary: "Arrive in Bangkok, transfer to Pattaya, check in, and enjoy the evening at leisure.", chips: ["Arrival", "Transfer", "Hotel Stay", "Leisure"], details: ["Meet your driver at Bangkok airport and begin the road transfer to Pattaya.", "Check in to your selected hotel and take time to relax after the journey.", "The evening is free for beachside walks, local markets, cafes, or optional entertainment.", "Flyo keeps the first day light so you can settle in comfortably before sightseeing begins."] },
    { title: "Coral Island Tour & Alcazar Show", summary: "Spend the day around Coral Island with lunch, then enjoy Pattaya's evening show experience.", chips: ["Breakfast", "Island Tour", "Lunch", "Show"], details: ["After breakfast, head to the pier for your Coral Island excursion.", "Enjoy beach time, water views, optional activities, and a relaxed island atmosphere.", "Lunch is included as part of the planned tour arrangement.", "Return to Pattaya and later proceed for the Alcazar Cabaret Show before overnight stay."] },
    { title: "Tiger Park Visit & Transfer to Bangkok", summary: "Visit Tiger Park in Pattaya before continuing to Bangkok for the next part of the trip.", chips: ["Breakfast", "Sightseeing", "Transfer", "Hotel Stay"], details: ["Start the day with breakfast and check out from your Pattaya hotel.", "Visit Tiger Park for a popular Pattaya photo and wildlife experience.", "Continue by road to Bangkok and check in to your city hotel.", "The evening is free for shopping areas, street food, or rest at the hotel."] },
    { title: "Bangkok City Tour", summary: "See Bangkok's temples, city landmarks, shopping areas, and cultural highlights.", chips: ["Breakfast", "City Tour", "Sightseeing", "Leisure"], details: ["After breakfast, begin a guided Bangkok city experience.", "Visit selected temples, local neighborhoods, photo stops, and city highlights.", "Enjoy time for shopping or optional add-ons based on your pace.", "Return to the hotel for your final night in Bangkok."] },
    { title: "Departure from Bangkok", summary: "Check out and transfer to the airport for your return journey.", chips: ["Breakfast", "Departure", "Transfer"], details: ["Enjoy breakfast at the hotel and complete checkout formalities.", "Your airport transfer will be arranged according to the confirmed flight schedule.", "Flyo will help coordinate timing so the departure remains smooth and stress-free.", "Continue to the airport with your Thailand holiday complete."] }
  ],
  "sri-lanka-highlights": [
    { title: "Arrival, Pinnawala & Kandy", summary: "Arrive in Sri Lanka, visit Pinnawala, and continue toward Kandy for your first overnight stay.", chips: ["Arrival", "Transfer", "Sightseeing", "Hotel Stay"], details: ["Meet your driver at the airport and begin the scenic journey inland.", "Visit Pinnawala Elephant Orphanage, one of the best-known family stops in Sri Lanka.", "Continue toward Kandy through changing landscapes and local towns.", "Check in to your hotel and relax after the first day of travel."] },
    { title: "Kandy Sightseeing & Nuwara Eliya", summary: "Explore Kandy's cultural sights before travelling through tea country toward Nuwara Eliya.", chips: ["Breakfast", "Sightseeing", "Culture", "Transfer"], details: ["After breakfast, visit the Temple of the Tooth Relic and key Kandy highlights.", "Enjoy a cultural show or local experience depending on final timing.", "Continue toward Nuwara Eliya through tea estates, viewpoints, and cool mountain scenery.", "Check in and enjoy the relaxed hill-country atmosphere."] },
    { title: "Ramboda Falls & Colombo City Tour", summary: "Travel from tea country toward Colombo with scenic stops and a city tour on arrival.", chips: ["Breakfast", "Waterfall", "Transfer", "City Tour"], details: ["Begin with breakfast and depart toward Colombo.", "Stop near Ramboda Falls and enjoy scenic views along the route.", "On arrival in Colombo, cover selected city highlights, shopping areas, and landmarks.", "Check in to your Colombo hotel for the final overnight stay."] },
    { title: "Departure from Colombo", summary: "Check out after breakfast and transfer to the airport for departure.", chips: ["Breakfast", "Departure", "Transfer"], details: ["Enjoy breakfast at the hotel and prepare for checkout.", "Your driver will coordinate the airport transfer based on your flight timing.", "If time allows, Flyo can suggest a short final stop before heading to the airport.", "Depart Sri Lanka with the main cultural and scenic highlights covered."] }
  ],
  "singapore-family-escape": [
    { title: "Arrival in Singapore", summary: "Arrive in Singapore, transfer to your hotel, and enjoy a light first evening.", chips: ["Arrival", "Transfer", "Hotel Stay", "Leisure"], details: ["Meet your driver at Singapore airport and continue to your hotel.", "Check in and settle into your family-friendly stay.", "The first evening is kept flexible for rest, nearby dining, or a relaxed walk.", "Flyo can help add optional night experiences if your flight arrives early."] },
    { title: "Universal Studios Singapore", summary: "Spend a full day at Universal Studios with rides, shows, and family attractions.", chips: ["Breakfast", "Theme Park", "Family", "Hotel Stay"], details: ["Start with breakfast at the hotel before heading to Universal Studios.", "Enjoy themed zones, popular rides, family shows, and photo stops throughout the day.", "The day is planned with enough time for meals, rest breaks, and shopping inside the park.", "Return to the hotel after a full day of entertainment."] },
    { title: "Sentosa Island Attractions", summary: "Enjoy Sentosa with cable car, oceanarium, luge, skyride, and evening show options.", chips: ["Breakfast", "Sentosa", "Attractions", "Family"], details: ["After breakfast, proceed to Sentosa Island for a packed family experience.", "Enjoy Cable Car views and visit Singapore Oceanarium as per the planned tickets.", "Continue with Luge & Skyride and other selected attractions.", "End the day with Wings of Time or return to the hotel depending on final scheduling."] },
    { title: "Gardens by the Bay & City Time", summary: "Visit Gardens by the Bay and enjoy Singapore's modern city highlights.", chips: ["Breakfast", "Sightseeing", "Gardens", "Leisure"], details: ["Begin the day with breakfast and proceed to Gardens by the Bay.", "Explore selected garden attractions and enjoy Singapore's signature skyline setting.", "Use remaining time for city sightseeing, shopping, or optional add-ons.", "Return to the hotel for your final night in Singapore."] },
    { title: "Departure from Singapore", summary: "Check out and transfer to the airport for your return flight.", chips: ["Breakfast", "Departure", "Transfer"], details: ["Enjoy breakfast at the hotel and complete checkout.", "Your airport transfer will be planned around the confirmed flight timing.", "Flyo can assist with late checkout requests or final activity suggestions where possible.", "Continue to the airport after a smooth family holiday."] }
  ],
  "beaches-of-thailand": [
    { title: "Arrival in Krabi", summary: "Arrive in Krabi, transfer to your hotel, and settle into Thailand's beach atmosphere.", chips: ["Arrival", "Transfer", "Beach", "Hotel Stay"], details: ["Meet your driver at the airport and continue to your Krabi hotel.", "Check in and take time to relax after the journey.", "The evening is free for beach walks, cafes, local markets, or rest.", "Flyo keeps the first day light so the island-hopping days feel comfortable."] },
    { title: "Krabi 4 Island Tour", summary: "Enjoy a scenic island-hopping day around Krabi's clear-water beaches.", chips: ["Breakfast", "Island Tour", "Beach", "Sightseeing"], details: ["After breakfast, proceed for the Krabi 4 Island Tour.", "Visit beautiful beaches, limestone scenery, and clear-water viewpoints depending on sea conditions.", "Enjoy time for swimming, photos, and relaxing by the water.", "Return to Krabi for an overnight stay."] },
    { title: "Transfer to Phi Phi Island", summary: "Travel to Phi Phi Island and enjoy leisure time after check-in.", chips: ["Breakfast", "Transfer", "Island", "Leisure"], details: ["Check out from your Krabi hotel after breakfast.", "Transfer to the pier and continue by ferry or boat arrangement to Phi Phi Island.", "Check in to your island stay and enjoy free time by the beach.", "Spend the evening at leisure in the island's relaxed atmosphere."] },
    { title: "Phi Phi Island Leisure Day", summary: "Enjoy a flexible day for beaches, viewpoints, snorkeling, or optional island activities.", chips: ["Breakfast", "Leisure", "Beach", "Optional Tour"], details: ["Start with breakfast and enjoy a slower island day.", "Guests can relax by the beach, explore cafes, or visit viewpoints.", "Optional snorkeling or boat experiences can be added based on weather and availability.", "Overnight stay continues on Phi Phi Island."] },
    { title: "Transfer to Phuket", summary: "Travel from Phi Phi to Phuket and settle into your next beach destination.", chips: ["Breakfast", "Transfer", "Hotel Stay", "Leisure"], details: ["After breakfast, check out and transfer back by ferry or boat arrangement.", "Continue onward to Phuket and check in to your selected hotel.", "The rest of the day is free for beach time, shopping, or rest.", "Flyo can recommend optional evening areas depending on your hotel location."] },
    { title: "James Bond Island & Phuket City Tour", summary: "Visit James Bond Island and cover key Phuket city highlights.", chips: ["Breakfast", "Island Tour", "City Tour", "Sightseeing"], details: ["Begin with breakfast before your James Bond Island excursion.", "Enjoy scenic coastal views, photo stops, and selected island experiences.", "Later, cover Phuket highlights such as Big Buddha, Wat Chalong, and city viewpoints as per schedule.", "Return to the hotel for the final overnight stay."] },
    { title: "Departure from Phuket", summary: "Check out and transfer to the airport for your return journey.", chips: ["Breakfast", "Departure", "Transfer"], details: ["Enjoy breakfast and complete checkout at the hotel.", "Your airport transfer will be arranged around the confirmed flight timing.", "If your flight is later, Flyo can suggest optional final stops or beach time.", "Depart Phuket after completing Krabi, Phi Phi, and Phuket highlights."] }
  ],
  "kenya-inspiring-safari": [
    { title: "Nairobi to Lake Nakuru", summary: "Meet your safari driver guide and travel to Lake Nakuru for your first wildlife experience.", chips: ["Arrival", "Transfer", "Safari", "Full Board"], details: ["Meet your English-speaking driver guide in Nairobi and begin the journey toward Lake Nakuru.", "Drive through scenic countryside with comfort stops as needed.", "Arrive at the lodge or camp and settle in for your safari stay.", "Enjoy your first park experience or relaxed lodge time depending on arrival timing."] },
    { title: "Lake Nakuru to Masai Mara", summary: "Travel from Lake Nakuru to Masai Mara and enjoy the safari landscape en route.", chips: ["Breakfast", "Transfer", "Safari", "Hotel Stay"], details: ["After breakfast, depart toward Masai Mara with your private safari vehicle.", "The drive introduces wide landscapes, local towns, and changing wildlife country.", "Check in to your lodge or camp and enjoy full-board hospitality.", "If time allows, proceed for an afternoon game drive."] },
    { title: "Masai Mara Game Drives", summary: "Spend the day exploring Masai Mara with game drives and full-board lodge meals.", chips: ["Safari", "Game Drives", "Full Board", "Wildlife"], details: ["Start early for a rewarding safari experience in Masai Mara.", "Your driver guide will plan game-drive routing based on wildlife movement and park conditions.", "Enjoy full-board meals through the lodge or packed safari arrangements depending on the final plan.", "Return to the lodge after a full day surrounded by Kenya's wildlife landscapes."] },
    { title: "Return to Nairobi", summary: "Enjoy breakfast, check out, and drive back to Nairobi for onward travel.", chips: ["Breakfast", "Departure", "Transfer"], details: ["Have breakfast at the lodge before checkout.", "Begin the return drive to Nairobi with comfort stops along the route.", "Arrival timing depends on road conditions and your onward travel plan.", "Flyo can help coordinate airport drop-off or additional Nairobi arrangements."] }
  ],
  "dubai-desert-safari": [
    { title: "Pickup from Dubai or Sharjah", summary: "Begin with pickup from your hotel or residence in a comfortable safari vehicle.", chips: ["Pickup", "Transfer", "Adventure"], details: ["Your driver will coordinate pickup timing based on location and season.", "Travel toward the desert in a comfortable vehicle suitable for the experience.", "A short stop may be included before entering the dunes.", "Guests are briefed so the experience feels clear and comfortable."] },
    { title: "Dune Bashing & Desert Drive", summary: "Enjoy a classic 4x4 dune bashing experience with experienced safari drivers.", chips: ["Safari", "Adventure", "Desert"], details: ["Enter the desert area and begin the dune drive with a trained safari driver.", "The route is planned for excitement while keeping guest comfort in mind.", "Photo stops may be included depending on timing and desert conditions.", "Guests who prefer a gentler ride can request this before the activity begins."] },
    { title: "Sunset Photos & Camp Arrival", summary: "Pause for desert sunset photos before continuing to the safari camp.", chips: ["Sightseeing", "Sunset", "Camp"], details: ["Stop at a scenic desert point for photos as the light softens.", "Continue to the camp area for traditional hospitality and activities.", "Enjoy time for camel rides, henna, sandboarding, or relaxed seating depending on package selection.", "The camp team will guide guests toward included experiences."] },
    { title: "BBQ Dinner & Live Shows", summary: "Enjoy dinner, camp activities, and live entertainment in the desert setting.", chips: ["Dinner", "Shows", "Camp", "Leisure"], details: ["Settle into your seating area and enjoy the evening camp atmosphere.", "Dinner is served as per the selected package with BBQ-style options.", "Live entertainment and camp activities are scheduled through the evening.", "Premium seating or private arrangements can be added based on availability."] },
    { title: "Drop-off After Safari", summary: "After the camp experience, return to your hotel or residence.", chips: ["Departure", "Transfer", "Drop-off"], details: ["At the end of the evening, meet your driver for the return transfer.", "Drop-off is arranged back to your hotel, residence, or agreed location.", "Timing may vary slightly depending on camp departure flow and traffic.", "Flyo remains available for coordination if you need support after the experience."] }
  ]
};

const defaultItineraryImages = [...new Set([packageData.cardImage, packageData.heroImage].filter(Boolean))];
const fallbackDetailLines = item => [
  item.text || packageData.summary,
  "Flyo coordinates timing, transfers, and key inclusions so the day stays easy to follow.",
  "The final arrangement may be adjusted around hotel location, availability, weather, and guest pace.",
  "Optional upgrades or custom stops can be requested before confirmation."
];
const fallbackChips = item => {
  const text = `${item.title || ""} ${item.text || ""}`.toLowerCase();
  const chips = [];
  if (text.includes("arriv")) chips.push("Arrival");
  if (text.includes("breakfast")) chips.push("Breakfast");
  if (text.includes("transfer") || text.includes("pickup") || text.includes("drop")) chips.push("Transfer");
  if (text.includes("tour") || text.includes("sight")) chips.push("Sightseeing");
  if (text.includes("island")) chips.push("Island Tour");
  if (text.includes("safari") || text.includes("game")) chips.push("Safari");
  if (text.includes("depart") || text.includes("return")) chips.push("Departure");
  return chips.length ? chips : ["Hotel Stay", "Leisure"];
};
const itineraryItems = (itineraryDetailsBySlug[packageData.slug] || packageData.itinerary.map(item => ({
  title: item.title,
  summary: item.text,
  details: fallbackDetailLines(item),
  chips: fallbackChips(item)
}))).map((item, index) => ({
  day: `Day ${String(index + 1).padStart(2, "0")}`,
  title: item.title,
  summary: item.summary || item.details?.[0] || packageData.summary,
  details: item.details || fallbackDetailLines(item),
  chips: item.chips || fallbackChips(item),
  images: item.images || (index < 3 ? defaultItineraryImages : [])
}));

byId("itineraryAccordion").innerHTML = itineraryItems.map((item, index) => `
  <article class="itinerary-day ${index === 0 ? "open" : ""}">
    <button class="itinerary-day-toggle" type="button" aria-expanded="${index === 0}" aria-controls="itineraryDay${index + 1}">
      <span class="itinerary-day-badge">${item.day}</span>
      <span class="itinerary-day-heading">
        <span class="itinerary-day-title">${item.title}</span>
        <span class="itinerary-day-summary">${item.summary}</span>
      </span>
      <span class="itinerary-chevron" aria-hidden="true">v</span>
    </button>
    <div class="itinerary-day-panel" id="itineraryDay${index + 1}">
      <div class="itinerary-day-content">
        <ul class="itinerary-detail-list">
          ${item.details.map(detail => `<li>${detail}</li>`).join("")}
        </ul>
        ${item.chips.length ? `<div class="itinerary-chip-row">${item.chips.map(chip => `<span>${chip}</span>`).join("")}</div>` : ""}
        ${item.images.length ? `<div class="itinerary-image-row">${item.images.slice(0, 3).map((image, imageIndex) => `<img src="${image}" alt="${item.title} preview ${imageIndex + 1}">`).join("")}</div>` : ""}
      </div>
    </div>
  </article>
`).join("");

const setPackageTab = name => {
  document.querySelectorAll("[data-package-tab]").forEach(tab => {
    const active = tab.dataset.packageTab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-package-panel]").forEach(panel => {
    panel.classList.toggle("active", panel.dataset.packagePanel === name);
  });
};

document.querySelectorAll("[data-package-tab]").forEach(tab => {
  tab.addEventListener("click", () => setPackageTab(tab.dataset.packageTab));
});

if (location.hash.toLowerCase().includes("itinerary")) {
  setPackageTab("itinerary");
}

document.querySelectorAll(".itinerary-day-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const target = button.closest(".itinerary-day");
    document.querySelectorAll(".itinerary-day").forEach(day => {
      const open = day === target;
      day.classList.toggle("open", open);
      day.querySelector(".itinerary-day-toggle").setAttribute("aria-expanded", String(open));
    });
  });
});

document.querySelector(".gallery-heading h2").textContent = "Related Packages";
document.querySelector(".gallery-heading p").textContent = "More curated holidays Flyo can plan around your dates and travel style.";
document.querySelector(".gallery-button").href = "/index.html#packages";
document.querySelector(".gallery-button").textContent = "View All Packages";
byId("galleryGrid").innerHTML = relatedPackages.slice(0, 3).map(item => `
  <a class="gallery-card" href="/packages/${item.slug}/" style="background-image:url('${item.cardImage}')">
    <strong><span>${item.country}</span>${item.title}</strong>
  </a>
`).join("");

document.querySelector(".options-panel .section-title h2").textContent = "Stay Options & Pricing";
document.querySelector(".options-panel .section-title").insertAdjacentHTML("beforeend", `
  <p>Choose from the available stay options for this package, or ask Flyo to customize hotels and transfers around your dates.</p>
  ${hasSeasonalPricing ? `<small class="pricing-seasonal-disclaimer">Final price may vary based on travel dates, availability, room type, and number of travelers.</small>` : ""}
`);
const pricingGrid = byId("pricingGrid");
pricingGrid.className = `pricing-grid pricing-count-${pricingOptions.length}${shouldRenderPricingTable ? " pricing-table-mode" : ""}`;
pricingGrid.innerHTML = shouldRenderPricingTable
  ? renderPricingTable(pricingOptions)
  : `${pricingOptions.map((option, index) => renderPricingCard(option, index, pricingOptions.length === 1 ? "single-featured" : "")).join("")}${pricingOptions.length === 1 ? renderCustomOptionCard() : ""}`;

const optionalToursCard = packageData.optionalTours?.length ? {
  title: "Optional Tours",
  body: `<ul>${packageData.optionalTours.map(item => `<li>${item}</li>`).join("")}</ul>`
} : null;
const visaDetailsCard = packageData.visaDetails ? {
  title: "Visa Details",
  body: `<p>${packageData.visaDetails}</p>`
} : null;
const importantInfoItems = packageData.importantInfo?.length ? packageData.importantInfo : packageData.notes;
const importantInfoCard = importantInfoItems?.length ? {
  title: "Important Information",
  body: `<ul class="important-info-list">${importantInfoItems.map(item => `<li>${item}</li>`).join("")}</ul>`
} : null;
const infoCards = [optionalToursCard, visaDetailsCard, importantInfoCard].filter(Boolean);
if (infoCards.length) {
  byId("travelNotesSection").hidden = false;
  const summaryCards = [optionalToursCard, visaDetailsCard].filter(Boolean);
  byId("packageInfoGrid").className = `travel-notes-card compact note-count-${infoCards.length}`;
  byId("packageInfoGrid").innerHTML = `
    ${summaryCards.length ? `
      <div class="travel-notes-summary-grid ${summaryCards.length === 1 ? "single-summary" : ""}">
        ${summaryCards.map(card => `
          <article class="travel-note-block">
            <h3>${card.title}</h3>
            ${card.body}
          </article>
        `).join("")}
      </div>
    ` : ""}
    ${summaryCards.length && importantInfoCard ? `<div class="travel-notes-horizontal-divider" aria-hidden="true"></div>` : ""}
    ${importantInfoCard ? `
      <article class="travel-note-block important-info-full">
        <h3>${importantInfoCard.title}</h3>
        ${importantInfoCard.body}
      </article>
    ` : ""}
  `;
}
byId("packageTrust").innerHTML = [
  { icon: "visaAssistance", title: "Visa Assistance" },
  { icon: "handpickedHotels", title: "Handpicked Hotels" },
  { icon: "transfersArranged", title: "Transfers Arranged" },
  { icon: "customItinerary", title: "Custom Itinerary" },
  { icon: "support247", title: "24/7 Support" }
].map(item => `
  <article class="trust-strip-item">
    <span class="trust-strip-icon">${iconAsset(item.icon)}</span>
    <strong>${item.title}</strong>
  </article>
`).join("");

byId("reviewBadge").textContent = "Trusted by travelers";
byId("reviewTitle").innerHTML = textToLines("Built Around\nYour Holiday Style");
byId("reviewText").textContent = "Flyo helps travelers move from idea to itinerary with clear options, destination guidance, and practical support before and during the trip.";
byId("trustPoints").innerHTML = [
  { icon: "CI", title: "Custom Itineraries" },
  { icon: "VA", title: "Visa Assistance" },
  { icon: "HT", title: "Hotels & Transfers" },
  { icon: "24", title: "24/7 Support" }
].map(item => `
  <div class="trust-point"><span>${item.icon}</span><strong>${item.title}<small>${packageData.country}</small></strong></div>
`).join("");

byId("packageTestimonials").innerHTML = [
  { quote: "Flyo made the planning easy and gave us options that matched our budget and travel dates.", name: "Aisha K.", location: "UAE", initials: "AK", rating: 5 },
  { quote: "The transfers, hotel selection, and itinerary pacing were smooth from arrival to departure.", name: "Nikhil S.", location: "India", initials: "NS", rating: 5 },
  { quote: "Responsive team, clear communication, and a holiday that felt planned with care.", name: "Mariam A.", location: "Dubai", initials: "MA", rating: 5 }
].map((item, index) => `
  <article class="package-testimonial ${index === 1 ? "featured" : ""}">
    <div class="quote-mark">"</div>
    <p>${item.quote}</p>
    <div class="review-person">
      <div class="avatar">${item.initials}</div>
      <div><strong>${item.name}</strong><small>${item.location}</small></div>
      <div class="stars">${stars(item.rating)}</div>
    </div>
  </article>
`).join("");
byId("reviewButton").textContent = "Plan a Similar Trip";
byId("reviewButton").href = whatsappFor("custom planning");

byId("statsStrip").innerHTML = [
  { icon: "10K", value: "10K+", label: "Happy Travelers" },
  { icon: "50", value: "50+", label: "Curated Packages" },
  { icon: "15", value: "15+", label: "Destinations" },
  { icon: "24", value: "24/7", label: "Travel Support" }
].map(item => `
  <article class="stat-item"><span>${item.icon}</span><div><strong>${item.value}</strong><small>${item.label}</small></div></article>
`).join("");

byId("faqGrid").innerHTML = packageData.faqs.slice(0, 5).map(item => `
  <article class="faq-item">
    <button class="faq-question" type="button"><span>${item.question}</span><b>+</b></button>
    <div class="faq-answer">${item.answer}</div>
  </article>
`).join("");

byId("ctaTitle").textContent = `Ready to Book ${packageData.title}?`;
byId("ctaText").textContent = "Speak with our travel team for availability, pricing, visa guidance, and custom support.";
byId("ctaActions").innerHTML = [
  { label: "WhatsApp Enquiry", href: whatsappFor("final CTA") },
  { label: `Call Now\n${contact.phone}`, href: callHref },
  { label: "Email Enquiry", href: emailHref }
].map(item => `
  <a href="${item.href}">${textToLines(item.label)}</a>
`).join("");

const footerColumnTargets = {
  "Quick Links": "footerQuickColumn",
  Services: "footerServicesColumn"
};

footerColumns.forEach(column => {
  const target = byId(footerColumnTargets[column.title]);
  if (!target) return;
  target.innerHTML = `<h3 class="footer-heading">${column.title}</h3><ul class="footer-links">${column.links.map(link => `<li><a href="${siteHrefMap[link] || "/packages/"}">${link}</a></li>`).join("")}</ul>`;
});

document.querySelector(".footer-about p").textContent = "Flyo plans curated holidays across the world, from international packages to family trips, honeymoons, visa support, and custom itineraries.";
document.querySelector(".footer-bottom-package").innerHTML = `
  <span>Copyright 2026 Flyo Tours & Travels. All rights reserved.</span>
  <span><a href="#">Privacy Policy</a> &nbsp; | &nbsp; <a href="#">Terms & Conditions</a></span>
`;

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  location.href = whatsappFor("quick enquiry");
}));
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    item.classList.toggle("open");
    button.querySelector("b").textContent = item.classList.contains("open") ? "-" : "+";
  });
});

const menuToggle = document.querySelector(".package-menu-toggle");
const nav = document.querySelector(".package-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const revealDelay = index => `reveal-delay-${(index % 6) + 1}`;

function initScrollReveal() {
  const revealSelectors = [
    ".package-detail-copy",
    ".package-detail-side",
    ".section-title",
    ".highlight-card",
    ".inclusion-card",
    ".exclusion-panel",
    ".itinerary-day",
    ".gallery-card",
    ".options-panel",
    ".price-card",
    ".custom-option-card",
    ".trust-strip-item",
    ".review-intro",
    ".trust-point",
    ".package-testimonial",
    ".faq-item",
    ".bottom-cta",
    ".package-footer"
  ];
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      if (!element.className.match(/reveal-delay-/)) element.classList.add(revealDelay(index));
    });
  });
  document.querySelectorAll(".package-main-image, .highlight-image, .gallery-card").forEach(element => element.classList.add("reveal-image"));
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
