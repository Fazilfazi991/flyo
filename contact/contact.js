import { openWhatsAppChooser, whatsappMessages } from "../whatsapp-chooser.js";
import "../navbar.js";

const contactForm = document.querySelector("[data-contact-form]");
const successMessage = document.querySelector("[data-contact-success]");
const whatsappButton = document.querySelector("[data-contact-whatsapp]");

contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  successMessage.hidden = false;
  contactForm.reset();
});

whatsappButton?.addEventListener("click", () => {
  openWhatsAppChooser(whatsappMessages.general);
});
