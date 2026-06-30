const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const defaultWhatsapp = "https://wa.me/971501234567";

const revealFooter = footer => {
  footer.classList.add("is-visible");
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

const ensureFloatingActions = () => {
  if (!document.querySelector(".flyo-floating-actions")) {
    const whatsappHref = document.querySelector('a[href*="wa.me"]')?.href || document.querySelector("[data-whatsapp]")?.href || defaultWhatsapp;
    const actions = document.createElement("div");
    actions.className = "flyo-floating-actions";
    actions.innerHTML = `
      <a class="flyo-whatsapp-float" href="${whatsappHref}" aria-label="Chat on WhatsApp">
        <span class="flyo-whatsapp-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M20.1 11.7a8.1 8.1 0 0 1-12 7.1L4 20.1l1.4-3.9a8.1 8.1 0 1 1 14.7-4.5Z"/>
            <path d="M8.7 8.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.4.5c-.1.2-.2.3 0 .5.4.7 1 1.4 1.8 1.9.2.1.4.1.5-.1l.7-.7c.2-.2.4-.3.7-.1l1.6.8c.2.1.4.3.4.5 0 .6-.5 1.4-1.1 1.7-.7.3-2.2.1-4-1.1-1.9-1.3-3.2-3.1-3.5-4.3-.2-.9.1-1.7.4-2.1Z"/>
          </svg>
        </span>
      </a>
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
  const footers = document.querySelectorAll(".footer, .package-footer");
  if (!footers.length) return;

  footers.forEach(footer => {
    footer.classList.add("footer-animate");
    markBlock(footer, ".footer-brand, .footer-about", 0);
    markBlock(footer, ".footer-quick-column", 80);
    markBlock(footer, ".footer-services-column", 130);
    markBlock(footer, ".footer-reachout", 180);
    markBlock(footer, ".footer-bottom, .footer-bottom-package", 230);
  });

  ensureFloatingActions();

  if (motionQuery.matches || !("IntersectionObserver" in window)) {
    footers.forEach(revealFooter);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealFooter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  footers.forEach(footer => {
    if (isFooterInView(footer)) {
      requestAnimationFrame(() => revealFooter(footer));
      return;
    }
    observer.observe(footer);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooterAnimations, { once: true });
} else {
  initFooterAnimations();
}
