export const whatsappMessages = {
  package: packageName => `Hello Flyo, I'm interested in the ${packageName} package. Please share more details.`,
  flight: "Hello Flyo Tours, I want to enquire about flight tickets. Please assist me.",
  visa: "Hello Flyo Tours, I want to enquire about visa services. Please assist me.",
  general: "Hello Flyo, I would like to know more about your travel packages."
};

const whatsappOffices = [
  {
    label: "UAE WhatsApp",
    number: "+971 50 535 7300",
    urlNumber: "971505357300"
  },
  {
    label: "India WhatsApp",
    number: "+91 6361 25 4400",
    urlNumber: "916361254400"
  }
];

let activeMessage = whatsappMessages.general;
let lastFocusedElement = null;
let initialized = false;

const getModal = () => document.querySelector(".whatsapp-office-modal");

const officeIcon = () => `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20.1 11.7a8.1 8.1 0 0 1-12 7.1L4 20.1l1.4-3.9a8.1 8.1 0 1 1 14.7-4.5Z"/>
    <path d="M8.7 8.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.4.5c-.1.2-.2.3 0 .5.4.7 1 1.4 1.8 1.9.2.1.4.1.5-.1l.7-.7c.2-.2.4-.3.7-.1l1.6.8c.2.1.4.3.4.5 0 .6-.5 1.4-1.1 1.7-.7.3-2.2.1-4-1.1-1.9-1.3-3.2-3.1-3.5-4.3-.2-.9.1-1.7.4-2.1Z"/>
  </svg>
`;

const createModal = () => {
  const modal = document.createElement("div");
  modal.className = "whatsapp-office-modal";
  modal.innerHTML = `
    <div class="whatsapp-office-backdrop" data-whatsapp-close></div>
    <section class="whatsapp-office-dialog" role="dialog" aria-modal="true" aria-labelledby="whatsappOfficeTitle" aria-describedby="whatsappOfficeSubtitle">
      <button class="whatsapp-office-close" type="button" aria-label="Close WhatsApp office chooser" data-whatsapp-close>x</button>
      <span class="whatsapp-office-kicker">Flyo Tours</span>
      <h2 id="whatsappOfficeTitle">Choose WhatsApp Office</h2>
      <p id="whatsappOfficeSubtitle">Select the office you would like to contact.</p>
      <div class="whatsapp-office-options">
        ${whatsappOffices.map(office => `
          <button class="whatsapp-office-option" type="button" data-whatsapp-office="${office.urlNumber}">
            <span class="whatsapp-office-option-icon">${officeIcon()}</span>
            <span><strong>${office.label}</strong><small>${office.number}</small></span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.appendChild(modal);
  return modal;
};

const closeWhatsAppChooser = () => {
  const modal = getModal();
  if (!modal) return;
  modal.classList.remove("is-open");
  document.body.classList.remove("whatsapp-office-open");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus({ preventScroll: true });
  }
};

export const openWhatsAppChooser = (message = whatsappMessages.general) => {
  const modal = getModal() || createModal();
  activeMessage = message || whatsappMessages.general;
  lastFocusedElement = document.activeElement;
  modal.classList.add("is-open");
  document.body.classList.add("whatsapp-office-open");
  requestAnimationFrame(() => modal.querySelector(".whatsapp-office-close")?.focus({ preventScroll: true }));
};

const messageFromHref = href => {
  if (!href) return whatsappMessages.general;
  try {
    const parsed = new URL(href, window.location.href);
    const oldMessage = parsed.searchParams.get("text");
    return oldMessage || whatsappMessages.general;
  } catch {
    return whatsappMessages.general;
  }
};

const messageForTrigger = trigger => {
  const packageName = trigger.dataset.whatsappPackage;
  if (packageName) return whatsappMessages.package(packageName);
  if (trigger.dataset.whatsappMessage) return trigger.dataset.whatsappMessage;
  if (trigger.dataset.whatsappType === "flight") return whatsappMessages.flight;
  if (trigger.dataset.whatsappType === "visa") return whatsappMessages.visa;
  if (trigger.dataset.whatsappType === "general") return whatsappMessages.general;
  if (location.pathname.toLowerCase().includes("/flights")) return whatsappMessages.flight;
  if (location.pathname.toLowerCase().includes("/visa-services")) return whatsappMessages.visa;
  return messageFromHref(trigger.getAttribute("href"));
};

export const initWhatsAppChooser = () => {
  if (initialized) return;
  initialized = true;
  window.openWhatsAppChooser = openWhatsAppChooser;
  window.flyoWhatsAppMessages = whatsappMessages;

  document.addEventListener("click", event => {
    const closeTrigger = event.target.closest("[data-whatsapp-close]");
    if (closeTrigger) {
      event.preventDefault();
      closeWhatsAppChooser();
      return;
    }

    const officeButton = event.target.closest("[data-whatsapp-office]");
    if (officeButton) {
      event.preventDefault();
      const encodedMessage = encodeURIComponent(activeMessage);
      window.open(`https://wa.me/${officeButton.dataset.whatsappOffice}?text=${encodedMessage}`, "_blank");
      closeWhatsAppChooser();
      return;
    }

    const whatsappTrigger = event.target.closest("[data-whatsapp], [data-whatsapp-type], [data-whatsapp-message], [data-whatsapp-package], a[href*='wa.me']");
    if (!whatsappTrigger) return;
    event.preventDefault();
    openWhatsAppChooser(messageForTrigger(whatsappTrigger));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeWhatsAppChooser();
  });
};

initWhatsAppChooser();
