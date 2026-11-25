/*
  Arquétipos (Types) – Tales from the Loop, cap. 4.
  Textos como pares [en, pt]. Nomes do cenário: {Suécia|EUA}.
  Para ajustar a tradução, edite apenas os segundos itens dos pares.
*/

export const TYPES = [
  {
    key: 'bookworm',
    name: ['Bookworm', 'Rato de Biblioteca'],
    skills: ['calculate', 'investigate', 'comprehend'],
    blurb: [
      'You travel the world through books and talk with poets and philosophers long gone. In real life you wish your pimples would show less, and you long for the day you leave this place.',
      'Você viaja o mundo pelos livros e conversa com poetas e filósofos que morreram há séculos. Na vida real, queria que suas espinhas aparecessem menos e sonha com o dia em que vai embora daqui.'
    ],
    iconic: [['Dog named {Plutten|Tiny}', 'Cachorro chamado {Plutten|Tiny}'], ['Encyclopedia', 'Enciclopédia'], ['Magnifying glass', 'Lupa']],
    problems: [
      ['Nobody tells me how my dad died.', 'Ninguém me conta como meu pai morreu.'],
      ['My sister is really sick.', 'Minha irmã está muito doente.'],
      ['That weird man is following me.', 'Aquele homem estranho está me seguindo.']
    ],
    drives: [['I want to find answers to the big questions in life.', 'Quero encontrar respostas para as grandes perguntas da vida.'], ['I need something to brag about.', 'Preciso de algo para me gabar.']],
    prides: [["I'm the smartest kid in school.", 'Sou a criança mais inteligente da escola.'], ['Nothing scares me.', 'Nada me assusta.']],
    relKids: [['He/she is my competitor.', 'Ele/ela é meu(minha) concorrente.'], ['I will make him/her love me.', 'Vou fazer ele/ela me amar.'], ['We are siblings and friends.', 'Somos irmãos e amigos.']],
    relNpcs: [
      ["{Olof|Gary} in my class was attacked by animals while riding his bike home from training. I can't believe that everyone at school thinks he was attacked by werewolves.", '{Olof|Gary}, da minha turma, foi atacado por animais quando voltava de bicicleta do treino. Não acredito que todo mundo na escola ache que foram lobisomens.'],
      ['When {Lena Thelin|Diane Petersen} was fired from the Loop, I heard her vow to take revenge on all who live here.', 'Quando {Lena Thelin|Diane Petersen} foi demitida do Loop, ouvi ela jurar vingança contra todos que vivem aqui.'],
      ["{Mona|Mary}, the school librarian, was my friend until she disappeared. I am sure that the school janitor {Per|Jeffrey} knows more than he's saying.", '{Mona|Mary}, a bibliotecária da escola, era minha amiga até desaparecer. Tenho certeza de que o zelador, {Per|Jeffrey}, sabe mais do que diz.']
    ],
    anchors: [['Mom/dad', 'Mãe/pai'], ['Teacher', 'Professor(a)'], ['Local author', 'Autor local']],
    names: {
      swe: { girl: ['Felicia', 'Ann-Christin', 'Magdalena', 'Gabriella'], boy: ['Nils', 'Kristian', 'Magnus', 'Jan'], nick: ['Ugglan', 'Vårtan', 'Plattfisk', 'Janne'] },
      us: { girl: ['Elizabeth', 'Erin', 'Rachel', 'Susan'], boy: ['Aaron', 'Darren', 'Joshua', 'Thomas'], nick: ['Frodo', 'Professor', 'Wart', 'Owl'] }
    }
  },
  {
    key: 'computer-geek',
    name: ['Computer Geek', 'Geek de Computador'],
    skills: ['calculate', 'program', 'comprehend'],
    blurb: [
      'You know exactly what matters: beating the record in Super Mario Bros, building programs, understanding how a robot works, or casting the right spell on roleplaying nights. Who cares what the others think?',
      'Você sabe exatamente o que importa: bater o recorde de Super Mario Bros, criar programas, entender como um robô funciona ou lançar o feitiço certo nas noites de RPG. Quem se importa com o que os outros pensam?'
    ],
    iconic: [['Computer', 'Computador'], ['Pocket calculator', 'Calculadora de bolso'], ['Toy lightsaber', 'Sabre de luz de brinquedo']],
    problems: [
      ['The tough guys hit me.', 'Os valentões me batem.'],
      ['My parents are always arguing.', 'Meus pais vivem brigando.'],
      ["She/he doesn't even know I exist.", 'Ela/ele nem sabe que eu existo.']
    ],
    drives: [['I love puzzles.', 'Eu amo quebra-cabeças.'], ['Peer pressure makes me do it.', 'A pressão dos colegas me faz agir.']],
    prides: [["When the shit hits the fan, I don't back down.", 'Quando a coisa fica feia, eu não recuo.'], ["I'm the smartest kid in school.", 'Sou a criança mais inteligente da escola.']],
    relKids: [['We are best friends.', 'Somos melhores amigos.'], ['We are different but still friends.', 'Somos diferentes, mas ainda amigos.'], ["He/she treats me badly but I won't sink to the same level.", 'Ele/ela me trata mal, mas não vou descer ao mesmo nível.']],
    relNpcs: [
      ['My friend {Lina|Leeanne} told me that strange creatures have moved into the Cooling Towers. She thinks they are aliens.', 'Minha amiga {Lina|Leeanne} me contou que criaturas estranhas se mudaram para as Torres de Resfriamento. Ela acha que são alienígenas.'],
      ['Everyone seems to be having nightmares about that horrible teenager Peter.', 'Todo mundo parece ter pesadelos com aquele adolescente horrível, o Peter.'],
      ['My friend Elisabeth has built a computer program that cracks codes, and we used it to listen to a scrambled radio communication. Some guys, who called each other fish names, talked about her mother as "one of the targets."', 'Minha amiga Elisabeth criou um programa que quebra códigos, e o usamos para ouvir uma comunicação de rádio embaralhada. Uns caras, que se chamavam por nomes de peixes, falaram da mãe dela como "um dos alvos".']
    ],
    anchors: [['Mother/father', 'Mãe/pai'], ['Science teacher', 'Professor(a) de ciências'], ['The guy who owns the comic shop', 'O dono da loja de quadrinhos']],
    names: {
      swe: { girl: ['Monika', 'Anette', 'Isabella', 'Lea'], boy: ['Kristoffer', 'Martin', 'Lukas', 'Börje'], nick: ['Haren', 'Glasögonorm', 'Sköldpaddan', 'Svettis'] },
      us: { girl: ['Shannon', 'Patricia', 'Karen', 'Julie'], boy: ['Andrew', 'Eric', 'Daniel', 'Timothy'], nick: ['Turtle', 'Lazer', 'Data', 'Ducky'] }
    }
  },
  {
    key: 'hick',
    name: ['Hick', 'Caipira'],
    skills: ['force', 'move', 'tinker'],
    blurb: [
      'Classmates smile at your tan, your accent and your jokes, but you get to spend every day in the fields and the woods. You can fix an engine, drive a tractor, and hunt.',
      'Os colegas sorriem do seu bronzeado, do seu sotaque e das suas piadas, mas você passa os dias nos campos e nas matas. Sabe consertar um motor, dirigir um trator e caçar.'
    ],
    iconic: [['German Shepherd', 'Pastor-alemão'], ['Crowbar', 'Pé de cabra'], ['Tractor', 'Trator']],
    problems: [
      ['Someone is poisoning our animals.', 'Alguém está envenenando nossos animais.'],
      ["Mom/dad doesn't want to accept that she/he is sick.", 'Mamãe/papai não aceita que está doente.'],
      ['I seriously hurt someone by mistake.', 'Machuquei alguém gravemente sem querer.']
    ],
    drives: [['There is more to this world than what meets the eye.', 'Há mais neste mundo do que os olhos veem.'], ['They need me.', 'Eles precisam de mim.']],
    prides: [['My machines will one day conquer the world.', 'Minhas máquinas ainda vão conquistar o mundo.'], ['I help other people.', 'Eu ajudo as outras pessoas.']],
    relKids: [["He/she wouldn't survive one day in the woods.", 'Ele/ela não sobreviveria um dia na mata.'], ['How can I show her/him what I really feel?', 'Como posso mostrar a ela/ele o que realmente sinto?'], ['A reliable friend.', 'Um amigo confiável.']],
    relNpcs: [
      ['The school janitor seems so lonely since {Mona|Mary}, the school librarian, disappeared. I wish I could help him.', 'O zelador da escola parece tão solitário desde que {Mona|Mary}, a bibliotecária, desapareceu. Queria poder ajudá-lo.'],
      ['The police officer {Ing-Marie Blankäng|Karen Richards} asked me if we could help her out on her boat this weekend.', 'A policial {Ing-Marie Blankäng|Karen Richards} me perguntou se podemos ajudá-la no barco dela neste fim de semana.'],
      ['I have seen that stranger, the former rock singer {Nille Landgren|Mikey Hayes}, sneaking around in the forest near the company {NAAB|NAI}.', 'Vi aquele estranho, o ex-cantor de rock {Nille Landgren|Mikey Hayes}, rondando a floresta perto da empresa {NAAB|NAI}.']
    ],
    anchors: [['Dad/mom', 'Pai/mãe'], ['Fellow hunter', 'Colega caçador'], ['Riding instructor', 'Instrutor(a) de equitação']],
    names: {
      swe: { girl: ['Lena', 'Greta', 'Åsa', 'Hanna-Sofia'], boy: ['Lars', 'Anders', 'Olof', 'Pär'], nick: ['Traktor-Bengt', 'Gris-Leif', 'Nordman', 'Nicke'] },
      us: { girl: ['Mary', 'Lee-Anne', 'Laura', 'Dawn'], boy: ['Benjamin', 'Jeremy', 'Ronald', 'Todd'], nick: ['Diesel', 'Scratch', 'Banjo', 'Buzz'] }
    }
  },
  {
    key: 'jock',
    name: ['Jock', 'Atleta'],
    skills: ['force', 'move', 'contact'],
    blurb: [
      'You feel at home in sweaty locker rooms and lit training fields in the autumn dark. Nothing beats a perfect shot or the ache after practice. You wish everything in life were that easy.',
      'Você se sente em casa em vestiários suados e campos iluminados no escuro do outono. Nada supera o arremesso perfeito ou a dor muscular depois do treino. Queria que a vida toda fosse tão simples.'
    ],
    iconic: [['Baseball bat', 'Taco de beisebol'], ['Hockey stick', 'Taco de hóquei'], ['BMX bike', 'Bicicleta BMX']],
    problems: [
      ['My brother refuses to go out of his room since the accident.', 'Meu irmão se recusa a sair do quarto desde o acidente.'],
      ['My teacher hates me.', 'Meu professor me odeia.'],
      ['I cannot read very well, and they want to move me to a special class.', 'Não leio muito bem e querem me mudar para uma turma especial.']
    ],
    drives: [["I'm in it for the thrill.", 'Faço isso pela emoção.'], ["It's the right thing to do.", 'É a coisa certa a fazer.']],
    prides: [['My father is a firefighter.', 'Meu pai é bombeiro.'], ['No one calls me chicken!', 'Ninguém me chama de medroso!']],
    relKids: [['I wonder if we can count on her/him?', 'Será que podemos contar com ela/ele?'], ['He/she knows everything!', 'Ele/ela sabe de tudo!'], ['Annoying little sister/brother.', 'Irmãzinha/irmãozinho chato(a).']],
    relNpcs: [
      ["That new police officer, {Ing-Marie Blankäng|Karen Richards}, has rented a boat to investigate something in the lake, but she hasn't told anyone what it is.", 'A nova policial, {Ing-Marie Blankäng|Karen Richards}, alugou um barco para investigar algo no lago, mas não contou a ninguém o que é.'],
      ['Several of my teammates are having strange dreams.', 'Vários colegas do meu time estão tendo sonhos estranhos.'],
      ['A scientist named Olivia Martinez came to our training session and asked the coach if we wanted to take part in some kind of medical experiment, but I could tell she was lying about something.', 'Uma cientista chamada Olivia Martinez foi ao nosso treino e perguntou ao técnico se queríamos participar de um experimento médico, mas percebi que ela mentia sobre algo.']
    ],
    anchors: [['Father/mother', 'Pai/mãe'], ['Coach for the team', 'Técnico do time'], ['Brother/sister', 'Irmão/irmã']],
    names: {
      swe: { girl: ['Stina', 'Lisa', 'Hanna', 'Camilla'], boy: ['Henrik', 'Kristian', 'Patrik', 'Sami'], nick: ['Pucken', 'Pelle', 'Mackan', 'Slangen'] },
      us: { girl: ['April', 'Heather', 'Kimberly', 'Tammy'], boy: ['Chad', 'Brock', 'Brad', 'Billy'], nick: ['Iceman', 'Butch', 'Scooter', 'Sneak'] }
    }
  },
  {
    key: 'popular-kid',
    name: ['Popular Kid', 'Popular'],
    skills: ['contact', 'charm', 'lead'],
    blurb: [
      "You decide what's lame and what's cool, and you know who is in love with whom. Others listen when you talk. It doesn't matter why they love you, just that they do.",
      'Você decide o que é brega e o que é legal, e sabe quem está apaixonado por quem. Os outros escutam quando você fala. Não importa por que gostam de você, só que gostam.'
    ],
    iconic: [['Pack of chewing gum', 'Pacote de chiclete'], ['Diary with juicy secrets', 'Diário com segredos suculentos'], ['Hairspray bottle', 'Frasco de laquê']],
    problems: [
      ['My aunt lives in our basement and she is crazy.', 'Minha tia mora no nosso porão e é louca.'],
      ['Mom/dad is having a secret love affair.', 'Mamãe/papai tem um caso secreto.'],
      ['Your rival knows what you are trying to hide.', 'Seu rival sabe o que você tenta esconder.']
    ],
    drives: [["It's a relief to get away from the burden of popularity.", 'É um alívio escapar do peso da popularidade.'], ['I hate secrets.', 'Eu odeio segredos.']],
    prides: [['Everybody likes me.', 'Todo mundo gosta de mim.'], ['I know everything about everyone.', 'Sei tudo sobre todos.']],
    relKids: [['I know she/he loves me.', 'Sei que ela/ele me ama.'], ['She/he is freaky but I like it.', 'Ela/ele é esquisito(a), mas eu gosto.'], ['He/she is useful.', 'Ele/ela é útil.']],
    relNpcs: [
      ['That new teen Lisa and her friends from the Wildlife Club are scary. I wonder what they are up to?', 'Aquela adolescente nova, a Lisa, e os amigos dela do Clube da Vida Selvagem são assustadores. O que será que eles estão tramando?'],
      ['The school janitor, {Per|Jeffrey}, seems to hate me, but I know he is hiding something.', 'O zelador da escola, {Per|Jeffrey}, parece me odiar, mas sei que esconde algo.'],
      ['Nobody knows it, but the former rock star {Nille Landgren|Mikey Hayes} lives in a cottage at {Väntholmen|Hemenway Park}. I talked to him and he said something horrible is happening at Svartsjölandet.', 'Ninguém sabe, mas o ex-astro do rock {Nille Landgren|Mikey Hayes} mora numa casinha em {Väntholmen|Hemenway Park}. Conversei com ele, que disse que algo horrível está acontecendo em Svartsjölandet.']
    ],
    anchors: [['Older sibling', 'Irmão(ã) mais velho(a)'], ['Mom/dad', 'Mãe/pai'], ['Famous friend of the family', 'Amigo famoso da família']],
    names: {
      swe: { girl: ['Johanna', 'Linnea', 'Nikolina', 'Linda-Marie'], boy: ['Andreas', 'Martin', 'Peter', 'Håkan'], nick: ['Krille', 'Madde', 'Gabbe', 'Milla'] },
      us: { girl: ['Shannon', 'Kelly', 'Melissa', 'Tiffany'], boy: ['John', 'Jason', 'Ryan', 'Sean'], nick: ['Baby', 'The King/Queen', 'Blue-eyes', 'Sunny'] }
    }
  },
  {
    key: 'rocker',
    name: ['Rocker', 'Roqueiro'],
    skills: ['move', 'charm', 'empathize'],
    blurb: [
      "A worn cassette tape changed your life. You imagine yourself a hard rocker playing so loud the windows crack. In truth you've just learned a C chord, and soon you'll form a band at the recreation center.",
      'Uma fita cassete gasta mudou sua vida. Você se imagina um roqueiro que toca tão alto que as janelas racham. Na verdade, acabou de aprender um dó na guitarra e logo vai montar uma banda no centro de recreação.'
    ],
    iconic: [['Boombox', 'Rádio portátil (boombox)'], ['Electric guitar', 'Guitarra elétrica'], ['Leather jacket', 'Jaqueta de couro']],
    problems: [
      ['My parents are about to divorce.', 'Meus pais estão prestes a se divorciar.'],
      ['I steal money.', 'Eu roubo dinheiro.'],
      ['Unrequited love.', 'Amor não correspondido.']
    ],
    drives: [["I'm doing it for love.", 'Faço isso por amor.'], ['Hunger for everything in life.', 'Fome de tudo na vida.']],
    prides: [['I play the guitar.', 'Eu toco guitarra.'], ['I stood up for my friend.', 'Defendi meu amigo.']],
    relKids: [['I love him/her.', 'Eu amo ele/ela.'], ["We don't like each other but he/she is part of the band.", 'Não gostamos um do outro, mas ele/ela faz parte da banda.'], ['He/she rocks!', 'Ele/ela arrasa!']],
    relNpcs: [
      ['My mom thinks that she is being followed because she\'s a scientist, but dad thinks she\'s going crazy.', 'Minha mãe acha que está sendo seguida por ser cientista, mas meu pai acha que ela está enlouquecendo.'],
      ["My older sister has joined the Wildlife Club; now she's stopped talking to me, and she sneaks out in the middle of the night.", 'Minha irmã mais velha entrou para o Clube da Vida Selvagem; agora parou de falar comigo e foge de casa no meio da noite.'],
      ["The strange scientist, {Lena Thelin|Diane Petersen}, is my aunt, but that doesn't mean I like her.", 'A cientista estranha, {Lena Thelin|Diane Petersen}, é minha tia, mas isso não quer dizer que eu goste dela.']
    ],
    anchors: [['Music teacher', 'Professor(a) de música'], ['Older brother/sister', 'Irmão(ã) mais velho(a)'], ['The guy at the music store', 'O cara da loja de música']],
    names: {
      swe: { girl: ['Frida', 'Janis', 'Branka', 'Tove'], boy: ['Ingmar', 'Niklas', 'Tommy', 'Alexander'], nick: ['Slash', 'Axl', 'Ziggy', 'Micke'] },
      us: { girl: ['Lori', 'Amanda', 'Crystal', 'Jamie'], boy: ['Justin', 'Gary', 'Kevin', 'Mark'], nick: ['Tommy-Lee', 'Spike', 'Ozzy', 'Fuzz'] }
    }
  },
  {
    key: 'troublemaker',
    name: ['Troublemaker', 'Encrenqueiro'],
    skills: ['force', 'sneak', 'lead'],
    blurb: [
      "You're a tough kid who never holds back. Classmates fear you or look up to you, teachers hate you, and everyone nags you to change. But when life hurts you, there is only one thing to do: fight back.",
      'Você é durão(durona) e nunca recua. Os colegas têm medo de você ou o admiram, os professores o odeiam e todo mundo pede que mude. Mas quando a vida te humilha e machuca, só há uma coisa a fazer: revidar.'
    ],
    iconic: [['Lighter and cigarettes', 'Isqueiro e cigarros'], ['Knife', 'Canivete'], ['Skateboard', 'Skate']],
    problems: [
      ["My parents say that I'm good for nothing.", 'Meus pais dizem que não presto para nada.'],
      ['My mother/father drinks a lot.', 'Minha mãe/meu pai bebe muito.'],
      ['We are short of money.', 'Estamos sem dinheiro.']
    ],
    drives: [["I'll do anything to get away from home.", 'Faço qualquer coisa para sair de casa.'], ['My friends and what we do is the only thing not broken in my life.', 'Meus amigos e o que fazemos juntos são a única coisa que não está quebrada na minha vida.']],
    prides: [['I helped a bird with a broken wing.', 'Ajudei um pássaro com a asa quebrada.'], ['I stood up to the teacher.', 'Enfrentei o professor.']],
    relKids: [['She/he thinks she/he is better than the rest of us!', 'Ela/ele se acha melhor que o resto de nós!'], ["I'll do anything for him/her.", 'Faço qualquer coisa por ele/ela.'], ["She/he knows what I'm going through.", 'Ela/ele sabe pelo que estou passando.']],
    relNpcs: [
      ['I wonder why the priest in {Wäsby|St Christopher\'s} bought explosives, and why his clothes are so filthy?', 'Me pergunto por que o padre de {Wäsby|St. Christopher} comprou explosivos e por que suas roupas estão tão sujas.'],
      ["They think I meet with {Nille|Mikey} at {Väntholmen|Hemenway Park} because he was famous or because I'm buying drugs, but I would never do drugs and I don't care about fame. I actually like him, though he keeps talking about how the owner of the company {NAAB|NAI} destroyed his life and the lives of many others.", 'Acham que me encontro com {Nille|Mikey} em {Väntholmen|Hemenway Park} porque ele era famoso ou porque compro drogas, mas eu jamais usaria drogas e não ligo para fama. Eu gosto dele, apesar de ele viver falando que o dono da empresa {NAAB|NAI} destruiu a vida dele e a de muita gente.'],
      ['My teacher {Niklas|Neil} is the only teacher I have ever liked, and now he is in the hospital and he won\'t wake up from whatever nightmare he is having.', 'Meu professor {Niklas|Neil} é o único de quem já gostei, e agora está no hospital e não acorda do pesadelo que está tendo.']
    ],
    anchors: [['Janitor at school', 'Zelador da escola'], ['School psychologist', 'Psicólogo(a) da escola'], ['Grandma', 'Vovó']],
    names: {
      swe: { girl: ['Sussy', 'Monika', 'Jenny', 'Emma'], boy: ['Lenny', 'Dennis', 'Benny', 'Stellan'], nick: ['Knota', 'Hajen', 'Kicki', 'Nettan', 'Mange'] },
      us: { girl: ['Marylee', 'Jenna', 'Stacey', 'Charlene'], boy: ['Ray', 'Jerry', 'Troy', 'Steve'], nick: ['Knuckles', 'Ninja', 'Sharky', 'Bird-killer'] }
    }
  },
  {
    key: 'weirdo',
    name: ['Weirdo', 'Esquisito'],
    skills: ['sneak', 'investigate', 'empathize'],
    blurb: [
      "They tease you for your clothes, your interests and your words, but you don't care. They know nothing about what you've been through. One day you will outshine them all.",
      'Zombam das suas roupas, dos seus interesses e das suas palavras, mas você não liga. Eles não sabem nada do que você já viveu. Um dia, você vai ofuscar todos eles.'
    ],
    iconic: [['Razorblade', 'Lâmina de barbear'], ['Drawing pad', 'Bloco de desenho'], ['Pet rat', 'Rato de estimação']],
    problems: [
      ['My father is a communist.', 'Meu pai é comunista.'],
      ['My brother is doing weird things in his room.', 'Meu irmão faz coisas estranhas no quarto.'],
      ['I get bullied at school.', 'Sofro bullying na escola.']
    ],
    drives: [["They say I'm the most curious person alive.", 'Dizem que sou a pessoa mais curiosa do mundo.'], ['Drawn to anything different or strange.', 'Atraído(a) por tudo que é diferente ou estranho.']],
    prides: [["I'm not heterosexual.", 'Não sou heterossexual.'], ['Mom says that I am beautiful.', 'Mamãe diz que sou lindo(a).']],
    relKids: [["He/she doesn't know that I love him/her.", 'Ele/ela não sabe que eu o(a) amo.'], ['Her/his parents let me live with them.', 'Os pais dela/dele me deixam morar com eles.'], ["He/she doesn't like me, but I will prove him/her wrong.", 'Ele/ela não gosta de mim, mas vou provar que está errado(a).']],
    relNpcs: [
      ["The priest in {Wäsby|St Christopher's}, {Hans-Erik|Joseph}, is the only adult whom I trust. Now he has disappeared.", 'O padre de {Wäsby|St. Christopher}, {Hans-Erik|Joseph}, é o único adulto em quem confio. Agora ele desapareceu.'],
      ['That kid {Björn|Bryan} told me that his friend, Peter, who works at the Dream Shop, is about to do something bad.', 'Aquele garoto, {Björn|Bryan}, me contou que o amigo dele, Peter, que trabalha na Loja dos Sonhos, está prestes a fazer algo ruim.'],
      ['She wants me to call her {Majsan|Stacey}, and she\'s older than me, and lives by herself in a house in {Kungsberga|outside Hemenway}. She hates all grownups.', 'Ela quer que eu a chame de {Majsan|Stacey}, é mais velha que eu e mora sozinha numa casa em {Kungsberga|nos arredores de Hemenway}. Ela odeia todos os adultos.']
    ],
    anchors: [['Grandmother', 'Avó'], ["Another Kid's mom/dad", 'Mãe/pai de outra criança'], ['Neighbor', 'Vizinho(a)']],
    names: {
      swe: { girl: ['Marianne', 'Sara', 'Anna-Lena', 'Ida'], boy: ['Nikodemus', 'Carl-Ingvar', 'Simeon', 'Gustaf'], nick: ['Ärret', 'Fladdermusen', 'Psykot', 'Nisse'] },
      us: { girl: ['Sandra', 'Amy', 'Michele', 'Christina'], boy: ['Jeffrey', 'Charles', 'Edward', 'Peter'], nick: ['Freaky', 'Commie', 'Ghost', 'Rat'] }
    }
  }
];

// Relações com PNJs ligadas à vida cotidiana (livro, p. 61)
export const EVERYDAY_NPCS = [
  ['Tim wants to knock me down.', 'O Tim quer me derrubar.'],
  ["Ulla doesn't trust me with her secrets.", 'A Ulla não confia seus segredos a mim.'],
  ['Mattias bullies me.', 'O Mattias faz bullying comigo.'],
  ['Greta is a parasite in our home.', 'A Greta é uma parasita na nossa casa.'],
  ['Lisa is out to make life difficult for me.', 'A Lisa quer dificultar a minha vida.'],
  ["Whatever I do is wrong in Tina's eyes.", 'Tudo o que eu faço está errado aos olhos da Tina.'],
  ['Marie was a true friend but she betrayed me.', 'A Marie era uma amiga de verdade, mas me traiu.'],
  ["I'll get my revenge on Mimmi.", 'Vou me vingar da Mimmi.'],
  ['Anna took my virginity.', 'A Anna tirou a minha virgindade.'],
  ['I admire Patrik, but he ignores me.', 'Eu admiro o Patrik, mas ele me ignora.']
];

// Perguntas do Mestre (livro, p. 63)
export const QUESTIONS_KIDS = [
  ['In what way has your Problem gone from bad to worse lately?', 'De que forma o seu Problema piorou ultimamente?'],
  ['What do your parents do for work?', 'Qual é o trabalho dos seus pais?'],
  ['What do you think about school?', 'O que você acha da escola?'],
  ['What is your favorite food?', 'Qual é a sua comida favorita?'],
  ['Do you have siblings? What do you think about them?', 'Você tem irmãos? O que pensa deles?'],
  ['What does your room look like?', 'Como é o seu quarto?'],
  ['What do you dream about at night?', 'Com o que você sonha à noite?'],
  ['What makes you angry?', 'O que te deixa com raiva?'],
  ['What do you want to work at when you grow up?', 'No que você quer trabalhar quando crescer?'],
  ['What do you think about sports?', 'O que você acha dos esportes?'],
  ['What is your experience with robots?', 'Qual é a sua experiência com robôs?'],
  ['What is the furthest you have traveled from your home town?', 'Qual foi o lugar mais distante da sua cidade aonde você já foi?'],
  ['How are you affected by your Pride?', 'Como o seu Orgulho afeta você?']
];
export const QUESTIONS_GROUP = [
  ['Who in the group has the most to say?', 'Quem no grupo tem mais a dizer?'],
  ['When did you get to know each other?', 'Quando vocês se conheceram?'],
  ['What makes you laugh?', 'O que faz vocês rirem?'],
  ['What secrets do you have?', 'Que segredos vocês têm?'],
  ['Who dislikes you?', 'Quem não gosta de vocês?'],
  ['Who wants to be in the gang?', 'Quem quer entrar na turma?'],
  ['What are you fighting about?', 'Por que vocês estão brigando?'],
  ['Who among you is most mocked?', 'Quem entre vocês é o mais zoado?'],
  ['Who is the leader?', 'Quem é o líder?'],
  ['Who is in love with whom?', 'Quem está apaixonado por quem?'],
  ['What sets you apart from other kids?', 'O que diferencia vocês das outras crianças?'],
  ['What are you not talking about?', 'Sobre o que vocês não falam?'],
  ['What do you like to do?', 'O que vocês gostam de fazer?']
];
