import { contact, packages } from "../data/packages.js";

const packageList = packages.filter(item => item.slug !== "dubai-desert-safari");
const resultCount = document.querySelector(".package-results-row > span");
if (resultCount) {
  resultCount.textContent = `Showing ${packageList.length} curated packages`;
}

const cardDetails = {
  "kuala-lumpur-getaway": {
    location: "Kuala Lumpur, Malaysia",
    duration: "3 Nights / 4 Days",
    tag: "City Break",
    price: "AED 899",
    highlights: ["KL Tower", "Genting Highlands", "Batu Caves", "City Break"]
  },
  "thai-wonders": {
    location: "Bangkok & Pattaya, Thailand",
    duration: "4 Nights / 5 Days",
    tag: "Beach",
    price: "AED 999",
    highlights: ["Coral Island", "Tiger Park", "Alcazar Show", "Bangkok Tour"]
  },
  "sri-lanka-highlights": {
    location: "Kandy, Nuwara Eliya, Colombo",
    duration: "3 Nights / 4 Days",
    tag: "Cultural",
    price: "AED 1,899",
    highlights: ["Pinnawala", "Kandy Temple", "Colombo Tour", "Nature"],
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=85"
  },
  "singapore-family-escape": {
    location: "Singapore",
    duration: "4 Nights / 5 Days",
    tag: "Family",
    price: "AED 2,999",
    highlights: ["Universal Studios", "Sentosa", "Gardens by the Bay", "Family Trip"]
  },
  "beaches-of-thailand": {
    location: "Krabi, Phi Phi, Phuket",
    duration: "6 Nights / 7 Days",
    tag: "Beach",
    price: "AED 1,875",
    highlights: ["Island Hopping", "James Bond Island", "Phuket City Tour", "Beach"]
  },
  "kenya-inspiring-safari": {
    location: "Lake Nakuru, Masai Mara",
    duration: "3 Nights / 4 Days",
    tag: "Safari",
    price: "AED 9,385",
    highlights: ["Private Safari", "Game Drives", "Full Board", "Wildlife"]
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

document.querySelector("#packageGrid").innerHTML = packageList.map((item, index) => {
  const details = cardDetails[item.slug] || {
    location: item.route || item.country,
    duration: item.duration,
    tag: item.category || item.tags[0] || "Holiday",
    price: item.price,
    highlights: item.highlights.slice(0, 3)
  };

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
          <strong>${details.price}</strong>
          <span>/person</span>
        </div>
      </div>
      <div class="package-action-row">
        <a class="package-view-link" href="/packages/${item.slug}/">${icon("bag")}View Package</a>
        <a class="package-enquire-link" href="${contact.whatsapp}?text=${encodeURIComponent(`Hi Flyo, I would like to enquire about ${item.title}.`)}">${icon("chat")}Enquire Now</a>
      </div>
    </div>
  </article>
`;}).join("");

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.setAttribute("href", contact.whatsapp);
});

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => {
  event.preventDefault();
  location.href = contact.whatsapp;
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

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
