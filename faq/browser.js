import { faqs } from '/data/faqs.js';
import { searchFaqs } from './search.mjs';
export function mountFaq(container, onHelp) {
  container.classList.add('faq-browser');
  container.innerHTML=`<div class="faq-controls"><label>Search frequently asked questions<input type="search" placeholder="Try visas, flights or payments" maxlength="160"></label><label>Category<select><option value="">All questions</option></select></label></div><p class="faq-count" role="status" aria-live="polite"></p><div class="faq-results"></div><button type="button" class="faq-help">Still need help? Chat with our team</button>`;
  const input=container.querySelector('input'),select=container.querySelector('select');
  for(const category of [...new Set(faqs.map(f=>f.category))])select.add(new Option(category,category));
  function render(){
    const matches=searchFaqs(faqs,input.value,select.value);
    container.querySelector('.faq-count').textContent=`${matches.length} ${matches.length===1?'answer':'answers'} found`;
    const list=container.querySelector('.faq-results');list.replaceChildren();
    for(const item of matches){
      const details=document.createElement('details'),summary=document.createElement('summary'),answer=document.createElement('p');
      summary.textContent=item.question;answer.textContent=item.answer;
      details.append(summary,answer);list.append(details);
    }
    if(!matches.length){const p=document.createElement('p');p.className='faq-empty';p.textContent='No matching questions. Try another keyword or ask our travel team.';list.append(p);}
  }
  input.addEventListener('input',render);select.addEventListener('change',render);
  container.querySelector('.faq-help').onclick=onHelp;render();
}
