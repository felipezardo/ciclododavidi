import { t, getLang, setLang, onLang } from './i18n.js';

/* ---------- DOM helper ---------- */
export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  append(el, kids);
  return el;
}
function append(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
}
export const clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/* ---------- Ícones (SVG inline, sem emojis) ---------- */
const P = {
  dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  print: '<path d="M7 9V3.5h10V9M7 17H4.5v-7h15v7H17M7 14h10v6.5H7z"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5.5-5 4 3.5 3-2.5 4 4"/>',
  up: '<path d="M12 19V6M6 11l6-6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
  book: '<path d="M4.5 5.5c2.5-1 5-1 7.5 1 2.5-2 5-2 7.5-1v13c-2.5-1-5-1-7.5 1-2.5-2-5-2-7.5-1z"/><path d="M12 6.5v13"/>',
  user: '<circle cx="12" cy="8.5" r="3.7"/><path d="M4.5 20c.6-4 3.7-6 7.5-6s6.9 2 7.5 6"/>',
  home: '<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/>',
  moon2: '<path d="M12 3v3M12 18v3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  dots: '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  shuffle: '<path d="M4 7h3.5c4 0 5 10 9 10H20M4 17h3.5c1.5 0 2.5-1.3 3.4-3M14 8c.8-.6 1.7-1 2.5-1H20M17.5 4L20 7l-2.5 3M17.5 14l2.5 3-2.5 3"/>',
  zoomin: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.5-4.5M11 8v6M8 11h6"/>',
  zoomout: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.5-4.5M8 11h6"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.5-5.6M4.5 4.5V9H9"/>',
  star: '<path d="M12 4l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.8 5.4-.7z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};
export function icon(name, size = 20, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
  if (cls) s.setAttribute('class', cls);
  s.innerHTML = P[name] || '';
  return s;
}

/* ---------- Bandeiras (SVG) ---------- */
export function flagBR(size = 28) {
  const w = size * 1.4;
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 28 20'); el.setAttribute('width', w); el.setAttribute('height', size);
  el.innerHTML = '<rect width="28" height="20" fill="#009C3B"/><path d="M14 2.2L25.2 10 14 17.8 2.8 10z" fill="#FFDF00"/><circle cx="14" cy="10" r="4.4" fill="#002776"/><path d="M9.7 9.1c2.9-.9 6.2-.2 8.7 1.6" stroke="#fff" stroke-width=".9" fill="none"/>';
  el.setAttribute('aria-hidden', 'true');
  return el;
}
export function flagUS(size = 28) {
  const w = size * 1.4;
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 28 20'); el.setAttribute('width', w); el.setAttribute('height', size);
  let stripes = '<rect width="28" height="20" fill="#fff"/>';
  for (let i = 0; i < 7; i++) stripes += `<rect y="${i * 3.077}" width="28" height="1.538" fill="#B22234"/>`;
  let stars = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) stars += `<circle cx="${1.8 + c * 2.1 + (r % 2) * 1}" cy="${1.6 + r * 2.3}" r=".5" fill="#fff"/>`;
  el.innerHTML = stripes + '<rect width="12.5" height="10.8" fill="#3C3B6E"/>' + stars;
  el.setAttribute('aria-hidden', 'true');
  return el;
}

/* ---------- Switches de idioma e tema ---------- */
export function langSwitch() {
  const wrap = h('div', { class: 'lang-switch', role: 'group', 'aria-label': 'Language / Idioma' });
  const mk = (code, flag, label) => {
    const b = h('button', { type: 'button', class: 'flag-btn', 'aria-label': label, title: label, 'aria-pressed': String(getLang() === code), onclick: () => setLang(code) }, flag);
    return b;
  };
  const br = mk('pt', flagBR(18), 'Português (Brasil)');
  const us = mk('en', flagUS(18), 'English (US)');
  wrap.append(br, us);
  const sync = () => { br.setAttribute('aria-pressed', String(getLang() === 'pt')); us.setAttribute('aria-pressed', String(getLang() === 'en')); };
  onLang(sync);
  return wrap;
}

const THEME_KEY = 'tftl.theme';
export function initTheme() {
  let th = null;
  try { th = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  if (th !== 'dark' && th !== 'light') th = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = th;
  return th;
}
export function themeSwitch() {
  const btn = h('button', { type: 'button', class: 'theme-btn' });
  const paint = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    clear(btn).append(icon(dark ? 'sun' : 'moon', 20));
    const label = dark ? t(['Switch to light mode', 'Mudar para o modo claro']) : t(['Switch to dark mode', 'Mudar para o modo escuro']);
    btn.setAttribute('aria-label', label); btn.title = label;
  };
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = next === 'dark' ? '#141211' : '#F7931E';
    paint();
  });
  onLang(paint); paint();
  return btn;
}

/* ---------- Toast ---------- */
let toastHost;
export function toast(msg, ms = 2600) {
  if (!toastHost) { toastHost = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' }); document.body.append(toastHost); }
  const el = h('div', { class: 'toast' }, msg);
  toastHost.append(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 250); }, ms);
}

/* ---------- Modais (pilha, foco preso, ESC) ---------- */
const stack = [];
export function openModal({ title, body, footer, size = 'md', className = '', onClose, closable = true, headerExtra }) {
  const prevFocus = document.activeElement;
  const backdrop = h('div', { class: 'modal-backdrop' });
  const titleId = 'm' + uid().slice(0, 6);
  const closeBtn = closable ? h('button', { type: 'button', class: 'icon-btn modal-close', 'aria-label': t(['Close', 'Fechar']), onclick: () => api.close() }, icon('close', 20)) : null;
  const head = h('header', { class: 'modal-head bar' }, h('h2', { id: titleId, class: 'modal-title' }, title), headerExtra || null, closeBtn);
  const bodyEl = h('div', { class: 'modal-body' }, body);
  const foot = footer ? h('footer', { class: 'modal-foot' }, footer) : null;
  const dlg = h('div', { class: `modal modal-${size} ${className}`, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId, tabindex: '-1' }, head, bodyEl, foot);
  backdrop.append(dlg);
  document.body.append(backdrop);
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => backdrop.classList.add('in'));

  const api = {
    el: dlg, body: bodyEl, footer: foot, head,
    close(result) {
      const i = stack.indexOf(api); if (i >= 0) stack.splice(i, 1);
      backdrop.classList.remove('in');
      document.removeEventListener('keydown', keydown, true);
      setTimeout(() => backdrop.remove(), 200);
      if (!stack.length) document.body.classList.remove('modal-open');
      if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) { /* ignore */ }
      if (onClose) onClose(result);
    }
  };
  function keydown(e) {
    if (stack[stack.length - 1] !== api) return;
    if (e.key === 'Escape' && closable) { e.stopPropagation(); api.close(); }
    if (e.key === 'Tab') {
      const f = [...dlg.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener('keydown', keydown, true);
  if (closable) backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) api.close(); });
  stack.push(api);
  setTimeout(() => { const af = dlg.querySelector('[autofocus]'); (af || dlg).focus(); }, 30);
  return api;
}

export function confirmDialog({ title, message, confirmLabel, danger = false }) {
  return new Promise((resolve) => {
    let done = false;
    const m = openModal({
      title, size: 'sm',
      body: h('p', { class: 'prose' }, message),
      footer: [
        h('button', { type: 'button', class: 'btn', onclick: () => m.close(false) }, t(['Cancel', 'Cancelar'])),
        h('button', { type: 'button', class: 'btn ' + (danger ? 'btn-danger' : 'btn-primary'), autofocus: true, onclick: () => { done = true; m.close(true); } }, confirmLabel || t(['Confirm', 'Confirmar']))
      ],
      onClose: (r) => resolve(done && r === true)
    });
  });
}

/* ---------- Botão "i" com popover ---------- */
let openPop = null;
export function closePopover() { if (openPop) { openPop.remove(); openPop = null; } }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopover(); });
document.addEventListener('mousedown', (e) => { if (openPop && !openPop.contains(e.target) && !e.target.closest('.info-btn')) closePopover(); });
window.addEventListener('scroll', closePopover, true);
window.addEventListener('resize', closePopover);

export function showPopover(anchor, title, content) {
  closePopover();
  const pop = h('div', { class: 'popover', role: 'tooltip' },
    title ? h('strong', { class: 'popover-title' }, title) : null,
    h('div', { class: 'popover-body' }, content));
  document.body.append(pop);
  const r = anchor.getBoundingClientRect();
  const pw = Math.min(320, window.innerWidth - 24);
  pop.style.width = pw + 'px';
  let left = clamp(r.left + r.width / 2 - pw / 2, 12, window.innerWidth - pw - 12);
  pop.style.left = left + 'px';
  const ph = pop.offsetHeight;
  let top = r.bottom + 10;
  if (top + ph > window.innerHeight - 12 && r.top - ph - 10 > 12) { top = r.top - ph - 10; pop.classList.add('above'); }
  pop.style.top = top + 'px';
  pop.style.setProperty('--arrow-x', clamp(r.left + r.width / 2 - left, 16, pw - 16) + 'px');
  requestAnimationFrame(() => pop.classList.add('in'));
  openPop = pop;
}

/** infoBtn(titlePair, contentPair|Node, glyph='i') */
export function infoBtn(title, content, glyph = 'i') {
  const label = t(['More information', 'Mais informações']) + (title ? ': ' + t(title) : '');
  const b = h('button', { type: 'button', class: 'info-btn', 'aria-label': label, 'aria-haspopup': 'true' }, glyph);
  const body = () => (content instanceof Node ? content.cloneNode(true) : typeof content === 'function' ? content() : h('p', null, t(content)));
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    if (openPop && b.dataset.open === '1') { closePopover(); b.dataset.open = ''; return; }
    showPopover(b, title ? t(title) : '', body());
    b.dataset.open = '1';
    setTimeout(() => { b.dataset.open = ''; }, 0);
  });
  return b;
}

/* ---------- Painéis de cabeçalho com textura (como a ficha) ---------- */
export const bar = (text, extra) => h('div', { class: 'bar' }, h('span', null, text), extra || null);

/* Número editável com botões −/+ */
export function stepper({ value, min = 0, max = 99, onChange, label, size = 'md' }) {
  const out = h('output', { class: 'stepper-val', 'aria-live': 'polite' }, String(value));
  const dec = h('button', { type: 'button', class: 'step-btn', 'aria-label': t(['Decrease', 'Diminuir']) + (label ? ' ' + label : ''), onclick: () => set(cur - 1) }, icon('minus', 16));
  const inc = h('button', { type: 'button', class: 'step-btn', 'aria-label': t(['Increase', 'Aumentar']) + (label ? ' ' + label : ''), onclick: () => set(cur + 1) }, icon('plus', 16));
  let cur = value;
  const root = h('div', { class: `stepper stepper-${size}` }, dec, out, inc);
  function paint() { out.textContent = String(cur); dec.disabled = cur <= api.min; inc.disabled = cur >= api.max; }
  function set(v) { v = clamp(v, api.min, api.max); if (v === cur) return; cur = v; paint(); onChange && onChange(cur); }
  const api = { el: root, min, max, set, get: () => cur, update(v, mn = api.min, mx = api.max) { cur = v; api.min = mn; api.max = mx; paint(); } };
  paint();
  return api;
}
