/* Regras do livro (cap. 4 e 5). Pares [en, pt]. */

export const ATTRS = [
  { key: 'body', name: ['Body', 'Corpo'], desc: ['The ability to jump high, run fast, fight, sneak and climb.', 'A capacidade de pular alto, correr rápido, lutar, se esgueirar e escalar.'] },
  { key: 'tech', name: ['Tech', 'Tecnologia'], desc: ['The ability to understand machines and robots, program things, open locked doors and build things.', 'A capacidade de entender máquinas e robôs, programar, abrir portas trancadas e construir coisas.'] },
  { key: 'heart', name: ['Heart', 'Coração'], desc: ['The ability to make friends, lie, know the right people, create a good atmosphere and persuade others.', 'A capacidade de fazer amigos, mentir, conhecer as pessoas certas, criar um bom clima e persuadir os outros.'] },
  { key: 'mind', name: ['Mind', 'Mente'], desc: ['The ability to find weak points, understand people, situations and creatures, solve riddles and clues, and have the right knowledge at the right time.', 'A capacidade de achar pontos fracos, entender pessoas, situações e criaturas, resolver enigmas e pistas, e ter o conhecimento certo na hora certa.'] }
];

// Ordem da ficha: Corpo, Tecnologia, Coração, Mente
export const SKILLS = [
  { key: 'sneak', attr: 'body', name: ['Sneak', 'Furtividade'],
    desc: ['The ability to hide, sneak or steal.', 'A capacidade de se esconder, se esgueirar ou furtar.'],
    questions: [],
    bonus: [['Give a success to another Kid.', 'Dê um sucesso a outra criança.'], ['You find something unexpected, or more of what you were looking for.', 'Você encontra algo inesperado, ou mais do que procurava.']] },
  { key: 'force', attr: 'body', name: ['Force', 'Força'],
    desc: ['The ability to lift heavy things, fight, and endure physically stressful situations.', 'A capacidade de levantar coisas pesadas, lutar e aguentar situações fisicamente estressantes.'],
    questions: [],
    bonus: [['Give a success to another Kid.', 'Dê um sucesso a outra criança.'], ['Impress, frighten or humiliate.', 'Impressionar, assustar ou humilhar.'], ['Pin your opponent.', 'Imobilizar o oponente.'], ['Take something from your opponent.', 'Tomar algo do oponente.'], ['Your opponent is knocked unconscious.', 'O oponente desmaia.'], ["You don't need to roll for the exact same Trouble in the future.", 'Você não precisa rolar de novo para a mesma Encrenca no futuro.'], ['You avoid any collateral damage.', 'Você evita qualquer dano colateral.']] },
  { key: 'move', attr: 'body', name: ['Move', 'Movimentação'],
    desc: ['The ability to climb high, balance, run fast, and chase someone or get away.', 'A capacidade de escalar, se equilibrar, correr rápido, perseguir alguém ou fugir.'],
    questions: [],
    bonus: [['Give a success to another Kid.', 'Dê um sucesso a outra criança.'], ['Impress someone.', 'Impressionar alguém.'], ['No one notices you.', 'Ninguém percebe você.']] },
  { key: 'tinker', attr: 'tech', name: ['Tinker', 'Mecânica'],
    desc: ['Build and manipulate machines and mechanical items: build things, break or jury-rig them, pick locks, drive vehicles. A successful build becomes an Item with +1.', 'Construir e manipular máquinas e itens mecânicos: montar coisas, quebrá-las ou improvisar, abrir fechaduras, dirigir veículos. Uma construção bem-sucedida vira um Item com +1.'],
    questions: [],
    bonus: [['Give a success to another Kid.', 'Dê um sucesso a outra criança.'], ["You don't need to roll for the same Trouble again.", 'Você não precisa rolar de novo para a mesma Encrenca.'], ['You do it quickly.', 'Você faz rápido.'], ['You do it quietly.', 'Você faz em silêncio.'], ['You show off.', 'Você se exibe.'], ['Built item: more durable, can do more, or more discreet (+1 bonus each, up to +3).', 'Item construído: mais durável, faz mais coisas ou mais discreto (+1 de bônus cada, até +3).']] },
  { key: 'program', attr: 'tech', name: ['Program', 'Programação'],
    desc: ['Create and manipulate computer programs and electronic devices; sister skill of Tinker for electronic things. A successful creation becomes an Item with +1.', 'Criar e manipular programas e dispositivos eletrônicos; perícia irmã da Mecânica, para coisas eletrônicas. Uma criação bem-sucedida vira um Item com +1.'],
    questions: [],
    bonus: [['Give a success to another Kid.', 'Dê um sucesso a outra criança.'], ["You don't need to roll for the same Trouble again.", 'Você não precisa rolar de novo para a mesma Encrenca.'], ['You do it quickly.', 'Você faz rápido.'], ['You get new or unexpected information.', 'Você obtém informação nova ou inesperada.'], ['You show off.', 'Você se exibe.'], ['Created item: more effective or can do more (+1 bonus each, up to +3).', 'Item criado: mais eficaz ou faz mais coisas (+1 de bônus cada, até +3).']] },
  { key: 'calculate', attr: 'tech', name: ['Calculate', 'Cálculo'],
    desc: ['Know how technical objects work and how to use them: robots, machines, magnetrine ships, cyborgs, an alarm clock. On a success you ask two questions.', 'Saber como objetos técnicos funcionam e como usá-los: robôs, máquinas, naves de magnetrina, ciborgues, um despertador. Com sucesso, você faz duas perguntas.'],
    questions: [['What is its purpose?', 'Qual é o propósito disso?'], ['How does it work?', 'Como funciona?'], ['How can I use it?', 'Como posso usar?'], ['Who built it?', 'Quem construiu?'], ['What problems could it cause?', 'Que problemas pode causar?'], ['Is it illegal?', 'É ilegal?']],
    bonus: [['Ask one additional question and take +1 die on one roll when you use the information (up to +3).', 'Faça uma pergunta adicional e receba +1 dado em uma rolagem ao usar a informação (até +3).']] },
  { key: 'contact', attr: 'heart', name: ['Contact', 'Contatos'],
    desc: ['Know the right person and get a hold of her. Tell the Gamemaster who, and roll to find her. On a failure she does not want to help, or even comes looking to make life difficult.', 'Conhecer a pessoa certa e conseguir falar com ela. Diga ao Mestre quem é e role para encontrá-la. Se falhar, ela não quer ajudar ou até vem atrás de você para atrapalhar.'],
    questions: [],
    bonus: [['The contact has all the right tools.', 'O contato tem todas as ferramentas certas.'], ['The contact may heal one of your Conditions.', 'O contato pode curar uma de suas Condições.'], ['The contact brings more people, also ready to help.', 'O contato traz mais gente disposta a ajudar.'], ["You don't have to roll to reach the contact again during this Mystery.", 'Você não precisa rolar para falar de novo com o contato neste Mistério.'], ['The contact knows something important.', 'O contato sabe algo importante.'], ['Use the contact once as an Item with +1 (up to +3).', 'Use o contato uma vez como Item com +1 (até +3).']] },
  { key: 'charm', attr: 'heart', name: ['Charm', 'Charme'],
    desc: ['Charm, lie, befriend and make people do what you want. The Gamemaster decides what is plausible.', 'Encantar, mentir, fazer amizade e levar as pessoas a fazer o que você quer. O Mestre decide o que é plausível.'],
    questions: [],
    bonus: [['She keeps believing you.', 'Ela continua acreditando em você.'], ['You have formed a lasting relationship.', 'Vocês criaram um vínculo duradouro.'], ['She will take risks to help you.', 'Ela correrá riscos para ajudar você.'], ['She will try to persuade others to believe you.', 'Ela tentará convencer outros a acreditar em você.'], ["She's frightened, confused or impressed.", 'Ela fica assustada, confusa ou impressionada.'], ["She's infatuated.", 'Ela fica apaixonada.']] },
  { key: 'lead', attr: 'heart', name: ['Lead', 'Liderança'],
    desc: ['Make your friends work together, keep them focused and soothe them. With time, roll to create a dice pool (1 success = 2 dice, 2 = 4, 3 = 6) to hand out to others who do as you say. Spending private time with a Kid can heal one of her Conditions; on a failure you suffer the same Condition.', 'Fazer os amigos trabalharem juntos, mantê-los focados e acalmá-los. Com tempo, role para criar uma reserva de dados (1 sucesso = 2 dados, 2 = 4, 3 = 6) para distribuir a quem seguir suas ordens. Passar um tempo a sós com uma criança pode curar uma Condição dela; se falhar, você sofre a mesma Condição.'],
    questions: [],
    bonus: [['Heal an additional Condition.', 'Cure uma Condição adicional.'], ['Heal one of your own Conditions.', 'Cure uma de suas próprias Condições.']] },
  { key: 'investigate', attr: 'mind', name: ['Investigate', 'Investigação'],
    desc: ['Find hidden objects, understand clues, break puzzles or survey a place. On a success you ask two questions. On a failure you misunderstand something, someone finds out something about you, or you suffer a Condition.', 'Achar objetos escondidos, entender pistas, resolver enigmas ou examinar um lugar. Com sucesso, você faz duas perguntas. Se falhar, você entende algo errado, alguém descobre algo sobre você ou você sofre uma Condição.'],
    questions: [['What is hidden here and where is it?', 'O que está escondido aqui e onde?'], ['What does it mean?', 'O que isso significa?'], ['What has happened here?', 'O que aconteceu aqui?'], ['How can I get into/out of/past something?', 'Como posso entrar/sair/passar por isso?'], ['What threats can I perceive here?', 'Que ameaças consigo perceber aqui?'], ['Where is it?', 'Onde está?']],
    bonus: [['Ask one additional question and take +1 die on one roll when you use the information (up to +3).', 'Faça uma pergunta adicional e receba +1 dado em uma rolagem ao usar a informação (até +3).']] },
  { key: 'comprehend', attr: 'mind', name: ['Comprehend', 'Conhecimento'],
    desc: ['Have the right piece of information, or find it in the school library or a similar place. On a failure the Gamemaster gives you bad news or wrong information, without saying which.', 'Ter a informação certa ou achá-la na biblioteca da escola ou em lugar parecido. Se falhar, o Mestre dá más notícias ou informação errada, sem dizer qual.'],
    questions: [],
    bonus: [['You get additional information and +1 die on one roll when you use it (up to +3).', 'Você recebe informação adicional e +1 dado em uma rolagem ao usá-la (até +3).']] },
  { key: 'empathize', attr: 'mind', name: ['Empathize', 'Empatia'],
    desc: ['Study what makes a person, animal or conscious robot tick, and find its weakness. You need time to study or talk to it first. On a success you ask two questions.', 'Estudar o que move uma pessoa, animal ou robô consciente e achar seu ponto fraco. Você precisa de tempo para observar ou conversar antes. Com sucesso, você faz duas perguntas.'],
    questions: [['What is her weak spot?', 'Qual é o ponto fraco dela?'], ['How can I make her do something?', 'Como posso fazê-la agir?'], ['What does she feel?', 'O que ela sente?'], ['What does she want?', 'O que ela quer?'], ['What will she do?', 'O que ela vai fazer?'], ['Is she lying?', 'Ela está mentindo?']],
    bonus: [['Ask one additional question and take +1 die on one roll when you use the information (up to +3).', 'Faça uma pergunta adicional e receba +1 dado em uma rolagem ao usar a informação (até +3).']] }
];

export const CONDITIONS = [
  { key: 'upset', name: ['Upset', 'Chateado'], desc: ['Mild Condition. You get -1 on all dice rolls until healed. Play it however fits: how are you upset?', 'Condição leve. Você sofre -1 em todas as rolagens até se curar. Interprete como preferir: de que jeito você está chateado?'] },
  { key: 'scared', name: ['Scared', 'Assustado'], desc: ['Mild Condition. You get -1 on all dice rolls until healed. Conditions are cumulative.', 'Condição leve. Você sofre -1 em todas as rolagens até se curar. As Condições se acumulam.'] },
  { key: 'exhausted', name: ['Exhausted', 'Exausto'], desc: ['Mild Condition. You get -1 on all dice rolls until healed. Two Conditions give -2, and so on.', 'Condição leve. Você sofre -1 em todas as rolagens até se curar. Duas Condições dão -2, e assim por diante.'] },
  { key: 'injured', name: ['Injured', 'Machucado'], desc: ['Mild Condition. You get -1 on all dice rolls until healed.', 'Condição leve. Você sofre -1 em todas as rolagens até se curar.'] },
  { key: 'broken', name: ['Broken', 'Acabado'], desc: ['If all four mild Conditions are marked and you take another, you are Broken: mentally or physically hurt, and you automatically fail all dice rolls until healed.', 'Se as quatro Condições leves estão marcadas e você sofre outra, fica Acabado: ferido mental ou fisicamente, e falha automaticamente em todas as rolagens até se curar.'] }
];

export const XP_QUESTIONS = [
  ['Did you participate in the session? (Each Kid present always gets at least one XP.)', 'Você participou da sessão? (Toda criança presente ganha sempre pelo menos 1 XP.)'],
  ['Have you been in Trouble because of your Problem or your Relationships?', 'Você se meteu em encrenca por causa do seu Problema ou dos seus Relacionamentos?'],
  ['Did you use, or struggle with, your Pride?', 'Você usou o seu Orgulho ou lutou contra ele?'],
  ['Did you put yourself at risk for the other Kids?', 'Você se pôs em risco pelas outras crianças?'],
  ['Have you learned something new? (What is it?)', 'Você aprendeu algo novo? (O que foi?)']
];

// Tabela de chances (livro, p. 70): [dados, chance, forçada]
export const CHANCE = [[1, 17, 29], [2, 31, 50], [3, 42, 64], [4, 52, 74], [5, 60, 81], [6, 67, 87], [7, 72, 90], [8, 77, 93], [9, 81, 95], [10, 84, 96]];

export const AGES = [10, 11, 12, 13, 14, 15];
export const luckFor = (age) => Math.max(0, 15 - age);
export const SKILL_BY_KEY = Object.fromEntries(SKILLS.map((s) => [s.key, s]));
