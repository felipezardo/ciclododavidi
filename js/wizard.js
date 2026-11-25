import { h, icon, clear, openModal, infoBtn, stepper, toast, confirmDialog, clamp } from './ui.js';
import { t, tf, onLang, fmt } from './i18n.js';
import { ATTRS, SKILLS, AGES, luckFor } from './data-rules.js';
import { TYPES, EVERYDAY_NPCS, QUESTIONS_GROUP } from './data-types.js';
import { blankChar, saveChar, getDraft, setDraft, clearDraft, normalize } from './store.js';
import { portrait, openPortraitEditor, artFor } from './portrait.js';

const STEPS = [
  { id: 'type', title: ['Type', 'Arquétipo'], help: ['Your Type is who you are in school: it sets your key skills and suggests your Iconic Item, Problem, Drive, Pride, relationships and names. Ideally each Kid in the group has a different Type.', 'O Arquétipo é quem você é na escola: define suas perícias-chave e sugere Item Icônico, Problema, Ímpeto, Orgulho, relacionamentos e nomes. O ideal é cada criança do grupo ter um Arquétipo diferente.'] },
  { id: 'age', title: ['Age', 'Idade'], help: ['Choose from 10 to 15. Older Kids have more attribute points; younger Kids have more Luck Points (15 minus age). Higher attributes make you better at certain actions, more Luck makes you more versatile.', 'Escolha de 10 a 15. Crianças mais velhas têm mais pontos de atributo; as mais novas têm mais Pontos de Sorte (15 menos a idade). Atributos altos deixam você melhor em certas ações; mais Sorte deixa você mais versátil.'] },
  { id: 'attrs', title: ['Attributes', 'Atributos'], help: ['Distribute points equal to your age among Body, Tech, Heart and Mind. Each attribute is 1 to 5, and the score is the number of dice you roll.', 'Distribua pontos iguais à sua idade entre Corpo, Tecnologia, Coração e Mente. Cada atributo vai de 1 a 5, e o valor é o número de dados que você rola.'] },
  { id: 'skills', title: ['Skills', 'Perícias'], help: ['Distribute 10 points among your skills. Key skills of your Type can go up to level 3. All other skills start at 1 at most. Skill levels add dice to your attribute.', 'Distribua 10 pontos entre as perícias. As perícias-chave do seu Arquétipo podem chegar ao nível 3. As demais começam em no máximo 1. Os níveis somam dados ao atributo.'] },
  { id: 'iconic', title: ['Iconic Item', 'Item Icônico'], help: ['Your Iconic Item says something about who you are. It gives +2 dice when it clearly helps, never breaks or disappears, and cannot be used by other Kids.', 'Seu Item Icônico diz algo sobre quem você é. Dá +2 dados quando claramente ajuda, nunca quebra nem desaparece e não pode ser usado por outras crianças.'] },
  { id: 'problem', title: ['Problem', 'Problema'], help: ['A worry from Everyday Life. It is a signal to the Gamemaster: put my Kid in this kind of Trouble. Choose one you want to explore.', 'Uma preocupação da vida cotidiana. É um sinal ao Mestre: me ponha nesse tipo de encrenca. Escolha um que você queira explorar.'] },
  { id: 'drive', title: ['Drive', 'Ímpeto'], help: ['The reason you face danger to solve Mysteries with your friends. You can change it between Mysteries.', 'O motivo pelo qual você enfrenta o perigo para resolver Mistérios com os amigos. Pode mudar entre Mistérios.'] },
  { id: 'pride', title: ['Pride', 'Orgulho'], help: ['Something that makes you feel strong and valuable. Once per Mystery you can check it for one automatic success. The Gamemaster may also set scenes that threaten it.', 'Algo que faz você se sentir forte e valioso. Uma vez por Mistério você pode marcá-lo para um sucesso automático. O Mestre também pode criar cenas que o ameacem.'] },
  { id: 'kids', title: ['Relationships: Kids', 'Relacionamentos: crianças'], help: ['Pick a Relationship toward each other Kid in the group. Talk with the other players: if you are siblings, both sheets should say so. Nobody should be an enemy, but a little tension is fun.', 'Escolha um Relacionamento com cada outra criança do grupo. Converse com os outros jogadores: se são irmãos, as duas fichas devem dizer isso. Ninguém deve ser inimigo, mas um pouco de tensão é divertido.'] },
  { id: 'npcs', title: ['Relationships: NPCs', 'Relacionamentos: PNJs'], help: ['Choose two. The NPCs from your Type link you to the strange events of the Mystery Landscape. Everyday Life NPCs are good for ordinary scenes. You can also write your own together with the Gamemaster.', 'Escolha dois. Os PNJs do seu Arquétipo ligam você aos eventos estranhos do Panorama de Mistérios. PNJs da vida cotidiana servem para cenas comuns. Você também pode escrever os seus junto com o Mestre.'] },
  { id: 'anchor', title: ['Anchor', 'Âncora'], help: ['Someone who gives you support, comfort and care: a friend, parent, teacher or neighbor. It cannot be another Kid. A scene with your Anchor heals all your Conditions.', 'Alguém que dá apoio, conforto e cuidado: amigo, pai, professor ou vizinho. Não pode ser outra criança. Uma cena com sua Âncora cura todas as suas Condições.'] },
  { id: 'name', title: ['Name', 'Nome'], help: ['Pick from the typical names or invent your own. Names change with the setting you chose.', 'Escolha entre os nomes típicos ou invente o seu. Os nomes mudam conforme o cenário escolhido.'] },
  { id: 'look', title: ['Description', 'Descrição'], help: ['Write what your Kid looks like and what she is like: how she talks and moves, what she wears. Anything useful when you play.', 'Escreva como sua criança é fisicamente e como é como pessoa: como fala e se move, o que veste. Qualquer coisa útil na hora de interpretar.'] },
  { id: 'song', title: ['Favorite song', 'Música favorita'], help: ['Pick a favorite song from the 1980s that says something about your Kid. It has no mechanical effect, but it can be the theme at the table.', 'Escolha uma música favorita dos anos 1980 que diga algo sobre sua criança. Não tem efeito mecânico, mas pode ser o tema na mesa.'] },
  { id: 'hideout', title: ['Hideout', 'Esconderijo'], help: ['Decide together with the group: where is the Kids\' Hideout? The Gamemaster cannot put you in Trouble there, and NPCs cannot find it unless you show them. All Kids share the same Hideout.', 'Decidam juntos: onde fica o Esconderijo das crianças? O Mestre não pode te meter em encrenca lá e PNJs não o encontram a menos que vocês mostrem. Todas as crianças dividem o mesmo Esconderijo.'] },
  { id: 'review', title: ['Review', 'Revisão'], help: ['Check everything. You can go back to any step. Everything stays editable on the sheet afterwards.', 'Confira tudo. Você pode voltar a qualquer passo. Tudo continua editável na ficha depois.'] }
];

export function openWizard({ onDone }) {
  let saved = getDraft();
  const state = saved ? { step: saved.step, c: saved.char, max: saved.step, ageChosen: saved.step >= 2 } : { step: 0, c: blankChar(), max: 0, ageChosen: false };
  let finished = false;
  if (!saved) { state.c.type = ''; }
  const typeOf = () => TYPES.find((x) => x.key === state.c.type) || null;
  const pt = () => state.c.setting;
  const persist = () => setDraft({ step: state.step, char: state.c, touched: {} });

  /* ---------- estrutura ---------- */
  const rail = h('ol', { class: 'wz-rail', 'aria-label': t(['Steps', 'Passos']) });
  const mobileCount = h('span', { class: 'wz-count' });
  const mobileBar = h('div', { class: 'wz-progress', role: 'progressbar', 'aria-valuemin': '1', 'aria-valuemax': String(STEPS.length) }, h('i'));
  const main = h('div', { class: 'wz-main' });
  const side = h('aside', { class: 'wz-side', 'aria-label': t(['Kid preview', 'Prévia da criança']) });
  const back = h('button', { type: 'button', class: 'btn', onclick: () => go(state.step - 1) }, icon('back', 18), t(['Back', 'Voltar']));
  const next = h('button', { type: 'button', class: 'btn btn-primary', onclick: () => (state.step === STEPS.length - 1 ? finish() : go(state.step + 1)) }, t(['Next', 'Próximo']), icon('next', 18));
  const note = h('span', { class: 'wz-note', role: 'status' });
  const helpHost = h('span', { class: 'wz-help' });
  const body = h('div', { class: 'wz-body' }, h('nav', { class: 'wz-nav', 'aria-label': t(['Steps', 'Passos']) }, rail), h('div', { class: 'wz-center' }, main), side);
  const m = openModal({
    title: t(['Create a Kid', 'Criar uma criança']), size: 'full', className: 'wizard', body: h('div', { class: 'wz-wrap' }, h('div', { class: 'wz-mobile-head' }, mobileCount, mobileBar), body),
    footer: [back, note, next], headerExtra: helpHost,
    onClose: () => { if (!finished) persist(); }
  });

  /* ---------- navegação ---------- */
  function validity(i = state.step) {
    const c = state.c; const id = STEPS[i].id;
    const need = (ok, msg) => ({ ok, msg });
    switch (id) {
      case 'type': return need(!!typeOf(), t(['Choose a Type to continue.', 'Escolha um Arquétipo para continuar.']));
      case 'age': return need(state.ageChosen === true, t(['Choose an age.', 'Escolha uma idade.']));
      case 'attrs': { const left = c.age - sumAttrs(); return need(left === 0, left > 0 ? t([`${left} point(s) left to distribute.`, `Faltam distribuir ${left} ponto(s).`]) : t([`${-left} point(s) over.`, `${-left} ponto(s) a mais.`])); }
      case 'skills': { const left = 10 - sumSkills(); return need(left === 0, left > 0 ? t([`${left} point(s) left to distribute.`, `Faltam distribuir ${left} ponto(s).`]) : t([`${-left} point(s) over.`, `${-left} ponto(s) a mais.`])); }
      case 'iconic': return need(!!c.iconic.trim(), t(['Choose or write an Iconic Item.', 'Escolha ou escreva um Item Icônico.']));
      case 'problem': return need(!!c.problem.trim(), t(['Choose or write a Problem.', 'Escolha ou escreva um Problema.']));
      case 'drive': return need(!!c.drive.trim(), t(['Choose or write a Drive.', 'Escolha ou escreva um Ímpeto.']));
      case 'pride': return need(!!c.pride.trim(), t(['Choose or write a Pride.', 'Escolha ou escreva um Orgulho.']));
      case 'anchor': return need(!!c.anchor.trim(), t(['Choose or write an Anchor.', 'Escolha ou escreva uma Âncora.']));
      case 'npcs': { const n = c.relNpcs.filter((x) => x.trim()).length; return need(n === 2, t([`Choose two (${n}/2).`, `Escolha dois (${n}/2).`])); }
      case 'name': return need(!!c.name.trim(), t(['Give your Kid a name.', 'Dê um nome à sua criança.']));
      default: return need(true, '');
    }
  }
  function go(i) {
    i = clamp(i, 0, STEPS.length - 1);
    if (i > state.step) { for (let k = state.step; k < i; k++) if (!validity(k).ok) { toast(validity(k).msg); i = k; break; } }
    if (i === STEPS.length - 1 + 1) return;
    state.step = i; state.max = Math.max(state.max, i); persist(); render();
  }
  function finish() {
    const c = normalize(state.c);
    c.luckSpent = 0; c.created = c.updated = Date.now();
    saveChar(c); clearDraft(); finished = true;
    m.close(); toast(t(['Kid created.', 'Criança criada.']));
    onDone && onDone(c.id);
  }

  /* ---------- util ---------- */
  const sumAttrs = () => Object.values(state.c.attrs).reduce((a, b) => a + b, 0);
  const sumSkills = () => Object.values(state.c.skills).reduce((a, b) => a + b, 0);
  const sec = (title, ...kids) => h('section', { class: 'wz-sec' }, title ? h('h3', null, title) : null, kids);
  const lead = (txt) => h('p', { class: 'wz-lead' }, txt);

  function counter(label, left, total) {
    return h('div', { class: 'points' + (left === 0 ? ' done' : left < 0 ? ' over' : '') }, h('span', null, label), h('b', null, String(left)), h('span', { class: 'of' }, `/ ${total}`));
  }

  /* opções com cartões + campo livre */
  function optionStep({ field, options, label, placeholder, rows = 3, multiline = true }) {
    const val = state.c[field] || '';
    const opts = options.map((p) => tf(p, pt()));
    const customActive = !!val.trim() && !opts.includes(val);
    const wrap = h('div', { class: 'choice-grid' });
    let custom;
    const cards = opts.map((txt) => {
      const b = h('button', { type: 'button', class: 'choice', 'aria-pressed': String(val === txt), onclick: () => { state.c[field] = txt; persist(); render(); } }, h('span', null, txt));
      return b;
    });
    wrap.append(...cards);
    const ta = h(multiline ? 'textarea' : 'input', { class: 'field', rows, placeholder, 'aria-label': label });
    if (!multiline) ta.type = 'text';
    ta.value = customActive ? val : '';
    ta.addEventListener('input', () => { state.c[field] = ta.value; cards.forEach((x) => x.setAttribute('aria-pressed', 'false')); customCard.classList.toggle('on', !!ta.value.trim()); persist(); paintNav(); paintSide(); });
    const customCard = h('div', { class: 'choice choice-custom' + (customActive ? ' on' : ''), 'aria-pressed': String(customActive) }, h('strong', null, t(['Write your own', 'Escreva o seu'])), ta);
    wrap.append(customCard);
    return wrap;
  }

  /* ---------- passos ---------- */
  const R = {
    type() {
      const setting = h('div', { class: 'seg seg-wide', role: 'group', 'aria-label': t(['Setting', 'Cenário']) },
        ['swe', 'us'].map((k) => h('button', { type: 'button', 'aria-pressed': String(pt() === k), onclick: () => { state.c.setting = k; persist(); render(); } }, k === 'swe' ? t(['Mälaren Islands, Sweden', 'Ilhas Mälaren, Suécia']) : t(['Boulder City, USA', 'Boulder City, EUA']))));
      const grid = h('div', { class: 'type-grid' }, TYPES.map((ty) => {
        const on = state.c.type === ty.key;
        return h('button', { type: 'button', class: 'type-card', 'aria-pressed': String(on), onclick: () => chooseType(ty.key) },
          h('span', { class: 'type-art' }, h('img', { src: artFor(ty.key), alt: '', loading: 'lazy' })),
          h('span', { class: 'type-info' }, h('strong', null, t(ty.name)),
            h('span', { class: 'type-skills' }, ty.skills.map((s) => h('span', { class: 'tag' }, t(SKILLS.find((x) => x.key === s).name)))),
            h('span', { class: 'type-blurb' }, t(ty.blurb))));
      }));
      return [lead(t(['Pick the kind of Kid you want to play. Then choose where the story takes place: it only changes the suggested names.', 'Escolha o tipo de criança que você quer jogar. Depois escolha onde a história acontece: isso só muda os nomes sugeridos.'])), sec(t(['Setting', 'Cenário']), setting), sec(t(['Type', 'Arquétipo']), grid)];
    },
    age() {
      return [lead(t(['Age sets your attribute points and your Luck Points. You can grow older later and gain more attribute points, while losing Luck.', 'A idade define seus pontos de atributo e seus Pontos de Sorte. Você poderá envelhecer depois, ganhando pontos de atributo e perdendo Sorte.'])),
        h('div', { class: 'age-grid' }, AGES.map((a) => h('button', { type: 'button', class: 'age-card', 'aria-pressed': String(state.c.age === a && state.ageChosen === true), onclick: () => chooseAge(a) },
          h('b', null, String(a)), h('span', null, t(['Attribute points', 'Pontos de atributo']) + ': ' + a), h('span', null, t(['Luck Points', 'Pontos de Sorte']) + ': ' + luckFor(a)))))];
    },
    attrs() {
      const c = state.c; const left = c.age - sumAttrs();
      const rows = ATTRS.map((a) => {
        const st = stepper({ value: c.attrs[a.key], min: 1, max: 5, label: t(a.name), onChange: (v) => { c.attrs[a.key] = v; persist(); updateAttrs(); } });
        const row = h('div', { class: 'stat-row' }, h('div', { class: 'stat-text' }, h('strong', null, t(a.name)), h('span', null, t(a.desc))), h('div', { class: 'stat-ctrl' }, dots(() => c.attrs[a.key], 5), st.el));
        row._st = st; row._key = a.key; return row;
      });
      const pts = h('div', { class: 'points-host' });
      function updateAttrs() { const l = c.age - sumAttrs(); clear(pts).append(counter(t(['Points left', 'Pontos restantes']), l, c.age)); rows.forEach((r) => { r._st.update(c.attrs[r._key], 1, Math.min(5, c.attrs[r._key] + Math.max(0, l))); r.querySelector('.dots').replaceWith(dots(() => c.attrs[r._key], 5)); }); paintNav(); paintSide(); }
      const helper = h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn btn-sm', onclick: () => { balance(); render(); } }, icon('shuffle', 16), t(['Spread evenly', 'Distribuir igualmente'])),
        h('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => { ATTRS.forEach((a) => { c.attrs[a.key] = 1; }); persist(); render(); } }, icon('reset', 16), t(['Reset', 'Zerar'])));
      queueMicrotask(updateAttrs);
      return [lead(t([`Distribute ${c.age} points among the four attributes (1 to 5 each).`, `Distribua ${c.age} pontos entre os quatro atributos (de 1 a 5 cada).`])), pts, rows, helper];
    },
    skills() {
      const c = state.c; const ty = typeOf();
      const groups = ATTRS.map((a) => {
        const rows = SKILLS.filter((s) => s.attr === a.key).map((s) => {
          const key = ty.skills.includes(s.key); const maxV = key ? 3 : 1;
          const st = stepper({ value: c.skills[s.key], min: 0, max: maxV, label: t(s.name), onChange: (v) => { c.skills[s.key] = v; persist(); updateSkills(); } });
          const info = infoBtn(s.name, () => h('div', null, h('p', null, t(s.desc)), s.questions.length ? h('ul', null, s.questions.map((q) => h('li', null, t(q)))) : null));
          const row = h('div', { class: 'stat-row compact' + (key ? ' key' : '') },
            h('div', { class: 'stat-text' }, h('strong', null, t(s.name), key ? h('span', { class: 'key-tag' }, t(['Key skill', 'Perícia-chave'])) : null, info)),
            h('div', { class: 'stat-ctrl' }, h('span', { class: 'max-note' }, t(['max ', 'máx. ']) + maxV), st.el));
          row._st = st; row._key = s.key; row._max = maxV; return row;
        });
        return { a, rows, el: h('div', { class: 'skill-group' }, h('h4', null, t(a.name), h('span', { class: 'attr-val' }, `${t(['attribute', 'atributo'])} ${c.attrs[a.key]}`)), rows) };
      });
      const all = groups.flatMap((g) => g.rows);
      const pts = h('div', { class: 'points-host' });
      function updateSkills() { const l = 10 - sumSkills(); clear(pts).append(counter(t(['Points left', 'Pontos restantes']), l, 10)); all.forEach((r) => r._st.update(c.skills[r._key], 0, Math.min(r._max, c.skills[r._key] + Math.max(0, l)))); paintNav(); paintSide(); }
      queueMicrotask(updateSkills);
      return [lead(t([`Distribute 10 points. Key skills of the ${t(ty.name)} go up to 3; the others up to 1.`, `Distribua 10 pontos. As perícias-chave de ${t(ty.name)} vão até 3; as outras até 1.`])), pts, h('div', { class: 'skill-groups' }, groups.map((g) => g.el))];
    },
    iconic() { const ty = typeOf(); return [lead(t(['It gives +2 dice when it clearly helps in a roll.', 'Dá +2 dados quando claramente ajuda numa rolagem.'])), optionStep({ field: 'iconic', options: ty.iconic, label: t(['Iconic Item', 'Item Icônico']), placeholder: t(['Your own Iconic Item', 'Seu próprio Item Icônico']), rows: 2 })]; },
    problem() { const ty = typeOf(); return [lead(t(['What worries you in Everyday Life?', 'O que preocupa você na vida cotidiana?'])), optionStep({ field: 'problem', options: ty.problems, label: t(['Problem', 'Problema']), placeholder: t(['Your own Problem', 'Seu próprio Problema']) })]; },
    drive() { const ty = typeOf(); return [lead(t(['Why do you throw yourself into dangerous Mysteries?', 'Por que você se joga em Mistérios perigosos?'])), optionStep({ field: 'drive', options: ty.drives, label: t(['Drive', 'Ímpeto']), placeholder: t(['Your own Drive', 'Seu próprio Ímpeto']), rows: 2 })]; },
    pride() { const ty = typeOf(); return [lead(t(['What makes you feel strong and important?', 'O que faz você se sentir forte e importante?'])), optionStep({ field: 'pride', options: ty.prides, label: t(['Pride', 'Orgulho']), placeholder: t(['Your own Pride', 'Seu próprio Orgulho']), rows: 2 })]; },
    anchor() { const ty = typeOf(); return [lead(t(['Who can comfort you and heal your Conditions? Not another Kid.', 'Quem pode confortar você e curar suas Condições? Não pode ser outra criança.'])), optionStep({ field: 'anchor', options: ty.anchors, label: t(['Anchor', 'Âncora']), placeholder: t(['Your own Anchor', 'Sua própria Âncora']), rows: 2, multiline: false })]; },
    kids() {
      const c = state.c; const ty = typeOf();
      if (state.group == null) state.group = Math.max(1, c.relKids.filter((r) => r.text || r.who).length || 3);
      const count = stepper({ value: state.group, min: 0, max: 4, label: t(['Other Kids', 'Outras crianças']), onChange: (v) => { state.group = v; render(); } });
      const slots = c.relKids.slice(0, state.group).map((r, i) => {
        const who = h('input', { type: 'text', class: 'field', placeholder: t(['Name of the other Kid (optional)', 'Nome da outra criança (opcional)']), 'aria-label': `${t(['Kid', 'Criança'])} ${i + 1}` }); who.value = r.who;
        who.addEventListener('input', () => { r.who = who.value; persist(); });
        const chips = h('div', { class: 'chip-row' }, ty.relKids.map((p) => { const txt = tf(p, pt()); return h('button', { type: 'button', class: 'chip', 'aria-pressed': String(r.text === txt), onclick: () => { r.text = txt; persist(); render(); } }, txt); }));
        const own = h('input', { type: 'text', class: 'field', placeholder: t(['Or write your own', 'Ou escreva o seu']), 'aria-label': t(['Custom relationship', 'Relacionamento próprio']) });
        own.value = ty.relKids.map((p) => tf(p, pt())).includes(r.text) ? '' : r.text;
        own.addEventListener('input', () => { r.text = own.value; persist(); chips.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', 'false')); });
        return h('div', { class: 'slot' }, h('h4', null, `${t(['Kid', 'Criança'])} ${i + 1}`), who, chips, own);
      });
      return [lead(t(['How many other Kids are in your group? Choose how you feel about each one.', 'Quantas outras crianças há no grupo? Escolha o que você sente por cada uma.'])), h('div', { class: 'inline-ctrl' }, h('span', { class: 'lbl' }, t(['Other Kids in the group', 'Outras crianças no grupo'])), count.el), h('div', { class: 'slots' }, slots)];
    },
    npcs() {
      const c = state.c; const ty = typeOf();
      const chosen = () => c.relNpcs.filter((x) => x.trim());
      const toggle = (txt) => {
        const cur = chosen();
        const i = cur.indexOf(txt);
        if (i >= 0) cur.splice(i, 1); else if (cur.length < 2) cur.push(txt); else { toast(t(['You can only choose two. Deselect one first.', 'Você só pode escolher dois. Desmarque um antes.'])); return; }
        c.relNpcs = [cur[0] || '', cur[1] || '']; persist(); render();
      };
      const card = (p) => { const txt = tf(p, pt()); return h('button', { type: 'button', class: 'choice', 'aria-pressed': String(chosen().includes(txt)), onclick: () => toggle(txt) }, h('span', null, txt)); };
      const own = h('input', { type: 'text', class: 'field', placeholder: t(['Write your own NPC Relationship', 'Escreva seu próprio Relacionamento com um PNJ']), 'aria-label': t(['Custom NPC Relationship', 'Relacionamento próprio com PNJ']) });
      const add = h('button', { type: 'button', class: 'btn', onclick: () => { const v = own.value.trim(); if (v) { own.value = ''; toggle(v); } } }, icon('plus', 16), t(['Add', 'Adicionar']));
      const customs = chosen().filter((x) => !ty.relNpcs.some((p) => tf(p, pt()) === x) && !EVERYDAY_NPCS.some((p) => tf(p, pt()) === x));
      return [lead(t([`Choose two (${chosen().length}/2). They tie you to what is going on around the Loop.`, `Escolha dois (${chosen().length}/2). Eles ligam você ao que acontece ao redor do Loop.`])),
        sec(t(['Linked to the Mystery Landscape', 'Ligados ao Panorama de Mistérios']), h('div', { class: 'choice-grid' }, ty.relNpcs.map(card))),
        sec(t(['Everyday Life', 'Vida cotidiana']), h('div', { class: 'choice-grid' }, EVERYDAY_NPCS.map(card))),
        sec(t(['Your own', 'Os seus']), customs.map((x) => h('button', { type: 'button', class: 'choice', 'aria-pressed': 'true', onclick: () => toggle(x) }, h('span', null, x))), h('div', { class: 'inline-field' }, own, add))];
    },
    name() {
      const c = state.c; const ty = typeOf(); const nm = ty.names[pt()];
      const input = h('input', { type: 'text', class: 'field field-lg', placeholder: t(['Your Kid\'s name', 'Nome da sua criança']), 'aria-label': t(['Name', 'Nome']), autofocus: true });
      input.value = c.name; input.addEventListener('input', () => { c.name = input.value; persist(); paintNav(); paintSide(); });
      const chips = (arr, fn) => h('div', { class: 'chip-row' }, arr.map((n) => h('button', { type: 'button', class: 'chip', onclick: () => { fn(n); input.value = c.name; persist(); paintNav(); paintSide(); input.focus(); } }, n)));
      return [lead(t(['Suggestions follow the setting you picked. Tap one, or write your own.', 'As sugestões seguem o cenário que você escolheu. Toque numa ou escreva a sua.'])), input,
        sec(t(['Girls\' names', 'Nomes femininos']), chips(nm.girl, (n) => { c.name = n; })),
        sec(t(['Boys\' names', 'Nomes masculinos']), chips(nm.boy, (n) => { c.name = n; })),
        sec(t(['Nicknames (added in quotes)', 'Apelidos (adicionados entre aspas)']), chips(nm.nick, (n) => { c.name = (c.name.replace(/\s*"[^"]*"\s*$/, '') + ` "${n}"`).trim(); }))];
    },
    look() {
      const c = state.c;
      const ta = h('textarea', { class: 'field', rows: 5, placeholder: t(['Hair, clothes, how you talk and move...', 'Cabelo, roupas, jeito de falar e de se mover...']), 'aria-label': t(['Description', 'Descrição']) }); ta.value = c.description;
      ta.addEventListener('input', () => { c.description = ta.value; persist(); });
      const pv = portrait(c, { cls: 'wz-portrait' });
      return [lead(t(['Write down what your Kid looks like and how she acts. Then, if you want, replace the book illustration with your own image.', 'Anote como sua criança é e como age. Depois, se quiser, troque a ilustração do livro por uma imagem sua.'])),
        h('div', { class: 'look-grid' }, h('div', null, ta), h('div', { class: 'look-portrait' }, pv.el, h('button', { type: 'button', class: 'btn', onclick: () => openPortraitEditor(c, (p) => { c.portrait = p; persist(); render(); }) }, icon('image', 18), t(['Frame or change portrait', 'Enquadrar ou trocar retrato']))))];
    },
    song() {
      const c = state.c;
      const input = h('input', { type: 'text', class: 'field field-lg', placeholder: t(['Title and artist', 'Título e artista']), 'aria-label': t(['Favorite song', 'Música favorita']) }); input.value = c.song;
      input.addEventListener('input', () => { c.song = input.value; persist(); });
      return [lead(t(['A song from the 1980s that says something about who your Kid is. It can be the theme you play at the table.', 'Uma música dos anos 1980 que diga algo sobre quem sua criança é. Pode ser o tema que toca na mesa.'])), input];
    },
    hideout() {
      const c = state.c;
      const ta = h('textarea', { class: 'field', rows: 4, placeholder: t(['An old boathouse, a tree hut, a shed behind the school...', 'Uma velha casa de barcos, uma casa na árvore, um galpão atrás da escola...']), 'aria-label': t(['Hideout', 'Esconderijo']) }); ta.value = c.hideout;
      ta.addEventListener('input', () => { c.hideout = ta.value; persist(); });
      const qOut = h('div', { class: 'q-out', 'aria-live': 'polite' }, t(['Tap to draw a question for the group.', 'Toque para sortear uma pergunta para o grupo.']));
      return [lead(t(['Decide this together with the other players. All Kids share one Hideout.', 'Decidam isso juntos com os outros jogadores. Todas as crianças dividem o mesmo Esconderijo.'])), ta,
        sec(t(['Questions for the group', 'Perguntas para o grupo']), h('p', { class: 'hint' }, t(['The Gamemaster will also ask you questions before the game. Here is a taste.', 'O Mestre também fará perguntas antes do jogo. Aqui vai uma amostra.'])), qOut,
          h('button', { type: 'button', class: 'btn', onclick: () => { qOut.textContent = t(QUESTIONS_GROUP[Math.floor(Math.random() * QUESTIONS_GROUP.length)]); } }, icon('shuffle', 18), t(['Draw a question', 'Sortear pergunta'])))];
    },
    review() {
      const c = state.c; const ty = typeOf();
      const pv = portrait(c, { cls: 'wz-portrait' });
      const line = (l, v) => v ? h('div', { class: 'rv-line' }, h('dt', null, l), h('dd', null, v)) : null;
      return [lead(t(['Everything looks right? You can edit any field on the sheet later.', 'Tudo certo? Você poderá editar qualquer campo na ficha depois.'])),
        h('div', { class: 'review' }, h('div', { class: 'rv-portrait' }, pv.el, h('h3', null, c.name || '—'), h('p', null, `${t(ty.name)}, ${c.age} ${t(['years old', 'anos'])}`)),
          h('dl', { class: 'rv-list' },
            line(t(['Attributes', 'Atributos']), ATTRS.map((a) => `${t(a.name)} ${c.attrs[a.key]}`).join(', ')),
            line(t(['Skills', 'Perícias']), SKILLS.filter((s) => c.skills[s.key] > 0).map((s) => `${t(s.name)} ${c.skills[s.key]}`).join(', ')),
            line(t(['Luck Points', 'Pontos de Sorte']), String(luckFor(c.age))),
            line(t(['Iconic Item', 'Item Icônico']), c.iconic), line(t(['Problem', 'Problema']), c.problem), line(t(['Drive', 'Ímpeto']), c.drive), line(t(['Pride', 'Orgulho']), c.pride), line(t(['Anchor', 'Âncora']), c.anchor),
            line(t(['Kids', 'Crianças']), c.relKids.filter((r) => r.text).map((r) => (r.who ? r.who + ': ' : '') + r.text).join(' / ')),
            line('PNJs', c.relNpcs.filter(Boolean).join(' / ')), line(t(['Favorite song', 'Música favorita']), c.song), line(t(['Hideout', 'Esconderijo']), c.hideout)))];
    }
  };

  function dots(get, n) { const d = h('span', { class: 'dots', 'aria-hidden': 'true' }); for (let i = 0; i < n; i++) d.append(h('i', { class: i < get() ? 'on' : '' })); return d; }
  function balance() { const c = state.c; ATTRS.forEach((a) => { c.attrs[a.key] = 1; }); let left = c.age - 4, i = 0; while (left > 0) { const k = ATTRS[i % 4].key; if (c.attrs[k] < 5) { c.attrs[k]++; left--; } i++; } persist(); }

  function chooseType(key) {
    const c = state.c;
    if (c.type !== key) {
      c.type = key; c.skills = Object.fromEntries(SKILLS.map((s) => [s.key, 0]));
      c.iconic = c.problem = c.drive = c.pride = c.anchor = ''; c.relKids = Array.from({ length: 4 }, () => ({ who: '', text: '' })); c.relNpcs = ['', ''];
      c.portrait = { src: null, zoom: 1, x: 0, y: 0 };
    }
    persist(); render();
  }
  function chooseAge(a) {
    const c = state.c;
    if (c.age !== a || !state.ageChosen) { c.age = a; c.attrs = { body: 1, tech: 1, heart: 1, mind: 1 }; }
    state.ageChosen = true;
    state.max = Math.max(state.max, 1); persist(); render();
  }

  /* ---------- prévia ---------- */
  function paintSide() {
    const c = state.c; const ty = typeOf(); clear(side);
    if (!ty) { side.append(h('div', { class: 'side-empty' }, icon('user', 40), h('p', null, t(['Your Kid will appear here as you make choices.', 'Sua criança aparece aqui conforme você faz escolhas.'])))); return; }
    const pv = portrait(c, { cls: 'side-portrait' });
    side.append(pv.el, h('h3', { class: 'side-name' }, c.name || t(['Unnamed Kid', 'Criança sem nome'])), h('p', { class: 'side-sub' }, `${t(ty.name)}${state.ageChosen ? ', ' + c.age : ''}`));
    if (state.ageChosen) {
      side.append(h('dl', { class: 'side-stats' }, ATTRS.map((a) => h('div', null, h('dt', null, t(a.name)), h('dd', null, dots(() => c.attrs[a.key], 5)))),
        h('div', null, h('dt', null, t(['Luck', 'Sorte'])), h('dd', null, String(luckFor(c.age))))));
      const sk = SKILLS.filter((s) => c.skills[s.key] > 0);
      if (sk.length) side.append(h('div', { class: 'side-skills' }, sk.map((s) => h('span', { class: 'tag' }, `${t(s.name)} ${c.skills[s.key]}`))));
    }
  }

  function paintNav() {
    const v = validity(); const last = state.step === STEPS.length - 1;
    back.disabled = state.step === 0;
    clear(next);
    if (last) next.append(icon('check', 18), t(['Create Kid', 'Criar criança']));
    else next.append(t(['Next', 'Próximo']), icon('next', 18));
    next.disabled = !v.ok;
    note.textContent = v.ok ? '' : v.msg;
  }

  function render() {
    const s = STEPS[state.step];
    clear(rail);
    STEPS.forEach((st, i) => {
      const reach = i <= state.max; const cur = i === state.step;
      rail.append(h('li', null, h('button', { type: 'button', class: 'rail-btn' + (cur ? ' cur' : '') + (i < state.step ? ' done' : ''), disabled: !reach, 'aria-current': cur ? 'step' : null, onclick: () => go(i) }, h('span', { class: 'rail-n' }, i < state.step ? icon('check', 14) : String(i + 1)), h('span', { class: 'rail-t' }, t(st.title)))));
    });
    mobileCount.textContent = `${t(['Step', 'Passo'])} ${state.step + 1} / ${STEPS.length}: ${t(s.title)}`;
    mobileBar.setAttribute('aria-valuenow', String(state.step + 1)); mobileBar.firstChild.style.width = ((state.step + 1) / STEPS.length * 100) + '%';
    clear(main).append(h('header', { class: 'wz-step-head' }, h('p', { class: 'wz-kicker' }, `${t(['Step', 'Passo'])} ${state.step + 1}`), h('h2', null, t(s.title)), infoBtn(s.title, s.help, '?')), h('div', { class: 'wz-step-body' }, R[s.id]()));
    main.scrollTop = 0; const sc = m.body; if (sc) sc.scrollTop = 0; main.closest('.wz-center').scrollTop = 0;
    paintNav(); paintSide();
  }
  const unLang = onLang(() => { if (document.body.contains(m.el)) render(); });
  const origClose = m.close; m.close = (r) => { unLang(); origClose(r); };
  render();
  return m;
}

export function hasDraft() { const d = getDraft(); return !!(d && d.char && d.char.type); }
export function discardDraft() { clearDraft(); }
