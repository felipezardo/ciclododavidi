import { h, icon, clear, infoBtn } from './ui.js';
import { t, tf } from './i18n.js';
import { ATTRS, SKILLS, CONDITIONS, XP_QUESTIONS, CHANCE } from './data-rules.js';
import { TYPES, QUESTIONS_KIDS, QUESTIONS_GROUP } from './data-types.js';
import { artFor } from './portrait.js';

const P = (...a) => h('p', null, ...a);
const UL = (items) => h('ul', { class: 'g-list' }, items.map((x) => h('li', null, typeof x === 'object' && !(x instanceof Node) ? t(x) : x)));
const H = (txt) => h('h3', null, t(txt));

const SECTIONS = [
  { id: 'start', title: ['The game', 'O jogo'], render: () => [
    P(t(['In Tales from the Loop you play Kids aged 10 to 15 in the late 1980s of a world where a huge particle accelerator, the Loop, has filled the landscape with strange machines and creatures. A story is called a Mystery. Everyday life is still dull and unforgiving, and adults are out of reach.', 'Em Contos do Loop você interpreta crianças de 10 a 15 anos no fim dos anos 1980 de um mundo onde um enorme acelerador de partículas, o Loop, encheu a paisagem de máquinas e criaturas estranhas. Uma história se chama Mistério. A vida cotidiana continua chata e implacável, e os adultos estão fora de alcance.'])),
    P(t(['All players but one create a Kid. One player is the Gamemaster, who plays everyone else, describes the world and puts the Kids in Trouble. You need paper, pens and at least ten six-sided dice. A typical Mystery takes three to six hours.', 'Todos os jogadores, menos um, criam uma criança. Um jogador é o Mestre, que interpreta todos os demais, descreve o mundo e põe as crianças em encrenca. Você precisa de papel, lápis e pelo menos dez dados de seis lados. Um Mistério típico dura de três a seis horas.'])),
    H(['The six principles', 'Os seis princípios']),
    UL([['Your home town is full of strange and fantastic things.', 'Sua cidade natal está cheia de coisas estranhas e fantásticas.'], ['Everyday life is dull and unforgiving.', 'A vida cotidiana é chata e implacável.'], ['Adults are out of reach and out of touch.', 'Os adultos estão fora de alcance e desligados da realidade.'], ['The land of the Loop is dangerous, but Kids will not die.', 'A terra do Loop é perigosa, mas as crianças não morrem.'], ['The game is played scene by scene.', 'O jogo é jogado cena a cena.'], ['The world is described collaboratively.', 'O mundo é descrito em conjunto.']]),
    H(['Mood', 'Clima']),
    P(t(['Stress three themes: nostalgia, everyday life and the machines. Describe a few details with all the senses, and do not forget the season and the weather.', 'Enfatize três temas: nostalgia, vida cotidiana e as máquinas. Descreva alguns detalhes usando todos os sentidos e não esqueça a estação e o clima.']))
  ] },
  { id: 'dice', title: ['Rolling dice', 'Rolando dados'], render: () => [
    P(t(['When a Kid tries something hard, you describe what you do and roll a number of six-sided dice equal to your attribute plus your level in the matching skill. Every six is a success. Usually one success is enough.', 'Quando uma criança tenta algo difícil, você descreve o que faz e rola um número de dados de seis lados igual ao seu atributo mais o seu nível na perícia correspondente. Cada seis é um sucesso. Em geral, um sucesso basta.'])),
    H(['Extra dice', 'Dados extras']),
    UL([['An Item gives +1 to +3 dice when it is obvious how it helps. Your Iconic Item gives +2.', 'Um Item dá de +1 a +3 dados quando fica óbvio como ajuda. Seu Item Icônico dá +2.'], ['A friend who helps gives you 1 extra die, but is bound to the outcome. Only one helper per roll.', 'Um amigo que ajuda dá a você 1 dado extra, mas fica preso ao resultado. Só um ajudante por rolagem.'], ['An NPC may rarely give 1 to 3 bonus dice.', 'Um PNJ pode, raramente, dar de 1 a 3 dados bônus.'], ['Every Condition gives -1 die.', 'Cada Condição dá -1 dado.']]),
    H(['How many successes', 'Quantos sucessos']),
    h('table', { class: 'g-table' }, h('tbody', null,
      h('tr', null, h('th', null, t(['Difficult (normal)', 'Difícil (normal)'])), h('td', null, '1')),
      h('tr', null, h('th', null, t(['Extremely Difficult', 'Extremamente difícil'])), h('td', null, '2')),
      h('tr', null, h('th', null, t(['Almost Impossible', 'Quase impossível'])), h('td', null, '3')))),
    H(['Buying effects', 'Comprando efeitos']),
    P(t(['Extra successes can buy bonus effects listed under each skill. They are a way to get more than you asked for, not to achieve what you set out to do.', 'Sucessos extras podem comprar efeitos bônus listados em cada perícia. Servem para conseguir mais do que você pediu, não para alcançar o que você se propôs a fazer.'])),
    H(['Chance to succeed', 'Chance de sucesso']),
    h('table', { class: 'g-table g-chance' }, h('thead', null, h('tr', null, h('th', null, t(['Dice', 'Dados'])), h('th', null, t(['Chance', 'Chance'])), h('th', null, t(['Pushed', 'Forçada'])))),
      h('tbody', null, CHANCE.map(([n, a, b]) => h('tr', null, h('td', null, String(n)), h('td', null, a + '%'), h('td', null, b + '%')))))
  ] },
  { id: 'trouble', title: ['Trouble', 'Encrenca'], render: () => [
    P(t(['Trouble is whatever keeps a Kid from doing something. The Gamemaster creates it and asks how you react. The Gamemaster never rolls for NPCs.', 'Encrenca é tudo o que impede uma criança de fazer algo. O Mestre a cria e pergunta como você reage. O Mestre nunca rola dados pelos PNJs.'])),
    H(['Failed rolls', 'Rolagens que falham']),
    P(t(['A failure never means nothing happens: the situation changes, probably for the worse. You may get caught, check a Condition, land in new Trouble or suffer a Complication (you still succeed, but something goes wrong along the way).', 'Uma falha nunca significa que nada acontece: a situação muda, provavelmente para pior. Você pode ser pego, marcar uma Condição, cair em nova encrenca ou sofrer uma Complicação (você ainda tem sucesso, mas algo dá errado no caminho).'])),
    H(['Pushing the roll', 'Forçando a rolagem']),
    P(t(['Right after a failed roll, you may push once: describe how you go to your limit, check a Condition of your choice, then reroll every die that is not a six. If the Trouble threatened a Condition and you still fail, you may check two. You can also push a success to buy more effects.', 'Logo após uma rolagem falha, você pode forçar uma vez: descreva como vai ao seu limite, marque uma Condição à sua escolha e role de novo todos os dados que não são seis. Se a Encrenca ameaçava uma Condição e você ainda falhar, pode ter de marcar duas. Você também pode forçar um sucesso para comprar mais efeitos.'])),
    H(['Luck and Pride', 'Sorte e Orgulho']),
    P(t(['After a failed roll you may spend one Luck Point to reroll failed dice, once per roll, before or after pushing. Once per Mystery, check your Pride for one automatic success, after a failure or to add a success.', 'Depois de uma rolagem falha você pode gastar 1 Ponto de Sorte para rolar de novo os dados que falharam, uma vez por rolagem, antes ou depois de forçar. Uma vez por Mistério, marque o Orgulho para um sucesso automático, após uma falha ou para somar um sucesso.'])),
    H(['Special NPCs', 'PNJs especiais']),
    P(t(['Some NPCs have a special attribute of 2 or 3. Trouble tied to it needs that many successes; other approaches need only one.', 'Alguns PNJs têm um atributo especial de 2 ou 3. A Encrenca ligada a ele exige essa quantidade de sucessos; outras abordagens exigem só um.'])),
    H(['Kid versus Kid', 'Criança contra criança']),
    P(t(['Everyone says what they want and rolls at the same time. The most successes wins. Everyone may push; on a tie you can buy extra successes by checking Conditions, one per Condition, even becoming Broken.', 'Todos dizem o que querem e rolam ao mesmo tempo. Vence quem tiver mais sucessos. Todos podem forçar; em caso de empate dá para comprar sucessos extras marcando Condições, um por Condição, até ficando Acabado.'])),
    H(['Extended Trouble', 'Encrenca prolongada']),
    UL([['Set the stakes: what happens if the Kids fail.', 'Defina o que está em jogo: o que acontece se as crianças falharem.'], ['Threat Level: twice the number of Kids is normal, three times is hard, four times is almost impossible.', 'Nível de Ameaça: o dobro do número de crianças é normal, o triplo é difícil, o quádruplo é quase impossível.'], ['Make a plan: each Kid picks a skill and an order.', 'Façam um plano: cada criança escolhe uma perícia e uma ordem.'], ['Play the scenes: each Kid rolls once and may push. A Kid with time can roll Lead to build a dice pool instead.', 'Joguem as cenas: cada criança rola uma vez e pode forçar. Quem tem tempo pode rolar Liderança para montar uma reserva de dados.'], ['Outcome: all sixes together reach the Threat Level, the Kids win. At half or more they can check extra Conditions (one success each) for a compromise. Below half, they fail completely.', 'Resultado: se todos os seis somados atingem o Nível de Ameaça, as crianças vencem. Com metade ou mais, podem marcar Condições extras (um sucesso cada) para um acordo. Abaixo da metade, falham por completo.']])
  ] },
  { id: 'kids', title: ['Making a Kid', 'Criando uma criança'], render: () => [
    P(t(['The book builds a Kid in these steps. The guided creation on this site follows them in order.', 'O livro monta uma criança nestes passos. A criação guiada deste site os segue em ordem.'])),
    h('ol', { class: 'g-list g-steps' }, [
      ['Choose your Type.', 'Escolha seu Arquétipo.'], ['Decide your age, from 10 to 15.', 'Decida sua idade, de 10 a 15.'], ['Distribute points equal to your age among the four attributes, 1 to 5 each.', 'Distribua pontos iguais à sua idade entre os quatro atributos, de 1 a 5 cada.'],
      ['Luck Points equal 15 minus your age.', 'Os Pontos de Sorte são 15 menos a sua idade.'], ['Distribute 10 points among skills: up to 3 in your three key skills, at most 1 in the others.', 'Distribua 10 pontos entre as perícias: até 3 nas três perícias-chave, no máximo 1 nas outras.'],
      ['Pick an Iconic Item.', 'Escolha um Item Icônico.'], ['Pick a Problem.', 'Escolha um Problema.'], ['Pick a Drive.', 'Escolha um Ímpeto.'], ['Pick a Pride.', 'Escolha um Orgulho.'],
      ['Define Relationships to the other Kids and to two NPCs.', 'Defina Relacionamentos com as outras crianças e com dois PNJs.'], ['Select an Anchor.', 'Escolha uma Âncora.'], ['Name your Kid.', 'Dê um nome à criança.'], ['Write a short description.', 'Escreva uma descrição curta.'], ['Choose your favorite song.', 'Escolha sua música favorita.'],
      ['Together: define the group\'s Hideout.', 'Juntos: definam o Esconderijo do grupo.'], ['Together: answer the Gamemaster\'s questions.', 'Juntos: respondam às perguntas do Mestre.']
    ].map((x) => h('li', null, t(x)))),
    H(['Attributes', 'Atributos']),
    h('dl', { class: 'g-dl' }, ATTRS.map((a) => h('div', null, h('dt', null, t(a.name)), h('dd', null, t(a.desc))))),
    H(['Age and Luck', 'Idade e Sorte']),
    P(t(['Older Kids have higher attributes but fewer Luck Points. Luck is refilled at the start of each session and cannot be saved. At each birthday you gain 1 attribute point (max 5) and lose 1 maximum Luck. At 16 you are no longer a Kid.', 'Crianças mais velhas têm atributos mais altos, mas menos Pontos de Sorte. A Sorte é recuperada no início de cada sessão e não pode ser guardada. A cada aniversário você ganha 1 ponto de atributo (máx. 5) e perde 1 de Sorte máxima. Aos 16 você deixa de ser criança.']))
  ] },
  { id: 'types', title: ['Types', 'Arquétipos'], render: (ctx) => {
    const setting = h('div', { class: 'seg seg-wide' }, ['swe', 'us'].map((k) => h('button', { type: 'button', 'aria-pressed': String(ctx.setting === k), onclick: () => { ctx.setting = k; ctx.repaint(); } }, k === 'swe' ? t(['Mälaren Islands', 'Ilhas Mälaren']) : t(['Boulder City', 'Boulder City']))));
    const list = (arr) => h('ul', { class: 'g-list' }, arr.map((p) => h('li', null, tf(p, ctx.setting))));
    return [P(t(['Eight Types, each with three key skills and suggested choices. Switch the setting to see the names that go with it.', 'Oito Arquétipos, cada um com três perícias-chave e escolhas sugeridas. Troque o cenário para ver os nomes correspondentes.'])), setting,
      h('div', { class: 'g-types' }, TYPES.map((ty) => h('article', { class: 'g-type' },
        h('div', { class: 'g-type-art' }, h('img', { src: artFor(ty.key), alt: t(ty.name), loading: 'lazy' })),
        h('div', { class: 'g-type-body' }, h('h3', null, t(ty.name)),
          h('p', { class: 'type-skills' }, ty.skills.map((s) => h('span', { class: 'tag' }, t(SKILLS.find((x) => x.key === s).name)))), h('p', null, t(ty.blurb)),
          h('details', null, h('summary', null, t(['Iconic Items and Anchors', 'Itens Icônicos e Âncoras'])), h('h4', null, t(['Iconic Item', 'Item Icônico'])), list(ty.iconic), h('h4', null, t(['Anchor', 'Âncora'])), list(ty.anchors)),
          h('details', null, h('summary', null, t(['Problems, Drives and Prides', 'Problemas, Ímpetos e Orgulhos'])), h('h4', null, t(['Problem', 'Problema'])), list(ty.problems), h('h4', null, t(['Drive', 'Ímpeto'])), list(ty.drives), h('h4', null, t(['Pride', 'Orgulho'])), list(ty.prides)),
          h('details', null, h('summary', null, t(['Relationships', 'Relacionamentos'])), h('h4', null, t(['To other Kids', 'Com outras crianças'])), list(ty.relKids), h('h4', null, t(['To NPCs', 'Com PNJs'])), list(ty.relNpcs)),
          h('details', null, h('summary', null, t(['Typical names', 'Nomes típicos'])), h('p', null, h('strong', null, t(['Girls: ', 'Meninas: ']), ''), ty.names[ctx.setting].girl.join(', ')), h('p', null, h('strong', null, t(['Boys: ', 'Meninos: ']), ''), ty.names[ctx.setting].boy.join(', ')), h('p', null, h('strong', null, t(['Nicknames: ', 'Apelidos: ']), ''), ty.names[ctx.setting].nick.join(', ')))))))];
  } },
  { id: 'skills', title: ['Skills', 'Perícias'], render: () => [
    P(t(['Each attribute has three skills. A skill level adds dice to the attribute when you roll. Levels go from 0 to 5.', 'Cada atributo tem três perícias. O nível da perícia soma dados ao atributo na rolagem. Os níveis vão de 0 a 5.'])),
    ATTRS.map((a) => h('section', { class: 'g-skill-group' }, h('h3', null, t(a.name)), SKILLS.filter((s) => s.attr === a.key).map((s) => h('article', { class: 'g-skill' },
      h('h4', null, t(s.name)), P(t(s.desc)),
      s.questions.length ? [h('strong', null, t(['Questions', 'Perguntas'])), UL(s.questions)] : null,
      h('strong', null, t(['Bonus effects', 'Efeitos bônus'])), UL(s.bonus))))),
    H(['Which skill for information?', 'Qual perícia para obter informação?']),
    UL([['Comprehend: things learned at school, riddles, finding information in a library.', 'Conhecimento: coisas aprendidas na escola, enigmas, achar informação numa biblioteca.'], ['Investigate: looking for things, hidden doors, examining a crime scene.', 'Investigação: procurar coisas, portas escondidas, examinar uma cena de crime.'], ['Calculate: figuring out how something technical works.', 'Cálculo: descobrir como algo técnico funciona.'], ['Empathize: what conscious beings feel, plan, like or dislike, including robots.', 'Empatia: o que seres conscientes sentem, planejam, gostam ou desgostam, inclusive robôs.']]),
    H(['Avoiding attacks', 'Evitando ataques']),
    P(t(['Physical attacks: usually Move. Relational tricks like seduction or lies: Charm. Understanding something in time: Comprehend. Spotting an ambush: Investigate.', 'Ataques físicos: em geral Movimentação. Truques de relacionamento, como sedução ou mentiras: Charme. Entender algo a tempo: Conhecimento. Perceber uma emboscada: Investigação.']))
  ] },
  { id: 'conditions', title: ['Conditions and healing', 'Condições e cura'], render: () => [
    P(t(['Kids cannot die, but they can suffer Conditions. You choose which one fits the situation. Each mild Condition gives -1 on all dice rolls until healed, and they add up.', 'As crianças não morrem, mas podem sofrer Condições. Você escolhe a que combina com a situação. Cada Condição leve dá -1 em todas as rolagens até se curar, e elas se acumulam.'])),
    h('dl', { class: 'g-dl' }, CONDITIONS.map((c) => h('div', null, h('dt', null, t(c.name)), h('dd', null, t(c.desc))))),
    P(t(['If you get a Condition that is already checked, choose another. You never have to play out a Condition if you do not want to.', 'Se você sofre uma Condição que já está marcada, escolha outra. Você nunca é obrigado a interpretar uma Condição se não quiser.'])),
    H(['Healing with your Anchor', 'Curando com sua Âncora']),
    P(t(['Spend a scene with your Anchor, physically or mentally close, and heal all Conditions. The Gamemaster cannot put you in Trouble in that scene, and if you put yourself in Trouble you heal nothing.', 'Passe uma cena com sua Âncora, física ou mentalmente próximos, e cure todas as Condições. O Mestre não pode te meter em encrenca nessa cena, e se você mesmo se meter em encrenca, não cura nada.'])),
    H(['Healing in the Hideout', 'Curando no Esconderijo']),
    P(t(['Two or more Kids close to each other in the Hideout (hugging, telling secrets, comforting one another) can heal Conditions the same way. All Conditions also heal between Mysteries.', 'Duas ou mais crianças próximas no Esconderijo (abraçando, contando segredos, consolando-se) podem curar Condições do mesmo jeito. Todas as Condições também se curam entre Mistérios.']))
  ] },
  { id: 'items', title: ['Items, Pride and Luck', 'Itens, Orgulho e Sorte'], render: () => [
    H(['Items', 'Itens']),
    UL([['Items give +1 to +3 dice when it is obvious how they help. A skateboard helps Move when fleeing a bully, not when climbing a tree.', 'Itens dão de +1 a +3 dados quando fica óbvio como ajudam. Um skate ajuda em Movimentação ao fugir de um valentão, não ao subir numa árvore.'], ['Most objects are only props that add atmosphere. The Gamemaster decides what counts as an Item.', 'A maioria dos objetos é só cenário que dá atmosfera. O Mestre decide o que conta como Item.'], ['Your Iconic Item gives +2, never breaks or disappears, and is found again if lost. Other Kids cannot use it.', 'Seu Item Icônico dá +2, nunca quebra nem desaparece e é reencontrado se perdido. Outras crianças não podem usá-lo.'], ['Between Mysteries all Items are lost except the Iconic Item. You may replace it with a new Iconic Item at +2.', 'Entre Mistérios todos os Itens se perdem, exceto o Icônico. Você pode trocá-lo por um novo Item Icônico com +2.']]),
    H(['Problem, Drive and Pride', 'Problema, Ímpeto e Orgulho']),
    UL([['Problem: if you solve it, pick a new one before the next Mystery.', 'Problema: se você o resolver, escolha outro antes do próximo Mistério.'], ['Drive: why you face danger. Can change between Mysteries.', 'Ímpeto: por que você enfrenta o perigo. Pode mudar entre Mistérios.'], ['Pride: can change between Mysteries. Once per Mystery (once per session in longer games) you can check it for one automatic success.', 'Orgulho: pode mudar entre Mistérios. Uma vez por Mistério (uma vez por sessão em jogos mais longos) você pode marcá-lo para um sucesso automático.']]),
    H(['Luck', 'Sorte']),
    P(t(['A Luck Point rerolls failed dice without pushing. Only one per roll. Maximum equals 15 minus your age, refilled every session.', 'Um Ponto de Sorte rola de novo os dados que falharam, sem forçar. Só um por rolagem. O máximo é 15 menos a idade, recuperado a cada sessão.']))
  ] },
  { id: 'xp', title: ['Experience and change', 'Experiência e mudança'], render: () => [
    P(t(['After a Mystery, or after a session if the Mystery continues, read these questions. Each Kid gets 1 XP per "yes".', 'Depois de um Mistério, ou da sessão se o Mistério continuar, leia estas perguntas. Cada criança ganha 1 XP por "sim".'])),
    h('ol', { class: 'g-list g-steps' }, XP_QUESTIONS.map((q) => h('li', null, t(q)))),
    P(t(['Raising a skill by one level costs 5 XP, up to level 5. You can keep at most 10 XP and spend them only before or after a session.', 'Aumentar uma perícia em um nível custa 5 XP, até o nível 5. Você guarda no máximo 10 XP e só gasta antes ou depois de uma sessão.'])),
    H(['After the Mystery', 'Depois do Mistério']),
    P(t(['Read your Problem, Pride, Iconic Item and Relationships aloud and change what you like. All Conditions heal. If time has passed and you missed your birthday, raise one attribute by 1 and lose 1 Luck Point. You may also retire a Kid between Mysteries and create a new one.', 'Leia em voz alta seu Problema, Orgulho, Item Icônico e Relacionamentos e mude o que quiser. Todas as Condições se curam. Se passou tempo e você perdeu o aniversário, aumente um atributo em 1 e perca 1 Ponto de Sorte. Você também pode aposentar uma criança entre Mistérios e criar outra.']))
  ] },
  { id: 'questions', title: ['Questions', 'Perguntas'], render: () => [
    P(t(['Before the game, the Gamemaster picks 4 to 6 questions for the Kids and 2 to 3 for the group.', 'Antes do jogo, o Mestre escolhe de 4 a 6 perguntas para as crianças e de 2 a 3 para o grupo.'])),
    H(['To the Kids', 'Para as crianças']), UL(QUESTIONS_KIDS), H(['To the group', 'Para o grupo']), UL(QUESTIONS_GROUP)
  ] }
];

export function renderGuide(host, sectionId, nav) {
  const ctx = { setting: 'swe', repaint: () => paint() };
  let cur = SECTIONS.find((s) => s.id === sectionId) || SECTIONS[0];
  const navEl = h('nav', { class: 'g-nav', 'aria-label': t(['Guide sections', 'Seções do guia']) });
  const content = h('article', { class: 'g-content' });
  function paint() {
    clear(navEl).append(h('ul', null, SECTIONS.map((s) => h('li', null, h('a', { href: '#/guide/' + s.id, class: s.id === cur.id ? 'cur' : '', 'aria-current': s.id === cur.id ? 'page' : null }, t(s.title))))));
    const y = window.scrollY;
    clear(content).append(h('header', { class: 'g-head bar' }, h('h1', null, t(cur.title))), h('div', { class: 'g-body' }, cur.render(ctx)));
    window.scrollTo(0, y);
  }
  paint();
  const idx = SECTIONS.indexOf(cur);
  const pager = h('div', { class: 'g-pager' },
    idx > 0 ? h('a', { class: 'btn', href: '#/guide/' + SECTIONS[idx - 1].id }, icon('back', 18), t(SECTIONS[idx - 1].title)) : h('span'),
    idx < SECTIONS.length - 1 ? h('a', { class: 'btn btn-primary', href: '#/guide/' + SECTIONS[idx + 1].id }, t(SECTIONS[idx + 1].title), icon('next', 18)) : h('span'));
  host.append(h('div', { class: 'guide' }, navEl, h('div', { class: 'g-main' }, content, pager)));
  return () => {};
}
