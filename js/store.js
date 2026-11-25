import { SKILLS, luckFor } from './data-rules.js';
import { uid } from './ui.js';

const KEY = 'tftl.chars.v1';
const DRAFT = 'tftl.draft.v1';
const ROLLS = 'tftl.rolls.v1';
const listeners = new Set();

const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

export function blankChar() {
  const now = Date.now();
  return {
    v: 1, id: uid(), created: now, updated: now,
    name: '', type: 'bookworm', setting: 'swe', age: 12,
    attrs: { body: 1, tech: 1, heart: 1, mind: 1 },
    skills: Object.fromEntries(SKILLS.map((s) => [s.key, 0])),
    cond: { upset: false, scared: false, exhausted: false, injured: false, broken: false },
    luckSpent: 0, xp: 0,
    iconic: '', items: Array.from({ length: 5 }, () => ({ name: '', bonus: 0 })),
    problem: '', drive: '', pride: '', prideUsed: false, anchor: '',
    relKids: Array.from({ length: 4 }, () => ({ who: '', text: '' })),
    relNpcs: ['', ''],
    description: '', song: '', hideout: '', notes: '',
    portrait: { src: null, zoom: 1, x: 0, y: 0 }
  };
}

/** Garante que dados antigos/importados tenham todos os campos. */
export function normalize(c) {
  const b = blankChar();
  const out = { ...b, ...c };
  out.attrs = { ...b.attrs, ...(c.attrs || {}) };
  out.skills = { ...b.skills, ...(c.skills || {}) };
  out.cond = { ...b.cond, ...(c.cond || {}) };
  out.portrait = { ...b.portrait, ...(c.portrait || {}) };
  out.items = Array.from({ length: 5 }, (_, i) => ({ name: '', bonus: 0, ...((c.items || [])[i] || {}) }));
  out.relKids = Array.from({ length: 4 }, (_, i) => ({ who: '', text: '', ...((c.relKids || [])[i] || {}) }));
  out.relNpcs = Array.from({ length: 2 }, (_, i) => (c.relNpcs || [])[i] || '');
  out.id = c.id || b.id;
  return out;
}

let cache = null;
const all = () => (cache ??= read(KEY, []).map(normalize));
const emit = () => listeners.forEach((fn) => fn());
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export const listChars = () => [...all()].sort((a, b) => b.updated - a.updated);
export const getChar = (id) => all().find((c) => c.id === id) || null;

let timer = null;
function flush() { write(KEY, all()); }
export function saveChar(c, { silent = false } = {}) {
  c.updated = Date.now();
  const list = all();
  const i = list.findIndex((x) => x.id === c.id);
  if (i >= 0) list[i] = c; else list.push(c);
  clearTimeout(timer);
  timer = setTimeout(() => { if (!write(KEY, list)) window.dispatchEvent(new CustomEvent('tftl:storage-full')); }, 250);
  if (!silent) emit();
}
export function removeChar(id) {
  cache = all().filter((c) => c.id !== id);
  flush(); localStorage.removeItem(ROLLS + '.' + id); emit();
}
window.addEventListener('beforeunload', () => { if (cache) flush(); });

export function duplicateChar(id) {
  const c = getChar(id); if (!c) return null;
  const copy = normalize(JSON.parse(JSON.stringify(c)));
  copy.id = uid(); copy.created = copy.updated = Date.now();
  copy.name = (c.name || '') + ' (2)';
  all().push(copy); flush(); emit();
  return copy;
}

/* ---- Rascunho do assistente ---- */
export const getDraft = () => { const d = read(DRAFT, null); return d ? { step: d.step || 0, char: normalize(d.char), touched: d.touched || {} } : null; };
export const setDraft = (d) => write(DRAFT, d);
export const clearDraft = () => { try { localStorage.removeItem(DRAFT); } catch (e) { /* ignore */ } };

/* ---- Histórico de rolagens (por personagem) ---- */
export const getRolls = (id) => read(ROLLS + '.' + id, []);
export const setRolls = (id, list) => write(ROLLS + '.' + id, list.slice(0, 60));

/* ---- Derivados ---- */
export const luckMax = (c) => luckFor(c.age);
export const luckNow = (c) => Math.max(0, luckMax(c) - c.luckSpent);
export const mildCount = (c) => ['upset', 'scared', 'exhausted', 'injured'].filter((k) => c.cond[k]).length;
export const penalty = (c) => mildCount(c);
export const isBroken = (c) => !!c.cond.broken;

/* ---- Import / Export ---- */
export function exportJSON(chars) {
  const data = { app: 'tales-from-the-loop-sheet', version: 1, exported: new Date().toISOString(), characters: chars };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  const base = chars.length === 1 ? (chars[0].name || 'kid').toLowerCase().replace(/[^a-z0-9]+/gi, '-') : 'tales-from-the-loop-kids';
  a.href = URL.createObjectURL(blob); a.download = base + '.json';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
export async function importFile(file) {
  const txt = await file.text();
  const data = JSON.parse(txt);
  const list = Array.isArray(data) ? data : data.characters || (data.name !== undefined ? [data] : []);
  if (!list.length) throw new Error('empty');
  let n = 0;
  for (const raw of list) {
    const c = normalize(raw);
    if (getChar(c.id)) c.id = uid();
    c.updated = Date.now();
    all().push(c); n++;
  }
  flush(); emit();
  return n;
}
