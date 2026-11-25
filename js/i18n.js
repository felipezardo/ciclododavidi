/* Idiomas: en | pt. Textos como pares [en, pt]. */
const KEY = 'tftl.lang';
const listeners = new Set();
let lang = 'en';

function detect() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'pt') return saved;
  } catch (e) { /* storage indisponível */ }
  const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
  for (const l of list) {
    const p = String(l).toLowerCase();
    if (p.startsWith('pt')) return 'pt';
    if (p.startsWith('en')) return 'en';
  }
  return 'en';
}

export function initLang() {
  lang = detect();
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  return lang;
}
export const getLang = () => lang;
export function setLang(l) {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ }
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
  listeners.forEach((fn) => fn(l));
}
export const onLang = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

/** t(['English','Português']) */
export function t(pair) {
  if (pair == null) return '';
  if (typeof pair === 'string') return pair;
  return pair[lang === 'pt' ? 1 : 0] ?? pair[0] ?? '';
}

/** Resolve {Suécia|EUA} conforme o cenário ('swe' | 'us'). */
export function fmt(text, setting = 'swe') {
  return String(text).replace(/\{([^{}|]+)\|([^{}]+)\}/g, (_, a, b) => (setting === 'us' ? b : a));
}
/** t + fmt */
export const tf = (pair, setting) => fmt(t(pair), setting);
