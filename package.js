import { footerColumns, navLinks, packages } from "./data/packages.js";

const slug = decodeURIComponent(location.pathname.split("/").filter(Boolean).pop() || "dubai-desert-safari");
const packageData = packages.find(item => item.slug === slug);

if (!packageData) {
  document.body.innerHTML = `
    <main class="not-found">
      <h1>Package not found</h1>
      <p>We could not find a package for <strong>${slug}</strong>.</p>
      <a href="../index.html">Back to Flyo Home</a>
    </main>
  `;
  throw new Error(`Package not found: ${slug}`);
}

const byId = id => document.getElementById(id);
const textToLines = text => text.split("\n").join("<br>");
const stars = count => "★".repeat(count);

document.title = `${packageData.title} | Flyo Tours & Travels`;
document.documentElement.style.setProperty("--package-hero-image", `url("${packageData.heroImage}")`);

byId("packageNav").innerHTML = navLinks.map(link => {
  const hrefMap = {
    Home: "../index.html",
    Destinations: "../index.html#destinations",
    Experiences: "#experiences",
    Packages: "#packages",
    "About Us": "../index.html#why-flyo",
    "Contact Us": "#contact"
  };
  return `<a href="${hrefMap[link] || "#"}">${link}</a>`;
}).join("");

byId("navPhone").textContent = `☎ ${packageData.phone}`;
byId("navPhone").href = `tel:${packageData.phone.replace(/\D/g, "")}`;
byId("heroBadge").textContent = `★ ${packageData.eyebrow}`;
byId("heroTitle").innerHTML = packageData.title.replace(" ", "<br>");
byId("heroSubtitle").textContent = packageData.subtitle;
byId("heroFeatures").innerHTML = packageData.heroFeatures.map(item => `
  <div class="hero-feature"><span>${item.icon}</span><strong>${item.title}</strong></div>
`).join("");
byId("heroTrust").innerHTML = packageData.trustLine.join(" <span>•</span> ");

byId("bookingTitle").textContent = packageData.booking.title;
byId("bookingDate").placeholder = `▣  ${packageData.booking.datePlaceholder}`;
byId("bookingAdults").value = packageData.booking.defaultAdults;
byId("bookingChildren").value = packageData.booking.defaultChildren;
byId("bookingPackage").innerHTML = packageData.options.map(item => `<option ${item.title === packageData.booking.defaultPackage ? "selected" : ""}>${item.title}</option>`).join("");
byId("bookingButton").textContent = packageData.booking.button;
byId("bookingNote").textContent = packageData.booking.note;

byId("highlightGrid").innerHTML = packageData.highlights.map(item => `
  <article class="highlight-card">
    <div class="highlight-image" style="background-image:url('${item.image}')"></div>
    <div class="highlight-body">
      <div class="number-title"><span>${item.number}</span><h3>${item.title}</h3></div>
      <p>${item.text}</p>
    </div>
  </article>
`).join("");

byId("timeline").innerHTML = packageData.timeline.map(item => `
  <article class="timeline-step">
    <div class="timeline-icon">${item.icon}</div>
    <div><h3>${item.title}</h3><p>${item.text}</p></div>
  </article>
`).join("");

byId("galleryGrid").innerHTML = packageData.gallery.map(item => `
  <article class="gallery-card" style="background-image:url('${item.image}')">
    <strong><span>${item.icon}</span>${item.title}</strong>
  </article>
`).join("");

byId("pricingGrid").innerHTML = packageData.options.map(item => `
  <article class="price-card ${item.featured ? "featured" : ""}">
    ${item.badge ? `<span class="popular-badge">★ ${item.badge}</span>` : ""}
    <div class="price-icon">${item.icon}</div>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <div class="price">${item.price} <small>${item.suffix}</small></div>
    <a href="#quick-book">View Details</a>
  </article>
`).join("");

byId("packageTrust").innerHTML = packageData.packageTrust.map(item => `<span><b>${item.icon}</b>${item.title}</span>`).join("");

byId("reviewBadge").textContent = `♥ ${packageData.reviewIntro.badge}`;
byId("reviewTitle").innerHTML = textToLines(packageData.reviewIntro.title);
byId("reviewText").textContent = packageData.reviewIntro.text;
byId("reviewButton").innerHTML = `${packageData.reviewIntro.button} <span>→</span>`;
byId("trustPoints").innerHTML = packageData.trustPoints.map(item => `
  <div class="trust-point"><span>${item.icon}</span><strong>${item.title}</strong></div>
`).join("");

byId("packageTestimonials").innerHTML = packageData.testimonials.map(item => `
  <article class="package-testimonial">
    <div class="quote-mark">“</div>
    <p>${item.quote}</p>
    <div class="review-person">
      <div class="avatar">${item.initials}</div>
      <div><strong>${item.name}</strong><small>${item.location}</small></div>
      <div class="stars">${stars(item.rating)}</div>
    </div>
  </article>
`).join("");

byId("statsStrip").innerHTML = packageData.stats.map(item => `
  <article class="stat-item"><span>${item.icon}</span><div><strong>${item.value}</strong><small>${item.label}</small></div></article>
`).join("");

byId("infoGrid").innerHTML = packageData.essentialInfo.map(item => `
  <article class="info-card">
    <div class="info-head"><span>${item.icon}</span><h3>${item.title}</h3></div>
    ${item.text ? `<p>${item.text}</p>` : ""}
    <ul>${item.items.map(detail => `<li>${detail}</li>`).join("")}</ul>
    ${item.link ? `<a href="#">${item.link}</a>` : ""}
  </article>
`).join("");

byId("faqGrid").innerHTML = packageData.faqs.map(item => `
  <article class="faq-item">
    <button class="faq-question" type="button"><span>${item.question}</span><b>+</b></button>
    <div class="faq-answer">${item.answer}</div>
  </article>
`).join("");

byId("infoTrust").innerHTML = [
  { icon: "☆", title: "5-Star Rated By Thousands" },
  { icon: "♧", title: "Trusted by 100K+ Travelers" },
  { icon: "◇", title: "Best Price Guarantee" },
  { icon: "☏", title: "24/7 Customer Support" },
  { icon: "▢", title: "Secure Booking No Hidden Charges" }
].map(item => `<span><b>${item.icon}</b>${item.title}</span>`).join("");

byId("ctaTitle").textContent = packageData.cta.title;
byId("ctaText").textContent = packageData.cta.text;
byId("ctaActions").innerHTML = packageData.cta.buttons.map(item => `
  <a href="${item.href}">${textToLines(item.label)}</a>
`).join("");

byId("footerColumns").innerHTML = footerColumns.map(column => `
  <div><h3>${column.title}</h3><ul>${column.links.map(link => `<li><a href="#">${link}</a></li>`).join("")}</ul></div>
`).join("");

document.querySelectorAll("form").forEach(form => form.addEventListener("submit", event => event.preventDefault()));
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    item.classList.toggle("open");
    button.querySelector("b").textContent = item.classList.contains("open") ? "−" : "+";
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
