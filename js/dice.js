import { h, icon, clear, openModal, toast, infoBtn, clamp } from './ui.js';
import { t, tf, onLang } from './i18n.js';
import { ATTRS, SKILLS, SKILL_BY_KEY, CHANCE } from './data-rules.js';
import { saveChar, luckNow, penalty, isBroken, getRolls, setRolls } from './store.js';

/* ---------- RNG justo ---------- */
export function d6() {
  const a = new Uint32Array(1);
  do { crypto.getRandomValues(a); } while (a[0] >= 4294967292); // 4294967292 = 6 * 715827882
  return (a[0] % 6) + 1;
}
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Dado 3D (CSS) ---------- */
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
const FACE_ROT = { 1: [0, 0], 6: [0, 180], 2: [0, -90], 5: [0, 90], 3: [-90, 0], 4: [90, 0] };
const FACE_AT = { front: 1, back: 6, right: 2, left: 5, top: 3, bottom: 4 };

function face(n, side) {
  const f = h('div', { class: `face f-${side} v${n}` });
  const grid = h('div', { class: 'pips' });
  for (let i = 0; i < 9; i++) grid.append(h('i', { class: PIPS[n].includes(i) ? 'on' : '' }));
  f.append(grid);
  return f;
}
export function makeDie(value = 1) {
  const cube = h('div', { class: 'cube' }, Object.entries(FACE_AT).map(([side, n]) => face(n, side)));
  const el = h('div', { class: 'die', role: 'img', 'aria-label': String(value) }, h('div', { class: 'die-shadow' }), h('div', { class: 'die-body' }, cube));
  const api = {
    el, value,
    show(v) { // sem animação
      api.value = v; const [rx, ry] = FACE_ROT[v];
      cube.style.transition = 'none'; cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.classList.toggle('six', v === 6); el.setAttribute('aria-label', String(v));
    },
    roll(v, delay = 0) {
      api.value = v;
      el.classList.remove('six', 'landed'); el.setAttribute('aria-label', String(v));
      const [rx, ry] = FACE_ROT[v];
      if (reduceMotion()) { api.show(v); el.classList.add('landed'); return Promise.resolve(); }
      const sx = 360 * (2 + Math.floor(Math.random() * 2)) * (Math.random() < .5 ? 1 : -1);
      const sy = 360 * (2 + Math.floor(Math.random() * 2)) * (Math.random() < .5 ? 1 : -1);
      const dur = 900 + Math.random() * 500;
      cube.style.transition = 'none';
      cube.style.transform = `rotateX(${-sx / 2 + 30}deg) rotateY(${-sy / 2 - 40}deg)`;
      el.classList.add('tossing');
      el.style.setProperty('--toss', `${dur}ms`);
      return new Promise((res) => {
        setTimeout(() => {
          void cube.offsetWidth;
          cube.style.transition = `transform ${dur}ms cubic-bezier(.18,.7,.25,1)`;
          cube.style.transform = `rotateX(${rx + sx}deg) rotateY(${ry + sy}deg)`;
          setTimeout(() => { el.classList.remove('tossing'); el.classList.add('landed'); el.classList.toggle('six', v === 6); res(); }, dur + 40);
        }, delay);
      });
    }
  };
  api.show(value);
  return api;
}

/** mini dado estático para o histórico */
function miniDie(v, locked) {
  const g = h('span', { class: `mini-die${v === 6 ? ' six' : ''}${locked ? ' kept' : ''}`, 'aria-label': String(v) });
  const grid = h('span', { class: 'pips' });
  for (let i = 0; i < 9; i++) grid.append(h('i', { class: PIPS[v].includes(i) ? 'on' : '' }));
  g.append(grid); return g;
}

/* ---------- Painel de rolagens ---------- */
export function createRoller(getChar, { onChange } = {}) {
  const c0 = getChar();
  const st = {
    sel: { kind: 'attr', key: 'body' }, iconic: false, items: new Set(), help: false, extra: 0, need: 1,
    current: null, // {dice:[{v,die}], pushed, luck, pride, label}
    rolling: false, history: getRolls(c0.id)
  };
  const dicePool = (c) => {
    let n = 0; const parts = [];
    if (st.sel.kind === 'attr') { n += c.attrs[st.sel.key]; parts.push([attrName(st.sel.key), c.attrs[st.sel.key]]); }
    else if (st.sel.kind === 'skill') {
      const s = SKILL_BY_KEY[st.sel.key];
      n += c.attrs[s.attr]; parts.push([attrName(s.attr), c.attrs[s.attr]]);
      n += c.skills[s.key]; parts.push([t(s.name), c.skills[s.key]]);
    } else { n += st.extra; }
    if (st.iconic && c.iconic) { n += 2; parts.push([t(['Iconic Item', 'Item Icônico']), 2]); }
    st.items.forEach((i) => { const it = c.items[i]; if (it && it.name) { n += +it.bonus || 0; parts.push([it.name, +it.bonus || 0]); } });
    if (st.help) { n += 1; parts.push([t(['Help', 'Ajuda']), 1]); }
    if (st.sel.kind !== 'custom' && st.extra) { n += st.extra; parts.push([t(['Extra', 'Extra']), st.extra]); }
    const pen = penalty(c);
    if (pen) { n -= pen; parts.push([t(['Conditions', 'Condições']), -pen]); }
    return { n: clamp(n, 0, 30), parts };
  };
  const attrName = (k) => t(ATTRS.find((a) => a.key === k).name);

  /* ----- estrutura ----- */
  const root = h('aside', { class: 'roller', 'aria-label': t(['Dice roller', 'Rolagem de dados']) });
  const head = h('div', { class: 'roller-head bar' });
  const picker = h('div', { class: 'picker' });
  const mods = h('div', { class: 'mods' });
  const summary = h('div', { class: 'pool-summary' });
  const tray = h('div', { class: 'tray', 'aria-live': 'polite' });
  const verdict = h('div', { class: 'verdict' });
  const actions = h('div', { class: 'roll-actions' });
  const histHead = h('div', { class: 'hist-head' });
  const histList = h('ol', { class: 'hist-list' });
  root.append(head, h('div', { class: 'roller-scroll' }, picker, mods, summary, h('div', { class: 'tray-wrap' }, tray, verdict), actions, histHead, histList));

  /* ----- seleção ----- */
  function paintPicker() {
    const c = getChar(); clear(picker);
    const chip = (kind, key, label, val, cls = '') => h('button', { type: 'button', class: `chip ${cls}`, 'aria-pressed': String(st.sel.kind === kind && st.sel.key === key), onclick: () => { st.sel = { kind, key }; if (kind === 'custom') st.extra = Math.max(st.extra, 1); refresh(); } }, h('span', null, label), val != null ? h('b', null, String(val)) : null);
    ATTRS.forEach((a) => {
      const group = h('div', { class: 'pick-group' }, chip('attr', a.key, t(a.name), c.attrs[a.key], 'chip-attr'));
      SKILLS.filter((s) => s.attr === a.key).forEach((s) => group.append(chip('skill', s.key, t(s.name), c.attrs[a.key] + c.skills[s.key])));
      picker.append(group);
    });
    picker.append(h('div', { class: 'pick-group' }, chip('custom', 'free', t(['Free roll', 'Rolagem livre']), null, 'chip-attr')));
  }
  function paintMods() {
    const c = getChar(); clear(mods);
    const tog = (label, on, fn, dis = false) => h('button', { type: 'button', class: 'chip toggle', 'aria-pressed': String(on), disabled: dis, onclick: fn }, label);
    const list = h('div', { class: 'mod-row' });
    list.append(tog(`${t(['Iconic Item', 'Item Icônico'])} +2`, st.iconic && !!c.iconic, () => { st.iconic = !st.iconic; refresh(); }, !c.iconic));
    c.items.forEach((it, i) => { if (it.name && +it.bonus) list.append(tog(`${it.name} +${it.bonus}`, st.items.has(i), () => { st.items.has(i) ? st.items.delete(i) : st.items.add(i); refresh(); })); });
    list.append(tog(`${t(['Help from a Kid', 'Ajuda de outra criança'])} +1`, st.help, () => { st.help = !st.help; refresh(); }));
    const extra = h('div', { class: 'extra-row' },
      h('span', { class: 'lbl' }, st.sel.kind === 'custom' ? t(['Number of dice', 'Número de dados']) : t(['Extra dice', 'Dados extras'])),
      h('button', { type: 'button', class: 'step-btn', 'aria-label': '-', onclick: () => { st.extra = clamp(st.extra - 1, st.sel.kind === 'custom' ? 1 : -5, 30); refresh(); } }, icon('minus', 14)),
      h('output', null, (st.extra > 0 && st.sel.kind !== 'custom' ? '+' : '') + st.extra),
      h('button', { type: 'button', class: 'step-btn', 'aria-label': '+', onclick: () => { st.extra = clamp(st.extra + 1, st.sel.kind === 'custom' ? 1 : -5, 30); refresh(); } }, icon('plus', 14)));
    const need = h('div', { class: 'need-row' },
      h('span', { class: 'lbl' }, t(['Successes needed', 'Sucessos necessários']), infoBtn(['Difficulty', 'Dificuldade'], () => h('div', null, h('p', null, t(['Difficult (normal): 1 success. Extremely Difficult: 2. Almost Impossible: 3. The Gamemaster only asks for more than one success in the most extreme cases.', 'Difícil (normal): 1 sucesso. Extremamente difícil: 2. Quase impossível: 3. O Mestre só exige mais de um sucesso nos casos mais extremos.'])))) ),
      h('div', { class: 'seg' }, [1, 2, 3].map((n) => h('button', { type: 'button', 'aria-pressed': String(st.need === n), onclick: () => { st.need = n; refresh(); } }, String(n)))));
    mods.append(list, h('div', { class: 'mod-grid' }, extra, need));
  }
  function paintSummary() {
    const c = getChar(); const { n, parts } = dicePool(c);
    clear(summary);
    const broken = isBroken(c);
    const row = CHANCE.find((r) => r[0] === n);
    summary.append(
      h('div', { class: 'pool-n' }, h('b', null, String(n)), h('span', null, n === 1 ? t(['die', 'dado']) : t(['dice', 'dados']))),
      h('div', { class: 'pool-parts' },
        parts.length ? parts.map(([l, v]) => h('span', { class: 'part' }, `${l} ${v >= 0 ? '' : ''}${v < 0 ? v : v}`)) : h('span', { class: 'part muted' }, t(['Pick an attribute or skill', 'Escolha um atributo ou perícia'])),
        row && st.need === 1 ? h('span', { class: 'chance' }, t(['Chance', 'Chance']) + ` ${row[1]}% / ${row[2]}% ` + t(['pushed', 'forçando'])) : null),
      broken ? h('p', { class: 'warn' }, t(['You are Broken: you automatically fail all rolls until healed.', 'Você está Acabado: falha automaticamente em todas as rolagens até se curar.'])) : null);
    return { n, broken };
  }

  /* ----- rolagem ----- */
  function labelFor(c) {
    if (st.sel.kind === 'attr') return attrName(st.sel.key);
    if (st.sel.kind === 'skill') return t(SKILL_BY_KEY[st.sel.key].name);
    return t(['Free roll', 'Rolagem livre']);
  }
  async function doRoll() {
    if (st.rolling) return;
    const c = getChar(); const { n, broken } = paintSummary();
    if (broken) { toast(t(['Broken: automatic failure.', 'Acabado: falha automática.'])); return; }
    if (n < 1) { toast(t(['No dice to roll.', 'Nenhum dado para rolar.'])); return; }
    st.current = { label: labelFor(c), need: st.need, pool: n, dice: Array.from({ length: n }, () => ({ v: d6(), die: makeDie(1), kept: false })), pushed: false, luck: false, pride: false, hid: Date.now() };
    mountTray();
    await animate(st.current.dice.map((_, i) => i));
    pushHistory(true);
    refreshResult();
  }
  function mountTray() {
    clear(tray); clear(verdict);
    st.current.dice.forEach((d) => { d.die.show(1); tray.append(d.die.el); });
    root.classList.add('has-roll');
  }
  async function animate(indexes) {
    st.rolling = true; paintActions();
    const ps = indexes.map((i, k) => st.current.dice[i].die.roll(st.current.dice[i].v, k * 70));
    await Promise.all(ps);
    st.rolling = false;
  }
  const successes = () => st.current.dice.filter((d) => d.v === 6).length + (st.current.pride ? 1 : 0);

  function refreshResult() {
    const cur = st.current; if (!cur) return;
    cur.dice.forEach((d) => d.die.el.classList.toggle('kept', d.v === 6));
    const s = successes(); const ok = s >= cur.need; const extra = Math.max(0, s - cur.need);
    clear(verdict);
    verdict.className = 'verdict ' + (ok ? 'ok' : 'fail');
    verdict.append(
      h('strong', null, ok ? t(['Success', 'Sucesso']) : t(['Failure', 'Falha'])),
      h('span', null, `${s} / ${cur.need} ` + (s === 1 ? t(['success', 'sucesso']) : t(['successes', 'sucessos']))),
      ok && extra ? h('span', { class: 'extra' }, t(['You can buy ', 'Você pode comprar ']) + extra + t([' bonus effect(s).', ' efeito(s) bônus.'])) : null,
      !ok ? h('span', { class: 'extra' }, t(['Something changes, probably for the worse. Push, spend Luck, or use Pride.', 'Algo muda, provavelmente para pior. Force a rolagem, gaste Sorte ou use o Orgulho.'])) : null);
    paintActions(); pushHistory(false); onChange && onChange();
  }

  function paintActions() {
    const c = getChar(); const cur = st.current; clear(actions);
    const canAct = !!cur && !st.rolling && !isBroken(c);
    const failedDice = cur ? cur.dice.some((d) => d.v !== 6) : false;
    const rollBtn = h('button', { type: 'button', class: 'btn btn-primary btn-lg roll-btn', disabled: st.rolling, onclick: doRoll }, icon('dice', 22), cur ? t(['Roll again', 'Rolar de novo']) : t(['Roll', 'Rolar']));
    actions.append(rollBtn);
    if (!cur) return;
    const sub = h('div', { class: 'roll-sub' });
    sub.append(
      h('button', { type: 'button', class: 'btn', disabled: !(canAct && !cur.pushed && failedDice), onclick: pushRoll, title: t(['Check a Condition and reroll all dice that are not sixes (once, right after the roll).', 'Marque uma Condição e role de novo todos os dados que não são seis (uma vez, logo após a rolagem).']) }, icon('up', 16), t(['Push the roll', 'Forçar a rolagem'])),
      h('button', { type: 'button', class: 'btn', disabled: !(canAct && !cur.luck && luckNow(c) > 0 && failedDice), onclick: useLuck, title: t(['Spend a Luck Point to reroll failed dice (once per roll).', 'Gaste um Ponto de Sorte para rolar de novo os dados que falharam (uma vez por rolagem).']) }, icon('star', 16), `${t(['Use Luck', 'Usar Sorte'])} (${luckNow(c)})`),
      h('button', { type: 'button', class: 'btn', disabled: !(canAct && !cur.pride && !c.prideUsed && c.pride), onclick: usePride, title: t(['Check your Pride for one automatic success (once per Mystery).', 'Marque seu Orgulho para ganhar um sucesso automático (uma vez por Mistério).']) }, icon('heart', 16), t(['Use Pride', 'Usar Orgulho'])));
    actions.append(sub);
    if (cur.pushed && successes() < cur.need) actions.append(h('p', { class: 'hint' }, t(['If the Trouble threatened a Condition, you may have to check two Conditions after a failed push.', 'Se a Encrenca ameaçava uma Condição, você pode ter de marcar duas Condições após uma tentativa forçada que falhou.'])));
  }

  async function pushRoll() {
    const c = getChar(); const cur = st.current;
    const mild = [['upset', ['Upset', 'Chateado']], ['scared', ['Scared', 'Assustado']], ['exhausted', ['Exhausted', 'Exausto']], ['injured', ['Injured', 'Machucado']]].filter(([k]) => !c.cond[k]);
    const options = mild.length ? mild : [['broken', ['Broken', 'Acabado']]];
    const pick = await chooseCondition(options, !mild.length);
    if (!pick) return;
    c.cond[pick] = true; saveChar(c);
    cur.pushed = true;
    const idx = [];
    cur.dice.forEach((d, i) => { if (d.v !== 6) { d.v = d6(); idx.push(i); } });
    onChange && onChange();
    await animate(idx);
    refreshResult();
  }
  async function useLuck() {
    const c = getChar(); const cur = st.current;
    c.luckSpent += 1; saveChar(c); cur.luck = true;
    const idx = [];
    cur.dice.forEach((d, i) => { if (d.v !== 6) { d.v = d6(); idx.push(i); } });
    onChange && onChange();
    await animate(idx);
    refreshResult();
  }
  function usePride() {
    const c = getChar(); c.prideUsed = true; saveChar(c);
    st.current.pride = true; onChange && onChange();
    refreshResult();
  }

  function chooseCondition(options, isBrokenOnly) {
    return new Promise((resolve) => {
      let chosen = null;
      const list = h('div', { class: 'choice-list' });
      options.forEach(([k, name]) => list.append(h('button', { type: 'button', class: 'choice', onclick: () => { chosen = k; m.close(); } }, h('strong', null, t(name)))));
      const m = openModal({
        title: t(['Push the roll', 'Forçar a rolagem']), size: 'sm',
        body: h('div', null, h('p', { class: 'prose' }, isBrokenOnly
          ? t(['All four mild Conditions are already marked. Pushing now makes you Broken.', 'As quatro Condições leves já estão marcadas. Forçar agora deixa você Acabado.'])
          : t(['Choose the Condition that fits the story. It is checked on your sheet, then every die that is not a six is rolled again.', 'Escolha a Condição que combina com a história. Ela será marcada na ficha e todos os dados que não são seis serão rolados de novo.'])), list),
        footer: h('button', { type: 'button', class: 'btn', onclick: () => m.close() }, t(['Cancel', 'Cancelar'])),
        onClose: () => resolve(chosen)
      });
    });
  }

  function resetRoll() {
    if (st.rolling) return;
    st.current = null; clear(tray); clear(verdict); verdict.className = 'verdict';
    root.classList.remove('has-roll'); paintActions(); onChange && onChange();
  }

  /* ----- histórico ----- */
  function pushHistory(isNew) {
    const cur = st.current; if (!cur) return;
    const entry = { id: cur.hid, label: cur.label, need: cur.need, dice: cur.dice.map((d) => d.v), s: successes(), pushed: cur.pushed, luck: cur.luck, pride: cur.pride, at: cur.hid };
    const i = st.history.findIndex((e) => e.id === entry.id);
    if (i >= 0) st.history[i] = entry; else st.history.unshift(entry);
    setRolls(getChar().id, st.history); paintHistory();
  }
  function paintHistory() {
    clear(histHead); clear(histList);
    histHead.append(h('h3', null, t(['Roll history', 'Histórico de rolagens'])),
      h('button', { type: 'button', class: 'btn btn-sm btn-ghost', disabled: !st.history.length, onclick: () => { st.history = []; setRolls(getChar().id, []); resetRoll(); paintHistory(); } }, icon('trash', 15), t(['Clear', 'Limpar'])));
    if (!st.history.length) histList.append(h('li', { class: 'empty' }, t(['No rolls yet. Your results will appear here.', 'Nenhuma rolagem ainda. Os resultados aparecem aqui.'])));
    st.history.forEach((e) => {
      const ok = e.s >= e.need;
      histList.append(h('li', { class: 'hist-item ' + (ok ? 'ok' : 'fail') },
        h('div', { class: 'hist-top' }, h('strong', null, e.label), h('span', { class: 'hist-res' }, `${ok ? t(['Success', 'Sucesso']) : t(['Failure', 'Falha'])} ${e.s}/${e.need}`)),
        h('div', { class: 'hist-dice' }, e.dice.map((v) => miniDie(v, v === 6))),
        h('div', { class: 'hist-tags' }, [e.pushed ? t(['Pushed', 'Forçada']) : null, e.luck ? t(['Luck', 'Sorte']) : null, e.pride ? t(['Pride', 'Orgulho']) : null, new Date(e.at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })].filter(Boolean).map((x) => h('span', { class: 'tag' }, x)))));
    });
  }

  /* ----- ciclo ----- */
  function paintHead() {
    clear(head).append(h('span', null, t(['Dice', 'Dados'])), infoBtn(['How rolling works', 'Como rolar'], () => h('div', null,
      h('p', null, t(['Roll one die for your attribute plus one for each level in the matching skill. Every six is a success; you usually need only one.', 'Role um dado por ponto do atributo mais um por nível na perícia correspondente. Cada seis é um sucesso; em geral basta um.'])),
      h('p', null, t(['After a failure you may push (check a Condition, reroll everything that is not a six), spend a Luck Point, or check your Pride.', 'Depois de uma falha você pode forçar (marcar uma Condição e rolar de novo tudo que não é seis), gastar um Ponto de Sorte ou marcar o Orgulho.']))), '?'));
  }
  function refresh() { paintHead(); paintPicker(); paintMods(); paintSummary(); paintActions(); }
  function selectRoll(kind, key) { st.sel = { kind, key }; refresh(); }
  refresh(); paintHistory();
  onLang(() => { refresh(); paintHistory(); if (st.current) refreshResult(); });
  return { el: root, refresh, selectRoll, doRoll, reset() { resetRoll(); refresh(); } };
}
