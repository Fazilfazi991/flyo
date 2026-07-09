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

const SOCIAL_ICON_BASE = "/social_icons_svg_pack";

const socialIcons = {
  facebook: `${SOCIAL_ICON_BASE}/facebook-icon.svg`,
  instagram: `${SOCIAL_ICON_BASE}/instagram-icon.svg`,
  whatsapp: `${SOCIAL_ICON_BASE}/whatsapp-icon.svg`,
  youtube: `${SOCIAL_ICON_BASE}/youtube-icon.svg`,
  linkedin: `${SOCIAL_ICON_BASE}/linkedin-icon.svg`,
  tiktok: `${SOCIAL_ICON_BASE}/tiktok-icon.svg`
};

const socialProfiles = {
  facebook: "https://www.facebook.com/share/1Bc6e2EfjV/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/flyo_tours?igsh=MWJmNWJoYm1zZWV5Mg==",
  linkedin: "https://www.linkedin.com/company/flyo-tours-and-travels/",
  youtube: "https://www.youtube.com/@Flyotoursandtravels",
  tiktok: "https://www.tiktok.com/@flyotour?_r=1&_t=ZS-97th2D0gv4f"
};

const socialKeyFor = link => {
  const label = `${link.getAttribute("aria-label") || ""} ${link.textContent || ""}`.toLowerCase();
  if (label.includes("facebook") || label.trim() === "f") return "facebook";
  if (label.includes("instagram") || label.includes("ig")) return "instagram";
  if (label.includes("whatsapp") || label.includes("wa")) return "whatsapp";
  if (label.includes("youtube") || label.includes("yt")) return "youtube";
  if (label.includes("linkedin") || label.includes("in")) return "linkedin";
  if (label.includes("tiktok") || label.includes("tik tok") || label.includes("tt")) return "tiktok";
  return "";
};

const enhanceFooterSocials = footer => {
  const socialWrap = footer.querySelector(".footer-social, .footer-socials, .socials");
  if (socialWrap && !socialWrap.querySelector('[aria-label="TikTok"]')) {
    const tikTokLink = document.createElement("a");
    tikTokLink.className = "footer-social-link";
    tikTokLink.href = socialProfiles.tiktok;
    tikTokLink.setAttribute("aria-label", "TikTok");
    socialWrap.appendChild(tikTokLink);
  }

  footer.querySelectorAll(".footer-social-link, .footer-socials a, .socials a").forEach(link => {
    if (link.dataset.socialIconReady === "true") return;
    const socialKey = socialKeyFor(link);
    const icon = socialIcons[socialKey];
    if (!icon) return;
    if (socialProfiles[socialKey]) {
      link.href = socialProfiles[socialKey];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.dataset.socialIconReady = "true";
    link.innerHTML = `<img src="${icon}" alt="" aria-hidden="true" loading="lazy">`;
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
          <img src="${SOCIAL_ICON_BASE}/floating-whatsapp-icon.svg" alt="" loading="lazy">
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
