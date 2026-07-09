import { initWhatsAppChooser, whatsappMessages } from "./whatsapp-chooser.js";

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealFooter = footer => {
  footer.classList.add("is-visible", "footer-visible", "visible");
  document.body.classList.add("footer-in-view");
};

const hideFooter = footer => {
  if (footer.dataset.footerRevealed === "true") return;
  footer.classList.remove("is-visible", "footer-visible", "visible");
  document.body.classList.remove("footer-in-view");
};

const isFooterInView = footer => {
  const rect = footer.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

const markBlock = (footer, selector, delay) => {
  const block = footer.querySelector(selector);
  if (!block) return;
  block.classList.add("footer-reveal-block");
  block.style.setProperty("--footer-delay", `${delay}ms`);
};

const footerIcons = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.6 3.2 3.4 5 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.8c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1l-2.2 2.2Z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>'
};

const socialIcons = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.1h2.1V4.7c-.4-.1-1.7-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.4v3H4.7v3.8H8v7.1h4v-7.1h3.3l.5-3.8H12v-2.6c0-1.1.3-2.2 2.2-2.2Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.3" y="4.3" width="15.4" height="15.4" rx="4.2"/><circle cx="12" cy="12" r="3.5"/><circle cx="16.5" cy="7.5" r="1"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 11.7a8.1 8.1 0 0 1-12 7.1L4 20.1l1.4-3.9a8.1 8.1 0 1 1 14.7-4.5Z"/><path d="M8.7 8.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.4.5c-.1.2-.2.3 0 .5.4.7 1 1.4 1.8 1.9.2.1.4.1.5-.1l.7-.7c.2-.2.4-.3.7-.1l1.6.8c.2.1.4.3.4.5 0 .6-.5 1.4-1.1 1.7-.7.3-2.2.1-4-1.1-1.9-1.3-3.2-3.1-3.5-4.3-.2-.9.1-1.7.4-2.1Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.2a3 3 0 0 0-2.1-2.1C17 5.6 12 5.6 12 5.6s-5 0-6.9.5A3 3 0 0 0 3 8.2a31.2 31.2 0 0 0 0 7.6 3 3 0 0 0 2.1 2.1c1.9.5 6.9.5 6.9.5s5 0 6.9-.5a3 3 0 0 0 2.1-2.1 31.2 31.2 0 0 0 0-7.6Z"/><path d="m10.2 15.1 5-3.1-5-3.1v6.2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 9.5H3.4v11.1h3.4V9.5ZM5.1 4.1a2 2 0 1 0 0 4.1 2 2 0 0 0 0-4.1ZM20.6 14.4c0-3.3-1.8-5.2-4.4-5.2-1.9 0-2.8 1.1-3.3 1.9V9.5H9.5v11.1h3.4v-5.9c0-1.5.8-2.6 2.2-2.6 1.3 0 2 1 2 2.6v5.9h3.5v-6.2Z"/></svg>'
};

const socialIconFor = link => {
  const label = `${link.getAttribute("aria-label") || ""} ${link.textContent || ""}`.toLowerCase();
  if (label.includes("facebook") || label.trim() === "f") return socialIcons.facebook;
  if (label.includes("instagram") || label.includes("ig")) return socialIcons.instagram;
  if (label.includes("whatsapp") || label.includes("wa")) return socialIcons.whatsapp;
  if (label.includes("youtube") || label.includes("yt")) return socialIcons.youtube;
  if (label.includes("linkedin") || label.includes("in")) return socialIcons.linkedin;
  return "";
};

const enhanceFooterSocials = footer => {
  footer.querySelectorAll(".footer-social-link, .footer-socials a, .socials a").forEach(link => {
    if (link.dataset.socialIconReady === "true") return;
    const icon = socialIconFor(link);
    if (!icon) return;
    link.dataset.socialIconReady = "true";
    link.innerHTML = icon;
  });
};

const footerOffices = [
  {
    title: "UAE Office",
    subtitle: "Cooperative Office",
    rows: [
      { icon: "phone", label: "Phone", text: "04 396 4626", href: "tel:043964626" },
      { icon: "email", label: "Email", text: "info.dubai@flyotour.com", href: "mailto:info.dubai@flyotour.com" },
      { icon: "location", label: "Location", text: "Deira, Dubai" },
    ]
  },
  {
    title: "India Office",
    rows: [
      { icon: "phone", label: "Phone", text: "+91 6361 25 4400", href: "tel:+916361254400" },
      { icon: "email", label: "Email", text: "info.india@flyotour.com", href: "mailto:info.india@flyotour.com" },
      { icon: "location", label: "Location", text: "Karnataka, India" }
    ]
  }
];

const enhanceFooterContact = footer => {
  const target = footer.querySelector(".footer-reachout");
  if (!target || target.dataset.officeContactReady === "true") return;
  target.dataset.officeContactReady = "true";
  target.innerHTML = `
    <h3>Reach Out To Us</h3>
    <div class="footer-office-grid">
      ${footerOffices.map(office => `
        <article class="footer-office-card">
          <div class="footer-office-head">
            <h4>${office.title}</h4>
            ${office.subtitle ? `<span>${office.subtitle}</span>` : ""}
          </div>
          <ul>
            ${office.rows.map(row => {
              const content = `<span class="footer-office-icon">${footerIcons[row.icon]}</span><span><small>${row.label}</small><strong>${row.text}</strong></span>`;
              return `<li>${row.href ? `<a href="${row.href}">${content}</a>` : `<span>${content}</span>`}</li>`;
            }).join("")}
          </ul>
        </article>
      `).join("")}
    </div>
  `;
};

const ensureFloatingActions = () => {
  if (!document.querySelector(".flyo-floating-actions")) {
    const actions = document.createElement("div");
    actions.className = "flyo-floating-actions";
    actions.innerHTML = `
      <button class="flyo-whatsapp-float" type="button" aria-label="Chat on WhatsApp" data-whatsapp-message="${whatsappMessages.general}">
        <span class="flyo-whatsapp-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M20.1 11.7a8.1 8.1 0 0 1-12 7.1L4 20.1l1.4-3.9a8.1 8.1 0 1 1 14.7-4.5Z"/>
            <path d="M8.7 8.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.4.5c-.1.2-.2.3 0 .5.4.7 1 1.4 1.8 1.9.2.1.4.1.5-.1l.7-.7c.2-.2.4-.3.7-.1l1.6.8c.2.1.4.3.4.5 0 .6-.5 1.4-1.1 1.7-.7.3-2.2.1-4-1.1-1.9-1.3-3.2-3.1-3.5-4.3-.2-.9.1-1.7.4-2.1Z"/>
          </svg>
        </span>
      </button>
      <button class="flyo-back-top" type="button" aria-label="Back to top">↑</button>
    `;
    document.body.appendChild(actions);
  }

  const topButton = document.querySelector(".flyo-back-top");
  topButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: motionQuery.matches ? "auto" : "smooth" });
  }, { once: false });
};

const initFooterAnimations = () => {
  initWhatsAppChooser();
  const footers = document.querySelectorAll(".footer, .package-footer");
  if (!footers.length) return;

  footers.forEach(footer => {
    enhanceFooterSocials(footer);
    enhanceFooterContact(footer);
    footer.classList.add("footer-animate", "reveal-footer");
    footer.querySelectorAll(".footer-brand, .footer-about, .footer-quick-column, .footer-services-column, .footer-reachout, .footer-bottom, .footer-bottom-package").forEach(item => {
      item.classList.add("footer-reveal-item", "footer-animate-item");
    });
    footer.querySelectorAll(".footer-contact-item, .footer-office-card").forEach(item => {
      item.classList.add("footer-reveal-contact");
    });
    markBlock(footer, ".footer-brand, .footer-about", 100);
    markBlock(footer, ".footer-quick-column", 220);
    markBlock(footer, ".footer-services-column", 340);
    markBlock(footer, ".footer-reachout", 460);
    markBlock(footer, ".footer-bottom, .footer-bottom-package", 580);
  });

  ensureFloatingActions();

  if (motionQuery.matches || !("IntersectionObserver" in window)) {
    footers.forEach(revealFooter);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealFooter(entry.target);
        entry.target.dataset.footerRevealed = "true";
        observer.unobserve(entry.target);
        return;
      }
      hideFooter(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  footers.forEach(footer => {
    if (isFooterInView(footer)) {
      requestAnimationFrame(() => revealFooter(footer));
    }
    observer.observe(footer);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooterAnimations, { once: true });
} else {
  initFooterAnimations();
}
