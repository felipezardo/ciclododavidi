import { initLang, onLang, t } from './i18n.js';
import { h, initTheme, themeSwitch, langSwitch, icon, toast, clear, closePopover } from './ui.js';
import { renderHome } from './home.js';
import { renderSheet } from './sheet.js';
import { renderGuide } from './guide.js';

initLang();
initTheme();

const app = document.getElementById('app');
const view = h('main', { id: 'view', class: 'view', tabindex: '-1' });
let cleanup = null;

function header() {
  const link = (href, label, cls = '') => h('a', { class: 'nav-link ' + cls, href }, label);
  const nav = h('nav', { class: 'topnav', 'aria-label': 'Main' });
  const paintNav = () => {
    const r = currentRoute();
    nav.replaceChildren(
      h('a', { class: 'nav-link', href: '#/', 'aria-current': r.name === 'home' ? 'page' : null }, icon('home', 18), h('span', null, t(['Kids', 'Crianças']))),
      h('a', { class: 'nav-link', href: '#/guide', 'aria-current': r.name === 'guide' ? 'page' : null }, icon('book', 18), h('span', null, t(['Guide', 'Guia']))));
  };
  paintNav();
  window.addEventListener('hashchange', paintNav);
  onLang(paintNav);
  return h('header', { class: 'site-header' },
    h('a', { class: 'brand', href: '#/', 'aria-label': 'Tales from the Loop' }, h('img', { src: 'assets/img/emblem.png', alt: '' }), h('span', { class: 'brand-text' }, 'Tales from the Loop')),
    nav, h('div', { class: 'header-tools' }, langSwitch(), themeSwitch()));
}

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [a, b] = hash.split('/');
  if (a === 'sheet' && b) return { name: 'sheet', id: b };
  if (a === 'guide') return { name: 'guide', id: b || 'start' };
  if (a === 'new') return { name: 'new' };
  return { name: 'home' };
}
export const navigate = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

function route() {
  if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
  closePopover();
  document.body.classList.remove('roller-open', 'modal-open');
  clear(view);
  const r = currentRoute();
  document.body.dataset.route = r.name;
  if (r.name === 'sheet') cleanup = renderSheet(r.id, view, navigate);
  else if (r.name === 'guide') cleanup = renderGuide(view, r.id, navigate);
  else {
    cleanup = renderHome(view, navigate);
    if (r.name === 'new') { history.replaceState(null, '', '#/'); import('./wizard.js').then((w) => w.openWizard({ onDone: (id) => navigate('#/sheet/' + id) })); }
  }
  const titles = { home: ['Tales from the Loop', 'Contos do Loop'], guide: ['Guide', 'Guia'], sheet: ['Character sheet', 'Ficha de personagem'], new: ['Create a Kid', 'Criar uma criança'] };
  document.title = t(titles[r.name]) + (r.name === 'home' ? '' : ' - Tales from the Loop');
  if (!location.hash.includes('#/guide/') || r.name !== 'guide') window.scrollTo(0, 0);
}

app.append(header(), view, h('footer', { class: 'site-footer' }, h('img', { src: 'assets/img/emblem.png', alt: '' }), h('span', null, t(['Private fan tool for Tales from the Loop.', 'Ferramenta de fãs, de uso privado, para Contos do Loop.']))));
window.addEventListener('hashchange', route);
onLang(() => { route(); document.querySelector('.site-footer span').textContent = t(['Private fan tool for Tales from the Loop.', 'Ferramenta de fãs, de uso privado, para Contos do Loop.']); document.querySelector('.skip-link').textContent = t(['Skip to content', 'Pular para o conteúdo']); });
window.addEventListener('tftl:storage-full', () => toast(t(['Storage is full. Export your Kids to keep a backup.', 'O armazenamento está cheio. Exporte suas crianças para guardar um backup.']), 6000));
document.querySelector('.skip-link').textContent = t(['Skip to content', 'Pular para o conteúdo']);
route();
