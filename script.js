import { contact, packages } from "./data/packages.js";

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

const holidayPackages = packages.slice(0, 6).map(item => ({
  name: item.title,
  text: item.summary,
  image: item.cardImage,
  href: `/packages/${item.slug}/`
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
if (travelStyleGrid) travelStyleGrid.innerHTML = holidayPackages.map((item, index) => `
  <article class="travel-style-card reveal ${revealDelay(index)}">
    <div class="travel-style-image reveal-image" style="background-image:url('${item.image}')" aria-hidden="true"></div>
    <div class="travel-style-body">
      <h3>${item.name}</h3>
      <p>${item.text}</p>
      <a href="${item.href}">View Package</a>
    </div>
  </article>
`).join("");

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
  link.setAttribute("href", contact.whatsapp);
});

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  location.href = form.classList.contains("flight-form") ? contact.whatsapp : "/packages/";
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
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dots button")];
const heroPrev = document.querySelector(".hero-prev");
const heroNext = document.querySelector(".hero-next");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroIndex = 0;
let heroTimer;
let touchStartX = 0;

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
  if (restart) startHeroAutoplay();
}

function startHeroAutoplay() {
  clearInterval(heroTimer);
  if (!reduceMotion.matches && heroSlides.length > 1) {
    heroTimer = setInterval(() => showHeroSlide(heroIndex + 1, false), 6500);
  }
}

if (hero && heroSlides.length) {
  heroPrev.addEventListener("click", () => showHeroSlide(heroIndex - 1));
  heroNext.addEventListener("click", () => showHeroSlide(heroIndex + 1));
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
