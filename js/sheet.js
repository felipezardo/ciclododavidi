import { h, icon, clear, bar, infoBtn, openModal, confirmDialog, toast, clamp, showPopover, closePopover } from './ui.js';
import { t, onLang } from './i18n.js';
import { ATTRS, SKILLS, CONDITIONS, XP_QUESTIONS, luckFor } from './data-rules.js';
import { TYPES } from './data-types.js';
import { getChar, saveChar, removeChar, duplicateChar, exportJSON, luckMax, luckNow, penalty, isBroken, normalize } from './store.js';
import { portrait, openPortraitEditor } from './portrait.js';
import { createRoller } from './dice.js';

const L = {
  title: ['CHARACTER SHEET', 'FICHA DE PERSONAGEM'],
  sub: ['TALES FROM THE LOOP', 'CONTOS DO LOOP'],
  attrs: ['ATTRIBUTES', 'ATRIBUTOS'], conds: ['CONDITIONS', 'CONDIÇÕES'], skills: ['SKILLS', 'PERÍCIAS'], xp: ['EXPERIENCE', 'EXPERIÊNCIA'],
  name: ['NAME', 'NOME'], type: ['TYPE', 'ARQUÉTIPO'], age: ['AGE', 'IDADE'], luck: ['LUCK POINTS', 'PONTOS DE SORTE'],
  drive: ['DRIVE', 'ÍMPETO'], anchor: ['ANCHOR', 'ÂNCORA'], problem: ['PROBLEM', 'PROBLEMA'], pride: ['PRIDE', 'ORGULHO'],
  desc: ['DESCRIPTION', 'DESCRIÇÃO'], song: ['FAVORITE SONG', 'MÚSICA FAVORITA'], rel: ['RELATIONSHIPS', 'RELACIONAMENTOS'],
  kid: ['KID', 'CRIANÇA'], npc: ['NPC', 'PNJ'], items: ['ITEMS', 'ITENS'], bonus: ['BONUS', 'BÔNUS'], iconic: ['ICONIC ITEM', 'ITEM ICÔNICO'],
  hideout: ['HIDEOUT', 'ESCONDERIJO'], notes: ['NOTES', 'ANOTAÇÕES']
};

const HELP = {
  luck: [['Luck Points', 'Pontos de Sorte'], ['After a failed roll, spend one Luck Point to reroll the failed dice. You start with 15 minus your age, refilled at the start of every session, and lose one maximum point each birthday. Tap a box to set how many you have left.', 'Depois de uma rolagem falha, gaste 1 Ponto de Sorte para rolar de novo os dados que falharam. Você começa com 15 menos a sua idade, recupera tudo no início de cada sessão e perde 1 ponto máximo a cada aniversário. Toque numa caixa para definir quantos ainda tem.']],
  type: [['Type', 'Arquétipo'], ['Your Type gives you three key skills that can start at level 3. Ideally only one Kid of each Type is in the group.', 'Seu Arquétipo dá três perícias-chave que podem começar no nível 3. O ideal é haver só uma criança de cada Arquétipo no grupo.']],
  age: [['Age', 'Idade'], ['Kids are 10 to 15. Each birthday gives +1 attribute point (max 5) and -1 maximum Luck Point. At 16 the Kid moves on and you create a new one.', 'As crianças têm de 10 a 15 anos. A cada aniversário você ganha +1 ponto de atributo (máx. 5) e perde 1 Ponto de Sorte máximo. Aos 16, a criança segue em frente e você cria outra.']],
  drive: [['Drive', 'Ímpeto'], ['The reason you face danger to solve Mysteries with your friends. You may change it between Mysteries.', 'O motivo pelo qual você enfrenta o perigo para resolver Mistérios com os amigos. Pode mudar entre Mistérios.']],
  anchor: [['Anchor', 'Âncora'], ['A person who gives you support and care: a parent, teacher, neighbor. Never another Kid. Spend a scene with your Anchor, close to each other, and heal all Conditions. The Gamemaster cannot put you in Trouble in that scene.', 'Uma pessoa que dá apoio e cuidado: pai, mãe, professor, vizinho. Nunca outra criança. Passe uma cena com sua Âncora, próximos um do outro, e cure todas as Condições. O Mestre não pode te meter em encrenca nessa cena.']],
  problem: [['Problem', 'Problema'], ['Something from Everyday Life that worries you. The Gamemaster uses it to put you in Trouble. If you solve it, pick a new one before the next Mystery.', 'Algo da vida cotidiana que preocupa você. O Mestre o usa para te meter em encrenca. Se resolvê-lo, escolha outro antes do próximo Mistério.']],
  pride: [['Pride', 'Orgulho'], ['What makes you feel strong and important. Once per Mystery, check it to get one automatic success on a roll (after a failure, or to add a success). Explain how it helps. The box is checked when used.', 'O que faz você se sentir forte e importante. Uma vez por Mistério, marque para ter um sucesso automático numa rolagem (após falha, ou para somar um sucesso). Explique como ajuda. A caixa é marcada ao usar.']],
  rel: [['Relationships', 'Relacionamentos'], ['Define one Relationship to each other Kid, and two to NPCs. NPC Relationships connect you to the strange things that will happen in the Mystery.', 'Defina um Relacionamento com cada outra criança e dois com PNJs. Os Relacionamentos com PNJs ligam você às coisas estranhas que vão acontecer no Mistério.']],
  items: [['Items', 'Itens'], ['Items add 1 to 3 dice when it is obvious how they help. Your Iconic Item gives +2, never breaks or disappears, and cannot be used by others. Other Items are lost between Mysteries.', 'Itens somam de 1 a 3 dados quando fica claro como ajudam. Seu Item Icônico dá +2, nunca quebra nem some e não pode ser usado por outros. Os demais Itens se perdem entre Mistérios.']],
  hideout: [['Hideout', 'Esconderijo'], ['The place the Kids share, where they are alone and safe. The Gamemaster may not put you in Trouble there, and if two or more Kids stay close you can heal Conditions as with an Anchor.', 'O lugar que as crianças dividem, onde ficam a sós e seguras. O Mestre não pode te meter em encrenca lá e, se duas ou mais crianças ficam próximas, vocês curam Condições como com uma Âncora.']],
  xp: [['Experience', 'Experiência'], ['After a Mystery you earn 1 XP for each "yes" to five questions. Five XP raise a skill by one level (max 5). You can save at most 10 XP and spend them only between sessions.', 'Depois de um Mistério você ganha 1 XP por cada "sim" a cinco perguntas. Cinco XP aumentam uma perícia em um nível (máx. 5). Você guarda no máximo 10 XP e só gasta entre sessões.']]
};

export function renderSheet(id, host, nav) {
  let c = getChar(id);
  if (!c) { host.append(h('div', { class: 'empty-state' }, h('p', null, t(['This Kid was not found.', 'Esta criança não foi encontrada.'])), h('a', { class: 'btn btn-primary', href: '#/' }, t(['Back to Kids', 'Voltar às crianças'])))); return () => {}; }
  const get = () => c;
  const save = (silent = true) => saveChar(c, { silent });
  const typeOf = () => TYPES.find((x) => x.key === c.type) || TYPES[0];

  /* ------------ cabeçalho do documento ------------ */
  const logo = h('img', { class: 'sheet-logo', src: 'assets/img/logo.png', alt: 'Tales from the Loop' });
  const docHead = h('div', { class: 'doc-head' }, h('p', { class: 'doc-kicker' }, t(L.title)), logo, h('p', { class: 'doc-sub' }, t(L.sub)));

  /* ------------ helpers de campo ------------ */
  const bindText = (key, { area = false, rows = 2, ph = '' } = {}) => {
    const el = area ? h('textarea', { rows, spellcheck: 'true', placeholder: ph }) : h('input', { type: 'text', placeholder: ph, autocomplete: 'off' });
    el.value = c[key] || '';
    el.addEventListener('input', () => { c[key] = el.value; save(); if (key === 'name') paintTitle(); if (area) grow(el); });
    if (area) queueMicrotask(() => grow(el));
    return el;
  };
  const grow = (el) => { el.style.height = 'auto'; el.style.height = Math.max(el.scrollHeight, 0) + 'px'; };
  const cell = (label, control, extra, cls = '') => h('div', { class: 'cell ' + cls }, h('label', { class: 'cell-label' }, h('span', null, t(label)), extra || null), control);

  const numBox = (get_, set_, min, max, label) => {
    const el = h('input', { type: 'number', class: 'numbox', min, max, inputmode: 'numeric', 'aria-label': label });
    el.value = get_();
    el.addEventListener('input', () => { if (el.value === '') return; const v = clamp(parseInt(el.value, 10) || 0, min, max); set_(v); save(); onData(); });
    el.addEventListener('blur', () => { el.value = get_(); });
    el.addEventListener('focus', () => el.select());
    return el;
  };
  const checkBox = (get_, set_, label) => {
    const el = h('input', { type: 'checkbox', class: 'checkbox', 'aria-label': label });
    el.checked = !!get_();
    el.addEventListener('change', () => { set_(el.checked); save(); onData(); });
    return el;
  };

  /* ------------ painel de atributos ------------ */
  const attrRows = ATTRS.map((a) => {
    const input = numBox(() => c.attrs[a.key], (v) => { c.attrs[a.key] = v; }, 1, 5, t(a.name));
    input.dataset.attr = a.key;
    return h('div', { class: 'row' }, h('span', { class: 'row-label' }, t(a.name), infoBtn(a.name, a.desc)), h('span', { class: 'row-tools' }, h('button', { type: 'button', class: 'roll-mini', 'aria-label': t(['Roll ', 'Rolar ']) + t(a.name), title: t(['Roll ', 'Rolar ']) + t(a.name), onclick: () => rollFor('attr', a.key) }, icon('dice', 16)), input));
  });
  const attrPanel = h('section', { class: 'panel' }, bar(t(L.attrs)), attrRows);

  /* ------------ condições ------------ */
  const penaltyChip = h('div', { class: 'cond-note', role: 'status' });
  const condRows = CONDITIONS.map((cd) => h('div', { class: 'row' },
    h('span', { class: 'row-label' }, t(cd.name), infoBtn(cd.name, cd.desc)),
    h('span', { class: 'row-tools' }, checkBox(() => c.cond[cd.key], (v) => { c.cond[cd.key] = v; }, t(cd.name)))));
  const condPanel = h('section', { class: 'panel' }, bar(t(L.conds), infoBtn(['Conditions', 'Condições'], () => h('div', null,
    h('p', null, t(['Kids cannot die, but they suffer Conditions when they fail or push a roll. Each mild Condition gives -1 on all dice rolls (cumulative). A fifth Condition makes you Broken: automatic failure until healed.', 'As crianças não morrem, mas sofrem Condições quando falham ou forçam uma rolagem. Cada Condição leve dá -1 em todas as rolagens (acumulativo). Uma quinta Condição deixa você Acabado: falha automática até se curar.'])),
    h('p', null, t(['Heal all Conditions in a scene with your Anchor or in the Hideout. All Conditions are healed between Mysteries.', 'Cure todas as Condições numa cena com sua Âncora ou no Esconderijo. Todas as Condições se curam entre Mistérios.'])),
  ), '?')), condRows, penaltyChip);

  /* ------------ perícias ------------ */
  const skillRows = SKILLS.map((s) => {
    const key = typeOf().skills.includes(s.key);
    const input = numBox(() => c.skills[s.key], (v) => { c.skills[s.key] = v; }, 0, 5, t(s.name));
    const attrName = t(ATTRS.find((a) => a.key === s.attr).name);
    const info = () => h('div', null,
      h('p', null, t(s.desc)),
      s.questions.length ? h('div', null, h('strong', null, t(['Questions you can ask', 'Perguntas que você pode fazer'])), h('ul', null, s.questions.map((q) => h('li', null, t(q))))) : null,
      s.bonus.length ? h('div', null, h('strong', null, t(['Bonus effects', 'Efeitos bônus'])), h('ul', null, s.bonus.map((q) => h('li', null, t(q))))) : null);
    return h('div', { class: 'row', dataset: { skill: s.key } },
      h('span', { class: 'row-label' }, `${t(s.name)} (${attrName})`, key ? h('span', { class: 'key-dot', title: t(['Key skill of your Type', 'Perícia-chave do seu Arquétipo']) }) : null, infoBtn(s.name, info)),
      h('span', { class: 'row-tools' }, h('button', { type: 'button', class: 'roll-mini', 'aria-label': t(['Roll ', 'Rolar ']) + t(s.name), title: t(['Roll ', 'Rolar ']) + t(s.name), onclick: () => rollFor('skill', s.key) }, icon('dice', 16)), input));
  });
  const skillPanel = h('section', { class: 'panel' }, bar(t(L.skills), infoBtn(['Skills', 'Perícias'], t(['Each skill adds dice to the roll on top of its attribute. A dot marks the key skills of your Type. At the start a skill is at most 3 (key) or 1 (others); XP can raise any skill to 5.', 'Cada perícia soma dados à rolagem além do atributo. Um ponto marca as perícias-chave do seu Arquétipo. No início, uma perícia vai até 3 (chave) ou 1 (outras); o XP pode levar qualquer uma a 5.']), '?')), skillRows);

  /* ------------ experiência ------------ */
  const xpBoxes = Array.from({ length: 10 }, (_, i) => h('button', { type: 'button', class: 'xp-box', role: 'checkbox', 'aria-label': `XP ${i + 1}`, onclick: () => { c.xp = c.xp === i + 1 ? i : i + 1; save(); paintXp(); } }));
  const xpSpend = h('button', { type: 'button', class: 'btn btn-sm', onclick: spendXp }, icon('up', 15), t(['Spend 5 XP', 'Gastar 5 XP']));
  const xpAsk = h('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: askXp }, t(['End-of-session questions', 'Perguntas de fim de sessão']));
  const xpPanel = h('section', { class: 'panel' }, bar(t(L.xp), infoBtn(HELP.xp[0], HELP.xp[1], '?')), h('div', { class: 'xp-row' }, xpBoxes), h('div', { class: 'xp-actions' }, xpSpend, xpAsk));
  function paintXp() { xpBoxes.forEach((b, i) => { b.classList.toggle('on', i < c.xp); b.setAttribute('aria-checked', String(i < c.xp)); }); xpSpend.disabled = c.xp < 5; }

  /* ------------ bloco de informações ------------ */
  const portraitBtn = h('button', { type: 'button', class: 'portrait-btn', 'aria-label': t(['Edit portrait', 'Editar retrato']), onclick: editPortrait });
  const portraitView = portrait(c, { cls: 'sheet-portrait' });
  portraitBtn.append(portraitView.el, h('span', { class: 'portrait-edit-tag' }, icon('image', 15), t(['Portrait', 'Retrato'])));
  function editPortrait() { openPortraitEditor(c, (p) => { c.portrait = p; save(); portraitView.update(c); toast(t(['Portrait updated.', 'Retrato atualizado.'])); }); }

  const typeSel = h('select', { 'aria-label': t(L.type) }, TYPES.map((x) => h('option', { value: x.key }, t(x.name))));
  typeSel.value = c.type;
  typeSel.addEventListener('change', () => { c.type = typeSel.value; save(); portraitView.update(c); skillRows.forEach((r) => { const k = typeOf().skills.includes(r.dataset.skill); r.querySelector('.key-dot')?.remove(); if (k) r.querySelector('.row-label').insertBefore(h('span', { class: 'key-dot', title: t(['Key skill of your Type', 'Perícia-chave do seu Arquétipo']) }), r.querySelector('.info-btn')); }); onData(); });

  const ageInput = numBox(() => c.age, (v) => { c.age = v; c.luckSpent = Math.min(c.luckSpent, luckMax(c)); }, 10, 15, t(L.age));
  const luckBoxes = Array.from({ length: 5 }, (_, i) => h('button', { type: 'button', class: 'luck-box', role: 'checkbox', 'aria-label': `${t(L.luck)} ${i + 1}`, onclick: () => { const avail = luckNow(c); const next = avail === i + 1 ? i : i + 1; c.luckSpent = luckMax(c) - next; save(); paintLuck(); roller.refresh(); } }));
  function paintLuck() { const now = luckNow(c), max = luckMax(c); luckBoxes.forEach((b, i) => { b.disabled = i >= max; b.classList.toggle('on', i < now); b.setAttribute('aria-checked', String(i < now)); }); luckCount.textContent = `${now}/${max}`; }
  const luckCount = h('output', { class: 'luck-count' });
  const prideBox = checkBox(() => c.prideUsed, (v) => { c.prideUsed = v; }, t(['Pride used', 'Orgulho usado']));
  prideBox.title = t(['Check when you use your Pride this Mystery', 'Marque ao usar o Orgulho neste Mistério']);

  const info = h('section', { class: 'panel info-panel' },
    h('div', { class: 'info-top' },
      portraitBtn,
      h('div', { class: 'info-grid' },
        cell(L.name, bindText('name', { ph: t(['Name', 'Nome']) }), null, 'c-name'),
        cell(L.type, typeSel, infoBtn(HELP.type[0], HELP.type[1]), 'c-type'),
        cell(L.age, ageInput, infoBtn(HELP.age[0], HELP.age[1]), 'c-age'),
        cell(L.luck, h('div', { class: 'luck-row' }, luckBoxes, luckCount), infoBtn(HELP.luck[0], HELP.luck[1]), 'c-luck accent'),
        cell(L.drive, bindText('drive'), infoBtn(HELP.drive[0], HELP.drive[1]), 'c-drive'),
        cell(L.anchor, bindText('anchor'), infoBtn(HELP.anchor[0], HELP.anchor[1]), 'c-anchor'))),
    cell(L.problem, bindText('problem', { area: true }), infoBtn(HELP.problem[0], HELP.problem[1]), 'wide'),
    h('div', { class: 'cell wide pride-cell' }, h('label', { class: 'cell-label' }, h('span', null, t(L.pride)), infoBtn(HELP.pride[0], HELP.pride[1])), h('div', { class: 'pride-body' }, bindText('pride', { area: true }), prideBox)),
    cell(L.desc, bindText('description', { area: true }), null, 'wide'),
    cell(L.song, bindText('song'), null, 'wide'));

  /* ------------ relacionamentos ------------ */
  const relRows = [];
  c.relKids.forEach((r, i) => {
    const who = h('input', { type: 'text', class: 'rel-who', placeholder: t(['Who', 'Quem']), 'aria-label': `${t(L.kid)} ${i + 1}` }); who.value = r.who;
    who.addEventListener('input', () => { r.who = who.value; save(); });
    const txt = h('input', { type: 'text', class: 'rel-text', 'aria-label': `${t(L.kid)} ${i + 1}` }); txt.value = r.text;
    txt.addEventListener('input', () => { r.text = txt.value; save(); });
    relRows.push(h('div', { class: 'rel-row' }, h('span', { class: 'cell-label' }, `${t(L.kid)} ${i + 1}`), who, txt));
  });
  c.relNpcs.forEach((r, i) => {
    const txt = h('input', { type: 'text', class: 'rel-text rel-npc', 'aria-label': `${t(L.npc)} ${i + 1}` }); txt.value = r;
    txt.addEventListener('input', () => { c.relNpcs[i] = txt.value; save(); });
    relRows.push(h('div', { class: 'rel-row' }, h('span', { class: 'cell-label' }, `${t(L.npc)} ${i + 1}`), txt));
  });
  const relPanel = h('section', { class: 'panel' }, bar(t(L.rel), infoBtn(HELP.rel[0], HELP.rel[1], '?')), relRows);

  /* ------------ itens ------------ */
  const iconicInput = bindText('iconic');
  const itemRows = c.items.map((it, i) => {
    const name = h('input', { type: 'text', 'aria-label': `${t(L.items)} ${i + 1}` }); name.value = it.name;
    name.addEventListener('input', () => { it.name = name.value; save(); roller.refresh(); });
    const b = numBox(() => it.bonus, (v) => { it.bonus = v; }, 0, 3, t(L.bonus));
    return h('div', { class: 'item-row' }, name, b);
  });
  const itemsPanel = h('section', { class: 'panel items-panel' }, bar(t(L.items), h('span', { class: 'bar-aside' }, t(L.bonus), infoBtn(HELP.items[0], HELP.items[1], '?'))),
    h('div', { class: 'item-row iconic' }, h('label', null, h('span', { class: 'cell-label' }, t(L.iconic)), iconicInput), h('span', { class: 'fixed-bonus' }, '+2')), itemRows);
  const hideoutPanel = h('section', { class: 'panel ruled-panel' }, bar(t(L.hideout), infoBtn(HELP.hideout[0], HELP.hideout[1], '?')), h('div', { class: 'ruled' }, bindText('hideout', { area: true, rows: 6 })));
  const notesPanel = h('section', { class: 'panel ruled-panel' }, bar(t(L.notes)), h('div', { class: 'ruled' }, bindText('notes', { area: true, rows: 4 })));

  /* ------------ barra de ferramentas ------------ */
  const titleEl = h('span', { class: 'tb-title' });
  const paintTitle = () => { titleEl.textContent = c.name || t(['New Kid', 'Nova criança']); };
  const rollBtn = h('button', { type: 'button', class: 'btn btn-primary tb-roll', onclick: () => toggleRoller(true) }, icon('dice', 20), h('span', null, t(['Dice', 'Dados'])));
  const moreBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': t(['More actions', 'Mais ações']), 'aria-haspopup': 'menu', onclick: (e) => { e.stopPropagation(); menu.classList.toggle('open'); } }, icon('dots', 20));
  const menu = h('div', { class: 'menu', role: 'menu' },
    mi('print', t(['Print sheet', 'Imprimir ficha']), () => window.print()),
    mi('download', t(['Export this Kid (JSON)', 'Exportar esta criança (JSON)']), () => exportJSON([c])),
    mi('copy', t(['Duplicate', 'Duplicar']), () => { const d = duplicateChar(c.id); if (d) { toast(t(['Duplicated.', 'Duplicada.'])); nav('#/sheet/' + d.id); } }),
    mi('trash', t(['Delete', 'Excluir']), async () => { if (await confirmDialog({ title: t(['Delete this Kid?', 'Excluir esta criança?']), message: t(['This cannot be undone. Export first if you want a backup.', 'Isso não pode ser desfeito. Exporte antes se quiser um backup.']), confirmLabel: t(['Delete', 'Excluir']), danger: true })) { removeChar(c.id); nav('#/'); } }, true));
  function mi(ic, label, fn, danger) { return h('button', { type: 'button', role: 'menuitem', class: 'menu-item' + (danger ? ' danger' : ''), onclick: () => { menu.classList.remove('open'); fn(); } }, icon(ic, 18), label); }
  const closeMenu = (e) => { if (!e.target.closest('.menu-wrap')) menu.classList.remove('open'); };
  document.addEventListener('click', closeMenu);

  const toolbar = h('div', { class: 'sheet-toolbar' },
    h('a', { class: 'icon-btn', href: '#/', 'aria-label': t(['Back to Kids', 'Voltar às crianças']), title: t(['Back to Kids', 'Voltar às crianças']) }, icon('back', 20)),
    titleEl,
    h('div', { class: 'tb-actions' },
      h('button', { type: 'button', class: 'btn btn-sm', onclick: growOlder }, icon('up', 16), h('span', { class: 'lbl-md' }, t(['Birthday', 'Aniversário']))),
      h('button', { type: 'button', class: 'btn btn-sm', onclick: sessionMenu }, icon('clock', 16), h('span', { class: 'lbl-md' }, t(['Session', 'Sessão']))),
      rollBtn,
      h('div', { class: 'menu-wrap' }, moreBtn, menu)));

  /* ------------ montagem ------------ */
  const left = h('div', { class: 'col col-left' }, attrPanel, condPanel, skillPanel, xpPanel);
  const right = h('div', { class: 'col col-right' }, info, relPanel, h('div', { class: 'items-hide' }, itemsPanel, hideoutPanel), notesPanel);
  const footer = h('div', { class: 'doc-foot', 'aria-hidden': 'true' }, h('span', { class: 'rule' }), h('img', { src: 'assets/img/emblem.png', alt: '' }), h('span', { class: 'rule' }));
  const paper = h('div', { class: 'paper' }, docHead, h('div', { class: 'sheet-grid' }, left, right), footer);

  /* ------------ rolador ------------ */
  const roller = createRoller(get, { onChange: () => { syncFromChar(); } });
  const drawer = h('div', { class: 'roller-drawer', 'aria-hidden': 'true' },
    h('button', { type: 'button', class: 'icon-btn drawer-close', 'aria-label': t(['Close dice', 'Fechar dados']), onclick: () => toggleRoller(false) }, icon('close', 20)), roller.el);
  const fab = h('button', { type: 'button', class: 'fab', 'aria-label': t(['Open dice', 'Abrir dados']), onclick: () => toggleRoller(true) }, icon('dice', 26));
  function toggleRoller(open) {
    document.body.classList.toggle('roller-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (open && window.innerWidth < 1100) document.body.classList.add('modal-open'); else document.body.classList.remove('modal-open');
  }
  function rollFor(kind, key) { roller.selectRoll(kind, key); toggleRoller(true); }

  /* ------------ derivados ------------ */
  function onData() { syncFromChar(); roller.refresh(); }
  function syncFromChar() {
    const pen = penalty(c);
    penaltyChip.className = 'cond-note' + (isBroken(c) ? ' broken' : pen ? ' active' : '');
    penaltyChip.textContent = isBroken(c) ? t(['Broken: automatic failure on all rolls', 'Acabado: falha automática em todas as rolagens']) : pen ? t(['-', '-']) + pen + t([' on all dice rolls', ' em todas as rolagens']) : t(['No Conditions', 'Sem Condições']);
    // sincroniza campos que podem ter mudado por ações externas (empurrar/sorte/orgulho)
    CONDITIONS.forEach((cd, i) => { const el = condRows[i].querySelector('input'); if (el) el.checked = !!c.cond[cd.key]; });
    prideBox.checked = !!c.prideUsed;
    paintLuck(); paintXp();
  }

  /* ------------ aniversário ------------ */
  function growOlder() {
    if (c.age >= 15) {
      confirmDialog({ title: t(['Turning 16', 'Fazendo 16 anos']), message: t(['At 16 a Kid is no longer a Kid for this game. Time to create a new one. You can keep this sheet as a record.', 'Aos 16 anos, a criança deixa de ser criança neste jogo. Hora de criar uma nova. Você pode manter esta ficha como registro.']), confirmLabel: t(['Create a new Kid', 'Criar nova criança']) }).then((ok) => { if (ok) nav('#/new'); });
      return;
    }
    let pick = null;
    const grid = h('div', { class: 'choice-grid cols-2' });
    const btns = ATTRS.map((a) => {
      const full = c.attrs[a.key] >= 5;
      const b = h('button', { type: 'button', class: 'choice', disabled: full, 'aria-pressed': 'false', onclick: () => { pick = a.key; btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); ok.disabled = false; } },
        h('strong', null, t(a.name)), h('span', { class: 'choice-sub' }, `${c.attrs[a.key]} → ${Math.min(5, c.attrs[a.key] + 1)}`));
      grid.append(b); return b;
    });
    const ok = h('button', { type: 'button', class: 'btn btn-primary', disabled: true, onclick: () => { c.age += 1; c.attrs[pick] += 1; c.luckSpent = Math.min(c.luckSpent, luckMax(c)); save(); m.close(); refreshFields(); toast(t(['Happy birthday! Age ', 'Feliz aniversário! Idade ']) + c.age + '.'); } }, t(['Apply birthday', 'Aplicar aniversário']));
    const m = openModal({
      title: t(['Birthday', 'Aniversário']), size: 'md',
      body: h('div', null, h('p', { class: 'prose' }, t([`${c.name || 'Your Kid'} turns ${c.age + 1}. You gain one attribute point (max 5 per attribute) and your maximum Luck Points drop to ${luckFor(c.age + 1)}.`, `${c.name || 'Sua criança'} faz ${c.age + 1} anos. Você ganha 1 ponto de atributo (máx. 5 por atributo) e seu máximo de Pontos de Sorte cai para ${luckFor(c.age + 1)}.`])), h('p', { class: 'lbl' }, t(['Choose the attribute to raise', 'Escolha o atributo a aumentar'])), grid),
      footer: [h('button', { type: 'button', class: 'btn', onclick: () => m.close() }, t(['Cancel', 'Cancelar'])), ok]
    });
  }
  function refreshFields() {
    ageInput.value = c.age;
    document.querySelectorAll('[data-attr]').forEach((i) => { i.value = c.attrs[i.dataset.attr]; });
    SKILLS.forEach((s, i) => { skillRows[i].querySelector('input').value = c.skills[s.key]; });
    onData();
  }

  /* ------------ XP ------------ */
  function spendXp() {
    if (c.xp < 5) return;
    let pick = null;
    const grid = h('div', { class: 'choice-grid cols-2' });
    const btns = SKILLS.map((s) => {
      const full = c.skills[s.key] >= 5;
      const b = h('button', { type: 'button', class: 'choice', disabled: full, 'aria-pressed': 'false', onclick: () => { pick = s.key; btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); ok.disabled = false; } },
        h('strong', null, t(s.name)), h('span', { class: 'choice-sub' }, `${c.skills[s.key]} → ${Math.min(5, c.skills[s.key] + 1)}`));
      grid.append(b); return b;
    });
    const ok = h('button', { type: 'button', class: 'btn btn-primary', disabled: true, onclick: () => { c.skills[pick] += 1; c.xp -= 5; save(); m.close(); refreshFields(); toast(t(['Skill raised.', 'Perícia aumentada.'])); } }, t(['Spend 5 XP', 'Gastar 5 XP']));
    const m = openModal({ title: t(['Raise a skill', 'Aumentar uma perícia']), body: h('div', null, h('p', { class: 'prose' }, t(['Five XP raise one skill by one level (maximum 5).', 'Cinco XP aumentam uma perícia em um nível (máximo 5).'])), grid), footer: [h('button', { type: 'button', class: 'btn', onclick: () => m.close() }, t(['Cancel', 'Cancelar'])), ok] });
  }
  function askXp() {
    let n = 0;
    const out = h('output', { class: 'xp-total' }, '0');
    const list = h('ul', { class: 'check-list' }, XP_QUESTIONS.map((q, i) => h('li', null, h('label', null, h('input', { type: 'checkbox', class: 'checkbox', checked: i === 0, onchange: (e) => { n += e.target.checked ? 1 : -1; out.textContent = n; } }), h('span', null, t(q))))));
    n = 1; out.textContent = '1';
    const m = openModal({
      title: t(['Experience questions', 'Perguntas de experiência']), body: h('div', null, h('p', { class: 'prose' }, t(['After the Mystery (or the session), the Gamemaster reads five questions. You get 1 XP for each "yes". You can keep at most 10 XP.', 'Depois do Mistério (ou da sessão), o Mestre lê cinco perguntas. Você ganha 1 XP por cada "sim". Pode guardar no máximo 10 XP.'])), list, h('p', { class: 'xp-sum' }, t(['XP earned: ', 'XP ganho: ']), out)),
      footer: [h('button', { type: 'button', class: 'btn', onclick: () => m.close() }, t(['Cancel', 'Cancelar'])), h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { c.xp = clamp(c.xp + n, 0, 10); save(); paintXp(); m.close(); toast(`+${n} XP`); } }, t(['Add XP', 'Adicionar XP']))]
    });
  }

  /* ------------ sessão ------------ */
  function sessionMenu() {
    const act = (title, desc, fn) => h('button', { type: 'button', class: 'choice choice-wide', onclick: () => { fn(); m.close(); refreshFields(); } }, h('strong', null, title), h('span', { class: 'choice-sub' }, desc));
    const m = openModal({
      title: t(['Session and Mystery', 'Sessão e Mistério']), size: 'md',
      body: h('div', { class: 'choice-list' },
        act(t(['Heal all Conditions', 'Curar todas as Condições']), t(['After a scene with your Anchor or in the Hideout.', 'Depois de uma cena com sua Âncora ou no Esconderijo.']), () => { Object.keys(c.cond).forEach((k) => { c.cond[k] = false; }); save(); toast(t(['Conditions healed.', 'Condições curadas.'])); }),
        act(t(['New session', 'Nova sessão']), t(['Refills your Luck Points. Your Pride can be used again if the Mystery spans several sessions.', 'Recupera seus Pontos de Sorte. O Orgulho pode ser usado de novo se o Mistério durar várias sessões.']), () => { c.luckSpent = 0; c.prideUsed = false; save(); toast(t(['Luck refilled.', 'Sorte recuperada.'])); }),
        act(t(['Close the Mystery', 'Encerrar o Mistério']), t(['Heals all Conditions, refills Luck, frees your Pride and removes every Item except your Iconic Item. Then review your Problem, Pride, Drive and Relationships.', 'Cura todas as Condições, recupera a Sorte, libera o Orgulho e remove todos os Itens, exceto o Item Icônico. Depois, revise Problema, Orgulho, Ímpeto e Relacionamentos.']), () => { Object.keys(c.cond).forEach((k) => { c.cond[k] = false; }); c.luckSpent = 0; c.prideUsed = false; c.items.forEach((it) => { it.name = ''; it.bonus = 0; }); save(); itemRows.forEach((r, i) => { r.querySelector('input[type=text]').value = ''; r.querySelector('input[type=number]').value = 0; }); toast(t(['Mystery closed.', 'Mistério encerrado.'])); })),
      footer: h('button', { type: 'button', class: 'btn', onclick: () => m.close() }, t(['Close', 'Fechar']))
    });
  }

  host.append(h('div', { class: 'sheet-page' }, toolbar, paper), drawer, fab);
  paintTitle(); syncFromChar();
  roller.refresh();
  window.addEventListener('resize', () => { [...paper.querySelectorAll('textarea')].forEach(grow); });
  requestAnimationFrame(() => paper.querySelectorAll('textarea').forEach(grow));

  return () => { document.removeEventListener('click', closeMenu); document.body.classList.remove('roller-open', 'modal-open'); closePopover(); };
}
