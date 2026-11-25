import { h, icon, confirmDialog, toast } from './ui.js';
import { t } from './i18n.js';
import { TYPES } from './data-types.js';
import { listChars, subscribe, removeChar, duplicateChar, exportJSON, importFile, luckMax } from './store.js';
import { portrait, artFor } from './portrait.js';
import { openWizard, hasDraft, discardDraft } from './wizard.js';

export function renderHome(host, nav) {
  const startWizard = () => openWizard({ onDone: (id) => nav('#/sheet/' + id) });
  const draft = hasDraft();

  const heroActions = h('div', { class: 'hero-actions' },
    h('button', { type: 'button', class: 'btn btn-primary btn-lg', onclick: startWizard }, icon('plus', 20), draft ? t(['Continue your Kid', 'Continuar sua criança']) : t(['Create a Kid', 'Criar uma criança'])),
    draft ? h('button', { type: 'button', class: 'btn btn-lg btn-on-dark', onclick: async () => { if (await confirmDialog({ title: t(['Start over?', 'Recomeçar?']), message: t(['The unfinished Kid will be discarded.', 'A criança inacabada será descartada.']), confirmLabel: t(['Start over', 'Recomeçar']), danger: true })) { discardDraft(); nav('#/'); startWizard(); } } }, t(['Start over', 'Recomeçar'])) : null,
    h('a', { class: 'btn btn-lg btn-on-dark', href: '#/guide' }, icon('book', 20), t(['Read the guide', 'Ler o guia'])));

  const hero = h('section', { class: 'hero' },
    h('div', { class: 'hero-bg', style: { backgroundImage: 'url(assets/img/hero.jpg)' }, 'aria-hidden': 'true' }),
    h('div', { class: 'hero-inner' },
      h('img', { class: 'hero-logo', src: 'assets/img/logo.png', alt: 'Tales from the Loop' }),
      h('h1', { class: 'hero-title' }, t(['A digital sheet and guide for the roleplaying game', 'Uma ficha digital e guia para o jogo de RPG'])),
      h('p', { class: 'hero-text' }, t(['Build your Kid step by step with the rules of the book, keep track of Conditions, Luck and Experience, and roll the dice right on the sheet.', 'Monte sua criança passo a passo com as regras do livro, controle Condições, Sorte e Experiência e role os dados direto na ficha.'])),
      heroActions));

  /* ----- crianças salvas ----- */
  const kidsHost = h('section', { class: 'section kids-section', 'aria-labelledby': 'kids-h' });
  const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const n = await importFile(f); toast(t([`${n} Kid(s) imported.`, `${n} criança(s) importada(s).`])); } catch (err) { toast(t(['This file is not a valid Kid export.', 'Este arquivo não é uma exportação válida.'])); }
    e.target.value = '';
  } });
  function paintKids() {
    const list = listChars();
    kidsHost.replaceChildren(
      h('div', { class: 'section-head' }, h('h2', { id: 'kids-h' }, t(['Your Kids', 'Suas crianças'])),
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-sm', onclick: () => file.click() }, icon('upload', 16), t(['Import', 'Importar'])), file,
          h('button', { type: 'button', class: 'btn btn-sm', disabled: !list.length, onclick: () => exportJSON(list) }, icon('download', 16), t(['Export all', 'Exportar todas'])))),
      list.length ? h('ul', { class: 'kid-grid' }, list.map(kidCard)) :
        h('div', { class: 'empty-state' }, h('img', { src: 'assets/kids/' + TYPES[Math.floor(Date.now() / 86400000) % TYPES.length].key + '.jpg', alt: '', class: 'empty-art' }),
          h('p', null, t(['No Kids yet. Create your first one, or import a file.', 'Nenhuma criança ainda. Crie a primeira ou importe um arquivo.'])),
          h('button', { type: 'button', class: 'btn btn-primary', onclick: startWizard }, icon('plus', 18), t(['Create a Kid', 'Criar uma criança']))));
  }
  function kidCard(c) {
    const ty = TYPES.find((x) => x.key === c.type) || TYPES[0];
    const pv = portrait(c, { cls: 'card-portrait' });
    const del = async (e) => { e.preventDefault(); if (await confirmDialog({ title: t(['Delete this Kid?', 'Excluir esta criança?']), message: t(['This cannot be undone. Export first if you want a backup.', 'Isso não pode ser desfeito. Exporte antes se quiser um backup.']), confirmLabel: t(['Delete', 'Excluir']), danger: true })) removeChar(c.id); };
    return h('li', { class: 'kid-card' },
      h('a', { class: 'kid-link', href: '#/sheet/' + c.id, 'aria-label': (c.name || t(['Unnamed Kid', 'Criança sem nome'])) + ', ' + t(ty.name) }, pv.el,
        h('div', { class: 'kid-meta' }, h('strong', null, c.name || t(['Unnamed Kid', 'Criança sem nome'])), h('span', null, `${t(ty.name)}, ${c.age} ${t(['years', 'anos'])}`),
          h('span', { class: 'kid-stats' }, `${t(['Luck', 'Sorte'])} ${luckMax(c) - c.luckSpent}/${luckMax(c)}`))),
      h('div', { class: 'kid-actions' },
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': t(['Duplicate', 'Duplicar']), title: t(['Duplicate', 'Duplicar']), onclick: () => { duplicateChar(c.id); toast(t(['Duplicated.', 'Duplicada.'])); } }, icon('copy', 18)),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': t(['Export', 'Exportar']), title: t(['Export', 'Exportar']), onclick: () => exportJSON([c]) }, icon('download', 18)),
        h('button', { type: 'button', class: 'icon-btn danger', 'aria-label': t(['Delete', 'Excluir']), title: t(['Delete', 'Excluir']), onclick: del }, icon('trash', 18))));
  }
  paintKids();
  const unsub = subscribe(paintKids);

  /* ----- os oito arquétipos ----- */
  const types = h('section', { class: 'section types-section', 'aria-labelledby': 'types-h' },
    h('div', { class: 'section-head' }, h('h2', { id: 'types-h' }, t(['The eight Types', 'Os oito arquétipos'])), h('a', { class: 'btn btn-sm', href: '#/guide/types' }, t(['See all', 'Ver todos']))),
    h('ul', { class: 'type-strip' }, TYPES.map((ty) => h('li', null, h('a', { href: '#/guide/types', class: 'strip-item' }, h('img', { src: artFor(ty.key), alt: '', loading: 'lazy' }), h('span', null, t(ty.name)))))));

  const quick = h('section', { class: 'section quick-section' },
    h('ul', { class: 'quick-grid' },
      qcard('dice', t(['Roll on the sheet', 'Role na ficha']), t(['Dice pools are built from your attributes, skills, Items and Conditions. Push, spend Luck or use Pride with one tap.', 'As reservas de dados são montadas com atributos, perícias, Itens e Condições. Force, gaste Sorte ou use o Orgulho com um toque.'])),
      qcard('book', t(['Rules at hand', 'Regras à mão']), t(['Tap the small "i" next to Conditions, skills and fields to read what they do, without leaving the sheet.', 'Toque no pequeno "i" ao lado de Condições, perícias e campos para ler o que fazem, sem sair da ficha.'])),
      qcard('download', t(['Yours to keep', 'Seus para guardar']), t(['Kids are saved in this browser. Export them as a file to back up or share with your group.', 'As crianças ficam salvas neste navegador. Exporte como arquivo para fazer backup ou compartilhar com o grupo.']))));
  function qcard(ic, title, text) { return h('li', { class: 'quick-card' }, h('span', { class: 'quick-ic' }, icon(ic, 22)), h('h3', null, title), h('p', null, text)); }

  const credit = h('p', { class: 'credit' }, t(['Private fan tool. Tales from the Loop, its art and text belong to Simon Stålenhag and Free League. You need the book to play.', 'Ferramenta de fãs, de uso privado. Tales from the Loop, sua arte e seu texto pertencem a Simon Stålenhag e à Free League. Você precisa do livro para jogar.']));

  host.append(h('div', { class: 'home' }, hero, kidsHost, types, quick, credit));
  return () => unsub();
}
