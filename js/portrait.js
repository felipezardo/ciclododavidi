import { h, icon, openModal, clamp, toast } from './ui.js';
import { t } from './i18n.js';
import { TYPES } from './data-types.js';

export const artFor = (type) => `assets/kids/${type}.jpg`;

/** Cria o elemento de retrato; retorna { el, update(char) } */
export function portrait(char, { cls = '' } = {}) {
  const img = h('img', { alt: '', draggable: 'false', decoding: 'async' });
  const el = h('div', { class: 'portrait ' + cls }, img);
  function update(c) {
    const p = c.portrait || {};
    const custom = !!p.src;
    img.src = custom ? p.src : artFor(c.type);
    el.classList.toggle('is-art', !custom);
    img.style.transform = `translate(${p.x || 0}%, ${p.y || 0}%) scale(${p.zoom || 1})`;
    const typeName = (TYPES.find((x) => x.key === c.type) || {}).name;
    img.alt = (c.name ? c.name + ' - ' : '') + (typeName ? t(typeName) : '');
  }
  update(char);
  return { el, update };
}

function downscale(file, max = 900) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    im.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')); };
    im.src = url;
  });
}

/** Abre o editor. onSave({src,zoom,x,y}) */
export function openPortraitEditor(char, onSave) {
  const state = { src: char.portrait.src || null, zoom: char.portrait.zoom || 1, x: char.portrait.x || 0, y: char.portrait.y || 0 };
  const view = portrait({ ...char, portrait: state }, { cls: 'portrait-edit' });
  const frame = view.el;
  const paint = () => view.update({ ...char, portrait: state });

  const slider = h('input', { type: 'range', min: '0.4', max: '4', step: '0.01', value: String(state.zoom), 'aria-label': 'Zoom', oninput: (e) => { state.zoom = +e.target.value; paint(); } });
  const setZoom = (z) => { state.zoom = clamp(z, 0.4, 4); slider.value = state.zoom; paint(); };

  // arrastar + pinça
  const ptrs = new Map(); let startDist = 0, startZoom = 1;
  frame.addEventListener('pointerdown', (e) => { frame.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; startDist = Math.hypot(a.x - b.x, a.y - b.y); startZoom = state.zoom; } frame.classList.add('grabbing'); });
  frame.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    const prev = ptrs.get(e.pointerId); const cur = { x: e.clientX, y: e.clientY }; ptrs.set(e.pointerId, cur);
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; setZoom(startZoom * (Math.hypot(a.x - b.x, a.y - b.y) / (startDist || 1))); return; }
    const r = frame.getBoundingClientRect();
    state.x = clamp(state.x + ((cur.x - prev.x) / r.width) * 100, -200, 200);
    state.y = clamp(state.y + ((cur.y - prev.y) / r.height) * 100, -200, 200);
    paint();
  });
  const end = (e) => { ptrs.delete(e.pointerId); if (!ptrs.size) frame.classList.remove('grabbing'); };
  frame.addEventListener('pointerup', end); frame.addEventListener('pointercancel', end);
  frame.addEventListener('wheel', (e) => { e.preventDefault(); setZoom(state.zoom * (e.deltaY < 0 ? 1.08 : 0.92)); }, { passive: false });
  frame.addEventListener('keydown', (e) => {
    const s = e.shiftKey ? 5 : 1.5;
    const m = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
    if (m) { e.preventDefault(); state.x += m[0]; state.y += m[1]; paint(); }
    if (e.key === '+' || e.key === '=') setZoom(state.zoom * 1.08);
    if (e.key === '-') setZoom(state.zoom * 0.92);
  });
  frame.tabIndex = 0;
  frame.setAttribute('aria-label', t(['Portrait frame: drag to move, scroll or pinch to zoom', 'Moldura do retrato: arraste para mover, role ou use pinça para dar zoom']));

  const file = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { state.src = await downscale(f); state.zoom = 1; state.x = 0; state.y = 0; slider.value = '1'; paint(); } catch (err) { toast(t(['Could not read this image.', 'Não foi possível ler esta imagem.'])); }
    e.target.value = '';
  } });
  const url = h('input', { type: 'url', class: 'field', placeholder: 'https://...', 'aria-label': t(['Image link', 'Link da imagem']) });
  const applyUrl = () => { const v = url.value.trim(); if (!v) return; state.src = v; state.zoom = 1; state.x = 0; state.y = 0; slider.value = '1'; paint(); };

  const body = h('div', { class: 'portrait-editor' },
    h('div', { class: 'pe-stage' }, frame,
      h('p', { class: 'hint' }, t(['Drag to reposition. Scroll, pinch or use the slider to zoom.', 'Arraste para reposicionar. Role, use pinça ou o controle deslizante para dar zoom.']))),
    h('div', { class: 'pe-controls' },
      h('div', { class: 'zoom-row' },
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Zoom -', onclick: () => setZoom(state.zoom * 0.9) }, icon('zoomout', 20)),
        slider,
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Zoom +', onclick: () => setZoom(state.zoom * 1.1) }, icon('zoomin', 20))),
      h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, icon('upload', 18), t(['Upload image', 'Enviar imagem'])), file,
        h('button', { type: 'button', class: 'btn', onclick: () => { state.zoom = 1; state.x = 0; state.y = 0; slider.value = '1'; paint(); } }, icon('reset', 18), t(['Reset framing', 'Reiniciar enquadramento']))),
      h('label', { class: 'lbl' }, t(['Or paste an image link', 'Ou cole o link de uma imagem'])),
      h('div', { class: 'inline-field' }, url, h('button', { type: 'button', class: 'btn', onclick: applyUrl }, t(['Use link', 'Usar link']))),
      h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => { state.src = null; state.zoom = 1; state.x = 0; state.y = 0; slider.value = '1'; paint(); } }, icon('book', 18), t(['Use the book illustration', 'Usar a ilustração do livro'])))
  );

  const m = openModal({
    title: t(['Portrait', 'Retrato']), body, size: 'lg', className: 'modal-portrait',
    footer: [
      h('button', { type: 'button', class: 'btn', onclick: () => m.close() }, t(['Cancel', 'Cancelar'])),
      h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { onSave({ ...state }); m.close(); } }, t(['Save portrait', 'Salvar retrato']))
    ]
  });
  return m;
}
