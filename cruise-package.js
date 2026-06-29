import { aroyaCruises } from "./data/aroya-cruises.js";
import { contact, footerColumns } from "./data/packages.js";

const slug = location.pathname.split("/").pop().replace(/\.html$/, "");
const cruise = aroyaCruises.find(item => item.slug === slug) || aroyaCruises[0];
const whatsappHref = `${contact.whatsapp}?text=${encodeURIComponent(cruise.whatsappMessage)}`;
const callHref = `tel:${contact.phone.replace(/\D/g, "")}`;
const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(cruise.title)}&body=${encodeURIComponent(cruise.whatsappMessage)}`;
const byId = id => document.getElementById(id);

const icon = name => ({
  duration: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
  price: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4z"/><path d="M8 11h.01M16 13h.01M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>`,
  departure: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>`,
  cruise: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16l-2 4H6l-2-4Z"/><path d="M7 17V7h10v10M9 7V3h6v4M8 11h2M14 11h2"/></svg>`
}[name] || "");

document.title = `${cruise.title} | Flyo Tours & Travels`;
document.documentElement.style.setProperty("--package-hero-image", `url("${cruise.image}")`);

byId("packageNav").innerHTML = [
  ["Home", "/index.html"],
  ["Flights", "/flights/"],
  ["Holidays", "/packages/"],
  ["Visa Services", "/index.html#visa-services"],
  ["Contact", "#contact"]
].map(([label, href]) => `<a href="${href}">${label}</a>`).join("") + `<a class="mobile-nav-cta" href="/index.html#holidays">Cruise Packages</a>`;

byId("heroBadge").textContent = "Aroya Cruises";
byId("heroTitle").textContent = cruise.title;
byId("heroSubtitle").textContent = cruise.overview;
byId("packageMainImage").style.backgroundImage = `url("${cruise.image}")`;
byId("heroFeatures").innerHTML = [
  { iconName: "duration", label: "Duration", value: cruise.duration },
  { iconName: "price", label: "Starting From", value: cruise.price },
  { iconName: "departure", label: "Departure", value: cruise.departure },
  { iconName: "cruise", label: "Provider", value: "Aroya Cruises" }
].map(item => `
  <div class="hero-feature">
    <span class="meta-icon">${icon(item.iconName)}</span>
    <small>${item.label}</small>
    <strong>${item.value}</strong>
  </div>
`).join("");
document.querySelector(".hero-cta").href = whatsappHref;
document.querySelector(".hero-cta").textContent = "WhatsApp Enquiry";
byId("heroTrust").innerHTML = "Cruise planning <span>|</span> Visa guidance <span>|</span> Optional shore tours";

byId("bookingTitle").textContent = "Cruise Enquiry";
byId("bookingDate").placeholder = "Preferred departure";
byId("bookingAdults").value = "2";
byId("bookingChildren").value = "0";
byId("bookingPackage").innerHTML = `<option>${cruise.title}</option>`;
byId("bookingButton").textContent = "Send Enquiry";
byId("bookingNote").textContent = "Flyo will confirm cabin options, final rates, visa guidance, and availability.";

byId("overviewText").textContent = cruise.overview;
byId("itineraryAccordion").innerHTML = cruise.itinerary.map((item, index) => `
  <article class="itinerary-day ${index === 0 ? "open" : ""}">
    <button class="itinerary-day-toggle" type="button" aria-expanded="${index === 0}">
      <span class="itinerary-day-badge">${item.day}</span>
      <span class="itinerary-day-heading">
        <span class="itinerary-day-title">${item.title}</span>
        <span class="itinerary-day-summary">${item.text}</span>
      </span>
      <span class="itinerary-chevron" aria-hidden="true">v</span>
    </button>
    <div class="itinerary-day-panel">
      <div class="itinerary-day-content">
        <ul class="itinerary-detail-list"><li>${item.text}</li></ul>
      </div>
    </div>
  </article>
`).join("");

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

const list = items => items.map(item => `<li>${item}</li>`).join("");
byId("timingsList").innerHTML = list(cruise.timings);
byId("inclusionGrid").innerHTML = cruise.inclusions.map(item => `<article class="inclusion-card"><span class="detail-item-icon">${icon("cruise")}</span><strong>${item}</strong></article>`).join("");
byId("exclusionGrid").innerHTML = cruise.exclusions.map(item => `<div class="exclusion-item"><span>x</span><strong>${item}</strong></div>`).join("");
byId("optionalToursNote").textContent = cruise.optionalToursNote;
byId("importantInfoList").innerHTML = list(cruise.importantInfo);
byId("visaNote").textContent = cruise.visaNote;
byId("ctaTitle").textContent = `Ready to Book ${cruise.title}?`;
byId("ctaText").textContent = "Speak with Flyo for live cabin availability, cruise pricing, visa guidance, and optional tour support.";
byId("ctaActions").innerHTML = `
  <a href="${whatsappHref}">WhatsApp Enquiry</a>
  <a href="${callHref}">Call Now<br>${contact.phone}</a>
  <a href="${emailHref}">Email Enquiry</a>
`;
document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = whatsappHref;
});

const siteHrefMap = { Home: "/index.html", Flights: "/flights/", Holidays: "/packages/", "Visa Services": "/index.html#visa-services", Contact: "#contact" };
footerColumns.forEach(column => {
  const target = byId(column.title === "Quick Links" ? "footerQuickColumn" : "footerServicesColumn");
  if (!target) return;
  target.innerHTML = `<h3>${column.title}</h3><ul>${column.links.map(link => `<li><a href="${siteHrefMap[link] || "/packages/"}">${link}</a></li>`).join("")}</ul>`;
});

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  location.href = whatsappHref;
}));

const menuToggle = document.querySelector(".package-menu-toggle");
const nav = document.querySelector(".package-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
