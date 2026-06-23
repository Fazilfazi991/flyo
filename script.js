const destinations = [
  { name: "Dubai", region: "UAE", layout: "dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=88" },
  { name: "Abu Dhabi", region: "UAE", layout: "abu-dhabi", image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=900&q=88" },
  { name: "Ras Al Khaimah", region: "UAE", layout: "rak", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=88" },
  { name: "Munnar", region: "Kerala", layout: "munnar", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=88" },
  { name: "Alleppey", region: "Kerala", layout: "alleppey", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=88" },
  { name: "Wayanad", region: "Kerala", layout: "wayanad", image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=88" }
];

const features = [
  { icon: "♙", title: "Custom Itineraries", text: "Tailor-made plans designed around your style & budget." },
  { icon: "▣", title: "Visa Assistance", text: "Hassle-free visa support for UAE & worldwide." },
  { icon: "♕", title: "Luxury Stays", text: "Handpicked 4 & 5 star stays for a premium experience." },
  { icon: "⌖", title: "Local Expertise", text: "Deep knowledge of UAE & Kerala for authentic journeys." },
  { icon: "▱", title: "Seamless Transfers", text: "Comfortable private transfers & smooth on-ground support." }
];

const experiences = [
  { name: "Desert Safari", text: "Thrilling adventures in the golden sands", icon: "☀", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85" },
  { name: "City Breaks", text: "Explore iconic landmarks & culture", icon: "♜", image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=85" },
  { name: "Honeymoons", text: "Romantic getaways made unforgettable", icon: "♡", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85" },
  { name: "Family Holidays", text: "Fun-filled vacations for the whole family", icon: "♧", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85" },
  { name: "Backwater Escapes", text: "Relax & unwind in Kerala's serene backwaters", icon: "♨", image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85" }
];

const testimonials = [
  { name: "Rahul & Priya", location: "Mumbai, India", initials: "RP", review: "Our Dubai trip was absolutely perfect! Flyo took care of everything — from visas to luxury stays. Highly recommended!" },
  { name: "Ananya Nair", location: "Kochi, India", initials: "AN", review: "The Kerala backwater experience was magical. Excellent service and great attention to detail." },
  { name: "Arun Joseph", location: "Dubai, UAE", initials: "AJ", review: "Professional, responsive and trustworthy. Our family holiday to UAE was smooth and memorable." }
];

document.querySelector("#destinationGrid").innerHTML = `
  ${destinations.map(item => `
    <article class="destination-card destination-card-${item.layout}" style="--destination-image:url('${item.image}')">
      <div class="destination-image" aria-hidden="true"></div>
      ${item.layout === "dubai" ? '<span class="destination-featured">☆ &nbsp; Featured</span>' : ""}
      <div class="destination-copy">
        <strong>${item.name}</strong>
        <small><span class="location-pin">⌖</span>${item.region}</small>
      </div>
      <a class="destination-arrow" href="#" aria-label="Explore ${item.name}">→</a>
    </article>`).join("")}`;

document.querySelector("#featureGrid").innerHTML = features.map(item => `
  <article class="feature-card"><span>${item.icon}</span><h3>${item.title}</h3><p>${item.text}</p></article>`).join("");

document.querySelector("#experienceGrid").innerHTML = experiences.map(item => `
  <article class="image-card experience-card" style="background-image:url('${item.image}')">
    <div class="experience-icon">${item.icon}</div>
    <div class="card-copy"><strong>${item.name}</strong><small>${item.text}</small></div>
  </article>`).join("");

document.querySelector("#testimonialGrid").innerHTML = testimonials.map(item => `
  <article class="testimonial-card">
    <div class="stars">★★★★★</div>
    <p>“${item.review}”</p>
    <div class="person"><span>${item.initials}</span><div><strong>${item.name}</strong><small>${item.location}</small></div></div>
  </article>`).join("");

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => event.preventDefault()));

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
