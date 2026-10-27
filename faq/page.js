import { mountFaq } from './browser.js';
mountFaq(document.querySelector('#faq-browser'),()=>window.FlyoChat?.open({view:'team'}));
