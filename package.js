import { contact, footerColumns, navLinks, packages } from "./data/packages.js";

const slug = decodeURIComponent(location.pathname.split("/").filter(Boolean).pop() || "kuala-lumpur-getaway");
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
const siteHrefMap = {
  Home: "/index.html",
  Flights: "/flights/",
  Holidays: "/packages/",
  "Visa Services": "/index.html#visa-services",
  Contact: "#contact",
  "Flight Booking Assistance": "/flights/",
  "Holiday Packages": "/packages/",
  "International Packages": "/packages/",
  "Visa Assistance": "/index.html#visa-services",
  "Custom Holidays": "/packages/",
  "Honeymoon Packages": "/packages/",
  "Family Holidays": "/packages/"
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

byId("packageNav").innerHTML = navLinks.map(link => {
  const hrefMap = {
    Home: "/index.html",
    Flights: "/flights/",
    Holidays: "/packages/",
    "Visa Services": "/index.html#visa-services",
    Contact: "#contact"
  };
  return `<a class="${link === "Holidays" ? "active" : ""}" href="${hrefMap[link] || "#"}">${link}</a>`;
}).join("") + `<a class="mobile-nav-cta" href="/packages/">Explore Packages</a>`;
byId("heroBadge").textContent = packageData.category || packageData.country;
byId("heroTitle").innerHTML = packageData.title;
byId("heroSubtitle").textContent = packageData.summary;
byId("heroFeatures").innerHTML = [
  { icon: "destination", label: "Destination", value: packageData.country },
  { icon: "duration", label: "Duration", value: packageData.duration },
  { icon: "route", label: "Route", value: packageData.route },
  { icon: "startingPrice", label: "Starting From", value: startingPriceText }
].map(item => `
  <div class="hero-feature">
    <span class="meta-icon">${iconAsset(item.icon)}</span>
    <small>${item.label}</small>
    <strong>${item.value}</strong>
  </div>
`).join("");
document.querySelector(".hero-cta").innerHTML = `${iconAsset("whatsapp")}<span>Enquire on WhatsApp</span>`;
document.querySelector(".hero-cta").href = whatsappFor("hero enquiry");
byId("heroTrust").innerHTML = ["Custom planning", "Visa support", "Hotels and transfers", "24/7 support"].join(" <span>|</span> ");

byId("bookingTitle").textContent = "Quick Trip Enquiry";
byId("bookingDate").placeholder = "Preferred travel date";
byId("bookingAdults").value = "2";
byId("bookingChildren").value = "0";
byId("bookingPackage").innerHTML = pricingOptions.map(item => `<option>${item.label || "Custom Quote"}</option>`).join("");
byId("bookingButton").textContent = "Send Enquiry";
byId("bookingNote").textContent = "Flyo will confirm availability, final rates, and customization options.";

document.querySelector(".highlights .section-title span").textContent = "Package Overview";
document.querySelector(".highlights .section-title h2").textContent = `Why Choose ${packageData.title}`;
document.querySelector(".highlights .section-title p").textContent = packageData.overview;
byId("highlightGrid").innerHTML = packageData.highlights.slice(0, 4).map((highlight, index) => `
  <article class="highlight-card">
    <div class="highlight-image" style="background-image:url('${packageData.cardImage}')"></div>
    <div class="highlight-body">
      <div class="number-title"><span>${String(index + 1).padStart(2, "0")}</span><h3>${highlight}</h3></div>
      <p>${index === 0 ? packageData.summary : "A carefully selected part of the itinerary, planned with smooth timing and guest comfort in mind."}</p>
    </div>
  </article>
`).join("");

const inclusionIcon = detail => {
  const value = detail.toLowerCase();
  if (value.includes("hotel") || value.includes("accommodation") || value.includes("stay")) return "HT";
  if (value.includes("transfer") || value.includes("pickup") || value.includes("drop")) return "TR";
  if (value.includes("meal") || value.includes("breakfast") || value.includes("dinner")) return "ML";
  if (value.includes("visa")) return "VS";
  if (value.includes("guide") || value.includes("tour")) return "TG";
  return "IN";
};

byId("inclusionGrid").innerHTML = packageData.inclusions.map(item => `
  <article class="inclusion-card">
    <span>${inclusionIcon(item)}</span>
    <strong>${item}</strong>
  </article>
`).join("");

byId("exclusionGrid").innerHTML = packageData.exclusions.map(item => `
  <div class="exclusion-item"><span>${checkIcon()}</span>${item}</div>
`).join("");

document.querySelector(".journey-section .section-title h2").textContent = "Day-by-Day Itinerary";
byId("timeline").innerHTML = packageData.itinerary.map(item => `
  <article class="timeline-step">
    <div class="timeline-icon">${item.day.replace(/\D/g, "") || ">"}</div>
    <div><h3>${item.title}</h3><p>${item.text}</p></div>
  </article>
`).join("");

document.querySelector(".gallery-heading h2").textContent = "Related Packages";
document.querySelector(".gallery-heading p").textContent = "More curated holidays Flyo can plan around your dates and travel style.";
document.querySelector(".gallery-button").href = "/index.html#packages";
document.querySelector(".gallery-button").textContent = "View All Packages";
byId("galleryGrid").innerHTML = relatedPackages.map(item => `
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

const infoSections = [
  { icon: "IN", title: "Inclusions", text: "What is planned as part of this package.", items: packageData.inclusions },
  { icon: "EX", title: "Exclusions", text: "Items that are usually not included in the starting rate.", items: packageData.exclusions },
  { icon: "NT", title: "Important Notes", text: "Useful details before confirming your booking.", items: packageData.notes },
  { icon: "VI", title: "Visa Support", text: "Flyo can guide documentation based on nationality and destination rules.", items: ["Document checklist guidance", "Appointment and application support where applicable", "Final visa approval remains subject to embassy or authority decision"] },
  { icon: "CU", title: "Customization", text: "Turn this package into your exact holiday.", items: ["Add extra nights", "Upgrade hotels", "Add honeymoon or family experiences", "Adjust private or SIC transfers"] }
];

const renderInfoPanel = index => {
  const info = infoSections[index];
  byId("infoPanel").innerHTML = `
    <div class="info-panel-head">
      <div class="info-panel-icon">${info.icon}</div>
      <div>
        <h3>${info.title}</h3>
        ${info.text ? `<p>${info.text}</p>` : ""}
      </div>
      <div class="desert-line-art" aria-hidden="true">
        <span class="sun"></span>
        <span class="cloud"></span>
        <span class="dune dune-one"></span>
        <span class="dune dune-two"></span>
        <span class="palm"></span>
      </div>
    </div>
    <div class="info-checklist">
      ${info.items.map(detail => `
        <div class="info-check-item">
          <span>${checkIcon()}</span>
          <div><strong>${detail}</strong></div>
        </div>
      `).join("")}
    </div>
    <a class="info-panel-link" href="${whatsappFor(info.title)}"><span>Ask</span>${info.title}</a>
  `;
  document.querySelectorAll(".info-tab").forEach((tab, tabIndex) => {
    tab.classList.toggle("active", tabIndex === index);
    tab.setAttribute("aria-selected", String(tabIndex === index));
  });
};

byId("infoTabs").innerHTML = infoSections.map((item, index) => `
  <button class="info-tab ${index === 0 ? "active" : ""}" type="button" role="tab" aria-selected="${index === 0}">
    <span>${item.icon}</span>
    <strong>${item.title}</strong>
  </button>
`).join("");
renderInfoPanel(0);
document.querySelectorAll(".info-tab").forEach((tab, index) => {
  tab.addEventListener("click", () => renderInfoPanel(index));
});

byId("faqGrid").innerHTML = packageData.faqs.map(item => `
  <article class="faq-item">
    <button class="faq-question" type="button"><span>${item.question}</span><b>+</b></button>
    <div class="faq-answer">${item.answer}</div>
  </article>
`).join("");

byId("infoTrust").innerHTML = ["Custom holidays", "Visa support", "Secure booking", "Clear inclusions", "WhatsApp support"].map(item => `<span><b>${checkIcon()}</b>${item}</span>`).join("");

byId("ctaTitle").textContent = `Ready to Book ${packageData.title}?`;
byId("ctaText").textContent = `Speak with Flyo for live availability, hotel options, visa support, and a custom quote for ${packageData.country}.`;
byId("ctaActions").innerHTML = [
  { label: "Enquire on WhatsApp", href: whatsappFor("final CTA") },
  { label: `Call Now\n${contact.phone}`, href: `tel:${contact.phone.replace(/\D/g, "")}` }
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
  target.innerHTML = `<h3>${column.title}</h3><ul>${column.links.map(link => `<li><a href="${siteHrefMap[link] || "/packages/"}">${link}</a></li>`).join("")}</ul>`;
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
