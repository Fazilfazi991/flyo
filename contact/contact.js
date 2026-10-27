import { openWhatsAppChooser, whatsappMessages } from "../whatsapp-chooser.js";
import "../navbar.js";

const contactForm = document.querySelector("[data-contact-form]");
const successMessage = document.querySelector("[data-contact-success]");
const whatsappButton = document.querySelector("[data-contact-whatsapp]");

contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  const values=Object.fromEntries(new FormData(contactForm));
  if (window.FlyoChat) {
    window.FlyoChat.open({view:'team',name:values.name,phone:values.phone,email:values.email,
      destination:values.interest,message:[`Enquiry type: ${values.type}`,values.message].filter(Boolean).join('\n')});
    successMessage.textContent='Review your details and privacy consent in the support window, then send your enquiry.';
  } else {
    successMessage.textContent='Support is still loading. Please try again, or use the WhatsApp button below.';
  }
  successMessage.hidden = false;
});

whatsappButton?.addEventListener("click", () => {
  openWhatsAppChooser(whatsappMessages.general);
});
