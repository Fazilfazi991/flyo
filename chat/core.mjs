export const categories = ['Tour package enquiry','International holiday','Domestic holiday','Honeymoon package','Family vacation','Group travel','Custom travel itinerary','Existing booking support','General enquiry'];
export function validateLead(lead) {
  if (!lead.name || lead.name.trim().length < 2) throw new Error('Please enter your name.');
  if (!/^\+?[0-9 ()-]{7,40}$/.test(lead.phone || '') || lead.phone.replace(/\D/g,'').length < 7 || lead.phone.replace(/\D/g,'').length > 15) throw new Error('Please enter a valid mobile number, including country code.');
  if (lead.email && !/^[^ @]+@[^ @]+\.[^ @]+$/.test(lead.email)) throw new Error('Please enter a valid email address.');
  if (!categories.includes(lead.category)) throw new Error('Please select an enquiry type.');
  if (!lead.message?.trim() || lead.message.trim().length > 4000) throw new Error('Please write a message of up to 4,000 characters.');
  if (lead.consent !== true) throw new Error('Please agree to contact details being stored for your enquiry.');
  return lead;
}
export function pageContext(location, title, supplied = {}) {
  const url = new URL(location.href);
  const campaign = {};
  for (const key of ['utm_source','utm_medium','utm_campaign']) {
    if (url.searchParams.has(key)) campaign[key] = url.searchParams.get(key).slice(0,150);
  }
  // Do not collect arbitrary query strings, referral URLs or form values.
  return { source_url: url.origin + url.pathname, page_title: title.slice(0,250), campaign,
    ...Object.fromEntries(['package_id','package_name','destination','package_url','category'].filter(k => typeof supplied[k] === 'string').map(k => [k,supplied[k].slice(0,k.endsWith('url') ? 1500 : 200)])) };
}
export function chronological(rows) {
  return [...new Map(rows.map(row => [row.id,row])).values()].sort((a,b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
}
