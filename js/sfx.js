/*
  Sons gerados por Web Audio (sem arquivos de áudio) e vibração leve.
  O contexto só é criado após o primeiro toque do usuário (exigência dos navegadores).
*/
const KEY = 'tftl.sound';
const listeners = new Set();
let ctx = null, master = null, noise = null;
let on = true;
try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) { /* ignore */ }

function ac() {
  if (!on) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 0.25);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

const rnd = (a, b) => a + Math.random() * (b - a);

function env(g, t, peak, attack, decay) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}
function tone(type, f0, f1, t, dur, peak) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g, t, peak, 0.004, dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function burst(t, freq, q, dur, peak, delay = 0) {
  const s = ctx.createBufferSource(); s.buffer = noise;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); env(g, t + delay, peak, 0.002, dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t + delay, rnd(0, 0.1), dur + 0.05);
}

export const sfx = {
  isOn: () => on,
  setOn(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    listeners.forEach((fn) => fn(on));
    if (on) { sfx.toggle(true); }
  },
  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  vibrate(ms) { if (on && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* ignore */ } } },
  unlock() { ac(); },

  /* clique de interface: um tique curto e seco */
  click() {
    const c = ac(); if (!c) return; const t = c.currentTime;
    tone('triangle', rnd(820, 920), 380, t, 0.04, 0.12);
    burst(t, 3800, 2, 0.02, 0.06);
  },
  toggle(state) {
    const c = ac(); if (!c) return; const t = c.currentTime;
    tone('triangle', state ? 520 : 420, state ? 780 : 300, t, 0.07, 0.14);
    if (state) tone('sine', 1040, 1040, t + 0.045, 0.06, 0.05);
  },
  step() { const c = ac(); if (!c) return; tone('square', rnd(500, 560), 420, c.currentTime, 0.025, 0.04); },

  /* um dado batendo na mesa */
  clack(vel = 1) {
    const c = ac(); if (!c) return; const t = c.currentTime;
    burst(t, rnd(1700, 3300), rnd(0.9, 1.6), 0.05 * vel + 0.02, 0.5 * vel);
    burst(t, rnd(500, 900), 1.1, 0.07, 0.28 * vel);
    tone('sine', rnd(170, 260), 90, t, 0.06, 0.26 * vel);
  },
  /* chacoalhar dos dados no ar, cada vez mais espaçado, como quicando */
  rattle(ms = 1100, count = 4) {
    const c = ac(); if (!c) return; const t = c.currentTime;
    const n = Math.min(16, Math.round(ms / 85) + count);
    let at = 0;
    for (let i = 0; i < n; i++) {
      const k = i / n, vel = 0.9 - k * 0.55;
      const when = at; at += 0.045 + k * 0.1 + rnd(0, 0.035);
      burst(t, rnd(1500, 3600), rnd(0.8, 1.7), 0.035, 0.3 * vel + 0.05, when);
      if (i % 2 === 0) tone('sine', rnd(180, 300), 100, t + when, 0.04, 0.12 * vel);
      if (at * 1000 > ms) break;
    }
  },
  /* resultados */
  success(extra = 0) {
    const c = ac(); if (!c) return; const t = c.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => tone('triangle', f, f, t + i * 0.075, 0.28, 0.2));
    if (extra > 0) [1046.5, 1318.5].forEach((f, i) => tone('sine', f, f, t + 0.24 + i * 0.07, 0.35, 0.12));
  },
  six() {
    const c = ac(); if (!c) return; const t = c.currentTime;
    tone('sine', 1318.5, 1318.5, t, 0.5, 0.1); tone('sine', 1976, 1976, t + 0.03, 0.4, 0.06);
  },
  fail() {
    const c = ac(); if (!c) return; const t = c.currentTime;
    tone('sawtooth', 220, 110, t, 0.28, 0.1); tone('sine', 150, 70, t, 0.34, 0.25);
    burst(t, 400, 0.8, 0.12, 0.12);
  },
  thump() { const c = ac(); if (!c) return; const t = c.currentTime; tone('sine', 120, 50, t, 0.22, 0.4); burst(t, 250, 0.8, 0.09, 0.2); },
  luck() { const c = ac(); if (!c) return; const t = c.currentTime; [1174.7, 1568, 2093].forEach((f, i) => tone('sine', f, f, t + i * 0.06, 0.3, 0.09)); },
  heart() { const c = ac(); if (!c) return; const t = c.currentTime; tone('sine', 196, 196, t, 0.18, 0.28); tone('sine', 196, 196, t + 0.16, 0.26, 0.24); tone('triangle', 392, 392, t + 0.16, 0.3, 0.08); },
  heal() { const c = ac(); if (!c) return; const t = c.currentTime; [392, 523.25, 659.25, 783.99].forEach((f, i) => tone('sine', f, f, t + i * 0.09, 0.4, 0.11)); },
  open() { const c = ac(); if (!c) return; const t = c.currentTime; tone('triangle', 300, 600, t, 0.12, 0.1); burst(t, 2200, 1, 0.08, 0.05); },
  close() { const c = ac(); if (!c) return; const t = c.currentTime; tone('triangle', 520, 260, t, 0.1, 0.09); }
};

/* Feedback global: som + vibração em qualquer botão, caixa e controle */
const PRESSABLE = 'button, a.btn, .btn, .chip, .choice, .seg button, .step-btn, .icon-btn, .nav-link, .flag-btn, summary, [role="checkbox"], select';
export function initFeedback() {
  document.addEventListener('pointerdown', (e) => {
    sfx.unlock();
    const el = e.target.closest && e.target.closest(PRESSABLE);
    if (!el || el.disabled || el.matches('.roll-btn, .no-sfx')) return;
    if (el.matches('.step-btn')) { sfx.step(); sfx.vibrate(5); return; }
    sfx.click(); sfx.vibrate(6);
  }, { capture: true, passive: true });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el && el.matches && el.matches('input.checkbox')) { sfx.toggle(el.checked); sfx.vibrate(el.checked ? 10 : 5); }
  }, true);
}
