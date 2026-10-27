const normalize = value => String(value || '').normalize('NFKD').replace(/\p{Diacritic}/gu,'').toLowerCase();
export function searchFaqs(entries, query = '', category = '') {
  const words=normalize(query).trim().split(/\s+/).filter(Boolean);
  return entries.filter(item=>(!category || item.category===category) && words.every(word=>normalize(`${item.question} ${item.answer} ${item.category}`).includes(word)));
}
