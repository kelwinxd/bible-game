// ---------- Habilidades → Afiar (aumenta a DURAÇÃO do poder do versículo) ----------
// Por versículo (o id de palavra/versiculos.js): 3 níveis de perguntas, cada um uma lista.
//   [0] = nível 1, "quem escreveu?" (completado com perguntas sorteadas de AUTORES, abaixo, pelo autor do versículo)
//   [1] = nível 2, contexto histórico · [2] = nível 3, contexto da passagem
//   cada pergunta: p = a pergunta · certa = a resposta certa · erradas = as outras opções.
// Textos ARC escritos de memória — conferir antes de publicar.
export const AFIACAO = {
  // Êxodo 20:3
  "ex20-3": [
      [
        { p: "Quem escreveu o livro de Êxodo?", certa: "Moisés", erradas: ["Arão", "Josué", "Samuel"] }
      ],
      [
        { p: "De qual terra Deus tinha acabado de tirar Israel?", certa: "Egito", erradas: ["Babilônia", "Canaã", "Assíria"] },
        { p: "Em qual monte Deus deu os Dez Mandamentos (Êxodo 19:20)?", certa: "Sinai", erradas: ["Carmelo", "Sião", "Das Oliveiras"] }
      ],
      [
        { p: "Logo antes (Êxodo 20:2), Deus se apresenta como aquele que tirou o povo de onde?", certa: "Da casa da servidão, a terra do Egito", erradas: ["Do dilúvio", "Da cova dos leões", "Do deserto de Midiã"] },
        { p: "Logo depois (Êxodo 20:4), o que Deus proíbe fazer?", certa: "Imagens de escultura para adorar", erradas: ["Trabalhar no sábado", "Comer carne de porco", "Casar com estrangeiros"] }
      ]
  ],
  // Êxodo 20:4
  "ex20-4": [
      [
        { p: "Quem escreveu o livro de Êxodo?", certa: "Moisés", erradas: ["Arão", "Josué", "Samuel"] }
      ],
      [
        { p: "Na primeira praga, as águas de qual rio viraram sangue?", certa: "Nilo", erradas: ["Jordão", "Eufrates", "Tigre"] },
        { p: "Quantas pragas Deus enviou sobre o Egito?", certa: "Dez", erradas: ["Sete", "Doze", "Três"] }
      ],
      [
        { p: "Logo depois (Êxodo 20:5), o que Deus diz para não fazer diante das imagens?", certa: "Encurvar-se a elas nem servi-las", erradas: ["Tocá-las com as mãos", "Vendê-las no mercado", "Guardá-las em casa"] },
        { p: "Qual mandamento vem logo antes (Êxodo 20:3)?", certa: "Não ter outros deuses diante de Deus", erradas: ["Honrar pai e mãe", "Guardar o sábado", "Não furtar"] }
      ]
  ],
  // Êxodo 20:7
  "ex20-7": [
      [
        { p: "Em que livro estão os Dez Mandamentos de Êxodo 20?", certa: "Êxodo", erradas: ["Gênesis", "Levítico", "Josué"] }
      ],
      [
        { p: "Qual mandamento é \"Não tomarás o nome do Senhor em vão\"?", certa: "O terceiro", erradas: ["O primeiro", "O quinto", "O décimo"] },
        { p: "Quem perguntou \"Quem é o Senhor, cuja voz eu ouvirei?\"", certa: "O faraó", erradas: ["Moisés", "Arão", "Josué"] }
      ],
      [
        { p: "Em que monte Deus deu os Dez Mandamentos a Moisés?", certa: "Sinai", erradas: ["Carmelo", "Sião", "Hermom"] },
        { p: "Em que os mandamentos foram escritos?", certa: "Em tábuas de pedra", erradas: ["Em rolos de papiro", "Em placas de ouro", "Em tábuas de madeira"] }
      ]
  ],
  // Hebreus 4:12
  "hb4-12": [
      [
        { p: "Quem escreveu a carta aos Hebreus?", certa: "Não se sabe (o autor não se identifica)", erradas: ["Pedro", "Tiago", "João"] }
      ],
      [
        { p: "A carta foi escrita principalmente para quem?", certa: "Cristãos de origem judaica", erradas: ["Romanos pagãos", "Filósofos gregos", "Sacerdotes egípcios"] },
        { p: "Segundo Hebreus 10:32-34, o que aqueles cristãos já tinham sofrido?", certa: "Perseguição e perda dos bens", erradas: ["Uma grande fome", "Um terremoto", "O exílio na Babilônia"] }
      ],
      [
        { p: "Logo antes (Hebreus 4:11), o autor exorta a se esforçar para entrar em quê?", certa: "No descanso de Deus", erradas: ["No templo", "Na arca", "Na cidade de Davi"] },
        { p: "Logo depois (Hebreus 4:13), o que fica encoberto diante de Deus?", certa: "Nada, tudo está descoberto", erradas: ["Os pensamentos", "O futuro", "Os pecados antigos"] }
      ]
  ],
  // Tiago 4:7
  "tg4-7": [
      [
        { p: "Quem escreveu a carta de Tiago?", certa: "Tiago, irmão do Senhor", erradas: ["Tiago, filho de Zebedeu", "Pedro", "Paulo"] }
      ],
      [
        { p: "Tiago foi líder de qual igreja?", certa: "Jerusalém", erradas: ["Antioquia", "Roma", "Éfeso"] },
        { p: "A quem a carta foi dirigida (Tiago 1:1)?", certa: "Às doze tribos dispersas", erradas: ["À igreja de Roma", "Aos gálatas", "A Timóteo"] }
      ],
      [
        { p: "Em Tiago 4:1, de onde vinham as guerras e contendas entre eles?", certa: "Dos seus próprios deleites", erradas: ["Da perseguição romana", "Da falta de dinheiro", "Dos falsos profetas"] },
        { p: "Logo antes (Tiago 4:6), Deus resiste a quem?", certa: "Aos soberbos", erradas: ["Aos pobres", "Aos gentios", "Aos pecadores arrependidos"] }
      ]
  ],
  // 1 Coríntios 10:13
  "1co10-13": [
      [
        { p: "Quem escreveu 1 Coríntios?", certa: "Paulo", erradas: ["Pedro", "Apolo", "Lucas"] }
      ],
      [
        { p: "Corinto ficava em qual região?", certa: "Grécia (Acaia)", erradas: ["Ásia Menor", "Judeia", "Itália"] },
        { p: "De qual cidade Paulo escreveu a carta (1 Coríntios 16:8)?", certa: "Éfeso", erradas: ["Roma", "Jerusalém", "Antioquia"] }
      ],
      [
        { p: "Em 1 Coríntios 10, Paulo usa como exemplo de advertência a história de quem?", certa: "Israel no deserto", erradas: ["Davi e Golias", "Jonas em Nínive", "Daniel na Babilônia"] },
        { p: "Logo depois (10:14), Paulo manda fugir de quê?", certa: "Da idolatria", erradas: ["Das contendas", "Da avareza", "Das festas"] }
      ]
  ],
  // Isaías 41:10
  "is41-10": [
      [
        { p: "Quem escreveu o livro de Isaías?", certa: "O profeta Isaías", erradas: ["Jeremias", "Ezequiel", "Moisés"] }
      ],
      [
        { p: "Isaías profetizou nos dias de quais reis de Judá (Isaías 1:1)?", certa: "Uzias, Jotão, Acaz e Ezequias", erradas: ["Davi e Salomão", "Josias e Jeoaquim", "Saul e Davi"] },
        { p: "Qual império ameaçava Judá nos dias de Isaías?", certa: "Assíria", erradas: ["Pérsia", "Roma", "Grécia"] }
      ],
      [
        { p: "Em Isaías 41:8, Deus chama de \"meu servo\" a quem?", certa: "Israel, a descendência de Jacó", erradas: ["Ciro, rei da Pérsia", "Davi", "Os filisteus"] },
        { p: "Isaías 41:8 lembra que Israel descende de qual \"amigo\" de Deus?", certa: "Abraão", erradas: ["Noé", "Moisés", "Davi"] }
      ]
  ],
  // Salmos 23:4
  "sl23-4": [
      [
        { p: "A quem é atribuído o Salmo 23?", certa: "Davi", erradas: ["Salomão", "Asafe", "Moisés"] }
      ],
      [
        { p: "Davi foi ungido rei no lugar de quem?", certa: "Saul", erradas: ["Salomão", "Samuel", "Jônatas"] },
        { p: "Qual cidade Davi conquistou e fez capital do reino?", certa: "Jerusalém", erradas: ["Belém", "Siló", "Samaria"] }
      ],
      [
        { p: "No Salmo 23, o Senhor é comparado a quê?", certa: "A um pastor", erradas: ["A um rei", "A uma rocha", "A um guerreiro"] },
        { p: "No versículo 4, o que consola o salmista?", certa: "A vara e o cajado do Senhor", erradas: ["A espada e o escudo", "A luz da lâmpada", "O canto dos anjos"] }
      ]
  ],
  // Salmos 3:7
  "sl3-7": [
      [
        { p: "A quem é atribuído o Salmo 3?", certa: "Davi", erradas: ["Salomão", "Asafe", "Coré"] }
      ],
      [
        { p: "Quem era Absalão?", certa: "Filho de Davi", erradas: ["Irmão de Davi", "General de Saul", "Rei dos filisteus"] },
        { p: "Por que Davi fugia de Jerusalém naquela época?", certa: "Absalão se rebelou para tomar o trono", erradas: ["Os filisteus invadiram a cidade", "Saul queria matá-lo", "Uma fome atingiu Judá"] }
      ],
      [
        { p: "Em Salmos 3:2, o que muitos diziam sobre Davi?", certa: "Que não há salvação para ele em Deus", erradas: ["Que ele reinaria para sempre", "Que ele fugiria para o Egito", "Que ele tinha muitos aliados"] },
        { p: "Em Salmos 3:5, mesmo cercado de inimigos, o que Davi fez?", certa: "Deitou, dormiu e acordou, sustentado pelo Senhor", erradas: ["Venceu sozinho o exército", "Escondeu-se numa caverna", "Fugiu para o deserto"] }
      ]
  ],
  // 1 Pedro 5:6
  "1pe5-6": [
      [
        { p: "Quem escreveu a primeira carta de Pedro?", certa: "Pedro", erradas: ["Paulo", "João", "Tiago"] }
      ],
      [
        { p: "Pelo que passavam os cristãos que receberam a carta (1 Pedro 4:12)?", certa: "Provações e sofrimentos", erradas: ["Uma grande riqueza", "Uma guerra civil", "O exílio no Egito"] },
        { p: "Pedro manda saudações da igreja de qual cidade (1 Pedro 5:13), nome simbólico para Roma?", certa: "Babilônia", erradas: ["Jerusalém", "Antioquia", "Corinto"] }
      ],
      [
        { p: "Logo antes (1 Pedro 5:5), Deus resiste a quem?", certa: "Aos soberbos", erradas: ["Aos pobres", "Aos estrangeiros", "Aos fracos"] },
        { p: "Logo depois (1 Pedro 5:7), o que devemos lançar sobre Deus?", certa: "Toda a nossa ansiedade", erradas: ["Nossas ofertas", "Nossos inimigos", "Nossas coroas"] }
      ]
  ],
  // Provérbios 3:5
  "pv3-5": [
      [
        { p: "Quem escreveu a maior parte de Provérbios?", certa: "Salomão", erradas: ["Davi", "Moisés", "Daniel"] }
      ],
      [
        { p: "Salomão era filho de qual rei?", certa: "Davi", erradas: ["Saul", "Ezequias", "Josias"] },
        { p: "O que Salomão pediu a Deus em Gibeom (1 Reis 3:9)?", certa: "Sabedoria para governar o povo", erradas: ["Riquezas", "Vida longa", "Vitória sobre os inimigos"] }
      ],
      [
        { p: "Logo depois (Provérbios 3:6), quem reconhece a Deus em todos os caminhos recebe o quê?", certa: "Veredas endireitadas por Ele", erradas: ["Muitas riquezas", "Inimigos derrotados", "Um reino"] },
        { p: "Logo depois (Provérbios 3:7), o conselho é não ser o quê aos próprios olhos?", certa: "Sábio", erradas: ["Pobre", "Forte", "Triste"] }
      ]
  ]
};

// Afiação nível 1: perguntas SÓ sobre a pessoa do autor (não sobre o contexto da carta/livro).
// Uma é sorteada a cada partida, depois do "quem escreveu?". Autores compartilhados entre versículos (ex.: Davi).
export const AUTORES = {
  hebreus: { nome: "Autor de Hebreus", perguntas: [
    { p: "A tradição antiga da igreja atribuiu Hebreus a quem?", certa: "Paulo", erradas: ["Pedro", "João", "Tiago"] },
    { p: "Além de Paulo, quais nomes os estudiosos já sugeriram como autor?", certa: "Apolo ou Barnabé", erradas: ["Pedro ou João", "Mateus ou Tiago", "Davi ou Salomão"] },
    { p: "Em Hebreus 13:23, o autor menciona qual irmão, já posto em liberdade?", certa: "Timóteo", erradas: ["Silas", "Tito", "Marcos"] }
  ] },
  paulo: { nome: "Paulo", perguntas: [
    { p: "Qual era o nome de Paulo antes de ser chamado Paulo?", certa: "Saulo", erradas: ["Silas", "Simeão", "Barnabé"] },
    { p: "Antes da conversão, Paulo perseguia quem?", certa: "Os cristãos", erradas: ["Os romanos", "Os fariseus", "Os samaritanos"] },
    { p: "Onde Paulo encontrou Jesus e se converteu?", certa: "No caminho de Damasco", erradas: ["No templo de Jerusalém", "Em Atenas", "No mar da Galileia"] },
    { p: "Paulo era natural de qual cidade?", certa: "Tarso", erradas: ["Nazaré", "Cafarnaum", "Corinto"] },
    { p: "Antes de Cristo, Paulo pertencia a qual grupo judeu?", certa: "Fariseus", erradas: ["Saduceus", "Essênios", "Zelotes"] },
    { p: "Paulo foi instruído aos pés de qual mestre (Atos 22:3)?", certa: "Gamaliel", erradas: ["Nicodemos", "Caifás", "Anás"] },
    { p: "Qual ofício Paulo usava para se sustentar?", certa: "Fazedor de tendas", erradas: ["Pescador", "Carpinteiro", "Cobrador de impostos"] },
    { p: "Paulo ficou conhecido como apóstolo de quem?", certa: "Dos gentios", erradas: ["Dos sacerdotes", "Dos samaritanos", "Dos reis"] }
  ] },
  tiago: { nome: "Tiago", perguntas: [
    { p: "Tiago, autor da carta, era irmão de quem?", certa: "De Jesus", erradas: ["De João", "De Pedro", "De André"] },
    { p: "Como Tiago se apresenta no início da carta (Tiago 1:1)?", certa: "Servo de Deus e do Senhor Jesus Cristo", erradas: ["Apóstolo dos gentios", "Profeta de Israel", "Filho do trovão"] },
    { p: "Antes da ressurreição, os irmãos de Jesus criam nele (João 7:5)?", certa: "Não, não criam", erradas: ["Sim, desde a infância", "Eram do grupo dos doze", "Só Tiago cria"] },
    { p: "Segundo 1 Coríntios 15:7, Jesus ressuscitado apareceu a quem?", certa: "A Tiago", erradas: ["A Nicodemos", "A Lázaro", "A José de Arimateia"] },
    { p: "Como Paulo chama Tiago em Gálatas 1:19?", certa: "Irmão do Senhor", erradas: ["Filho do trovão", "Pai da fé", "O zelote"] }
  ] },
  moises: { nome: "Moisés", perguntas: [
    { p: "Quando bebê, onde Moisés foi colocado para escapar da ordem de Faraó (Êxodo 2:3)?", certa: "Num cesto de junco no rio", erradas: ["Numa caverna", "No templo", "Num poço seco"] },
    { p: "Quem criou Moisés no palácio (Êxodo 2:10)?", certa: "A filha de Faraó", erradas: ["A rainha de Sabá", "Raabe", "Rute"] },
    { p: "Moisés era de qual tribo de Israel (Êxodo 2:1)?", certa: "Levi", erradas: ["Judá", "Benjamim", "Dã"] },
    { p: "Para qual terra Moisés fugiu depois de matar o egípcio (Êxodo 2:15)?", certa: "Midiã", erradas: ["Moabe", "Edom", "Filístia"] },
    { p: "De dentro de quê Deus chamou Moisés (Êxodo 3:2)?", certa: "De uma sarça ardente", erradas: ["De uma nuvem", "De um redemoinho", "De uma rocha"] },
    { p: "Quem Deus deu para falar ao lado de Moisés (Êxodo 4:14)?", certa: "Seu irmão Arão", erradas: ["Josué", "Calebe", "Jetro"] }
  ] },
  isaias: { nome: "Isaías", perguntas: [
    { p: "Isaías era filho de quem (Isaías 1:1)?", certa: "Amoz", erradas: ["Hilquias", "Buzi", "Jessé"] },
    { p: "Quando foi chamado (Isaías 6), o que Isaías viu?", certa: "O Senhor num alto e sublime trono", erradas: ["Uma sarça ardente", "Uma escada até o céu", "Um carro de fogo"] },
    { p: "O que tocou os lábios de Isaías no seu chamado (Isaías 6:6-7)?", certa: "Uma brasa viva do altar", erradas: ["Um ramo de hissopo", "Óleo da unção", "Água do Jordão"] },
    { p: "O que Isaías respondeu quando Deus perguntou: a quem enviarei?", certa: "Eis-me aqui, envia-me a mim", erradas: ["Quem sou eu para ir?", "Não sei falar", "Envia outro"] },
    { p: "Isaías profetizou principalmente a qual reino?", certa: "Judá", erradas: ["Edom", "Egito", "Moabe"] }
  ] },
  pedro: { nome: "Pedro", perguntas: [
    { p: "Qual era a profissão de Pedro antes de seguir Jesus?", certa: "Pescador", erradas: ["Cobrador de impostos", "Carpinteiro", "Pastor"] },
    { p: "Qual era o nome de Pedro antes de Jesus chamá-lo assim?", certa: "Simão", erradas: ["Saulo", "Levi", "Natanael"] },
    { p: "Quantas vezes Pedro negou Jesus?", certa: "Três", erradas: ["Uma", "Duas", "Sete"] },
    { p: "Quem era o irmão de Pedro, também apóstolo?", certa: "André", erradas: ["João", "Tiago", "Filipe"] }
  ] },
  salomao: { nome: "Salomão", perguntas: [
    { p: "Qual grande obra Salomão construiu em Jerusalém?", certa: "O templo", erradas: ["A muralha de Neemias", "O palácio de Herodes", "A torre de Babel"] },
    { p: "Quem era a mãe de Salomão?", certa: "Bate-Seba", erradas: ["Rute", "Ester", "Mical"] },
    { p: "Qual rainha visitou Salomão para provar a sabedoria dele?", certa: "A rainha de Sabá", erradas: ["A rainha Ester", "A rainha Jezabel", "A rainha Vasti"] }
  ] },
  davi: { nome: "Davi", perguntas: [
    { p: "Antes de ser rei, Davi trabalhava como quê?", certa: "Pastor de ovelhas", erradas: ["Pescador", "Carpinteiro", "Sacerdote"] },
    { p: "Davi era filho de quem?", certa: "Jessé", erradas: ["Saul", "Samuel", "Boaz"] },
    { p: "Davi nasceu em qual cidade?", certa: "Belém", erradas: ["Nazaré", "Jericó", "Hebrom"] },
    { p: "Qual gigante filisteu Davi venceu?", certa: "Golias", erradas: ["Ogue", "Sansão", "Anaque"] },
    { p: "Qual profeta ungiu Davi como rei?", certa: "Samuel", erradas: ["Natã", "Elias", "Eli"] },
    { p: "Qual instrumento Davi tocava para acalmar Saul?", certa: "Harpa", erradas: ["Trombeta", "Flauta", "Tamboril"] }
  ] }
};

// níveis da afiação: base = segundos de poder sem afiar · ganho = segundos a mais por nível · descr = o tema de cada nível
export const NIVEIS_AFIACAO = { base: 4, ganho: 1, descr: ["Autor do livro", "Contexto histórico", "Contexto da passagem"] };
