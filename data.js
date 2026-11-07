// Conteúdo separado da lógica (GDD 14.2). Textos ARC escritos de memória — conferir antes de publicar.
window.DATA = {
  // Cada versículo tem 2 trilhas de 3 níveis (só passa de nível acertando tudo):
  //  - Forja (aumenta o DANO): nível 1 = `lacunas` (2), nível 2 = `lacunas` + `lacunas2` (4), nível 3 = versículo inteiro.
  //  - Afiação (aumenta a DURAÇÃO do poder): `afiacao[0]` = "quem escreveu?" (+ 1 pergunta sorteada de `autores[autor]`),
  //    `afiacao[1]` contexto histórico, `afiacao[2]` contexto da passagem.
  versiculos: [
    {
      id: "hb4-12", ref: "Hebreus 4:12", tema: "mentira", autor: "hebreus",
      texto: "Porque a palavra de Deus é viva, e eficaz, e mais penetrante do que qualquer espada de dois gumes, e penetra até à divisão da alma, e do espírito, e das juntas e medulas, e é apta para discernir os pensamentos e intenções do coração.",
      lacunas: [
        { certa: "viva", distratores: ["antiga", "bela", "simples"] },
        { certa: "espada", distratores: ["lança", "flecha", "pedra"] }
      ],
      lacunas2: [
        { certa: "eficaz", distratores: ["breve", "rara", "difícil"] },
        { certa: "coração", distratores: ["povo", "mundo", "templo"] }
      ],
      afiacao: [
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
      ]
    },
    {
      id: "tg4-7", ref: "Tiago 4:7", tema: "tentacao", autor: "tiago",
      texto: "Sujeitai-vos, pois, a Deus; resisti ao diabo, e ele fugirá de vós.",
      lacunas: [
        { certa: "resisti", distratores: ["obedecei", "servi", "ouvi"] },
        { certa: "fugirá", distratores: ["voltará", "ficará", "vencerá"] }
      ],
      lacunas2: [
        { certa: "Deus", distratores: ["lei", "igreja", "verdade"] },
        { certa: "diabo", distratores: ["mundo", "pecado", "medo"] }
      ],
      afiacao: [
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
      ]
    },
    {
      id: "1co10-13", ref: "1 Coríntios 10:13", tema: "tentacao", autor: "paulo",
      texto: "Não veio sobre vós tentação, senão humana; mas fiel é Deus, que vos não deixará tentar acima do que podeis; antes, com a tentação dará também o escape, para que a possais suportar.",
      lacunas: [
        { certa: "fiel", distratores: ["justo", "forte", "santo"] },
        { certa: "escape", distratores: ["caminho", "refúgio", "descanso"] }
      ],
      lacunas2: [
        { certa: "humana", distratores: ["divina", "pequena", "rara"] },
        { certa: "suportar", distratores: ["vencer", "esquecer", "evitar"] }
      ],
      afiacao: [
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
      ]
    },
    {
      id: "is41-10", ref: "Isaías 41:10", tema: "duvida", autor: "isaias",
      texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça.",
      lacunas: [
        { certa: "contigo", distratores: ["grande", "longe", "juiz"] },
        { certa: "destra", distratores: ["esquerda", "palavra", "força"] }
      ],
      lacunas2: [
        { certa: "temas", distratores: ["chores", "fujas", "durmas"] },
        { certa: "ajudo", distratores: ["julgo", "chamo", "provo"] }
      ],
      afiacao: [
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
      ]
    },
    {
      id: "sl23-4", ref: "Salmos 23:4", tema: "duvida", autor: "davi",
      texto: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
      lacunas: [
        { certa: "sombra", distratores: ["casa", "vida", "festa"] },
        { certa: "cajado", distratores: ["pão", "manto", "escudo"] }
      ],
      lacunas2: [
        { certa: "morte", distratores: ["noite", "guerra", "fome"] },
        { certa: "consolam", distratores: ["guiam", "cercam", "ferem"] }
      ],
      afiacao: [
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
      ]
    },
    {
      id: "sl3-7", ref: "Salmos 3:7", tema: "duvida", autor: "davi",
      texto: "Levanta-te, Senhor; salva-me, Deus meu, pois feriste a todos os meus inimigos nas queixadas; quebraste os dentes dos ímpios.",
      lacunas: [
        { certa: "salva-me", distratores: ["ouve-me", "ensina-me", "consola-me"] },
        { certa: "dentes", distratores: ["ossos", "braços", "escudos"] }
      ],
      lacunas2: [
        { certa: "inimigos", distratores: ["amigos", "irmãos", "servos"] },
        { certa: "ímpios", distratores: ["justos", "reis", "leões"] }
      ],
      afiacao: [
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
      ]
    }
  ],
  mentiras: [
    { texto: "Cede. Só desta vez.", tipo: "tentacao", ideal: ["tg4-7"] },
    { texto: "Você não aguenta mais.", tipo: "tentacao", ideal: ["1co10-13"] },
    { texto: "Deus te abandonou.", tipo: "duvida", ideal: ["sl23-4"] },
    { texto: "Você é fraco e medroso. Desista.", tipo: "duvida", ideal: ["is41-10"] },
    { texto: "Seus inimigos são fortes demais.", tipo: "duvida", ideal: ["sl3-7"] },
    // variações: frases diferentes que pedem o mesmo versículo (anti-decoreba, GDD 6.3)
    { texto: "Ninguém vai saber.", tipo: "tentacao", ideal: ["tg4-7"] },
    { texto: "Você merece isso, aproveita.", tipo: "tentacao", ideal: ["tg4-7"] },
    { texto: "Não tem saída, desista.", tipo: "tentacao", ideal: ["1co10-13"] },
    { texto: "Isso é forte demais pra você.", tipo: "tentacao", ideal: ["1co10-13"] },
    { texto: "Você está sozinho no escuro.", tipo: "duvida", ideal: ["sl23-4"] },
    { texto: "Ninguém vai te socorrer.", tipo: "duvida", ideal: ["is41-10"] },
    { texto: "Você vai perder essa batalha.", tipo: "duvida", ideal: ["sl3-7"] },
    // demônio da Mentira: desacredita a Bíblia
    { texto: "A Bíblia é só um livro antigo. Não serve pra nada hoje.", tipo: "mentira", ideal: ["hb4-12"] },
    { texto: "Palavras velhas e mortas. Isso não muda ninguém.", tipo: "mentira", ideal: ["hb4-12"] },
    { texto: "Isso é coisa do passado, não tem poder nenhum.", tipo: "mentira", ideal: ["hb4-12"] }
  ],
  // Abreviação dos livros para os cards compactos do HUD (deck fechado): "Tiago 4:7" → "Tg 4:7".
  abrev: { "Hebreus": "Hb", "Tiago": "Tg", "1 Coríntios": "1Co", "Isaías": "Is", "Salmos": "Sl" },

  // Cor do poder por tema do versículo: brilho no herói, rasgo, impacto, referência, barra de poder e cards.
  temas: {
    tentacao: { nome: "Tentação", cor: "#f2c84b", claro: "#fff2b0", brilho: "#ffd34d" }, // amarelo/dourado
    duvida:   { nome: "Dúvida",   cor: "#7cc8ff", claro: "#e3f5ff", brilho: "#5fb8ff" }, // azul claro
    mentira:  { nome: "Mentira",  cor: "#ff9a4d", claro: "#ffe0c4", brilho: "#ff8a2a" }  // laranja
  },
  inimigos: {
    // chao: anda no chão e ataca corpo a corpo (passo = px/s); sem chao: flutua e cospe fogo;
    // mergulho: ave que paira no alto e mergulha no herói (sprite assets/sprites/enemy/ave-*.png)
    tentacao: { nome: "Demônio da Tentação", vida: 70, dano: 10, tell: 0.55, cadencia: 1.5, chao: true, passo: 90, cor: "#6e0f12", sprite: "serpente" },
    duvida:   { nome: "Ave da Dúvida",       vida: 60, dano: 10, tell: 0.7,  cadencia: 2.2, cor: "#4a3426", sprite: "ave", mergulho: true },
    mentira:  { nome: "Demônio da Mentira",  vida: 60, dano: 8,  tell: 0.6,  cadencia: 1.8, chao: true, passo: 70, cor: "#9a1c1c", sprite: "serpente" }  // serpente: assets/sprites/enemy/serpente-*.png
  },
  // Jornadas (fases), em ordem: vencer uma libera a próxima. O herói começa só com os versículos achados nas
  // jornadas anteriores. dica (opcional) = aviso no topo ao começar; fundo (opcional) = imagem de fundo (sem ele, céu desenhado).
  // Eventos em ordem de x (pixels do mundo):
  //  buraco     = obstáculo para pular (cair = volta ao último ponto firme, -10 de vida)
  //  terreno    = trecho com outra altura: altura > 0 = mais alto (parede: precisa pular), < 0 = vale mais baixo
  //  plataforma = laje flutuante; sobe pulando por baixo e fica em cima
  //  pedra      = ídolo (bezerro de ouro) com o livro dourado do versículo; fica apoiada no que estiver embaixo
  //               (chão, terreno alto, vale ou plataforma). 3 golpes; tocar no livro = versículo no HUD
  //  inimigos   = grupo que surge quando o herói chega perto; a câmera trava até todos caírem. vida = multiplicador;
  //               frases (opcional) = mentira fixa de cada inimigo do grupo (texto igual ao de `mentiras`)
  //  Arenas ficam no plano: deixe ~740 px antes e ~220 px depois do x de `inimigos` sem desnível.
  //  Pulo: sobe até ~130 px e alcança ~185 px na horizontal.
  // mapa (tela Jogar): x/y = posição do ponto em % do mapa deitado (no celular em pé, x e y se invertem);
  //   icone = desenho do ponto (js/ui/map.js → ICONES: piramide, vale; sem ele, ruínas); cor = brilho da região em volta
  // protótipo: true = todas as jornadas abertas no menu, sem precisar vencer a anterior (false = trava até vencer)
  jornadasLiberadas: true,
  fases: [{
    // Jornada 1: só 2 versículos, bem separados. Cada um vem antes de 2 monstros (um por vez) que ele refuta.
    nome: "Exodus", comprimento: 9300,
    mapa: { x: 24, y: 60, icone: "piramide", cor: "#e0782c" },
    // fundo (opcional): imagem que rola devagar (parallax) e se repete espelhada, emendando sem corte; escuro = véu por cima
    fundo: { img: "assets/img/fundo-exodus.webp", parallax: 0.35, escuro: 0.35 },
    chao: "assets/img/chao-exodus.webp", // laje de terra e pedras (miolo repetido + pontas nas bordas)
    eventos: [
      // 1) buraco e pedra no chão → Hebreus 4:12
      { tipo: "buraco", x: 650, w: 140 },
      { tipo: "pedra", x: 1050, verso: "hb4-12" },
      //    → 2 Mentiras (serpentes), uma de cada vez, com um terreno alto entre elas
      { tipo: "inimigos", x: 1900, inimigos: ["mentira"], vida: 0.6, frases: ["A Bíblia é só um livro antigo. Não serve pra nada hoje."] },
      { tipo: "terreno", x: 2350, w: 380, altura: 90 },
      { tipo: "inimigos", x: 3500, inimigos: ["mentira"], vida: 0.7, frases: ["Palavras velhas e mortas. Isso não muda ninguém."] },
      // 2) caminho longo até o 2º versículo: buraco, vale, buraco largo, degrau e penhasco com a pedra no topo → Tiago 4:7
      { tipo: "buraco", x: 4000, w: 170 },
      { tipo: "terreno", x: 4500, w: 500, altura: -90 },
      { tipo: "buraco", x: 5300, w: 330 },
      { tipo: "plataforma", x: 5400, w: 130, altura: 50 },
      { tipo: "plataforma", x: 5720, w: 140, altura: 70 },
      { tipo: "terreno", x: 5880, w: 460, altura: 140 },
      { tipo: "pedra", x: 6150, verso: "tg4-7" },
      //    → 2 Tentações, uma de cada vez (frases fixas: as que Tiago 4:7 refuta)
      { tipo: "inimigos", x: 7200, inimigos: ["tentacao"], vida: 0.6, frases: ["Cede. Só desta vez."] },
      { tipo: "inimigos", x: 8500, inimigos: ["tentacao"], vida: 0.75, frases: ["Ninguém vai saber."] }
    ]
  }, {
    // Jornada 2: a Dúvida ataca do alto (aves que mergulham). 3 versículos contra o medo, cada um antes das aves que ele refuta.
    nome: "O vale da sombra", comprimento: 10800,
    mapa: { x: 58, y: 38, icone: "vale", cor: "#5d7fb8" },
    dica: ["A Dúvida ataca do alto: a ave mergulha onde você está", "Saia do lugar ou erga o escudo [J]; pule para golpeá-la"],
    eventos: [
      // 1) buraco e pedra no chão → Isaías 41:10
      { tipo: "buraco", x: 700, w: 150 },
      { tipo: "pedra", x: 1250, verso: "is41-10" },
      //    → 2 aves, uma de cada vez, com um terreno alto entre elas
      { tipo: "inimigos", x: 2200, inimigos: ["duvida"], vida: 0.7, frases: ["Você é fraco e medroso. Desista."] },
      { tipo: "terreno", x: 2650, w: 400, altura: 100 },
      { tipo: "inimigos", x: 3900, inimigos: ["duvida"], vida: 0.75, frases: ["Ninguém vai te socorrer."] },
      // 2) buraco e descida ao vale: a pedra fica lá embaixo ("vale da sombra da morte") → Salmos 23:4
      { tipo: "buraco", x: 4400, w: 170 },
      { tipo: "terreno", x: 4900, w: 560, altura: -90 },
      { tipo: "pedra", x: 5180, verso: "sl23-4" },
      { tipo: "inimigos", x: 6400, inimigos: ["duvida"], vida: 0.8, frases: ["Deus te abandonou."] },
      { tipo: "inimigos", x: 7500, inimigos: ["duvida"], vida: 0.85, frases: ["Você está sozinho no escuro."] },
      // 3) buraco largo com lajes e penhasco com a pedra no topo → Salmos 3:7
      { tipo: "buraco", x: 8000, w: 330 },
      { tipo: "plataforma", x: 8100, w: 130, altura: 50 },
      { tipo: "plataforma", x: 8420, w: 140, altura: 70 },
      { tipo: "terreno", x: 8580, w: 460, altura: 140 },
      { tipo: "pedra", x: 8850, verso: "sl3-7" },
      //    → final: 2 aves juntas (mergulham uma de cada vez)
      { tipo: "inimigos", x: 10050, inimigos: ["duvida", "duvida"], vida: 0.7, frases: ["Seus inimigos são fortes demais.", "Você vai perder essa batalha."] }
    ]
  }],
  // Exercitar a fé: leitura + quiz sobre os heróis de Hebreus 11. Passar no quiz aumenta a duração do escudo.
  // Afiação nível 1: perguntas SÓ sobre a pessoa do autor (não sobre o contexto da carta/livro).
  // Uma é sorteada a cada partida, depois do "quem escreveu?". Autores compartilhados entre versículos (ex.: Davi).
  autores: {
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
    isaias: { nome: "Isaías", perguntas: [
      { p: "Isaías era filho de quem (Isaías 1:1)?", certa: "Amoz", erradas: ["Hilquias", "Buzi", "Jessé"] },
      { p: "Quando foi chamado (Isaías 6), o que Isaías viu?", certa: "O Senhor num alto e sublime trono", erradas: ["Uma sarça ardente", "Uma escada até o céu", "Um carro de fogo"] },
      { p: "O que tocou os lábios de Isaías no seu chamado (Isaías 6:6-7)?", certa: "Uma brasa viva do altar", erradas: ["Um ramo de hissopo", "Óleo da unção", "Água do Jordão"] },
      { p: "O que Isaías respondeu quando Deus perguntou: a quem enviarei?", certa: "Eis-me aqui, envia-me a mim", erradas: ["Quem sou eu para ir?", "Não sei falar", "Envia outro"] },
      { p: "Isaías profetizou principalmente a qual reino?", certa: "Judá", erradas: ["Edom", "Egito", "Moabe"] }
    ] },
    davi: { nome: "Davi", perguntas: [
      { p: "Antes de ser rei, Davi trabalhava como quê?", certa: "Pastor de ovelhas", erradas: ["Pescador", "Carpinteiro", "Sacerdote"] },
      { p: "Davi era filho de quem?", certa: "Jessé", erradas: ["Saul", "Samuel", "Boaz"] },
      { p: "Davi nasceu em qual cidade?", certa: "Belém", erradas: ["Nazaré", "Jericó", "Hebrom"] },
      { p: "Qual gigante filisteu Davi venceu?", certa: "Golias", erradas: ["Ogue", "Sansão", "Anaque"] },
      { p: "Qual profeta ungiu Davi como rei?", certa: "Samuel", erradas: ["Natã", "Elias", "Eli"] },
      { p: "Qual instrumento Davi tocava para acalmar Saul?", certa: "Harpa", erradas: ["Trombeta", "Flauta", "Tamboril"] }
    ] }
  },

  // Sessão Espírito Santo (na forja): leitura + quiz só sobre o Espírito Santo.
  // Passar no quiz (errar no máx. 1 de 5) sobe o nível do Impulso do Espírito: dano = danoBase + nível × ganho.
  // Escrito de memória — conferir as referências antes do jogo oficial.
  espirito: {
    danoBase: 6, ganho: 2, nivelMax: 3, perguntasPorQuiz: 5, errosPermitidos: 1,
    versiculos: [
      { ref: "Atos 1:8", texto: "Mas recebereis a virtude do Espírito Santo, que há de vir sobre vós; e ser-me-eis testemunhas, tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra." },
      { ref: "João 14:26", texto: "Mas aquele Consolador, o Espírito Santo, que o Pai enviará em meu nome, esse vos ensinará todas as coisas e vos fará lembrar de tudo quanto vos tenho dito." }
    ],
    perguntas: [
      { p: "Em que festa o Espírito Santo desceu sobre os discípulos?", certa: "Pentecostes", erradas: ["Páscoa", "Festa dos Tabernáculos", "Dia da Expiação"], ref: "Atos 2:1" },
      { p: "O que apareceu sobre cada um dos discípulos no Pentecostes?", certa: "Línguas como de fogo", erradas: ["Uma pomba branca", "Uma nuvem de glória", "Uma coroa de luz"], ref: "Atos 2:3" },
      { p: "Que som veio do céu quando o Espírito desceu?", certa: "Como de um vento veemente e impetuoso", erradas: ["Um trovão", "Um toque de trombeta", "Um coro de anjos"], ref: "Atos 2:2" },
      { p: "Depois de cheios do Espírito, os discípulos começaram a falar em quê?", certa: "Em outras línguas", erradas: ["Em parábolas", "Só em hebraico", "Em sonhos"], ref: "Atos 2:4" },
      { p: "No batismo de Jesus, o Espírito desceu sobre ele de que forma?", certa: "Como pomba", erradas: ["Como fogo", "Como nuvem", "Como águia"], ref: "Mateus 3:16" },
      { p: "Como Jesus chamou o Espírito Santo que o Pai enviaria?", certa: "Consolador", erradas: ["Juiz", "Mestre da lei", "Mensageiro"], ref: "João 14:16" },
      { p: "Segundo João 14:26, o que o Espírito Santo faria pelos discípulos?", certa: "Ensinaria todas as coisas e os faria lembrar das palavras de Jesus", erradas: ["Daria riquezas a eles", "Os livraria de todo sofrimento", "Escreveria a lei em pedras"], ref: "João 14:26" },
      { p: "Segundo Atos 1:8, o que os discípulos receberiam com a vinda do Espírito?", certa: "Poder para serem testemunhas", erradas: ["Um reino terreno", "Riquezas e honra", "Vida longa"], ref: "Atos 1:8" },
      { p: "Em que cidade Jesus mandou os discípulos esperarem a promessa do Pai?", certa: "Jerusalém", erradas: ["Nazaré", "Belém", "Roma"], ref: "Atos 1:4" },
      { p: "Quem pregou no dia de Pentecostes?", certa: "Pedro", erradas: ["Paulo", "Tiago", "Estêvão"], ref: "Atos 2:14" },
      { p: "Quantas pessoas se converteram naquele dia de Pentecostes?", certa: "Quase três mil", erradas: ["Doze", "Setenta", "Cem"], ref: "Atos 2:41" },
      { p: "Qual destes NÃO está na lista do fruto do Espírito?", certa: "Riqueza", erradas: ["Paz", "Mansidão", "Bondade"], ref: "Gálatas 5:22-23" },
      { p: "Segundo 1 Coríntios 6:19, o corpo do cristão é o quê?", certa: "Templo do Espírito Santo", erradas: ["Altar de pedra", "Arca da aliança", "Trono de Davi"], ref: "1 Coríntios 6:19" },
      { p: "Quando não sabemos orar como convém, o que o Espírito faz?", certa: "Intercede por nós com gemidos inexprimíveis", erradas: ["Fica em silêncio", "Ora só pelos anjos", "Nos deixa sozinhos"], ref: "Romanos 8:26" },
      { p: "Quem anda no Espírito não cumpre o quê?", certa: "Os desejos da carne", erradas: ["A lei de Moisés", "Os mandamentos", "As promessas de Deus"], ref: "Gálatas 5:16" },
      { p: "Em Gênesis 1:2, o Espírito de Deus se movia sobre o quê?", certa: "Sobre a face das águas", erradas: ["Sobre os montes", "Sobre o jardim do Éden", "Sobre a arca"], ref: "Gênesis 1:2" },
      { p: "Pelo profeta Joel, Deus prometeu derramar o seu Espírito sobre quem?", certa: "Sobre toda a carne", erradas: ["Só sobre os sacerdotes", "Só sobre os reis", "Só sobre os anjos"], ref: "Joel 2:28" }
    ]
  },

  fe: {
    escudoBase: 3, escudoMax: 6, ganho: 1, perguntasPorQuiz: 5, errosPermitidos: 1,
    versiculos: [
      { ref: "Hebreus 11:1", texto: "Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem." },
      { ref: "Hebreus 11:6", texto: "Ora, sem fé é impossível agradar-lhe, porque é necessário que aquele que se aproxima de Deus creia que ele existe e que é galardoador dos que o buscam." }
    ],
    perguntas: [
      { p: "Pela fé, quem ofereceu a Deus maior sacrifício do que Caim?", certa: "Abel", erradas: ["Sete", "Enoque", "Noé"], ref: "Hebreus 11:4" },
      { p: "Pela fé, quem foi trasladado para não ver a morte?", certa: "Enoque", erradas: ["Elias", "Moisés", "Abel"], ref: "Hebreus 11:5" },
      { p: "Pela fé, quem, avisado por Deus, preparou a arca para salvar a sua família?", certa: "Noé", erradas: ["Abraão", "Jacó", "José"], ref: "Hebreus 11:7" },
      { p: "Pela fé, quem obedeceu e saiu para um lugar que havia de receber por herança, sem saber para onde ia?", certa: "Abraão", erradas: ["Isaque", "Ló", "Moisés"], ref: "Hebreus 11:8" },
      { p: "Pela fé, quem recebeu força para conceber, mesmo fora da idade, porque teve por fiel aquele que lho prometera?", certa: "Sara", erradas: ["Raquel", "Rebeca", "Ana"], ref: "Hebreus 11:11" },
      { p: "Pela fé, sendo provado, Abraão ofereceu qual filho?", certa: "Isaque", erradas: ["Ismael", "Jacó", "José"], ref: "Hebreus 11:17" },
      { p: "Pela fé, quem abençoou Jacó e Esaú, no tocante às coisas futuras?", certa: "Isaque", erradas: ["Abraão", "Labão", "José"], ref: "Hebreus 11:20" },
      { p: "Pela fé, quem, próximo da morte, abençoou cada um dos filhos de José e adorou encostado à ponta do seu bordão?", certa: "Jacó", erradas: ["Isaque", "Moisés", "Davi"], ref: "Hebreus 11:21" },
      { p: "Pela fé, quem, próximo da morte, fez menção da saída dos filhos de Israel e deu ordem acerca de seus ossos?", certa: "José", erradas: ["Jacó", "Moisés", "Josué"], ref: "Hebreus 11:22" },
      { p: "Pela fé, quem recusou ser chamado filho da filha de Faraó?", certa: "Moisés", erradas: ["Arão", "José", "Josué"], ref: "Hebreus 11:24" },
      { p: "Pela fé, o povo passou como por terra seca por qual mar?", certa: "Mar Vermelho", erradas: ["Mar Morto", "Mar da Galileia", "Rio Jordão"], ref: "Hebreus 11:29" },
      { p: "Pela fé, caíram os muros de qual cidade, depois de rodeados durante sete dias?", certa: "Jericó", erradas: ["Jerusalém", "Babilônia", "Nínive"], ref: "Hebreus 11:30" },
      { p: "Pela fé, qual mulher não pereceu com os incrédulos, por ter recebido os espias em paz?", certa: "Raabe", erradas: ["Rute", "Débora", "Ester"], ref: "Hebreus 11:31" },
      { p: "\"A fé é o firme fundamento das coisas que se ___.\"", certa: "esperam", erradas: ["veem", "temem", "sabem"], ref: "Hebreus 11:1" },
      { p: "\"Sem fé é impossível ___ a Deus.\"", certa: "agradar", erradas: ["conhecer", "servir", "ver"], ref: "Hebreus 11:6" }
    ]
  },
  // Níveis por trilha. Forja: multiplicador de dano (8 × mult). Afiação: segundos de poder.
  niveis: {
    forja:   { nomes: ["Bruto", "Forjado", "Temperado"], mult: [1.0, 1.2, 1.4], descr: ["2 palavras faltando", "4 palavras faltando", "versículo inteiro"] },
    afiacao: { base: 4, ganho: 1, descr: ["Autor do livro", "Contexto histórico", "Contexto da passagem"] }
  },
  graus: [
    { nome: "Temperado", mult: 1.4, cor: "#f2c84b", letra: "T" },
    { nome: "Forjado",   mult: 1.2, cor: "#c9d1d9", letra: "F" },
    { nome: "Bruto",     mult: 1.0, cor: "#c87533", letra: "B" }
  ]
};
