import { contact, packages } from "../data/packages.js";

const packageList = packages.filter(item => item.slug !== "dubai-desert-safari");

const cardDetails = {
  "kuala-lumpur-getaway": {
    badge: "Best Seller",
    location: "Kuala Lumpur, Malaysia",
    duration: "3 Nights / 4 Days",
    tag: "City Break",
    price: "AED 899",
    highlights: ["KL Tower", "Genting Highlands", "Batu Caves"]
  },
  "thai-wonders": {
    badge: "Popular",
    location: "Bangkok & Pattaya, Thailand",
    duration: "4 Nights / 5 Days",
    tag: "Beach",
    price: "AED 999",
    highlights: ["Coral Island", "Tiger Park", "Alcazar Show"]
  },
  "sri-lanka-highlights": {
    badge: "New",
    location: "Kandy, Nuwara Eliya, Colombo",
    duration: "3 Nights / 4 Days",
    tag: "Cultural",
    price: "AED 1,899",
    highlights: ["Pinnawala", "Kandy Temple", "Colombo Tour"],
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=85"
  },
  "singapore-family-escape": {
    badge: "Family Favourite",
    location: "Singapore",
    duration: "4 Nights / 5 Days",
    tag: "Family",
    price: "AED 2,999",
    highlights: ["Universal Studios", "Sentosa", "Gardens by the Bay"]
  },
  "beaches-of-thailand": {
    badge: "Trending",
    location: "Krabi, Phi Phi, Phuket",
    duration: "6 Nights / 7 Days",
    tag: "Beach",
    price: "AED 1,875",
    highlights: ["Island Hopping", "James Bond Island", "Phuket City Tour"]
  },
  "kenya-inspiring-safari": {
    badge: "Premium",
    location: "Lake Nakuru, Masai Mara",
    duration: "3 Nights / 4 Days",
    tag: "Safari",
    price: "AED 9,385",
    highlights: ["Private Safari", "Game Drives", "Full Board"]
  }
};

document.querySelector("#packageGrid").innerHTML = packageList.map(item => {
  const details = cardDetails[item.slug] || {
    badge: item.tags[0] || "Featured",
    location: item.route || item.country,
    duration: item.duration,
    tag: item.category || item.tags[0] || "Holiday",
    price: item.price,
    highlights: item.highlights.slice(0, 3)
  };

  return `
  <article class="package-card">
    <a class="package-card-image" href="/packages/${item.slug}/" style="background-image:url('${details.image || item.cardImage}')" aria-label="View ${item.title}">
      <span class="package-badge">${details.badge}</span>
      <span class="wishlist-button" aria-hidden="true">&hearts;</span>
    </a>
    <div class="package-card-body">
      <h3>${item.title}</h3>
      <div class="package-card-meta">
        <span>Route: ${details.location}</span>
        <span>Duration: ${details.duration}</span>
      </div>
      <div class="package-highlight-row">
        ${details.highlights.slice(0, 3).map(highlight => `<span>${highlight}</span>`).join("")}
      </div>
      <div class="package-card-footer">
        <span class="package-category-chip">${details.tag}</span>
        <div class="package-price">
          <small>From</small>
          <strong>${details.price}</strong>
          <span>/person</span>
        </div>
      </div>
      <div class="package-action-row">
        <a class="package-view-link" href="/packages/${item.slug}/">View Package</a>
        <a class="package-enquire-link" href="${contact.whatsapp}?text=${encodeURIComponent(`Hi Flyo, I would like to enquire about ${item.title}.`)}">Enquire Now</a>
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

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
